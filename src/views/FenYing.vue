<template>
    <div class="fenying">
        <div class="version-note">
            <strong>苍生铸世 · 双方固定50级</strong>
            <span>基础属性及部分技能已更新；其余倍率、奇穴和伤害规则尚未完成新版校准，伤害结果仅供对比。</span>
            <a href="https://www.jx3box.com/bps/109665" target="_blank" rel="noopener noreferrer">心法属性资料</a>
            <a href="https://www.jx3box.com/bps/109685" target="_blank" rel="noopener noreferrer">属性换算资料</a>
        </div>
        <el-row :gutter="16" class="main-row" style="margin:0px">
            <el-col :span="17">
                <!-- 自身数值 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title">自身数值</span>
                        <span class="mj-hint">请录入50级、0增益游戏面板</span>
                    </div>
                    <p class="input-note">基础攻击填写游戏的基础攻击（已含元气固有转换及心法固定攻击），不要填写最终面板攻击。会心、会效、破防填写等级点数，不填百分比。换装后请同步更新全部输入。</p>
                    <el-form label-width="88px" size="small" label-position="right">
                        <el-row :gutter="16">
                            <el-col :span="12">
                                <el-form-item label="元气数值">
                                    <el-input-number v-model.number="元气" label="元气数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="基础攻击">
                                    <el-input-number v-model.number="基础攻击" label="基础攻击" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="会心数值">
                                    <el-input-number v-model.number="会心值" label="会心数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="会效数值">
                                    <el-input-number v-model.number="会效值" label="会效数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="破防数值">
                                    <el-input-number v-model.number="破防值" label="破防数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>

                <!-- 敌方数值 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title enemy">敌方数值</span>
                        <span class="mj-hint">固定50级 · 无对应属性请填0</span>
                    </div>
                    <el-form label-width="88px" size="small" label-position="right">
                        <el-row :gutter="16">
                            <el-col :span="8">
                                <el-form-item label="化劲数值">
                                    <el-input-number v-model.number="化劲" label="化劲数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="御劲数值">
                                    <el-input-number v-model.number="御劲" label="御劲数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="内防数值">
                                    <el-input-number v-model.number="内防值" label="内防数值" placeholder="待录入" :min="0" :step="10" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-checkbox v-model="敌方基础化劲">包含非防御心法基础化劲（约9.96%）</el-checkbox>
                    <p class="input-note">木桩、NPC或防御心法请取消勾选；化劲输入仍填写等级点数。</p>
                </el-card>

                <!-- 我方增益和奇穴 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title">我方增益与奇穴</span>
                    </div>
                    <div class="buff-group">
                        <div class="buff-group-title"><i class="el-icon-magic-stick"></i> 奇穴 / 秘籍</div>
                        <el-checkbox v-model="yonghuierming" label="用晦而明" size="mini" border></el-checkbox>
                        <el-checkbox v-model="youyinChenJi" label="幽隐尘寂" size="mini" border></el-checkbox>
                        <el-checkbox v-model="wumingyingfu" label="无明缚夜" size="mini" border></el-checkbox>
                        <el-checkbox v-model="mingyueduxin" label="溟月度心" size="mini" border></el-checkbox>
                        <el-checkbox v-model="jimieJiehui" label="寂灭劫灰" size="mini" border></el-checkbox>
                    </div>
                    <el-divider class="mj-divider"></el-divider>
                    <div class="buff-group">
                        <div class="buff-group-title"><i class="el-icon-goblet-full"></i> 小吃小药 / 附魔（新版数值待更新，暂不参与计算）</div>
                        <el-checkbox v-model="紫元气小药" label="紫元气药" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="紫元气小吃" label="紫元气吃" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="紫攻击小药" label="紫攻击药" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="紫攻击小吃" label="紫攻击吃" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="紫武器附魔" label="紫武附魔" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="紫元气酒" label="紫元气酒" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="紫攻击创意" label="攻家园菜" size="mini" border disabled></el-checkbox>
                    </div>
                    <el-divider class="mj-divider"></el-divider>
                    <div class="buff-group">
                        <div class="buff-group-title"><i class="el-icon-medal"></i> 装备 / 特效</div>
                        <el-checkbox v-model="mingjiaozhen" label="明教阵眼" size="mini" border></el-checkbox>
                        <el-checkbox v-model="texiaoyaozhui" label="特效腰坠（待更新）" size="mini" border disabled></el-checkbox>
                        <el-checkbox v-model="chengwu" label="橙武特效" size="mini" border></el-checkbox>
                    </div>
                </el-card>

                <!-- 敌方增益 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title enemy">敌方增益</span>
                    </div>
                    <div class="buff-group">
                        <el-checkbox v-model="shengyong" label="圣咏" size="mini" border></el-checkbox>
                        <el-checkbox v-model="zhanlong" label="战龙" size="mini" border></el-checkbox>
                        <el-checkbox v-model="yijifuhuodian" label="10减伤复活点" size="mini" border></el-checkbox>
                        <el-checkbox v-model="erjifuhuodian" label="20减伤复活点" size="mini" border></el-checkbox>
                        <el-checkbox v-model="zhanjie14" label="14战阶" size="mini" border></el-checkbox>
                        <el-checkbox v-model="yuHuaDaQi" label="御化大旗" size="mini" border></el-checkbox>
                    </div>
                </el-card>

                <div class="mj-action-bar">
                    <el-button type="primary" icon="el-icon-s-data" :disabled="!statsReady" @click="jiNengDialog = true">技能伤害列表</el-button>
                    <el-button type="warning" icon="el-icon-connection" :disabled="!statsReady" @click="lianzhaoDialog = true">技能伤害序列</el-button>
                </div>

                <el-dialog
                    title="技能伤害列表"
                    :visible.sync="jiNengDialog"
                    width="58%"
                    custom-class="mj-dialog"
                    center>
                    <el-table :data="damageTableData" stripe size="small" style="width:100%" :header-cell-style="{background:'#f5ede0',color:'#5a1a1a',fontWeight:'bold'}">
                        <el-table-column prop="name" label="技能" min-width="140"/>
                        <el-table-column label="不会心伤害" min-width="140" align="right">
                            <template slot-scope="scope">
                                <span class="dmg-normal">{{ scope.row.normal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="会心伤害" min-width="140" align="right">
                            <template slot-scope="scope">
                                <span class="dmg-crit">{{ scope.row.crit }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>

                <el-dialog
                    title="技能伤害序列"
                    :visible.sync="lianzhaoDialog"
                    width="72%"
                    custom-class="mj-dialog"
                    center>
                    <div class="seq-section">
                        <div class="seq-section-title">技能选择</div>
                        <p v-if="jimieJiehui" class="input-note">寂灭劫灰从0层起算：日破、月破、驱夜施放后叠1层，最多8层；每层使日破、月破伤害提高15%，驱夜仅叠层。</p>
                        <p class="input-note">无明缚夜与斩杀二选一；圣裁刑晷与原地二选一。移除当前选择后可切换另一种。</p>
                        <div class="combo-buttons">
                            <el-button v-for="btn in comboButtons" :key="btn" type="primary" size="small" :disabled="isComboBtnDisabled(btn)" @click="pushJiNengXuLie(btn)">{{ btn }}</el-button>
                        </div>
                    </div>

                    <div class="seq-section">
                        <div class="seq-section-title">
                            当前技能序列
                            <el-button type="danger" size="mini" plain @click="clearJiNengXuLie" style="margin-left:12px;">清空序列</el-button>
                        </div>
                        <div class="seq-list">
                            <el-tag
                                v-for="(d,index) in jiNengXuLie"
                                :key="index"
                                closable
                                effect="dark"
                                :type="tagType(d)"
                                @close="jiNengXuLie.splice(index,1); updateChart();"
                                class="seq-tag">
                                {{ index + 1 }}. {{ d }}
                            </el-tag>
                            <span v-if="!jiNengXuLie.length" class="seq-empty">点击上方按钮添加技能</span>
                        </div>
                    </div>

                    <div class="seq-section" v-if="jiNengXuLie.length">
                        <div class="seq-section-title">连招技能系数</div>
                        <el-table
                            :data="comboCoefData"
                            size="small"
                            border
                            stripe
                            show-summary
                            :summary-method="coefSummary"
                            :header-cell-style="{background:'#f5ede0',color:'#5a1a1a',fontWeight:'bold'}"
                            style="width:100%">
                            <el-table-column prop="name" label="技能" min-width="100"/>
                            <el-table-column prop="count" label="次数" min-width="80" align="center"/>
                            <el-table-column label="单次系数" min-width="120" align="right">
                                <template slot-scope="scope">
                                    <span class="coef-cell">{{ scope.row.coef.toFixed(5) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="小计系数" min-width="120" align="right">
                                <template slot-scope="scope">
                                    <span class="coef-cell subtotal">{{ scope.row.subtotal.toFixed(5) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="占比" min-width="100" align="right">
                                <template slot-scope="scope">
                                    <span class="coef-pct">{{ totalCoef ? (scope.row.subtotal / totalCoef * 100).toFixed(1) : 0 }}%</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div class="seq-section">
                        <div class="seq-section-title">伤害占比对比</div>
                        <el-row :gutter="16">
                            <el-col :span="12">
                                <div class="chart-wrap">
                                    <div class="chart-title non-crit">全不会心 · 总伤害 <b>{{ totalNormal }}</b></div>
                                    <div ref="chartRef" style="width:100%;height:380px;"></div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="chart-wrap">
                                    <div class="chart-title crit">全会心 · 总伤害 <b>{{ totalCrit }}</b></div>
                                    <div ref="chartCritRef" style="width:100%;height:380px;"></div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-dialog>
            </el-col>

            <el-col :span="7">
                <el-card class="mj-card panel-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title"><i class="el-icon-user-solid"></i> 自身实际面板</span>
                    </div>
                    <div class="stat-grid" v-if="ownStatsReady">
                        <div class="stat-row"><span class="stat-label">元气</span><span class="stat-value">{{ctx.面板元气.toFixed(2)}}</span></div>
                        <div class="stat-row"><span class="stat-label">基础攻击</span><span class="stat-value">{{ctx.面板基础攻击.toFixed(2)}}</span></div>
                        <div class="stat-row highlight"><span class="stat-label">面板攻击</span><span class="stat-value attack">{{ctx.面板攻击.toFixed(2)}}</span></div>
                        <div class="stat-row"><span class="stat-label">会心</span><span class="stat-value crit">{{ctx.huixin.toFixed(2)}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">会效</span><span class="stat-value crit-eff">{{ctx.huixiao.toFixed(2)}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">破防</span><span class="stat-value pofang">{{ctx.pofang.toFixed(2)}}<em>%</em></span></div>
                    </div>
                    <p v-else class="input-note">请先填写全部自身属性。</p>
                </el-card>

                <el-card class="mj-card panel-card gain-panel" shadow="hover">
                    <div slot="header" class="mj-card-header gain-header">
                        <span class="mj-title"><i class="el-icon-trophy"></i> 属性收益</span>
                        <el-select
                            v-model="refSkill"
                            size="mini"
                            class="ref-skill-select"
                            placeholder="参考技能">
                            <el-option
                                v-for="opt in refSkillOptions"
                                :key="opt"
                                :label="opt"
                                :value="opt"/>
                        </el-select>
                    </div>
                    <div class="stat-grid" v-if="statsReady">
                        <div
                            v-for="g in statGains"
                            :key="g.stat"
                            class="stat-row gain-row">
                            <span class="stat-label"><i :class="g.icon"></i> {{ g.stat }}</span>
                            <span class="stat-value gain" :class="g.cls">+{{ g.gain }}<em>伤害</em></span>
                        </div>
                        <div class="stat-row highlight">
                            <span class="stat-label">参考期望伤害</span>
                            <span class="stat-value attack">{{ referenceExpectedDamage }}</span>
                        </div>
                    </div>
                    <p v-else class="input-note">填写完整的双方属性后，显示增加1点属性的收益。</p>
                    <p class="input-note">元气收益包含攻击、会心及破防的联动。期望伤害沿用原规则，暂未扣除敌方御劲对会心率的影响。</p>
                </el-card>

                <el-card class="mj-card panel-card enemy-panel" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title enemy"><i class="el-icon-s-flag"></i> 敌方防御面板</span>
                    </div>
                    <div class="stat-grid" v-if="enemyStatsReady">
                        <div class="stat-row"><span class="stat-label">内防</span><span class="stat-value neifang">{{ctx.neifang.toFixed(2)}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">化劲</span><span class="stat-value huajin">{{ctx.huajin.toFixed(2)}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">御劲</span><span class="stat-value yujin">{{ctx.yujin.toFixed(2)}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">御效</span><span class="stat-value yuxiao">{{ctx.yuxiao.toFixed(2)}}<em>%</em></span></div>
                    </div>
                    <p v-else class="input-note">请先填写全部敌方属性；无对应属性请填0。</p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import {
        normalDamage,
        critDamage,
        comboButtons as baseComboButtons,
        comboNormalDamage,
        comboCritDamage,
        comboCoefs,
        comboTagType,
        buildCtxFromState,
        expectedDamage,
    } from '@/common/skills/fenying';

    const exclusiveSkills = {
        无明缚夜: '无明缚夜(斩杀)',
        '无明缚夜(斩杀)': '无明缚夜',
        圣裁刑晷: '圣裁刑晷(原地)',
        '圣裁刑晷(原地)': '圣裁刑晷',
    };

    export default {
        data() {
            return {
                jiNengXuLie: [],
                chart: null,
                chartCrit: null,
                totalNormal: 0,
                totalCrit: 0,
                无间影狱: 1.1,
                //我方面板
                元气: undefined,
                基础攻击: undefined,
                会心值: undefined,
                会效值: undefined,
                破防值: undefined,
                //敌方面板
                化劲: undefined,
                御劲: undefined,
                内防值: undefined,
                敌方基础化劲: true,
                //增益开关
                jingtitiandi: 1,
                mingguanghengzhao: false,
                xuanxiangzhuming: true,
                tiandi: false,
                chengwu: false,
                紫元气小药: false,
                紫元气小吃: false,
                紫攻击小药: false,
                紫攻击小吃: false,
                紫武器附魔: false,
                紫元气酒: false,
                紫攻击创意: false,
                mingjiaozhen: false,
                yonghuierming: false,
                youyinChenJi: false,
                wumingyingfu: false,
                mingyueduxin: false,
                jimieJiehui: false,
                texiaoyaozhui: false,
                shengyong: false,
                zhanlong: false,
                yijifuhuodian: false,
                erjifuhuodian: false,
                zhanjie14: false,
                yuHuaDaQi: false,
                jiNengDialog: false,
                lianzhaoDialog: false,
                //属性收益参考技能（可选）
                refSkill: '单体日破',
                refSkillOptions: [
                    '绕背驱夜',
                    '单体日破',
                    '单体月破',
                    '普通诛邪',
                    '三段日月晦',
                    '日斩',
                    '月潮',
                    '无明缚夜',
                    '无明缚夜(斩杀)',
                    '圣裁刑晷',
                    '圣裁刑晷(原地)',
                ],
            };
        },
        computed: {
            ownStatsReady() {
                return [this.元气, this.基础攻击, this.会心值, this.会效值, this.破防值]
                    .every((value) => Number.isFinite(value) && value >= 0);
            },
            enemyStatsReady() {
                return [this.化劲, this.御劲, this.内防值]
                    .every((value) => Number.isFinite(value) && value >= 0);
            },
            statsReady() {
                return this.ownStatsReady && this.enemyStatsReady;
            },
            //通用计算上下文，打包给 common/skills/fenying 使用
            ctx() {
                return buildCtxFromState(this.$data);
            },
            comboButtons() {
                return this.wumingyingfu
                    ? [...baseComboButtons, '无明缚夜', '无明缚夜(斩杀)']
                    : baseComboButtons;
            },
            // 按顺序模拟技能序列，记录每次施放时寂灭劫灰对该技能的乘子
            // 日破/月破/驱夜在本次伤害结算后叠1层，上限8层；日月破魔每层增伤15%，不消耗。
            sequenceCasts() {
                let stacks = 0;
                return this.jiNengXuLie.map((skill) => {
                    let mult = 1;
                    if (this.jimieJiehui && (skill === '日破' || skill === '月破')) {
                        mult = 1 + 0.15 * stacks;
                    }
                    if (this.jimieJiehui && (skill === '日破' || skill === '月破' || skill === '驱夜')) {
                        stacks = Math.min(8, stacks + 1);
                    }
                    return { skill, mult };
                });
            },
            damageTableData() {
                const c = this.ctx;
                const f = (v) => (typeof v === 'number' ? v.toFixed(0) : v);
                return [
                    { name: '绕背驱夜',           normal: f(normalDamage.绕背驱夜(c)),     crit: f(critDamage.绕背驱夜(c)) },
                    { name: '单体日破',           normal: f(normalDamage.单体日破(c)),     crit: f(critDamage.单体日破(c)) },
                    { name: '单体月破',           normal: f(normalDamage.单体月破(c)),     crit: f(critDamage.单体月破(c)) },
                    { name: '普通诛邪',           normal: f(normalDamage.普通诛邪(c)),     crit: f(critDamage.普通诛邪(c)) },
                    { name: '3段日月晦总伤害',    normal: f(normalDamage.三段日月晦(c)),   crit: f(critDamage.三段日月晦(c)) },
                    { name: '橙戒指',             normal: f(normalDamage.橙戒指(c)),       crit: f(critDamage.橙戒指(c)) },
                    { name: '橙武特效单次伤害',   normal: f(normalDamage.橙武特效(c)),     crit: f(critDamage.橙武特效(c)) },
                    { name: '无明缚夜',           normal: f(normalDamage.无明缚夜(c)),     crit: f(critDamage.无明缚夜(c)) },
                    { name: '无明缚夜(斩杀)',     normal: f(normalDamage['无明缚夜(斩杀)'](c)), crit: f(critDamage['无明缚夜(斩杀)'](c)) },
                    { name: '月潮',             normal: f(normalDamage.月潮(c)),         crit: f(critDamage.月潮(c)) },
                    { name: '圣裁刑晷',         normal: f(normalDamage.圣裁刑晷(c)),     crit: f(critDamage.圣裁刑晷(c)) },
                    { name: '圣裁刑晷(原地)',   normal: f(normalDamage['圣裁刑晷(原地)'](c)), crit: f(critDamage['圣裁刑晷(原地)'](c)) },
                ];
            },
            comboCoefData() {
                const c = this.ctx;
                const map = {};
                const addCast = (skill, baseCoef, mult) => {
                    if (!map[skill]) {
                        map[skill] = { name: skill, count: 0, subtotal: 0 };
                    }
                    map[skill].count += 1;
                    map[skill].subtotal += baseCoef * mult;
                };
                this.sequenceCasts.forEach(({ skill, mult }) => {
                    addCast(skill, comboCoefs[skill](c), mult);
                    if (this.chengwu && !this.yuanhuoExempt(skill)) {
                        addCast('愿火长燃', comboCoefs['愿火长燃'](c), 1);
                    }
                });
                // 单次系数取该技能在序列中的实际平均值（含寂灭加成）
                return Object.values(map).map((r) => ({
                    name: r.name,
                    count: r.count,
                    coef: r.subtotal / r.count,
                    subtotal: r.subtotal,
                }));
            },
            totalCoef() {
                return this.comboCoefData.reduce((s, r) => s + r.subtotal, 0);
            },
            totalCount() {
                return this.comboCoefData.reduce((s, r) => s + r.count, 0);
            },
            //属性收益：基于参考技能期望伤害（会心加权）做有限差分
            statGains() {
                if (!this.statsReady) return [];
                const s = this.$data;
                const skill = this.refSkill;
                const base = expectedDamage(this.ctx, skill);
                const probe = (key) => {
                    const increased = key === '元气'
                        ? buildCtxFromState(s, 1)
                        : buildCtxFromState({ ...s, [key]: s[key] + 1 });
                    return expectedDamage(increased, skill) - base;
                };
                const fmt = (v) => v.toFixed(2);
                return [
                    { stat: '1点元气',     icon: 'el-icon-lightning',   gain: fmt(probe('元气')),     cls: 'yuanqi' },
                    { stat: '1点基础攻击', icon: 'el-icon-aim',         gain: fmt(probe('基础攻击')), cls: 'attack' },
                    { stat: '1点会心',     icon: 'el-icon-star-on',     gain: fmt(probe('会心值')),   cls: 'crit' },
                    { stat: '1点会效',     icon: 'el-icon-magic-stick', gain: fmt(probe('会效值')),   cls: 'crit-eff' },
                    { stat: '1点破防',     icon: 'el-icon-discover',    gain: fmt(probe('破防值')),   cls: 'pofang' },
                ];
            },
            //期望伤害（用于面板展示 "参考伤害"）
            referenceExpectedDamage() {
                return this.statsReady ? expectedDamage(this.ctx, this.refSkill).toFixed(0) : '待录入';
            },
        },
        methods: {
            coefSummary() {
                return ['合计', this.totalCount, '—', this.totalCoef.toFixed(5), '100%'];
            },
            tagType(skill) {
                return comboTagType[skill] || '';
            },
            yuanhuoExempt(skill) {
                return skill === '诛邪' || skill === '无明缚夜' || skill === '无明缚夜(斩杀)';
            },
            isComboBtnDisabled(btn) {
                if (!this.comboButtons.includes(btn)) return true;
                if (this.jiNengXuLie.includes(exclusiveSkills[btn])) return true;
                if (btn === '无明缚夜' || btn === '无明缚夜(斩杀)') {
                    return this.jiNengXuLie.includes(btn);
                }
                return false;
            },
            pushJiNengXuLie(x) {
                if (this.isComboBtnDisabled(x)) return;
                this.jiNengXuLie.push(x);
                this.updateChart();
            },
            clearJiNengXuLie() {
                this.jiNengXuLie = [];
                this.updateChart();
            },
            getSkillDamage(skill) {
                return parseInt(comboNormalDamage[skill](this.ctx));
            },
            getSkillDamageCrit(skill) {
                return parseInt(comboCritDamage[skill](this.ctx));
            },
            buildPieOption(title, damageData, colors) {
                return {
                    title: { text: title, left: 'center', textStyle: { color: '#5a1a1a', fontSize: 14 } },
                    tooltip: { trigger: 'item', formatter: '{a}<br/>{b}: {c} ({d}%)' },
                    legend: { orient: 'horizontal', bottom: 0, data: damageData.map((item) => item.name) },
                    color: colors,
                    series: [{
                        name: '伤害占比',
                        type: 'pie',
                        radius: ['40%', '62%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: true,
                        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                        label: { formatter: '{b}\n{d}%' },
                        data: damageData,
                        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' } },
                    }],
                };
            },
            aggregate(dataGetter) {
                const damageData = [];
                let total = 0;
                const addData = (name, damage) => {
                    total += damage;
                    const existing = damageData.find((item) => item.name === name);
                    if (existing) {
                        existing.value += damage;
                    } else {
                        damageData.push({ name, value: damage });
                    }
                };
                this.sequenceCasts.forEach(({ skill, mult }) => {
                    addData(skill, Math.round(dataGetter(skill) * mult));
                    if (this.chengwu && !this.yuanhuoExempt(skill)) {
                        addData('愿火长燃', dataGetter('愿火长燃'));
                    }
                });
                return { damageData, total };
            },
            updateChart() {
                if (!this.chart || !this.chartCrit) {
                    this.initChart();
                    return;
                }
                const normal = this.aggregate(this.getSkillDamage);
                const crit = this.aggregate(this.getSkillDamageCrit);
                this.totalNormal = normal.total;
                this.totalCrit = crit.total;
                this.chart.setOption(
                    this.buildPieOption('全不会心伤害占比', normal.damageData,
                        ['#7f8c8d', '#95a5a6', '#bdc3c7', '#34495e', '#5d6d7e', '#85929e']),
                    true,
                );
                this.chartCrit.setOption(
                    this.buildPieOption('全会心伤害占比', crit.damageData,
                        ['#a01c1c', '#d4a017', '#e67e22', '#5f3a8f', '#c0392b', '#2c7a7b']),
                    true,
                );
            },
            initChart() {
                if (this.$refs.chartRef) this.chart = echarts.init(this.$refs.chartRef);
                if (this.$refs.chartCritRef) this.chartCrit = echarts.init(this.$refs.chartCritRef);
                if (this.chart && this.chartCrit) this.updateChart();
            },
        },
        watch: {
            statsReady(ready) {
                if (!ready) {
                    this.jiNengDialog = false;
                    this.lianzhaoDialog = false;
                }
            },
            lianzhaoDialog(newVal) {
                if (newVal) this.$nextTick(() => this.initChart());
            },
            ctx() {
                if (this.lianzhaoDialog) this.updateChart();
            },
            wumingyingfu(val) {
                if (val) {
                    this.mingyueduxin = false;
                } else {
                    this.jiNengXuLie = this.jiNengXuLie.filter((skill) => skill !== '无明缚夜' && skill !== '无明缚夜(斩杀)');
                    if (this.lianzhaoDialog) this.updateChart();
                }
            },
            mingyueduxin(val) {
                if (val) this.wumingyingfu = false;
                if (this.lianzhaoDialog) this.updateChart();
            },
            jimieJiehui() {
                if (this.lianzhaoDialog) this.updateChart();
            },
        },
        beforeDestroy() {
            if (this.chart) this.chart.dispose();
            if (this.chartCrit) this.chartCrit.dispose();
        },
    };
</script>

<style scoped>
.fenying {
    background: url("../assets/backmingjiao.png") no-repeat;
    flex: 1;
    background-size: 600px;
    background-position-x: center;
    background-position-y: center;
    background-attachment: fixed;
    padding: 16px;
    min-height: 100vh;
}

.main-row { margin-bottom: 20px; }

.version-note {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    margin-bottom: 14px;
    padding: 12px 16px;
    background: #fff8eb;
    border: 1px solid #e8d5ae;
    border-radius: 8px;
    color: #76522b;
    font-size: 13px;
    line-height: 1.6;
}
.version-note a { color: #8b0000; }
.input-note { margin: 0 0 12px; color: #716353; font-size: 12px; line-height: 1.7; }
.mj-card-header { flex-wrap: wrap; }

.mj-card {
    margin-bottom: 14px;
    border: 1px solid rgba(160, 28, 28, 0.15);
    border-radius: 10px;
    background: rgba(255, 252, 248, 0.92);
    backdrop-filter: blur(3px);
    transition: box-shadow .25s, transform .25s;
}
.mj-card:hover { transform: translateY(-1px); }

.mj-card >>> .el-card__header {
    padding: 12px 18px;
    background: linear-gradient(90deg, rgba(160,28,28,0.08) 0%, rgba(212,160,23,0.05) 100%);
    border-bottom: 1px solid rgba(160, 28, 28, 0.15);
    border-radius: 10px 10px 0 0;
}
.mj-card >>> .el-card__body { padding: 16px 18px; }

.mj-card-header { display: flex; align-items: baseline; gap: 10px; }
.mj-title {
    font-size: 16px;
    font-weight: 700;
    color: #8B0000;
    letter-spacing: 1px;
    position: relative;
    padding-left: 12px;
}
.mj-title::before {
    content: '';
    position: absolute;
    left: 0; top: 4px;
    width: 4px; height: 16px;
    background: linear-gradient(180deg, #a01c1c, #d4a017);
    border-radius: 2px;
}
.mj-title.enemy { color: #4a4a4a; }
.mj-title.enemy::before { background: linear-gradient(180deg, #4a4a4a, #8a8a8a); }
.mj-hint { font-size: 12px; color: #999; }

.buff-group { line-height: 2.2; }
.buff-group-title { font-size: 13px; font-weight: 600; color: #8B0000; margin-bottom: 8px; }
.buff-group-title i { margin-right: 4px; }
.buff-group .el-checkbox { margin: 4px 6px 4px 0 !important; }

.mj-divider { margin: 12px 0 !important; }

.mj-action-bar { display: flex; gap: 12px; margin: 6px 0 0; }
.mj-action-bar .el-button {
    padding: 10px 22px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.panel-card .el-card__body { padding: 14px 18px; }
.stat-grid { display: flex; flex-direction: column; gap: 6px; }
.stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgba(245, 237, 224, 0.5);
    transition: background .2s;
}
.stat-row:hover { background: rgba(245, 237, 224, 0.9); }
.stat-row.highlight {
    background: linear-gradient(90deg, rgba(160,28,28,0.08), rgba(212,160,23,0.15));
    border: 1px solid rgba(160, 28, 28, 0.2);
}
.stat-label { font-size: 13px; color: #666; font-weight: 500; }
.stat-value { font-size: 18px; font-weight: 700; color: #333; font-family: 'Consolas', 'Monaco', monospace; }
.stat-value em { font-size: 12px; font-style: normal; color: #888; margin-left: 2px; font-weight: 500; }
.stat-value.attack    { color: #a01c1c; font-size: 22px; }
.stat-value.crit      { color: #d4a017; }
.stat-value.crit-eff  { color: #e67e22; }
.stat-value.pofang    { color: #c0392b; }
.stat-value.neifang   { color: #34495e; }
.stat-value.huajin    { color: #5f3a8f; }
.stat-value.yujin     { color: #2c7a7b; }
.stat-value.yuxiao    { color: #2c7a7b; }
.enemy-panel .stat-row.highlight { background: rgba(74, 74, 74, 0.1); }

/* 属性收益面板 */
.gain-panel .gain-row {
    background: linear-gradient(90deg, rgba(212,160,23,0.04), rgba(160,28,28,0.04));
}
.gain-panel .gain-row .stat-label i { margin-right: 4px; color: #d4a017; }
.stat-value.gain {
    font-size: 16px;
    color: #a01c1c;
}
.stat-value.gain em {
    font-size: 11px;
    margin-left: 3px;
    color: #999;
}
.stat-value.gain.yuanqi    { color: #c0392b; }
.stat-value.gain.attack    { color: #a01c1c; }
.stat-value.gain.crit      { color: #d4a017; }
.stat-value.gain.crit-eff  { color: #e67e22; }
.stat-value.gain.pofang    { color: #8B0000; }

.gain-header { justify-content: space-between; width: 100%; }
.ref-skill-select { width: 140px; }
.ref-skill-select >>> .el-input__inner {
    border-color: rgba(160, 28, 28, 0.3);
    color: #8B0000;
    font-weight: 600;
}

.mj-dialog >>> .el-dialog__header {
    background: linear-gradient(90deg, #8B0000 0%, #a01c1c 100%);
    padding: 16px 20px;
    border-radius: 6px 6px 0 0;
}
.mj-dialog >>> .el-dialog__title { color: #fff; font-weight: 700; letter-spacing: 2px; }
.mj-dialog >>> .el-dialog__headerbtn .el-dialog__close { color: #fff; }

.dmg-normal { font-family: 'Consolas', monospace; font-weight: 600; color: #333; }
.dmg-crit   { font-family: 'Consolas', monospace; font-weight: 700; color: #d4a017; }

.seq-section { margin-bottom: 20px; }
.combo-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.combo-buttons .el-button { margin-left: 0; }
.seq-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #8B0000;
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 3px solid #a01c1c;
}
.seq-list {
    min-height: 44px;
    padding: 8px;
    background: #fafafa;
    border: 1px dashed #ddd;
    border-radius: 6px;
}
.seq-tag { margin: 4px 6px 4px 0; cursor: default; }
.seq-empty { color: #aaa; font-size: 13px; padding-left: 4px; }

.el-form-item { margin-bottom: 12px !important; }

.chart-wrap {
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 10px;
}
.chart-title {
    text-align: center;
    font-size: 13px;
    padding: 6px 0 4px;
    border-bottom: 1px dashed #e0e0e0;
    margin-bottom: 6px;
}
.chart-title b { font-family: 'Consolas', monospace; font-size: 15px; margin-left: 6px; }
.chart-title.non-crit { color: #555; }
.chart-title.non-crit b { color: #333; }
.chart-title.crit { color: #8B0000; }
.chart-title.crit b { color: #d4a017; }

.coef-cell { font-family: 'Consolas', monospace; color: #333; }
.coef-cell.subtotal { font-weight: 700; color: #a01c1c; }
.coef-pct { font-family: 'Consolas', monospace; color: #d4a017; font-weight: 600; }
</style>
