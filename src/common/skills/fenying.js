// 焚影明教 技能系数与伤害计算 (万灵当歌版本)
// 所有函数都以 ctx 为输入参数，ctx 由 Vue 组件通过 buildCtx 构造

// ---------- 技能基础系数常量 ----------
export const COEFS = {
    // 绕背驱夜断愁  260*1.1*1.05*1.05*1.05  lv29  已计算绕背
    驱夜断愁: 1.2604 * 1.3 * 1.6 * 3,
    // 诛邪镇魔×2  225*1.05*1.1*1.1  lv32
    诛邪镇魔: 1.7083 * 2,
    赤日轮1: 0.8697,
    赤日轮2: 0.8697,
    赤日轮3: 1.0885,
    幽月轮1: 0.7916,
    幽月轮2: 0.7916,
    幽月轮3: 0.9062,
    // 月破 60 * 1.15 * 1.1*1.1*1.1*1.05*1.1*1.1*1.15 *3 (单次*3)  lv32
    月破: 0.8385 * 3,
    // 日破 单体 180*1.15*1.1*1.1*1.1*1.05*1.1*1.1*1.15  lv32
    日破: 2.5156,
    // 日月晦 三段总系数
    日月晦: 5.0625,
    生死劫日: 0.35,
    生死劫月: 0.35,
    烈日斩: 1.2708,
    银月斩: 0.7500,
    银月斩Dot: 0.16,
    洞若观火: 0.2604,
    // 净体不畏层级
    jingTiBuWeriRiLV1: 0.61875,
    jingTiBuWeriRiLV2: 0.4640625,
    jingTiBuWeriRiLV3: 1.0209375,
    jingTiBuWeriRiLV4: 0.0928125,
    jingTiBuWeriRiLV5: 0.0928125,
    chongGuangZhanE: 37.038744,
};

// ---------- 共用乘子 ----------
// 面板 + 破防 + 无间影狱 + 敌方防御 + 敌方减伤
// huajinPct 可选，用于"幽隐尘寂"等忽视化劲的技能；缺省走通用化劲。
export function envMul(c, huajinPct) {
    const hj = huajinPct != null ? huajinPct : c.huajin;
    return c.面板攻击 * ((c.pofang - 0) + 100) / 100 * c.无间影狱
        * (1 - c.neifang / 100) * (1 - hj / 100)
        * (1 - 0.1 * c.shengyong) * (1 - 0.2 * c.zhanlong)
        * (1 - 0.1 * c.yijifuhuodian) * (1 - 0.2 * c.erjifuhuodian);
}

// 会心效果乘子
export function critMul(c) {
    return 1 + (c.huixiao - 100) / 100 * (100 - c.yuxiao) / 100;
}

// 秘籍 + 橙武
const mishuChengwu = (c) => 1 + 0.12 + 0.05 * c.chengwu;
// 日月破 秘籍层：在 mishuChengwu 同层叠加 +0.4 × 溟月度心
const mishuChengwuRiYue = (c) => mishuChengwu(c) + 0.4 * (c.mingyueduxin || 0);

// ---------- 不会心技能伤害 ----------
export const normalDamage = {
    绕背驱夜:       (c) => mishuChengwu(c) * COEFS.驱夜断愁 * envMul(c),
    单体日破:       (c) => mishuChengwuRiYue(c) * 3.327335615780859 * envMul(c, c.huajin日破),
    单体月破:       (c) => mishuChengwuRiYue(c) * 0.5525 * 3 * envMul(c),
    普通诛邪:       (c) => mishuChengwu(c) * 2.707089 * envMul(c),
    三段日月晦:     (c) => 1.265625 * 4 * envMul(c),
    手大附魔:       (c) => 0.46875 * envMul(c),
    鞋大附魔:       (c) => 0.52084 * envMul(c),
    橙戒指:         () => 11250,
    橙武特效:       (c) => 2 * envMul(c),
    愿火长燃:       (c) => 2.0 * envMul(c),
    无明影缚:       (c) => 10.0 * envMul(c),
    '无明影缚(斩杀)': (c) => 10.0 * 1.5 * envMul(c),
    日斩:           (c) => 1 * 1.25 * 1.25 * 2 * (1 + 0.22) * 1.18540627734375 * envMul(c),
};

// ---------- 会心技能伤害 ----------
export const critDamage = {
    绕背驱夜:       (c) => mishuChengwu(c) * COEFS.驱夜断愁 * envMul(c) * critMul(c),
    单体日破:       (c) => mishuChengwuRiYue(c) * 1.6574 * envMul(c, c.huajin日破) * critMul(c),
    单体月破:       (c) => mishuChengwuRiYue(c) * 0.5525 * 3 * envMul(c) * critMul(c),
    普通诛邪:       (c) => mishuChengwu(c) * 2.707089 * envMul(c) * critMul(c),
    三段日月晦:     (c) => 1.265625 * 4 * envMul(c) * critMul(c),
    手大附魔:       (c) => 0.46875 * envMul(c) * critMul(c),
    鞋大附魔:       (c) => 0.52084 * envMul(c) * critMul(c),
    橙戒指:         () => 11250,
    橙武特效:       (c) => 2 * envMul(c) * critMul(c),
    愿火长燃:       (c) => 2.0 * envMul(c) * critMul(c),
    无明影缚:       (c) => 10.0 * envMul(c) * critMul(c),
    '无明影缚(斩杀)': (c) => 10.0 * 1.5 * envMul(c) * critMul(c),
    日斩:           (c) => (1 * 1.25 * 1.25 * (1 + 0.22) * 1.18540627734375 + 1.18540627734375) * envMul(c) * critMul(c),
};

// ---------- 连招序列按钮 ----------
export const comboButtons = ['驱夜', '日破', '月破', '诛邪', '日斩'];

// 按钮 → 不会心伤害函数
export const comboNormalDamage = {
    驱夜: normalDamage.绕背驱夜,
    日破: normalDamage.单体日破,
    月破: normalDamage.单体月破,
    诛邪: normalDamage.普通诛邪,
    日斩: normalDamage.日斩,
    愿火长燃: normalDamage.愿火长燃,
    无明影缚: normalDamage.无明影缚,
    '无明影缚(斩杀)': normalDamage['无明影缚(斩杀)'],
};

// 按钮 → 会心伤害函数
export const comboCritDamage = {
    驱夜: critDamage.绕背驱夜,
    日破: critDamage.单体日破,
    月破: critDamage.单体月破,
    诛邪: critDamage.普通诛邪,
    日斩: critDamage.日斩,
    愿火长燃: critDamage.愿火长燃,
    无明影缚: critDamage.无明影缚,
    '无明影缚(斩杀)': critDamage['无明影缚(斩杀)'],
};

// 按钮 → 单次技能系数（只包含 秘籍+橙武 × 技能倍率，不含面板/破防/减伤）
export const comboCoefs = {
    驱夜: (c) => mishuChengwu(c) * COEFS.驱夜断愁,
    日破: (c) => mishuChengwuRiYue(c) * 3.327335615780859,
    月破: (c) => mishuChengwuRiYue(c) * 0.5525 * 3,
    诛邪: (c) => mishuChengwu(c) * 2.707089,
    日斩: () => 1 * 1.25 * 1.25 * 2 * (1 + 0.22) * 1.18540627734375,
    愿火长燃: () => 2.0,
    无明影缚: () => 10.0,
    '无明影缚(斩杀)': () => 15.0,
};

// 标签颜色映射（Element UI tag type）
export const comboTagType = {
    驱夜: 'danger',
    日破: 'danger',
    月破: 'info',
    诛邪: 'success',
    日斩: 'warning',
    愿火长燃: 'warning',
    无明影缚: 'danger',
    '无明影缚(斩杀)': 'danger',
};

// ---------- 纯函数：从 state 构建完整 ctx（供属性收益面板有限差分使用） ----------
// 输入 s 必须包含：元气/基础攻击/会心值/会效值/破防值/化劲/御劲/内防值/无间影狱
// 以及所有增益开关 (boolean / 0-1)
export function buildCtxFromState(s) {
    const b = (v) => (v ? 1 : 0);
    const yqBonus = b(s.紫元气小吃) * 736 + b(s.紫元气小药) * 946 + b(s.紫元气酒) * 544;

    const 面板元气 = (s.元气 - 0) + yqBonus;
    const 面板基础攻击 = (s.基础攻击 - 0)
        + b(s.紫攻击小药) * 2236 + b(s.紫攻击小吃) * 1739
        + b(s.紫武器附魔) * 1491 + b(s.紫攻击创意) * 2170
        + 0.1 * yqBonus;
    const 面板攻击 = 面板元气 * 1.99
        + 面板基础攻击 * (1 + 0.05 * b(s.mingjiaozhen) + 0.1 * b(s.tiandi));

    const wuJianMod = (s.无间影狱 === 1 ? 1 : 0);

    const huixinRaw = ((s.会心值 - 0) + yqBonus * 0.29) / 197703.0 * 100
        + wuJianMod * 10 + 13 * b(s.mingjiaozhen);
    const huixin = Math.min(100, huixinRaw);

    const huixiaoRaw = s.会效值 / 72844.2 * 100 + 175
        + wuJianMod * 5 + 20 * b(s.mingjiaozhen);
    const huixiao = Math.min(300, huixiaoRaw);

    const pofang = ((s.破防值 - 0) + 36472 * b(s.texiaoyaozhui) + 0.3 * yqBonus) / 225957.6 * 100;

    const neifangEff = s.内防值 * (1 - 0.55 * b(s.yonghuierming));
    const neifang = Math.min(80, neifangEff / (neifangEff + 126007.2) * 100);

    const huajinBase = (s.化劲 - 0) * (1 + 0.1 * b(s.zhanjie14));
    const huajinRaw = huajinBase / (huajinBase + 33046.2) * 100 + 9.9609375;
    const huajin = Math.max(10, Math.min(80, huajinRaw));

    const huajin日破Base = (s.化劲 - 0) * (b(s.youyinChenJi) ? 0.85 : 1) * (1 + 0.1 * b(s.zhanjie14));
    const huajin日破Raw = huajin日破Base / (huajin日破Base + 33046.2) * 100 + 9.9609375;
    const huajin日破 = Math.max(10, Math.min(80, huajin日破Raw));

    const yujinRaw = s.御劲 / 197703.0 * 100;
    const yujin = Math.max(0, Math.min(100, yujinRaw));
    const yuxiao = Math.min(40, s.御劲 / 55123.2 * 100);

    return {
        // 面板展示用
        面板元气, 面板基础攻击, 面板攻击, huixin, huixiao, pofang,
        neifang, huajin, huajin日破, yujin, yuxiao,
        // 伤害公式所需
        无间影狱: s.无间影狱,
        chengwu: b(s.chengwu),
        shengyong: b(s.shengyong),
        zhanlong: b(s.zhanlong),
        yijifuhuodian: b(s.yijifuhuodian),
        erjifuhuodian: b(s.erjifuhuodian),
        mingyueduxin: b(s.mingyueduxin),
    };
}

// ---------- 期望伤害：p × 会心 + (1-p) × 不会心，默认以单体日破为参考 ----------
export function expectedDamage(ctx, skillKey = '单体日破') {
    const p = ctx.huixin / 100;
    return p * critDamage[skillKey](ctx) + (1 - p) * normalDamage[skillKey](ctx);
}
