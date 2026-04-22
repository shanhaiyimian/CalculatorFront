<template>
    <div class="mingjiao">
        <el-row :gutter="16" class="main-row" style="margin:0px">
            <el-col :span="17">
                <!-- 自身数值 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title">自身数值</span>
                        <span class="mj-hint">0增益裸面板 / 默认为本赛季毕业属性</span>
                    </div>
                    <el-form label-width="88px" size="small" label-position="right">
                        <el-row :gutter="16">
                            <el-col :span="12">
                                <el-form-item label="元气数值">
                                    <el-input-number v-model.number="元气" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="基础攻击">
                                    <el-input-number v-model.number="基础攻击" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="会心数值">
                                    <el-input-number v-model.number="会心值" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="会效数值">
                                    <el-input-number v-model.number="会效值" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="破防数值">
                                    <el-input-number v-model.number="破防值" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>

                <!-- 敌方数值 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title enemy">敌方数值</span>
                    </div>
                    <el-form label-width="88px" size="small" label-position="right">
                        <el-row :gutter="16">
                            <el-col :span="8">
                                <el-form-item label="化劲数值">
                                    <el-input-number v-model.number="化劲" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="御劲数值">
                                    <el-input-number v-model.number="御劲" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="内防数值">
                                    <el-input-number v-model.number="内防值" :min="0" :step="100" controls-position="right" style="width:100%"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>

                <!-- 我方增益和奇穴 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title">我方增益与奇穴</span>
                    </div>
                    <div class="buff-group">
                        <div class="buff-group-title"><i class="el-icon-magic-stick"></i> 奇穴 / 秘籍</div>
                        <el-checkbox v-model="pvpShou" label="PVP手" size="mini" border></el-checkbox>
                        <el-checkbox v-model="jianFengBaiDuan" label="剑锋百锻" size="mini" border></el-checkbox>
                        <el-checkbox v-model="yonghuierming" label="用晦而明" size="mini" border></el-checkbox>
                        <el-checkbox v-model="judian" label="据点增益" size="mini" border></el-checkbox>
                    </div>
                    <el-divider class="mj-divider"></el-divider>
                    <div class="buff-group">
                        <div class="buff-group-title"><i class="el-icon-goblet-full"></i> 小吃小药 / 附魔</div>
                        <el-checkbox v-model="紫元气小药" label="紫元气药" size="mini" border></el-checkbox>
                        <el-checkbox v-model="紫元气小吃" label="紫元气吃" size="mini" border></el-checkbox>
                        <el-checkbox v-model="紫攻击小药" label="紫攻击药" size="mini" border></el-checkbox>
                        <el-checkbox v-model="紫攻击小吃" label="紫攻击吃" size="mini" border></el-checkbox>
                        <el-checkbox v-model="紫武器附魔" label="紫武附魔" size="mini" border></el-checkbox>
                        <el-checkbox v-model="紫元气酒" label="紫元气酒" size="mini" border></el-checkbox>
                        <el-checkbox v-model="紫攻击创意" label="攻家园菜" size="mini" border></el-checkbox>
                    </div>
                    <el-divider class="mj-divider"></el-divider>
                    <div class="buff-group">
                        <div class="buff-group-title"><i class="el-icon-medal"></i> 装备 / 特效</div>
                        <el-checkbox v-model="mingjiaozhen" label="明教阵眼" size="mini" border></el-checkbox>
                        <el-checkbox v-model="texiaoyaozhui" label="特效腰椎" size="mini" border></el-checkbox>
                        <el-checkbox v-model="chengwu" label="橙武特效" size="mini" border></el-checkbox>
                    </div>
                </el-card>

                <!-- 敌方减伤 -->
                <el-card class="mj-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title enemy">敌方减伤</span>
                    </div>
                    <div class="buff-group">
                        <el-checkbox v-model="shengyong" label="圣咏" size="mini" border></el-checkbox>
                        <el-checkbox v-model="zhanlong" label="战龙" size="mini" border></el-checkbox>
                        <el-checkbox v-model="yijifuhuodian" label="10减伤复活点" size="mini" border></el-checkbox>
                        <el-checkbox v-model="erjifuhuodian" label="20减伤复活点" size="mini" border></el-checkbox>
                    </div>
                </el-card>

                <!-- 操作按钮 -->
                <div class="mj-action-bar">
                    <el-button type="primary" icon="el-icon-s-data" @click="jiNengDialog = true">技能伤害列表</el-button>
                    <el-button type="warning" icon="el-icon-connection" @click="lianzhaoDialog = true">技能伤害序列</el-button>
                </div>

                <!-- 技能伤害列表 -->
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

                <!-- 技能伤害序列 -->
                <el-dialog
                    title="技能伤害序列"
                    :visible.sync="lianzhaoDialog"
                    width="72%"
                    custom-class="mj-dialog"
                    center>
                    <div class="seq-section">
                        <div class="seq-section-title">技能选择</div>
                        <el-button-group>
                            <el-button type="primary" size="small" @click="pushJiNengXuLie('驱夜')">驱夜</el-button>
                            <el-button type="primary" size="small" @click="pushJiNengXuLie('日大')">日大</el-button>
                            <el-button type="primary" size="small" @click="pushJiNengXuLie('日破')">日破</el-button>
                            <el-button type="primary" size="small" @click="pushJiNengXuLie('月破')">月破</el-button>
                            <el-button type="primary" size="small" @click="pushJiNengXuLie('诛邪')">诛邪</el-button>
                            <el-button type="primary" size="small" @click="pushJiNengXuLie('日斩')">日斩</el-button>
                        </el-button-group>
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
                                    <span class="coef-cell">{{ scope.row.coef.toFixed(4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="小计系数" min-width="120" align="right">
                                <template slot-scope="scope">
                                    <span class="coef-cell subtotal">{{ scope.row.subtotal.toFixed(4) }}</span>
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

            <!-- 右侧面板 -->
            <el-col :span="7">
                <el-card class="mj-card panel-card" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title"><i class="el-icon-user-solid"></i> 自身实际面板</span>
                    </div>
                    <div class="stat-grid">
                        <div class="stat-row"><span class="stat-label">元气</span><span class="stat-value">{{yuanqi()}}</span></div>
                        <div class="stat-row"><span class="stat-label">基础攻击</span><span class="stat-value">{{jichugongji()}}</span></div>
                        <div class="stat-row highlight"><span class="stat-label">面板攻击</span><span class="stat-value attack">{{面板攻击()}}</span></div>
                        <div class="stat-row"><span class="stat-label">会心</span><span class="stat-value crit">{{huixin()}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">会效</span><span class="stat-value crit-eff">{{huixiao()}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">破防</span><span class="stat-value pofang">{{pofang()}}<em>%</em></span></div>
                    </div>
                </el-card>

                <el-card class="mj-card panel-card enemy-panel" shadow="hover">
                    <div slot="header" class="mj-card-header">
                        <span class="mj-title enemy"><i class="el-icon-s-flag"></i> 敌方防御面板</span>
                    </div>
                    <div class="stat-grid">
                        <div class="stat-row"><span class="stat-label">内防</span><span class="stat-value neifang">{{neifang()}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">化劲</span><span class="stat-value huajin">{{huajin()}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">御劲</span><span class="stat-value yujin">{{yujin()}}<em>%</em></span></div>
                        <div class="stat-row"><span class="stat-label">御效</span><span class="stat-value yuxiao">{{yuxiao()}}<em>%</em></span></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        data() {
            return {
                //技能序列
                jiNengXuLie:[],
                chart: null,
                chartCrit: null,
                totalNormal: 0,
                totalCrit: 0,
                无间影狱:1.1,
                //我方面板模块
                元气:11691,
                基础攻击:52716,
                会心值:24525,
                会效值:9724,
                破防值:94083,
                //敌方面板模块
                化劲:51423,
                御劲:2632,
                内防值:16830,
                //-------------------------------------技能系数模块--万灵当歌版本-----------------------------------------------
                //绕背驱夜断愁 260*1.1*1.05 * 1.05*1.05  lv29
                驱夜断愁:1.2604*1.3*1.6*3/**3.14技改 */,//已计算绕背
                //诛邪镇魔×2  225*1.05*1.1 * 1.1  lv32
                诛邪镇魔:1.7083*2,//已计算伤害×2
                //赤日轮1 77 * 1.2 * 1.1*1.1*1.1 * 1.05*1.3lv33
                赤日轮1:0.8697,
                //赤日轮2 77 * 1.2 * 1.1*1.1*1.1 * 1.05* 1.3lv33
                赤日轮2:0.8697,
                //赤日轮3 96 * 1.2 * 1.1*1.1*1.1 * 1.05* 1.3 lv33
                赤日轮3:1.0885,
                //幽月轮1 70*1.2*1.1*1.1*1.1 * 1.05* 1.3 lv24
                幽月轮1:0.7916,
                //幽月轮2 70*1.2*1.1*1.1*1.1 * 1.05 *1.3 LV 24
                幽月轮2:0.7916,
                //幽月轮3 80*1.2*1.1*1.1*1.1 * 1.05* 1.3 lv24
                幽月轮3:0.9062,//*2.0937
                //月破  60 * 1.15 * 1.1*1.1*1.1*1.05*1.1*1.1*1.15  注意 这是单次 记得*3  lv32
                月破:0.8385*3,
                //日破 单体  180*1.15*1.1*1.1*1.1*1.05*1.1*1.1*1.15  lv32
                日破:2.5156,
                //日大 200 单次 最终得*4 满灵结算为 310 * 0.1 * dwSkillLevel  日大系数目前展示为4+吞满日
                riDaXiShu:5.78125,
                //日月晦 一段 300 * 0.9 * 0.9  二段300 * 0.9 * 0.9  三段 300 * 0.9 * 0.9 *2
                日月晦:5.0625,
                //日劫 64 * 1.05
                生死劫日:0.35,
                //月劫 64 * 1.05
                生死劫月:0.35,
                //烈日斩  141 * 1.1*1.1*1.05 * 1.05*1.3  lv32
                烈日斩:1.2708,
                //银月斩  (40 + (dwSkillLevel - 9) * 4) 76* 1.1 * 1.1*1.1*1.05 * 1.05*1.3  lv18
                银月斩:0.7500,
                //银月斩Dot每跳
                银月斩Dot:0.16,
                //50 * 1.1 * 1.2 * 1.8  LV1
                //动若观火
                洞若观火:0.2604,

                //-----------------净体不畏层级
                jingTiBuWeriRiLV1:0.61875,//斩系列 净体触发系数
                jingTiBuWeriRiLV2:0.4640625,//轮系列 净体触发系数
                jingTiBuWeriRiLV3:1.0209375,//破 影子 系列 净体触发系数
                jingTiBuWeriRiLV4:0.0928125,//诛邪系列 净体触发系数
                jingTiBuWeriRiLV5:0.0928125,//生死劫系列 净体触发系数

                chongGuangZhanE:37.038744,

                jingtitiandi:1,
                pvpShou:true,
                mingguanghengzhao:false,
                xuanxiangzhuming:true,
                tiandi:false,
                judian:false,
                chengwu:true,
                紫元气小药:false,
                紫元气小吃:false,
                紫攻击小药:false,
                紫攻击小吃:false,
                紫武器附魔:false,
                紫元气酒:false,
                紫攻击创意:false,
                mingjiaozhen:false,
                jianFengBaiDuan:false,
                yonghuierming:false,
                texiaoyaozhui:false,

                shengyong:false,
                zhanlong:false,
                yijifuhuodian:false,
                erjifuhuodian:false,
                jiNengDialog: false, //技能伤害框
                lianzhaoDialog: false, //连招序列框
            };
        },
        computed: {
            //连招技能系数聚合（按技能归并，累计次数与小计系数）
            comboCoefData() {
                const mishu = 1 + 0.12;                     // 秘籍加成
                const cw = 0.05 * (this.chengwu ? 1 : 0);   // 橙武加成
                const coefOf = (skill) => {
                    switch(skill) {
                        case '驱夜': return (mishu + cw) * this.驱夜断愁;
                        case '日大': return 4.1668;
                        case '日破': return (mishu + cw) * 3.327335615780859;
                        case '月破': return (mishu + cw) * 0.5525 * 3;
                        case '诛邪': return (mishu + cw) * 2.707089;
                        case '日斩': return 1 * 1.25 * 1.25 * 2 * (1 + 0.22) * 1.18540627734375;
                        default: return 0;
                    }
                };
                const map = {};
                this.jiNengXuLie.forEach(skill => {
                    if (!map[skill]) {
                        map[skill] = { name: skill, count: 0, coef: coefOf(skill), subtotal: 0 };
                    }
                    map[skill].count += 1;
                    map[skill].subtotal += map[skill].coef;
                });
                return Object.values(map);
            },
            totalCoef() {
                return this.comboCoefData.reduce((s, r) => s + r.subtotal, 0);
            },
            totalCount() {
                return this.comboCoefData.reduce((s, r) => s + r.count, 0);
            },
            damageTableData() {
                return [
                    { name: '绕背驱夜', normal: this.buhuixinraobeiquye(), crit: this.huixinraobeiquye() },
                    { name: '单体日破', normal: this.ripo(), crit: this.huixinripo() },
                    { name: '单体超凡日破', normal: this.dantichaofanripo(), crit: this.huixindantichaofanripo() },
                    { name: '单体月破', normal: this.yuepo(), crit: this.huixinyuepo() },
                    { name: '4跳日大', normal: this.rida(), crit: '—' },
                    { name: '普通诛邪', normal: this.zhuxie(), crit: this.huixinzhuxie() },
                    { name: '超凡诛邪', normal: this.chaofanzhuxie(), crit: this.huixinchaofanzhuxie() },
                    { name: '3段日月晦总伤害', normal: this.sanduanriyuehui(), crit: this.huixinsanduanriyuehui() },
                    { name: '橙戒指', normal: this.chengjiezhi(), crit: this.huixinchengjiezhi() },
                    { name: '橙武特效单次伤害', normal: this.chengwutexiao(), crit: this.huixinchengwutexiao() },
                ];
            }
        },
        methods: {
            //技能系数表合计行
            coefSummary() {
                return [
                    '合计',
                    this.totalCount,
                    '—',
                    this.totalCoef.toFixed(4),
                    '100%',
                ];
            },
            //根据技能名返回 tag 颜色
            tagType(skill) {
                const map = {
                    '驱夜': 'danger',
                    '日大': 'warning',
                    '日破': 'danger',
                    '月破': 'info',
                    '诛邪': 'success',
                    '日斩': 'warning',
                };
                return map[skill] || '';
            },
            //面板元气的计算函数
            yuanqi(){
                return ((this.元气-0)+this.紫元气小吃*284+this.紫元气小药*365+this.紫元气酒*208).toFixed(0)
            },
            //面板基础攻击的计算函数
            jichugongji(){
                return (((this.基础攻击-0)+this.紫攻击小药*875+this.紫攻击小吃*680
                    +this.紫武器附魔*583+this.紫攻击创意*850
                    +0.1*(this.紫元气小吃*284+this.紫元气小药*365+this.紫元气酒*208))).toFixed(0)
                    // 130版本元气收益从1.8变更为1.81
            },
            //面板攻击的计算函数
            面板攻击(){
                return((this.yuanqi()*1.99)+(this.jichugongji()*1)*
                (1+0.05*this.mingjiaozhen+0.5*this.judian+0.3*this.jianFengBaiDuan+0.1*this.tiandi)).toFixed(0)
            },
            //面板会心的计算函数
            huixin(){
                if((((((this.会心值-0)+(this.紫元气小吃*284+this.紫元气小药*365+this.紫元气酒*208)*0.29)/197703.0-0)*100)+((this.无间影狱===1?1:0)*10)+13*this.mingjiaozhen).toFixed(2)
                >100){
                    return 100
                }else{
                return (((((this.会心值-0)+(this.紫元气小吃*284+
                this.紫元气小药*365+this.紫元气酒*208)*0.29)/197703.0-0)*100)+((this.无间影狱===1?1:0)*10)+13*this.mingjiaozhen).toFixed(2)
                }
            },
            //面板会效的计算函数
            huixiao(){
                if(((this.会效值/72844.2)*100+175+((this.无间影狱===1?1:0)*5)+20*this.mingjiaozhen).toFixed(2)>300){
                    return 300
                }else{
                    return ((this.会效值/72844.2)*100+175+((this.无间影狱===1?1:0)*5)+20*this.mingjiaozhen).toFixed(2)
                }
            },
            //面板破防的计算函数
            pofang(){
                return ((((this.破防值-0)+36472*this.texiaoyaozhui+0.3*(this.紫元气小吃*284+this.紫元气小药*365+this.紫元气酒*208))/225957.6)*100).toFixed(2)
            },
            //面板内防的计算函数
            neifang(){
                if(((this.内防值*(1-0.55*this.yonghuierming))/
                (this.内防值*(1-0.55*this.yonghuierming)+126007.2)*100).toFixed(2)>80){
                    return 80
                }else{
                    return ((this.内防值*(1-0.55*this.yonghuierming))/
                    (this.内防值*(1-0.55*this.yonghuierming)+126007.2)*100).toFixed(2)
                }
            },
            //面板化劲的计算函数
            huajin(){
                if((((this.化劲-0-2756*this.pvpShou)/((this.化劲-0-2756*this.pvpShou)+33046.2)*100+9.9609375)).toFixed(2)>80){
                    return 80
                }
                if((((this.化劲-0-2756*this.pvpShou)/((this.化劲-0-2756*this.pvpShou)+33046.2)*100+9.9609375)).toFixed(2)<10){
                    return 10
                }else{
                    return (((this.化劲-0-2756*this.pvpShou)/((this.化劲-0-2756*this.pvpShou)+33046.2)*100+9.9609375)).toFixed(2)
                }
            },
            //面板御劲的计算函数
            yujin(){
                if(((this.御劲/197703.0*100)-0).toFixed(2)<0){
                    return 0
                }
                if(((this.御劲/197703.0*100)-0).toFixed(2)>100){
                    return 100
                }else{
                    return ((this.御劲/197703.0*100)-0).toFixed(2)
                }
            },
            //面板御效的计算函数
            yuxiao(){
                if((this.御劲/55123.2*100).toFixed(2)>40){
                    return 40;
                }else{
                    return (this.御劲/55123.2*100).toFixed(2)
                }
            },
            //技能伤害列表中的 不会心绕背驱夜
            buhuixinraobeiquye(){
                return (1*(1+0.12+0.05*this.chengwu)*this.驱夜断愁*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            dantichaofanripo(){
                return (1*(1+0.12+0.2+0.05*this.chengwu)*3.327335615780859*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            ripo(){
                return (1*(1+0.12+0.05*this.chengwu)*3.327335615780859*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            yuepo(){
                return (1*(1+0.12+0.05*this.chengwu)*0.5525*3*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            rida(){
                return ((4.1668*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            zhuxie(){
                return (1*(1+0.12+0.05*this.chengwu)*2.707089*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            chaofanzhuxie(){
                return (1*(1+0.12/**秘籍*/+0.2+0.05*this.chengwu)*2.707089*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            sanduanriyuehui(){
                return ((1.265625*4*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            shoudafumo(){
                return ((0.46875*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            xiedafumo(){
                return ((0.52084*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            chengjiezhi(){
                return 11250
            },
            chengwutexiao(){
                return ((2*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinraobeiquye(){
                return (1*(1+0.12+0.05*this.chengwu)*this.驱夜断愁*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinripo(){
                return (1*(1+0.12+0.05*this.chengwu)*1.6574*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixindantichaofanripo(){
                return (1*(1+0.12+0.2+0.05*this.chengwu)*1.6574*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinyuepo(){
                return (1*(1+0.12+0.05*this.chengwu)*0.5525*3*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinrida(){
                return ((4.1668*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinzhuxie(){
                return (1*(1+0.12+0.05*this.chengwu)*2.707089*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinchaofanzhuxie(){
                return (1*(1+0.12+0.2+0.05*this.chengwu)*2.707089*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinsanduanriyuehui(){
                return ((1.265625*4*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinshoudafumo(){
                return ((0.46875*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinxiedafumo(){
                return ((0.52084*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinchengjiezhi(){
                return 11250
            },
            huixinchengwutexiao(){
                return ((2*this.面板攻击()*((this.pofang()-0)+100)/100)*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            xinbanbenrizhan(){
                return (1*1.25*1.25*2*(1+0.22)*1.18540627734375*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            huixinxinbanbenrizhan(){
                return ((1*1.25*1.25*(1+0.22)*1.18540627734375+1.18540627734375)*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
                *(1-this.neifang()/100)*(1-this.huajin()/100)*(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)*(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            },
            pushJiNengXuLie(x){
                this.jiNengXuLie.push(x)
                this.updateChart();
            },
            clearJiNengXuLie(){
                this.jiNengXuLie = [];
                this.updateChart();
            },
            getSkillDamage(skill) {
                switch(skill) {
                    case '驱夜': return parseInt(this.buhuixinraobeiquye());
                    case '日大': return parseInt(this.rida());
                    case '日破': return parseInt(this.ripo());
                    case '月破': return parseInt(this.yuepo());
                    case '诛邪': return parseInt(this.zhuxie());
                    case '日斩': return parseInt(this.xinbanbenrizhan());
                    default: return 0;
                }
            },
            getSkillDamageCrit(skill) {
                switch(skill) {
                    case '驱夜': return parseInt(this.huixinraobeiquye());
                    case '日大': return parseInt(this.huixinrida());
                    case '日破': return parseInt(this.huixinripo());
                    case '月破': return parseInt(this.huixinyuepo());
                    case '诛邪': return parseInt(this.huixinzhuxie());
                    case '日斩': return parseInt(this.huixinxinbanbenrizhan());
                    default: return 0;
                }
            },
            buildPieOption(title, damageData, colors) {
                return {
                    title: { text: title, left: 'center', textStyle: { color:'#5a1a1a', fontSize:14 } },
                    tooltip: { trigger: 'item', formatter: '{a}<br/>{b}: {c} ({d}%)' },
                    legend: { orient: 'horizontal', bottom: 0, data: damageData.map(item => item.name) },
                    color: colors,
                    series: [{
                        name: '伤害占比',
                        type: 'pie',
                        radius: ['40%','62%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: true,
                        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                        label: { formatter: '{b}\n{d}%' },
                        data: damageData,
                        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' } }
                    }]
                };
            },
            aggregate(dataGetter) {
                const damageData = [];
                let total = 0;
                this.jiNengXuLie.forEach(skill => {
                    const damage = dataGetter(skill);
                    total += damage;
                    const existing = damageData.find(item => item.name === skill);
                    if (existing) {
                        existing.value += damage;
                    } else {
                        damageData.push({name: skill, value: damage});
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
                    true
                );
                this.chartCrit.setOption(
                    this.buildPieOption('全会心伤害占比', crit.damageData,
                        ['#a01c1c', '#d4a017', '#e67e22', '#5f3a8f', '#c0392b', '#2c7a7b']),
                    true
                );
            },
            initChart() {
                if (this.$refs.chartRef) {
                    this.chart = echarts.init(this.$refs.chartRef);
                }
                if (this.$refs.chartCritRef) {
                    this.chartCrit = echarts.init(this.$refs.chartCritRef);
                }
                this.updateChart();
            },
        },
        created() {},
        watch: {
            lianzhaoDialog(newVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.initChart();
                    });
                }
            }
        },
        beforeDestroy() {
            if (this.chart) this.chart.dispose();
            if (this.chartCrit) this.chartCrit.dispose();
        },
    }
</script>

<style scoped>
.mingjiao{
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

/* 卡片整体风格 —— 半透明白底 + 红金点缀 */
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

.mj-card-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
}
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

/* 增益分组 */
.buff-group { line-height: 2.2; }
.buff-group-title {
    font-size: 13px;
    font-weight: 600;
    color: #8B0000;
    margin-bottom: 8px;
}
.buff-group-title i { margin-right: 4px; }
.buff-group .el-checkbox { margin: 4px 6px 4px 0 !important; }

.mj-divider { margin: 12px 0 !important; }

/* 操作按钮条 */
.mj-action-bar {
    display: flex;
    gap: 12px;
    margin: 6px 0 0;
}
.mj-action-bar .el-button {
    padding: 10px 22px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* 右侧面板 */
.panel-card .el-card__body { padding: 14px 18px; }
.stat-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
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
.stat-label {
    font-size: 13px;
    color: #666;
    font-weight: 500;
}
.stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    font-family: 'Consolas', 'Monaco', monospace;
}
.stat-value em {
    font-size: 12px;
    font-style: normal;
    color: #888;
    margin-left: 2px;
    font-weight: 500;
}
.stat-value.attack    { color: #a01c1c; font-size: 22px; }
.stat-value.crit      { color: #d4a017; }
.stat-value.crit-eff  { color: #e67e22; }
.stat-value.pofang    { color: #c0392b; }
.stat-value.neifang   { color: #34495e; }
.stat-value.huajin    { color: #5f3a8f; }
.stat-value.yujin     { color: #2c7a7b; }
.stat-value.yuxiao    { color: #2c7a7b; }

.enemy-panel .stat-row.highlight { background: rgba(74, 74, 74, 0.1); }

/* Dialog */
.mj-dialog >>> .el-dialog__header {
    background: linear-gradient(90deg, #8B0000 0%, #a01c1c 100%);
    padding: 16px 20px;
    border-radius: 6px 6px 0 0;
}
.mj-dialog >>> .el-dialog__title { color: #fff; font-weight: 700; letter-spacing: 2px; }
.mj-dialog >>> .el-dialog__headerbtn .el-dialog__close { color: #fff; }

.dmg-normal {
    font-family: 'Consolas', monospace;
    font-weight: 600;
    color: #333;
}
.dmg-crit {
    font-family: 'Consolas', monospace;
    font-weight: 700;
    color: #d4a017;
}

/* 序列区 */
.seq-section { margin-bottom: 20px; }
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
.seq-tag {
    margin: 4px 6px 4px 0;
    cursor: default;
}
.seq-empty {
    color: #aaa;
    font-size: 13px;
    padding-left: 4px;
}

/* input-number 缩紧 */
.el-form-item { margin-bottom: 12px !important; }

/* 双图并列 */
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
.chart-title b {
    font-family: 'Consolas', monospace;
    font-size: 15px;
    margin-left: 6px;
}
.chart-title.non-crit { color: #555; }
.chart-title.non-crit b { color: #333; }
.chart-title.crit { color: #8B0000; }
.chart-title.crit b { color: #d4a017; }

/* 技能系数表 */
.coef-cell {
    font-family: 'Consolas', monospace;
    color: #333;
}
.coef-cell.subtotal {
    font-weight: 700;
    color: #a01c1c;
}
.coef-pct {
    font-family: 'Consolas', monospace;
    color: #d4a017;
    font-weight: 600;
}
</style>
