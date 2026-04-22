// 明尊 技能系数与伤害计算
// 所有函数以 ctx 为输入参数

// ---------- 共用乘子 ----------
// 面板 + 破防 + 铁血 + 敌方化劲 + 敌方减伤（不含外防，部分技能对外防单独处理）
function envNoWaifang(c) {
    return ((c.pofang - 0) + 100) / 100 * (1 + 0.5 * c.tiexuedajiangjun)
        * (1 - c.huajin / 100)
        * (1 - 0.1 * c.shengyong) * (1 - 0.2 * c.zhanlong)
        * (1 - 0.1 * c.yijifuhuodian) * (1 - 0.2 * c.erjifuhuodian);
}

function envWithWaifang(c) {
    return envNoWaifang(c) * (1 - c.waifang / 100);
}

function critMul(c, huixiaoBonus = 0) {
    return 1 + (c.huixiao + huixiaoBonus - 100) / 100 * (100 - c.yuxiao) / 100;
}

// ---------- 不会心技能伤害 ----------
export const normalDamage = {
    // 夺魄箭
    夺魄箭: (c) =>
        1.9688 * (1 + 0.07 + 0.05 * c.chengwu)
        * (c.面板攻击 + c.武器伤害 * 2)
        * (1 + 0.2 * c.zhuyijipo)
        * envWithWaifang(c),
    手大附魔: (c) => 0.3813 * c.面板攻击 * envWithWaifang(c),
    鞋大附魔: (c) => 0.4688 * c.面板攻击 * envWithWaifang(c),
    橙戒指:   (c) => 11250 * envWithWaifang(c),
};

// ---------- 会心技能伤害 ----------
export const critDamage = {
    夺魄箭: (c) =>
        1.9688 * (1 + 0.07 + 0.05 * c.chengwu)
        * (c.面板攻击 + c.武器伤害 * 2)
        * (1 + 0.2 * c.zhuyijipo)
        * envWithWaifang(c) * critMul(c, 10),
    // 单隐追：外防只吃 30% (1-0.7)
    单隐追: (c) =>
        2.7188 * (1 + 0.12) * 1.1 * (c.面板攻击 + c.武器伤害 * 3)
        * (1 + 0.2 * c.zhuyijipo)
        * (1 - c.waifang / 100 * (1 - 0.7))
        * envNoWaifang(c) * critMul(c, 40),
    // 双隐追：第一跳 + 第二跳
    双隐追: (c) => {
        const first = 2.7188 * (1 + 0.12) * 1.1 * (c.面板攻击 + c.武器伤害 * 3)
            * (1 + 0.2 * c.zhuyijipo)
            * (1 - c.waifang / 100 * (1 - 0.7))
            * envNoWaifang(c) * critMul(c, 40);
        const second = 2.17504 * (1 + 0.12) * c.面板攻击
            * (1 - c.waifang / 100 * (1 - 0.2))
            * envNoWaifang(c) * critMul(c);
        return first + second;
    },
    // 百里追魂
    百里追魂: (c) =>
        10.5875 * (c.面板攻击 + c.武器伤害 * 3.3)
        * envNoWaifang(c) * critMul(c),
    手大附魔: (c) => 0.3813 * c.面板攻击 * envWithWaifang(c) * critMul(c),
    鞋大附魔: (c) => 0.4688 * c.面板攻击 * envWithWaifang(c) * critMul(c),
    橙戒指:   (c) => 11250 * envWithWaifang(c) * critMul(c),
};
