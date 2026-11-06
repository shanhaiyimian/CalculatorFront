// 焚影：基础属性已适配苍生铸世；技能按已确认数据更新，其余倍率、奇穴仍待校准。
// 面板、技能和属性收益统一由 buildCtxFromState 构造 ctx。

// ---------- 技能基础系数常量 ----------
export const COEFS = {
    // 绕背驱夜断愁  260*1.1*1.05*1.05*1.05  lv29  已计算绕背
    驱夜断愁: 1.2604 * 1.3 * 1.6 * 3,
    // 日破 单体  lv32
    日破: 3.327335615780859,
    月潮: 12.0,
    无明缚夜: 7.1979,
    '无明缚夜(斩杀)': 7.1979 * 1.5,
    圣裁刑晷: 4.375,
    '圣裁刑晷(原地)': 4.375 * 1.5,
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
    月潮:           (c) => COEFS.月潮 * envMul(c),
    无明缚夜:       (c) => COEFS.无明缚夜 * envMul(c),
    '无明缚夜(斩杀)': (c) => COEFS['无明缚夜(斩杀)'] * envMul(c),
    圣裁刑晷:       (c) => COEFS.圣裁刑晷 * envMul(c),
    '圣裁刑晷(原地)': (c) => COEFS['圣裁刑晷(原地)'] * envMul(c),
    日斩:           (c) => 1 * 1.25 * 1.25 * 2 * (1 + 0.22) * 1.18540627734375 * envMul(c),
};

// ---------- 会心技能伤害 ----------
export const critDamage = {
    绕背驱夜:       (c) => mishuChengwu(c) * COEFS.驱夜断愁 * envMul(c) * critMul(c),
    单体日破:       (c) => mishuChengwuRiYue(c) * 3.327335615780859 * envMul(c, c.huajin日破) * critMul(c),
    单体月破:       (c) => mishuChengwuRiYue(c) * 0.5525 * 3 * envMul(c) * critMul(c),
    普通诛邪:       (c) => mishuChengwu(c) * 2.707089 * envMul(c) * critMul(c),
    三段日月晦:     (c) => 1.265625 * 4 * envMul(c) * critMul(c),
    手大附魔:       (c) => 0.46875 * envMul(c) * critMul(c),
    鞋大附魔:       (c) => 0.52084 * envMul(c) * critMul(c),
    橙戒指:         () => 11250,
    橙武特效:       (c) => 2 * envMul(c) * critMul(c),
    愿火长燃:       (c) => 2.0 * envMul(c) * critMul(c),
    月潮:           (c) => normalDamage.月潮(c) * critMul(c),
    无明缚夜:       (c) => normalDamage.无明缚夜(c) * critMul(c),
    '无明缚夜(斩杀)': (c) => normalDamage['无明缚夜(斩杀)'](c) * critMul(c),
    圣裁刑晷:       (c) => normalDamage.圣裁刑晷(c) * critMul(c),
    '圣裁刑晷(原地)': (c) => normalDamage['圣裁刑晷(原地)'](c) * critMul(c),
    日斩:           (c) => (1 * 1.25 * 1.25 * 2 * (1 + 0.22) * 1.18540627734375 + 1.18540627734375) * envMul(c) * critMul(c),
};

// ---------- 连招序列按钮 ----------
export const comboButtons = ['驱夜', '日破', '月破', '诛邪', '日斩', '月潮', '圣裁刑晷', '圣裁刑晷(原地)'];

// 按钮 → 不会心伤害函数
export const comboNormalDamage = {
    驱夜: normalDamage.绕背驱夜,
    日破: normalDamage.单体日破,
    月破: normalDamage.单体月破,
    诛邪: normalDamage.普通诛邪,
    日斩: normalDamage.日斩,
    愿火长燃: normalDamage.愿火长燃,
    月潮: normalDamage.月潮,
    无明缚夜: normalDamage.无明缚夜,
    '无明缚夜(斩杀)': normalDamage['无明缚夜(斩杀)'],
    圣裁刑晷: normalDamage.圣裁刑晷,
    '圣裁刑晷(原地)': normalDamage['圣裁刑晷(原地)'],
};

// 按钮 → 会心伤害函数
export const comboCritDamage = {
    驱夜: critDamage.绕背驱夜,
    日破: critDamage.单体日破,
    月破: critDamage.单体月破,
    诛邪: critDamage.普通诛邪,
    日斩: critDamage.日斩,
    愿火长燃: critDamage.愿火长燃,
    月潮: critDamage.月潮,
    无明缚夜: critDamage.无明缚夜,
    '无明缚夜(斩杀)': critDamage['无明缚夜(斩杀)'],
    圣裁刑晷: critDamage.圣裁刑晷,
    '圣裁刑晷(原地)': critDamage['圣裁刑晷(原地)'],
};

// 按钮 → 单次技能系数（只包含 秘籍+橙武 × 技能倍率，不含面板/破防/减伤）
export const comboCoefs = {
    驱夜: (c) => mishuChengwu(c) * COEFS.驱夜断愁,
    日破: (c) => mishuChengwuRiYue(c) * 3.327335615780859,
    月破: (c) => mishuChengwuRiYue(c) * 0.5525 * 3,
    诛邪: (c) => mishuChengwu(c) * 2.707089,
    日斩: () => 1 * 1.25 * 1.25 * 2 * (1 + 0.22) * 1.18540627734375,
    愿火长燃: () => 2.0,
    月潮: () => COEFS.月潮,
    无明缚夜: () => COEFS.无明缚夜,
    '无明缚夜(斩杀)': () => COEFS['无明缚夜(斩杀)'],
    圣裁刑晷: () => COEFS.圣裁刑晷,
    '圣裁刑晷(原地)': () => COEFS['圣裁刑晷(原地)'],
};

// 标签颜色映射（Element UI tag type）
export const comboTagType = {
    驱夜: 'danger',
    日破: 'danger',
    月破: 'info',
    诛邪: 'success',
    日斩: 'warning',
    愿火长燃: 'warning',
    月潮: 'info',
    无明缚夜: 'danger',
    '无明缚夜(斩杀)': 'danger',
    圣裁刑晷: 'success',
    '圣裁刑晷(原地)': 'success',
};

// ---------- 苍生铸世基础属性（50级角色） ----------
// https://www.jx3box.com/bps/109665 （2026-10-29，焚影心法转换）
// https://www.jx3box.com/bps/109685 （2026-10-31，正式服属性体系）
// 裸面板基础攻击已含元气固有转换0.19和心法固定攻击2662；
// 裸面板会心/破防也已含元气贡献，只对 extraYuanqi 补齐新增部分。
// extraYuanqi 用于计算额外1点元气收益，不是重新录入一份游戏面板。
export function buildCtxFromState(s, extraYuanqi = 0) {
    const b = (v) => (v ? 1 : 0);
    const n = (v) => Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0;
    const yqBonus = n(extraYuanqi);

    // 旧版小药、附魔和腰坠固定点数未有新版依据，开关不再参与计算。
    const 面板元气 = n(s.元气) + yqBonus;
    const 面板基础攻击 = n(s.基础攻击) + 0.19 * yqBonus;
    // 沿用原页面的增益层：阵法/天地只放大基础攻击，心法额外攻击单独相加。
    const 面板攻击 = 面板元气 * 0.62 + 面板基础攻击
        * (1 + 0.05 * b(s.mingjiaozhen) + 0.1 * b(s.tiandi));

    const wuJianMod = (s.无间影狱 === 1 ? 1 : 0);

    const huixinRaw = (n(s.会心值) + yqBonus * 0.13) / 9512.91 * 100
        + wuJianMod * 10 + 13 * b(s.mingjiaozhen);
    const huixin = Math.min(100, huixinRaw);

    const huixiaoRaw = n(s.会效值) / 3504.6 * 100 + 175
        + wuJianMod * 5 + 20 * b(s.mingjiaozhen);
    const huixiao = Math.min(300, huixiaoRaw);

    const pofang = (n(s.破防值) + 0.06 * yqBonus) / 10378.17 * 100;

    const neifangEff = n(s.内防值) * (1 - 0.55 * b(s.yonghuierming));
    const neifang = Math.min(80, neifangEff / (neifangEff + 10802.88) * 100);

    const baseHuajin = s.敌方基础化劲 === false ? 0 : 9.9609375;
    const huajinBase = n(s.化劲) * (1 + 0.1 * b(s.zhanjie14)) * (1 + 0.3 * b(s.yuHuaDaQi));
    const huajin = Math.min(80, huajinBase / (huajinBase + 5148) * 100 + baseHuajin);

    const huajin日破Base = huajinBase * (b(s.youyinChenJi) ? 0.85 : 1);
    const huajin日破 = Math.min(80, huajin日破Base / (huajin日破Base + 5148) * 100 + baseHuajin);

    // 上限沿用原计算器；两篇属性资料未重新校验这些战斗规则。
    const yujinRaw = n(s.御劲) * (1 + 0.15 * b(s.yuHuaDaQi)) / 19025.82 * 100;
    const yujin = Math.max(0, Math.min(100, yujinRaw));
    const yuxiao = Math.min(40, n(s.御劲) * (1 + 0.15 * b(s.yuHuaDaQi)) / 9422.82 * 100);

    return {
        // 面板展示用
        面板元气, 面板基础攻击, 面板攻击, huixin, huixiao, pofang,
        neifang, huajin, huajin日破, yujin, yuxiao,
        // 伤害公式所需
        无间影狱: s.无间影狱 == null ? 1.1 : n(s.无间影狱),
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
