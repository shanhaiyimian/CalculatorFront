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
    assert.equal(view.statsReady, false, 'empty inputs gate results');
    assert.equal(view.referenceExpectedDamage, '待录入');
    assert.equal(view.statGains.length, 0);
    Object.assign(view, naked);
    assert.equal(view.statsReady, true);
    assert.deepEqual(view.ctx, panel, 'component and damage calculations share context');
    const expectedGain = skills.expectedDamage(extra) - skills.expectedDamage(panel);
    assert.equal(view.statGains.find((gain) => gain.stat === '1点元气').gain, expectedGain.toFixed(2));
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
        assert.ok(view.refSkillOptions.includes(skill), `${skill} is available for stat gains`);
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
    console.log('PASS: Vue shared context, empty/cleared-input gating and one-point gains near the critical cap.');
    console.log('PASS: Jimie stack builders, sun/moon bonuses, eight-stack cap, toggle, deletion/reset and coefficient/damage aggregation.');
    console.log('PASS: added skill coefficients, damage mappings, renamed labels, exclusive variants, repeatable skills and Wuming toggle cleanup.');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
