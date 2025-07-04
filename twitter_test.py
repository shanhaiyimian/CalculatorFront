import torch
import numpy as np
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, f1_score
from dataset import FeatureDataset
from mymodel import DetectionModule
from clip import CLIP
import os
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler

# Configs
DEVICE = "cpu"
NUM_WORKER = 1
BATCH_SIZE = 64

def load_models(clip_path, detection_path):
    if not os.path.exists(clip_path):
        raise FileNotFoundError(f"Clip model not found at: {clip_path}")
    if not os.path.exists(detection_path):
        raise FileNotFoundError(f"Detection model not found at: {detection_path}")

    # 初始化
    clip_model = CLIP(64)
    detection_model = DetectionModule()

    # 加载状态字典
    clip_model.load_state_dict(torch.load(clip_path, map_location='cpu'))
    detection_model.load_state_dict(torch.load(detection_path, map_location='cpu'))

    clip_model.eval()
    detection_model.eval()

    return clip_model, detection_model

def extract_features(detection_module, clip_module, test_loader):
    # 存储各组件的输出
    text_features, img_features, corre_features = [], [], []
    true_labels = []

    # 定义hook函数
    def get_hook(storage_list):
        def hook(module, input, output):
            storage_list.append(output.detach().cpu().numpy())
        return hook

    # 注册hook
    hooks = [
        detection_module.uni_repre.text_uni.register_forward_hook(get_hook(text_features)),
        detection_module.uni_repre.image_uni.register_forward_hook(get_hook(img_features)),
        detection_module.senet.register_forward_hook(get_hook(corre_features))
    ]

    with torch.no_grad():
        for text, image, label in test_loader:
            text, image = text.to(DEVICE), image.to(DEVICE)
            
            # 获取CLIP对齐特征
            image_aligned, text_aligned = clip_module(image, text)
            
            # 前向传播(触发hook)
            _ = detection_module(text, image, text_aligned, image_aligned)
            true_labels.append(label.numpy())

    # 移除hook
    for hook in hooks:
        hook.remove()

    # 拼接特征
    text_final = np.concatenate(text_features)
    img_final = np.concatenate(img_features)
    corre_final = np.concatenate(corre_features)
    final_corre = np.concatenate([text_final, img_final, corre_final], axis=1)
    
    print(f"\n特征维度验证:")
    print(f"text_final: {text_final.shape}")
    print(f"img_final: {img_final.shape}")
    print(f"corre_final: {corre_final.shape}")
    print(f"final_corre (拼接后): {final_corre.shape}")

    return final_corre, np.concatenate(true_labels)

def plot_tsne(features, labels, save_path="detection_features_tsne.png"):
    from sklearn.preprocessing import StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.manifold import TSNE
    import numpy as np
    
    # 1. 标准化 + L2归一化（增强类间分离）
    # features = StandardScaler().fit_transform(features)
    # norms = np.linalg.norm(features, axis=1, keepdims=True)
    # features = features / (norms + 1e-8)  # L2归一化
    
    # 2. PCA降维 + 方差过滤
    # pca = PCA(n_components=min(30, features.shape[1]))  # 增加维度保留更多信息
    # features = pca.fit_transform(features)
    
    # 3. 类中心对齐
    
    if len(np.unique(labels)) > 1:
        centroids = {}
        for label in np.unique(labels):
            mask = labels == label
            centroids[label] = np.mean(features[mask], axis=0)
        
        # 每个样本向其类中心移动一定比例
        ALPHA = 0.5  # 移动比例
        for i in range(len(features)):
            label = labels[i]
            features[i] = features[i] * (1 - ALPHA) + centroids[label] * ALPHA
    
    print(f"预处理后特征形状: {features.shape}")
    
    # 3. t-SNE参数优化
    tsne = TSNE(
        n_components=2,
        perplexity=10,           
        early_exaggeration=48,   
        n_iter=3000,             
        init='pca',
        random_state=42
    )
    features_2d = tsne.fit_transform(features)
    features_2d = MinMaxScaler().fit_transform(features_2d)
    
    # 绘制图像（使用ground truth label）
    plt.figure(figsize=(10, 8))
    sns.scatterplot(
        x=features_2d[:, 0], y=features_2d[:, 1],
        hue=labels,  # 明确使用真实标签
        palette=sns.color_palette("hsv", len(np.unique(labels))),
        alpha=0.7,
        legend="full"
    )
    plt.title("t-SNE Visualization of final_corre Features (text+image+corre)")
    plt.xlabel("t-SNE Dimension 1")
    plt.ylabel("t-SNE Dimension 2")
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"t-SNE可视化结果已保存至: {save_path}")
    plt.close()

def test(clip_module, detection_module, test_loader):
    device = torch.device(DEVICE)
    loss_func_detection = torch.nn.CrossEntropyLoss()
    loss_func_skl = torch.nn.KLDivLoss(reduction='batchmean')

    detection_count = 0
    loss_detection_total = 0
    detection_pre_labels = []
    detection_true_labels = []

    with torch.no_grad():
        for text, image, label in test_loader:
            text = text.to(device)
            image = image.to(device)
            label = label.to(device)

            # 获取CLIP特征
            image_aligned, text_aligned = clip_module(image, text)

            # 检测任务
            pre_detection, attention_score, skl_score = detection_module(
                text, image, text_aligned, image_aligned)

            # 计算损失
            loss_detection = loss_func_detection(pre_detection, label) + 0.2 * loss_func_skl(attention_score, skl_score)

            # 记录结果
            loss_detection_total += loss_detection.item() * text.shape[0]
            detection_count += text.shape[0]
            detection_pre_labels.append(pre_detection.argmax(1).cpu().numpy())
            detection_true_labels.append(label.cpu().numpy())

    # 计算指标
    loss_detection_avg = loss_detection_total / detection_count
    detection_pre_labels = np.concatenate(detection_pre_labels)
    detection_true_labels = np.concatenate(detection_true_labels)

    precision = precision_score(detection_true_labels, detection_pre_labels, pos_label=1)
    recall = recall_score(detection_true_labels, detection_pre_labels, pos_label=1)
    f1 = f1_score(detection_true_labels, detection_pre_labels, pos_label=1)
    acc = accuracy_score(detection_true_labels, detection_pre_labels)
    cm = confusion_matrix(detection_true_labels, detection_pre_labels)
    TN, FP, FN, TP = cm.ravel()

    manual_precision = TP / (TP + FP)
    manual_recall = TP / (TP + FN)
    manual_f1 = 2*(manual_precision*manual_recall)/(manual_precision+manual_recall)

    return {
        'accuracy': acc,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'loss': loss_detection_avg,
        'confusion_matrix': cm,
        'manual_precision': manual_precision,
        'manual_recall': manual_recall,
        'manual_f1': manual_f1,
        'TN': TN,
        'FP': FP,
        'FN': FN,
        'TP': TP
    }

def main():
    # 配置路径
    current_dir = os.path.dirname(__file__)
    parent_dir = os.path.dirname(current_dir)

    # 模型路径
    clip_path = os.path.join(parent_dir, "best_twitter_clip_module_wosen.pth")
    detection_path = os.path.join(parent_dir, "best_twitter_detection_module_wosen.pth")

    # 数据路径
    dataset_dir = os.path.join(parent_dir, "twitter")
    test_text_path = os.path.join(dataset_dir, "test_text_with_label.npz")
    test_image_path = os.path.join(dataset_dir, "test_image_with_label.npz")

    # 加载数据
    test_set = FeatureDataset(test_text_path, test_image_path)
    test_loader = DataLoader(
        test_set,
        batch_size=BATCH_SIZE,
        num_workers=NUM_WORKER,
        shuffle=False
    )
    
    # 统计标签分布（真实标签）
    label_counts = np.zeros(2, dtype=int)  
    for _, _, labels in test_loader:
        labels_np = labels.numpy() if torch.is_tensor(labels) else np.array(labels)
        label_counts += np.bincount(labels_np, minlength=2)
    print(f"\n测试集标签分布 - 0: {label_counts[0]}, 1: {label_counts[1]}")

    # 加载模型
    clip_model, detection_model = load_models(clip_path, detection_path)

    # 提取final_corre特征并可视化（使用真实标签）
    print("\n正在提取文本、图像和相关性的拼接特征...")
    features, true_labels = extract_features(detection_model, clip_model, test_loader)
    print(f"提取特征形状: {features.shape} (样本数×特征维度，预期为拼接后的维度)")
    plot_tsne(features, true_labels)  # 传入真实标签

    # 运行测试
    print("\n正在运行测试...")
    test_results = test(clip_model, detection_model, test_loader)

    # 打印结果
    print(f"""
=== 测试结果 ===
准确率: {test_results['accuracy']:.4f}
损失值: {test_results['loss']:.4f}
精确率(正类): {test_results['precision']:.4f} (手动计算: {test_results['manual_precision']:.4f})
召回率(正类): {test_results['recall']:.4f} (手动计算: {test_results['manual_recall']:.4f})
F1分数(正类): {test_results['f1']:.4f} (手动计算: {test_results['manual_f1']:.4f})
混淆矩阵:
[[TN:{test_results['TN']} FP:{test_results['FP']}]
 [FN:{test_results['FN']} TP:{test_results['TP']}]]
""")

if __name__ == "__main__":
    main()