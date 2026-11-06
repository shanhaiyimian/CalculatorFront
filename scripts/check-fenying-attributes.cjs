// Run: node scripts/check-fenying-attributes.cjs
// Reference: https://www.jx3box.com/bps/109665 and /bps/109685 (50-level live server).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function near(actual, expected, label, tolerance = 1e-9) {
    assert.ok(Number.isFinite(actual), `${label}: expected a finite number, got ${actual}`);
    assert.ok(Math.abs(actual - expected) <= tolerance,
        `${label}: expected ${expected}, got ${actual}`);
}

async function main() {
    const source = fs.readFileSync(path.join(__dirname, '../src/common/skills/fenying.js'), 'utf8');
    const skills = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    const { buildCtxFromState } = skills;
    const zero = {
        元气: 0, 基础攻击: 0, 会心值: 0, 会效值: 0, 破防值: 0,
        化劲: 0, 御劲: 0, 内防值: 0, 无间影狱: 1.1,
        敌方基础化劲: true,
    };
    const naked = {
        ...zero, 元气: 1000, 基础攻击: 5000, 会心值: 1319,
        会效值: 350.46, 破防值: 1037.817, 内防值: 10802.88,
        化劲: 5148, 御劲: 1902.582,
    };
    const panel = buildCtxFromState(naked);
    near(panel.面板攻击, 5620, 'naked attack: do not count innate/fixed bonuses twice');
    near(panel.面板基础攻击, 5000, 'naked base attack stays unchanged');
    near(panel.huixin, 13.87, 'article example: 1319 critical rating', 0.005);
    near(panel.huixiao, 185, 'critical effect includes base 175%');
    near(panel.pofang, 10, 'overcome at level 50');
    near(panel.neifang, 50, 'nonlinear defense at level 50');
    near(panel.huajin, 59.9609375, 'nonlinear toughness plus innate reduction');
    near(panel.yujin, 10, 'critical resistance at level 50');
    near(panel.yuxiao, 1902.582 / 9422.82 * 100, 'critical damage resistance');

    const extra = buildCtxFromState(naked, 1);
    near(extra.面板元气 - panel.面板元气, 1, 'one extra yuanqi');
    near(extra.面板基础攻击 - panel.面板基础攻击, 0.19, 'extra yuanqi innate attack');
    near(extra.面板攻击 - panel.面板攻击, 0.81, 'extra yuanqi total attack');
    near(extra.huixin - panel.huixin, 0.13 / 9512.91 * 100, 'extra yuanqi critical');
    near(extra.pofang - panel.pofang, 0.06 / 10378.17 * 100, 'extra yuanqi overcome');
    const formation = buildCtxFromState({ ...naked, mingjiaozhen: true });
    near(formation.面板攻击, 5870, 'formation multiplies base attack only');
    near(buildCtxFromState({ ...naked, mingjiaozhen: true }, 1).面板攻击 - formation.面板攻击,
        0.8195, 'formation and extra yuanqi use the same attack layer');

    assert.deepEqual(buildCtxFromState({ ...naked, 敌方等级: 53 }), panel, 'target conversions stay fixed at level 50');
    near(buildCtxFromState({ ...zero, 敌方基础化劲: false }).huajin, 0, 'no innate toughness when unchecked');
    near(buildCtxFromState(zero).huajin, 9.9609375, 'do not round innate toughness up to 10%');

    const retiredBuffs = {
        紫元气小吃: true, 紫元气小药: true, 紫元气酒: true, 紫攻击小药: true,
        紫攻击小吃: true, 紫武器附魔: true, 紫攻击创意: true, texiaoyaozhui: true,
    };
    assert.deepEqual(buildCtxFromState({ ...naked, ...retiredBuffs }), panel, 'retired fixed-value buffs must be ignored');
    const emptyConsumables = { food: '', medicine: '', weapon: '', wine: '', cooking: '', banquet: '', perfume: '' };
    const expectedConsumables = {
        food: [['attack', '基础攻击', 158], ['overcome', '破防值', 158],
            ['attack', '基础攻击', 126], ['overcome', '破防值', 126]],
        medicine: [['attack', '基础攻击', 203], ['overcome', '破防值', 203],
            ['attack', '基础攻击', 162], ['overcome', '破防值', 162]],
        weapon: [['attack', '基础攻击', 135], ['attack', '基础攻击', 108]],
        wine: [['yuanqi', '元气', 92]],
        cooking: [['overcome', '破防值', 156], ['attack', '基础攻击', 156]],
        banquet: [['yuanqi', '元气', 143], ['yuanqi', '元气', 179]],
        perfume: [['overcome', '破防值', 16], ['critical', '会心值', 16]],
    };
    assert.deepEqual(skills.consumableGroups.map((group) => group.key).sort(), Object.keys(expectedConsumables).sort());
    for (const [groupKey, entries] of Object.entries(expectedConsumables)) {
        const actual = skills.consumableGroups.find((group) => group.key === groupKey).options;
        const expected = entries.map(([kind, stat, value]) => ({ id: `${groupKey}-${kind}-${value}`, stat, value }));
        assert.deepEqual(actual.map(({ id, stat, value }) => ({ id, stat, value })).sort((a, b) => a.id.localeCompare(b.id)),
            expected.sort((a, b) => a.id.localeCompare(b.id)), `${groupKey} contains only the requested buffs and tiers`);
        for (const { id, stat, value } of expected) {
            const buffed = buildCtxFromState({ ...naked, consumables: { [groupKey]: id } });
            const yuanqi = stat === '元气' ? value : 0;
            const attack = stat === '基础攻击' ? value : 0;
            near(buffed.面板元气 - panel.面板元气, yuanqi, `${id} yuanqi`);
            near(buffed.面板基础攻击 - panel.面板基础攻击, attack + yuanqi * 0.19, `${id} base attack`);
            near(buffed.面板攻击 - panel.面板攻击, attack + yuanqi * 0.81, `${id} total attack`);
            near(buffed.huixin - panel.huixin, ((stat === '会心值' ? value : 0) + yuanqi * 0.13) / 9512.91 * 100,
                `${id} critical rating conversion`);
            near(buffed.pofang - panel.pofang, ((stat === '破防值' ? value : 0) + yuanqi * 0.06) / 10378.17 * 100,
                `${id} overcome rating conversion`);
        }
    }
    for (const consumables of [null, {}, emptyConsumables, { food: 'unknown' }, { food: 'medicine-attack-203' },
        { food: ['food-attack-158', 'food-overcome-158'] }, { cooking: { stat: '基础攻击', value: 99999 } },
        { cooking: 'cooking-critical-156' }, { banquet: 'wine-yuanqi-92' }, { banquet: 'banquet-yuanqi-72' }]) {
        assert.deepEqual(buildCtxFromState({ ...naked, consumables }), panel, 'empty or invalid selections cannot add buffs');
    }
    const selectedConsumables = {
        food: 'food-attack-158', medicine: 'medicine-overcome-203', weapon: 'weapon-attack-135',
        wine: 'wine-yuanqi-92', cooking: 'cooking-attack-156', banquet: 'banquet-yuanqi-179', perfume: 'perfume-critical-16',
    };
    const buffedPanel = buildCtxFromState({ ...naked, consumables: selectedConsumables });
    near(buffedPanel.面板元气, 1271, 'wine and banquet add 92 + 179 yuanqi');
    near(buffedPanel.面板基础攻击, 5500.49, 'food, weapon, cooking, wine and banquet stack across groups');
    near(buffedPanel.面板攻击, 6288.51, 'wine and banquet add both innate and specialization attack');
    near(buffedPanel.huixin, (1319 + 16 + (92 + 179) * 0.13) / 9512.91 * 100, 'perfume and yuanqi critical ratings stack');
    near(buffedPanel.pofang, (1037.817 + 203 + (92 + 179) * 0.06) / 10378.17 * 100, 'medicine and yuanqi overcome ratings stack');
    near(buildCtxFromState({ ...naked, consumables: selectedConsumables, mingjiaozhen: true }).面板攻击,
        5500.49 * 1.05 + 1271 * 0.62, 'formation multiplies consumable base attack, not specialization attack');
    const fields = ['元气', '基础攻击', '会心值', '会效值', '破防值', '化劲', '御劲', '内防值'];
    for (const invalid of [undefined, null, '', NaN, Infinity, -100]) {
        const input = { ...zero, ...Object.fromEntries(fields.map((key) => [key, invalid])) };
        assert.deepEqual(buildCtxFromState(input), buildCtxFromState(zero), `invalid input ${String(invalid)} becomes zero`);
    }
    const capped = buildCtxFromState({ ...zero, ...Object.fromEntries(fields.map((key) => [key, 1e9])) });
    for (const [key, limit] of [['huixin', 100], ['huixiao', 300], ['neifang', 80], ['huajin', 80], ['yujin', 100], ['yuxiao', 40]]) {
        near(capped[key], limit, `${key} retained cap`);
    }
    // Use the actual Vue component's computed properties without mounting a DOM/chart.
    const Vue = require('vue');
    const vueSource = fs.readFileSync(path.join(__dirname, '../src/views/FenYing.vue'), 'utf8');
    const script = require('vue-template-compiler').parseComponent(vueSource).script.content;
    const code = require('@babel/core').transformSync(script, {
        babelrc: false, configFile: false, plugins: ['@babel/plugin-transform-modules-commonjs'],
    }).code;
    const componentModule = { exports: {} };
    const imports = (name) => {
        if (name === '@/common/skills/fenying') return skills;
        if (name === 'echarts') return {};
        throw new Error(`Unexpected component import: ${name}`);
    };
    new Function('require', 'module', 'exports', code)(imports, componentModule, componentModule.exports);
    const view = new Vue(componentModule.exports.default);
    assert.equal(view.statsReady, true, 'default attributes are ready for calculation');
    const defaults = Object.fromEntries(fields.map((field) => [field, view[field]]));
    const defaultPanel = { ...view.ctx };
    for (const [stat, expected] of [['面板元气', defaults.元气], ['面板基础攻击', defaults.基础攻击],
        ['面板攻击', defaults.基础攻击 + defaults.元气 * 0.62],
        ['huixin', Math.min(100, defaults.会心值 / 9512.91 * 100)],
        ['huixiao', Math.min(300, defaults.会效值 / 3504.6 * 100 + 175)],
        ['pofang', defaults.破防值 / 10378.17 * 100],
        ['neifang', Math.min(80, defaults.内防值 / (defaults.内防值 + 10802.88) * 100)],
        ['huajin', Math.min(80, defaults.化劲 / (defaults.化劲 + 5148) * 100 + 9.9609375)],
        ['yujin', Math.min(100, defaults.御劲 / 19025.82 * 100)]]) {
        near(defaultPanel[stat], expected, `default ${stat}`);
    }
    near(defaultPanel.yuxiao, Math.min(40, defaults.御劲 / 9422.82 * 100), 'default critical damage resistance derives from its rating');
    assert.equal(view.referenceExpectedDamage, skills.expectedDamage(defaultPanel).toFixed(0));
    assert.equal(view.statGains.length, 5, 'default attributes show all attribute gains');
    assert.deepEqual({ ...view.consumables }, emptyConsumables, 'default attributes contain no consumable buffs');
    assert.equal(Object.hasOwn(view.$data, 'refSkill'), false, 'reference skill selection is removed');
    assert.equal(Object.hasOwn(view.$data, 'refSkillOptions'), false, 'reference skill options are removed');
    const gainFields = [['元气', '1点元气'], ['基础攻击', '1点基础攻击'], ['会心值', '1点会心'],
        ['会效值', '1点会效'], ['破防值', '1点破防']];
    const dayDamage = (ctx) => ctx.huixin / 100 * skills.critDamage.单体日破(ctx)
        + (1 - ctx.huixin / 100) * skills.normalDamage.单体日破(ctx);
    const checkCurrentGains = (label) => {
        const base = dayDamage(view.ctx);
        const expected = gainFields.map(([key, stat]) => {
            const increased = key === '元气' ? buildCtxFromState(view.$data, 1)
                : buildCtxFromState({ ...view.$data, [key]: view[key] + 1 });
            return { stat, gain: dayDamage(increased) - base };
        }).sort((a, b) => b.gain - a.gain);
        assert.equal(view.referenceExpectedDamage, base.toFixed(0), label + ': reference stays on single-target day damage');
        assert.deepEqual(view.statGains.map(({ stat, gain }) => ({ stat, gain })),
            expected.map(({ stat, gain }) => ({ stat, gain: gain.toFixed(2) })), label + ': descending raw gains with current buffs');
        return expected;
    };
    checkCurrentGains('default panel');
    const defaultResistance = view.御劲;
    view.御劲 = defaultResistance * 2;
    near(view.ctx.yujin, Math.min(100, defaultResistance * 2 / 19025.82 * 100), 'changing critical resistance rating updates critical resistance');
    near(view.ctx.yuxiao, Math.min(40, defaultResistance * 2 / 9422.82 * 100), 'changing critical resistance rating also updates critical damage resistance');
    view.御劲 = defaultResistance;
    view.toggleConsumable('wine', 'wine-yuanqi-92');
    view.toggleConsumable('banquet', 'banquet-yuanqi-179');
    near(view.ctx.面板元气, defaults.元气 + 92 + 179, 'wine and banquet add yuanqi to the default panel');
    near(view.ctx.面板基础攻击, defaultPanel.面板基础攻击 + (92 + 179) * 0.19, 'default panel receives innate attack from added yuanqi');
    near(view.ctx.面板攻击, defaultPanel.面板攻击 + (92 + 179) * 0.81, 'default panel receives both yuanqi attack layers');
    near(view.ctx.huixin, Math.min(100, (defaults.会心值 + (92 + 179) * 0.13) / 9512.91 * 100), 'default critical chance retains its baseline with yuanqi buffs');
    near(view.ctx.pofang, defaultPanel.pofang + (92 + 179) * 0.06 / 10378.17 * 100, 'default overcome retains its baseline with yuanqi buffs');
    view.toggleConsumable('wine', 'wine-yuanqi-92');
    view.toggleConsumable('banquet', 'banquet-yuanqi-179');
    assert.deepEqual(view.ctx, defaultPanel, 'removing wine and banquet restores the default panel');
    Object.assign(view, Object.fromEntries(fields.map((field) => [field, undefined])));
    assert.equal(view.statsReady, false, 'explicitly cleared inputs gate results');
    assert.equal(view.referenceExpectedDamage, '待录入');
    assert.equal(view.statGains.length, 0);
    Object.assign(view, naked);
    assert.equal(view.statsReady, true);
    assert.deepEqual(view.ctx, panel, 'component and damage calculations share context');
    const expectedGain = skills.expectedDamage(extra) - skills.expectedDamage(panel);
    assert.equal(view.statGains.find((gain) => gain.stat === '1点元气').gain, expectedGain.toFixed(2));
    assert.deepEqual({ ...view.consumables }, emptyConsumables, 'all consumable groups start unselected');
    for (const group of skills.consumableGroups) {
        const optionId = group.options[0].id;
        view.toggleConsumable(group.key, optionId);
        assert.equal(view.consumables[group.key], optionId, `${group.key} selects its clicked option`);
        view.toggleConsumable(group.key, optionId);
        assert.equal(view.consumables[group.key], '', `${group.key} deselects its option on a second click`);
        assert.deepEqual(view.ctx, panel, `${group.key} deselection restores the unbuffed panel`);
        assert.equal(view.referenceExpectedDamage, skills.expectedDamage(panel).toFixed(0),
            `${group.key} deselection restores expected damage`);
    }
    for (const [groupKey, optionId] of Object.entries(selectedConsumables)) {
        view.toggleConsumable(groupKey, optionId);
    }
    assert.deepEqual({ ...view.consumables }, selectedConsumables, 'selecting a group preserves every other group');
    assert.deepEqual(view.ctx, buffedPanel, 'component uses the buffed context');
    assert.equal(view.referenceExpectedDamage, skills.expectedDamage(buffedPanel).toFixed(0));
    assert.equal(view.damageTableData.find((row) => row.name === '单体日破').normal,
        skills.normalDamage.单体日破(buffedPanel).toFixed(0), 'skill table receives consumable damage');
    checkCurrentGains('all consumables active');
    Object.assign(view, { mingjiaozhen: true, youyinChenJi: true, mingyueduxin: true, chengwu: true });
    checkCurrentGains('consumables, formation, talents and weapon effect active');
    assert.notEqual(view.referenceExpectedDamage, skills.expectedDamage(buffedPanel).toFixed(0), 'selected non-consumable buffs affect the reference');
    Object.assign(view, { mingjiaozhen: false, youyinChenJi: false, mingyueduxin: false, chengwu: false });
    view.toggleConsumable('food', 'food-overcome-126');
    assert.deepEqual({ ...view.consumables }, { ...selectedConsumables, food: 'food-overcome-126' },
        'clicking another food replaces only that group');
    near(view.ctx.面板基础攻击, buffedPanel.面板基础攻击 - 158, 'changing food removes the previous attack buff');
    near(view.ctx.pofang, buffedPanel.pofang + 126 / 10378.17 * 100, 'changing food adds only the selected overcome tier');
    view.toggleConsumable('cooking', 'cooking-overcome-156');
    near(view.ctx.面板基础攻击, buffedPanel.面板基础攻击 - 158 - 156, 'cooking attack cannot coexist with cooking overcome');
    near(view.ctx.pofang, buffedPanel.pofang + (126 + 156) / 10378.17 * 100, 'cooking and food are separate groups');
    view.toggleConsumable('perfume', 'perfume-overcome-16');
    near(view.ctx.huixin, buffedPanel.huixin - 16 / 9512.91 * 100, 'perfume critical cannot coexist with perfume overcome');
    near(view.ctx.pofang, buffedPanel.pofang + (126 + 156 + 16) / 10378.17 * 100, 'perfume stacks with food and cooking');
    view.toggleConsumable('banquet', 'banquet-yuanqi-143');
    near(view.ctx.面板元气, 1000 + 92 + 143, 'changing banquet replaces its tier and retains wine');
    near(view.ctx.面板基础攻击, 5000 + 135 + (92 + 143) * 0.19, 'banquet replacement updates innate attack');
    near(view.ctx.面板攻击, 5000 + 135 + (92 + 143) * 0.19 + (1000 + 92 + 143) * 0.62,
        'banquet replacement updates specialization attack');
    near(view.ctx.huixin, (1319 + (92 + 143) * 0.13) / 9512.91 * 100, 'banquet replacement updates critical rating');
    near(view.ctx.pofang, (1037.817 + 203 + 126 + 156 + 16 + (92 + 143) * 0.06) / 10378.17 * 100,
        'banquet replacement updates overcome rating');
    for (const [groupKey, optionId] of Object.entries({ ...view.consumables })) {
        view.toggleConsumable(groupKey, optionId);
    }
    assert.deepEqual({ ...view.consumables }, emptyConsumables, 'clicking all active options clears every group');
    assert.deepEqual(view.ctx, panel, 'clearing every group restores the unbuffed panel');
    assert.equal(view.referenceExpectedDamage, skills.expectedDamage(panel).toFixed(0), 'clearing all buffs restores damage');
    view.基础攻击 = 10349;
    const closeGains = checkCurrentGains('nearly equal gains');
    const overcomeGain = closeGains.find((row) => row.stat === '1点破防').gain;
    const yuanqiGain = closeGains.find((row) => row.stat === '1点元气').gain;
    assert.ok(overcomeGain > yuanqiGain, 'overcome is slightly better than yuanqi in the rounding regression case');
    assert.equal(overcomeGain.toFixed(2), yuanqiGain.toFixed(2), 'distinct gains display the same rounded number');
    assert.ok(view.statGains.findIndex((row) => row.stat === '1点破防') < view.statGains.findIndex((row) => row.stat === '1点元气'),
        'sort before rounding, even when both labels display 0.95');
    view.基础攻击 = 120000;
    checkCurrentGains('large gains after changing the panel');
    assert.equal(view.statGains[0].stat, '1点破防', '10.44 ranks above 7.76 numerically');
    Object.assign(view, naked);
    view.会心值 = 9512.91 - 0.5;
    const nextCrit = buildCtxFromState({ ...view.$data, 会心值: view.会心值 + 1 });
    assert.equal(view.statGains.find((gain) => gain.stat === '1点会心').gain,
        (skills.expectedDamage(nextCrit) - skills.expectedDamage(view.ctx)).toFixed(2), 'one-point gain at the critical cap');
    view.元气 = undefined;
    assert.equal(view.statsReady, false, 'clearing an input gates results again');
    assert.equal(view.referenceExpectedDamage, '待录入');
    assert.equal(view.statGains.length, 0);
    Object.assign(view, naked);
    view.jimieJiehui = true;
    view.jiNengXuLie = ['驱夜', '日破', '诛邪', '月破', '日斩', '驱夜', '月破'];
    const checkMultipliers = (expected, label) => {
        assert.equal(view.sequenceCasts.length, expected.length, label);
        expected.forEach((mult, index) => near(view.sequenceCasts[index].mult, mult, `${label} cast ${index + 1}`));
    };
    checkMultipliers([1, 1.15, 1, 1.3, 1, 1, 1.6], 'Jimie: three builders, only sun/moon consumers');
    view.jiNengXuLie.splice(0, 1);
    checkMultipliers([1, 1, 1.15, 1, 1, 1.45], 'deleting a builder recalculates later stacks');
    view.jiNengXuLie = Array(10).fill('日破');
    checkMultipliers([1, 1.15, 1.3, 1.45, 1.6, 1.75, 1.9, 2.05, 2.2, 2.2], 'eight-stack cap and damage before stacking');
    view.jimieJiehui = false;
    checkMultipliers(Array(10).fill(1), 'Jimie disabled');
    view.jimieJiehui = true;
    view.chengwu = true;
    view.jiNengXuLie = ['驱夜', '日破', '月破'];
    for (const [skill, mult] of [['驱夜', 1], ['日破', 1.15], ['月破', 1.3]]) {
        near(view.comboCoefData.find((row) => row.name === skill).subtotal,
            skills.comboCoefs[skill](view.ctx) * mult, `${skill} coefficient uses Jimie multiplier`);
        for (const getter of [view.getSkillDamage, view.getSkillDamageCrit]) {
            near(view.aggregate(getter).damageData.find((row) => row.name === skill).value,
                Math.round(getter(skill) * mult), `${skill} normal/critical aggregate uses Jimie multiplier`);
        }
    }
    near(view.comboCoefData.find((row) => row.name === '愿火长燃').subtotal,
        3 * skills.comboCoefs['愿火长燃'](view.ctx), 'orange-weapon extra coefficient is not amplified');
    for (const getter of [view.getSkillDamage, view.getSkillDamageCrit]) {
        near(view.aggregate(getter).damageData.find((row) => row.name === '愿火长燃').value,
            3 * getter('愿火长燃'), 'orange-weapon extra damage is not amplified');
    }
    view.updateChart = () => {}; // No chart/DOM is mounted in this component check.
    view.clearJiNengXuLie();
    checkMultipliers([], 'clear sequence');
    view.pushJiNengXuLie('月破');
    checkMultipliers([1], 'a fresh sequence starts at zero stacks');
    for (const unavailable of ['不存在的技能', '无明缚夜', '无明缚夜(斩杀)']) {
        assert.equal(view.isComboBtnDisabled(unavailable), true, 'unknown or inactive skills are disabled');
        view.pushJiNengXuLie(unavailable);
        assert.deepEqual([...view.jiNengXuLie], ['月破'], 'programmatic calls cannot add unavailable skills');
    }
    const addedSkills = [
        ['月潮', 12], ['无明缚夜', 7.1979], ['无明缚夜(斩杀)', 7.1979 * 1.5],
        ['圣裁刑晷', 4.375], ['圣裁刑晷(原地)', 4.375 * 1.5],
    ];
    view.wumingyingfu = true;
    await Vue.nextTick();
    for (const [skill, coefficient] of addedSkills) {
        near(skills.comboCoefs[skill](panel), coefficient, `${skill} exact coefficient`);
        const normal = coefficient * skills.envMul(panel);
        const critical = normal * skills.critMul(panel);
        near(skills.normalDamage[skill](panel), normal, `${skill} normal damage`);
        near(skills.critDamage[skill](panel), critical, `${skill} critical damage`);
        near(skills.comboNormalDamage[skill](panel), normal, `${skill} combo normal damage`);
        near(skills.comboCritDamage[skill](panel), critical, `${skill} combo critical damage`);
        assert.ok(skills.comboTagType[skill], `${skill} has a combo tag`);
        assert.ok(view.comboButtons.includes(skill), `${skill} has a sequence button`);
        assert.ok(view.damageTableData.some((row) => row.name === skill), `${skill} appears in damage table`);
        view.jiNengXuLie = ['驱夜', skill, '月破'];
        checkMultipliers([1, 1, 1.15], `${skill} neither builds nor consumes Jimie`);
    }
    for (const oldName of ['无明影缚', '无明影缚(斩杀)']) {
        assert.equal(skills.normalDamage[oldName], undefined, `${oldName} was renamed`);
        assert.equal(view.comboButtons.includes(oldName), false);
        assert.equal(view.damageTableData.some((row) => row.name === oldName), false);
    }
    for (const pair of [['无明缚夜', '无明缚夜(斩杀)']]) {
        for (const first of pair) {
            view.clearJiNengXuLie();
            pair.forEach((skill) => assert.equal(view.isComboBtnDisabled(skill), false, `${skill} initially unlocked`));
            view.pushJiNengXuLie(first);
            pair.forEach((skill) => {
                assert.equal(view.isComboBtnDisabled(skill), true, `${first} locks ${skill}`);
                view.pushJiNengXuLie(skill);
            });
            assert.deepEqual([...view.jiNengXuLie], [first], 'programmatic calls cannot bypass exclusivity or duplicate limits');
            view.jiNengXuLie.splice(0, 1);
            pair.forEach((skill) => assert.equal(view.isComboBtnDisabled(skill), false, 'deletion unlocks both variants'));
            view.pushJiNengXuLie(first);
            view.clearJiNengXuLie();
            pair.forEach((skill) => assert.equal(view.isComboBtnDisabled(skill), false, 'clear unlocks both variants'));
        }
    }
    const shengcai = ['圣裁刑晷', '圣裁刑晷(原地)'];
    for (const first of shengcai) {
        const other = shengcai.find((skill) => skill !== first);
        view.clearJiNengXuLie();
        view.pushJiNengXuLie(first);
        assert.equal(view.isComboBtnDisabled(first), false, 'Shengcai selected variant remains repeatable');
        assert.equal(view.isComboBtnDisabled(other), true, 'Shengcai opposite variant is disabled');
        view.pushJiNengXuLie(other);
        view.pushJiNengXuLie(first);
        assert.deepEqual([...view.jiNengXuLie], [first, first], 'Shengcai forbids mixing, permits repeat casts');
        view.jiNengXuLie.splice(0, 1);
        assert.equal(view.isComboBtnDisabled(other), true, 'remaining Shengcai cast retains exclusivity');
        view.jiNengXuLie.splice(0, 1);
        shengcai.forEach((skill) => assert.equal(view.isComboBtnDisabled(skill), false, 'deleting all Shengcai casts unlocks both'));
        view.pushJiNengXuLie(first);
        view.clearJiNengXuLie();
        shengcai.forEach((skill) => assert.equal(view.isComboBtnDisabled(skill), false, 'clearing Shengcai unlocks both'));
    }
    view.pushJiNengXuLie('月潮');
    view.pushJiNengXuLie('月潮');
    assert.deepEqual([...view.jiNengXuLie], ['月潮', '月潮'], 'ordinary skills remain repeatable');
    for (const variant of ['无明缚夜', '无明缚夜(斩杀)']) {
        view.wumingyingfu = true;
        await Vue.nextTick();
        view.jiNengXuLie = ['月潮', variant, '月破'];
        view.wumingyingfu = false;
        await Vue.nextTick();
        assert.deepEqual([...view.jiNengXuLie], ['月潮', '月破'], 'turning off Wuming removes its casts only');
        assert.equal(view.comboButtons.includes(variant), false, 'turning off Wuming hides its buttons');
        assert.equal(view.isComboBtnDisabled(variant), true, 'turning off Wuming blocks programmatic reinsertion');
        view.pushJiNengXuLie(variant);
        assert.deepEqual([...view.jiNengXuLie], ['月潮', '月破']);
    }
    view.$destroy();
    console.log('PASS: fixed level-50 conversions, naked inputs, yuanqi gains, formation, retired buffs, invalid inputs and caps.');
    console.log('PASS: default panel, fixed day-skill reference, current buffs, raw numeric gain ranking, cleared-input gating and critical cap.');
    console.log('PASS: 17 consumables in 7 groups, wine/banquet conversions, food/cooking/perfume exclusivity, clear and buffed damage/stat gains.');
    console.log('PASS: Jimie stack builders, sun/moon bonuses, eight-stack cap, toggle, deletion/reset and coefficient/damage aggregation.');
    console.log('PASS: added skill coefficients, damage mappings, renamed labels, exclusive variants, repeatable skills and Wuming toggle cleanup.');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
