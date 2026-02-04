<template>
    <div class="mingjiao">
        <el-row :gutter="10" style="margin:0px">
            <el-col :span="17" >
                <div class="grid-content bg-purple">
                    <div class="shuzhi">
                        <h3>输入自身数值(0增益裸面板 默认为本赛季毕业属性)</h3>
                        <div>
                            元气数值：<input type="text" name="yuanqi" id="yuanqi" v-model="元气"  placeholder="请输入具体的元气数值" required>
                            基础攻击：<input type="text" name="jichugongji" v-model="基础攻击" placeholder="请输入具体的基础攻击数值" required>
                        </div>
                        <div>
                            会心数值：<input type="text" name="huixin" v-model="会心值" placeholder="请输入具体的会心数值" required>
                            会效数值：<input type="text" name="huixiao" v-model="会效值" placeholder="请输入具体的会效数值" required>
                            破防数值：<input type="text" name="pofang" v-model="破防值" placeholder="请输入具体的破防数值" required>
                        </div>
                        <h3>敌方数值</h3>
                        <div>
                            化劲数值：<input type="text" name="huajin" v-model="化劲" placeholder="请输入具体的化劲数值" required>
                            御劲数值：<input type="text" name="yujin" v-model="御劲" placeholder="请输入具体的御劲数值" required>
                            内防数值：<input type="text" name="neifang" v-model="内防值" placeholder="请输入具体的内防数值" required>
                        </div>
                        
                    </div>
                    <div class="zengjianyi">
                        <h3>选择我方增益和奇穴</h3>
                        <!-- <el-无间影狱-group v-model="无间影狱">
                            <el-无间影狱 :label="1.1">无间影狱</el-无间影狱>
                            <el-无间影狱 :label="1">无明业火</el-无间影狱>
                        </el-无间影狱-group>
                        <br>
                        <el-无间影狱-group v-model="jingtitiandi">
                            <el-无间影狱 :label="1">净体不畏</el-无间影狱>
                            <el-无间影狱 :label="1.1" disabled>天地诛戮</el-无间影狱>
                        </el-无间影狱-group> -->
                        <div>
                            <div>
                                <!-- <el-checkbox v-model="mingguanghengzhao" label="明光恒照" size="mini" disabled border></el-checkbox>
                                <el-checkbox v-model="xuanxiangzhuming" label="悬象著明" size="mini" disabled border></el-checkbox> -->
                                <el-checkbox v-model="pvpShou" label="PVP手" size="mini" style="width: 96px"  border></el-checkbox>
                                <el-checkbox v-model="jianFengBaiDuan" label="剑锋百锻" size="mini" border></el-checkbox>
                                <el-checkbox v-model="yonghuierming" label="用晦而明" size="mini" border></el-checkbox>
                                <el-checkbox v-model="judian" label="据点增益" size="mini" border></el-checkbox>
                            </div>
                            <div>
                                <el-checkbox v-model="紫元气小药" label="紫元气药" size="mini" border></el-checkbox>
                                <el-checkbox v-model="紫元气小吃" label="紫元气吃" size="mini" border></el-checkbox>
                                <el-checkbox v-model="紫攻击小药" label="紫攻击药" size="mini" border></el-checkbox>
                                <el-checkbox v-model="紫攻击小吃" label="紫攻击吃" size="mini" border></el-checkbox>
                                <br>
                                <el-checkbox v-model="紫武器附魔" label="紫武附魔" size="mini" border></el-checkbox>
                                <el-checkbox v-model="紫元气酒" label="紫元气酒" size="mini" border></el-checkbox>
                                <el-checkbox v-model="紫攻击创意" label="攻家园菜" size="mini" border></el-checkbox>
                            </div>
                            <div>
                                <el-checkbox v-model="mingjiaozhen" label="明教阵眼" size="mini" border></el-checkbox>
                                <el-checkbox v-model="texiaoyaozhui" label="特效腰椎" size="mini" border></el-checkbox>
                                <el-checkbox v-model="chengwu" label="橙武特效" size="mini" border></el-checkbox>
                            </div>
                        </div>
                        <h3>选择敌方减伤</h3>
                        <el-checkbox v-model="shengyong" label="圣咏" size="mini" border></el-checkbox>
                        <el-checkbox v-model="zhanlong" label="战龙" size="mini" border></el-checkbox>
                        <el-checkbox v-model="yijifuhuodian" label="10减伤复活点" size="mini" border></el-checkbox>
                        <el-checkbox v-model="erjifuhuodian" label="20减伤复活点" size="mini" border></el-checkbox>
                    </div>
                </div>
                <el-button type="primary" @click="jiNengDialog = true">技能伤害列表</el-button>
                <el-button type="primary" @click="lianzhaoDialog = true">连招序列</el-button>
                <el-dialog
                    title="技能伤害列表"
                    :visible.sync="jiNengDialog"
                    width="30%"
                    center>
                    不会心技能伤害 <hr>
                    <!-- 崇光斩恶*3:<span>{{chongGuangZhanE3()}}</span><br> -->
                    绕背驱夜:<span>{{buhuixinraobeiquye()}}</span><br>
                    单体日破:<span>{{ripo()}}</span><br>
                    单体超凡日破:<span>{{dantichaofanripo()}}</span><br>
                    单体月破:<span>{{yuepo()}}</span><br>
                    4跳日大:<span>{{rida()}}</span><br>
                    <!-- rida3+吞100:<span></span><br> -->
                    普通诛邪:<span>{{zhuxie()}}</span><br>
                    超凡诛邪:<span>{{chaofanzhuxie()}}</span><br>
                    <!-- 洞若观火:<span>{{dongRuoGuanHuo}}</span><br> -->
                    <!-- 悬日斩:<span>还没做</span><br>
                    悬日破:<span>还没做</span><br>
                    悬月破:<span>还没做</span><br> -->
                    3段日月晦总伤害:<span>{{sanduanriyuehui()}}</span><br>
                    <!-- 手大附魔：<span>{{shoudafumo()}}</span><br>
                    鞋大附魔：<span>{{xiedafumo()}}</span><br> -->
                    橙戒指：<span>{{chengjiezhi()}}</span><br>
                    橙武特效单次伤害：<span>{{chengwutexiao()}}</span>
                    <br><br>
                    技能会心伤害: <br><hr>
                    绕背驱夜:<span>{{huixinraobeiquye()}}</span><br>
                    单体日破:<span>{{huixinripo()}}</span><br>
                    单体超凡日破:<span>{{huixindantichaofanripo()}}</span><br>
                    单体月破:<span>{{huixinyuepo()}}</span><br>
                    <!-- 4跳日大:<span>{{huixinrida()}}</span><br> -->
                    <!-- rida3+吞100:<span></span><br> -->
                    普通诛邪:<span>{{huixinzhuxie()}}</span><br>
                    超凡诛邪:<span>{{huixinchaofanzhuxie()}}</span><br>
                    <!-- 洞若观火:<span>还没做</span><br>
                    悬日斩:<span>还没做</span><br>
                    悬日破:<span>还没做</span><br>
                    悬月破:<span>还没做</span><br> -->
                    3段日月晦总伤害:<span>{{huixinsanduanriyuehui()}}</span><br>
                    <!-- 手大附魔：<span>{{huixinshoudafumo()}}</span><br>
                    鞋大附魔：<span>{{huixinxiedafumo()}}</span><br> -->
                    橙戒指：<span>{{huixinchengjiezhi()}}</span><br>
                    橙武特效单次伤害：<span>{{huixinchengwutexiao()}}</span>
                    <span slot="footer" class="dialog-footer">
                    </span>
                </el-dialog>
                <el-dialog
                    title="连招列表"
                    :visible.sync="lianzhaoDialog"
                    width="70%"
                    center>
                    <div>
                    <el-button type="primary" @click="pushJiNengXuLie('驱夜')">驱夜</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('日大')">日大</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('日破')">日破</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('月破')">月破</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('诛邪')">诛邪</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('悬象')">悬象</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('暗步')">暗步</el-button>
                    <el-button type="primary" @click="pushJiNengXuLie('日斩')">日斩</el-button>
                    </div>
                    <div v-for="(d,index) in this.jiNengXuLie" :key="index">
                        <el-button size="mini" @click="jiNengXuLie.splice(index,1)">{{d}}</el-button>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <div id="main" style="width: 600px;height:400px;">伤害构成</div>
                    </span>
                </el-dialog>
            </el-col>
            <el-col :span="7">
                <div class="grid-content bg-purple">
                    <div class="mianban">
                        <h3>自身实际面板</h3>
                        元气:<div class="面板攻击">{{yuanqi()}}</div>
                        基础攻击:<div class="面板攻击">{{jichugongji()}}</div>
                        面板攻击：<div class="面板攻击">{{面板攻击()}}</div>
                        会心：<div class="mianbanhuixin">{{huixin()}}%</div>
                        会效：<div class="mianbanhuixiao" min="175" max="300">{{huixiao()}}%</div>
                        破防：<div class="mianbanpofang">{{pofang()}}%</div>
                        <h3>敌方防御面板</h3>   
                        内防：<div class="mianbanneifang">{{neifang()}}%</div>
                        化劲：<div class="mianbanhuajin">{{huajin()}}%</div>
                        御劲：<div class="mianbanyujin">{{yujin()}}%</div>
                        御效：<div class="mianbanyuxiao">{{yuxiao()}}%</div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //技能序列
                jiNengXuLie:[],
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
                            //日破 8目标  83 * 1.15*1.1*1.1*1.1*1.05*1.1*1.1*1.15  lv32
                            // riPo8XiShu:0.9635,
                            //月大 360 * 1.89
                            // yueDaXiShu:3.54375,
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
                //弥业报劫系数 

                //-----------------净体不畏层级
                jingTiBuWeriRiLV1:0.61875,//斩系列 净体触发系数
                //50 * 1.1 * 1.2 * 1.8 * 0.5 * 1.5
                jingTiBuWeriRiLV2:0.4640625,//轮系列 净体触发系数
                //50 * 1.1 * 1.2 * 1.8 * 1.5*1.1
                jingTiBuWeriRiLV3:1.0209375,//破 影子 系列 净体触发系数
                //50 * 1.1 * 1.2 * 1.8 * 1.5 * 0.1
                jingTiBuWeriRiLV4:0.0928125,//诛邪系列 净体触发系数
                //50 * 1.1 * 1.2 * 1.8 * 1.5 * 0.1
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
            //             option = {
            //     backgroundColor: '#2c343c',

            //     title: {
            //         text: 'Customized Pie',
            //         left: 'center',
            //         top: 20,
            //         textStyle: {
            //             color: '#ccc'
            //         }
            //     },

            //     tooltip: {
            //         trigger: 'item',
            //         formatter: '{a} <br/>{b} : {c} ({d}%)'
            //     },

            //     visualMap: {
            //         show: false,
            //         min: 80,
            //         max: 600,
            //         inRange: {
            //             colorLightness: [0, 1]
            //         }
            //     },
            //     series: [
            //         {
            //             name: '伤害构成',
            //             type: 'pie',
            //             radius: '55%',
            //             center: ['50%', '50%'],
            //             data: [
            //                 {value: li, name: '直接访问'},
            //                 {value: 310, name: '邮件营销'},
            //                 {value: 274, name: '联盟广告'},
            //                 {value: 235, name: '视频广告'},
            //                 {value: 400, name: '搜索引擎'}
            //             ].sort(function (a, b) { return a.value - b.value; }),
            //             roseType: 'radius',
            //             label: {
            //                 color: 'rgba(255, 255, 255, 0.3)'
            //             },
            //             labelLine: {
            //                 lineStyle: {
            //                     color: 'rgba(255, 255, 255, 0.3)'
            //                 },
            //                 smooth: 0.2,
            //                 length: 10,
            //                 length2: 20
            //             },
            //             itemStyle: {
            //                 color: '#c23531',
            //                 shadowBlur: 200,
            //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
            //             },

            //             animationType: 'scale',
            //             animationEasing: 'elasticOut',
            //             animationDelay: function (idx) {
            //                 return Math.random() * 200;
            //             }
            //         }
            //     ]
            // };
        },
        methods: {
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
                // 会心% (130级) ≈ 最终会心等级 / 197703.0
            },
            //面板会效的计算函数
            huixiao(){
                if(((this.会效值/72844.2)*100+175+((this.无间影狱===1?1:0)*5)+20*this.mingjiaozhen).toFixed(2)>300){
                    return 300
                }else{
                    return ((this.会效值/72844.2)*100+175+((this.无间影狱===1?1:0)*5)+20*this.mingjiaozhen).toFixed(2)
                }
                // 会心效果% (130级) ≈ 最终会心效果等级 / 72844.2 + 1.75
            },
            //面板破防的计算函数
            pofang(){
                return ((((this.破防值-0)+36472*this.texiaoyaozhui+0.3*(this.紫元气小吃*284+this.紫元气小药*365+this.紫元气酒*208))/225957.6)*100).toFixed(2)
                // 破防% (130级) ≈ 最终破防等级 / 225957.6
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
                // 防御% (130级) ≈ 最终防御等级 / ( 最终防御等级 + 126007.2 )
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
                // 化劲% (130级) ≈ 最终化劲等级 / ( 最终化劲等级 + 33046.2 ) + 0.099609375
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
                // 御劲% (130级) ≈ 最终御劲等级 / 197703.0
            },
            //面板御效的计算函数
            yuxiao(){
                if((this.御劲/55123.2*100).toFixed(2)>40){
                    return 40;
                }else{
                    return (this.御劲/55123.2*100).toFixed(2)
                }
                // 御劲会效% (130级) ≈ 最终御劲会效等级 / 55123.2
            },
            pofangMultiplier(){
                return ((this.pofang()-0)+100)/100
            },
            commonDamageMultiplier(){
                return (1-this.neifang()/100)*(1-this.huajin()/100)
                *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)
                *(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)
            },
            critDamageMultiplier(){
                return this.commonDamageMultiplier()
                *(1+(this.huixiao()-100)/100*(100-this.yuxiao())/100)
            },
            damageBase(skillCoeff, isCrit){
                const baseDamage = skillCoeff*this.面板攻击()*this.pofangMultiplier()*this.无间影狱
                return baseDamage*(isCrit ? this.critDamageMultiplier() : this.commonDamageMultiplier())
            },
            //技能伤害列表中的 不会心绕背驱夜
            buhuixinraobeiquye(){   
                const skillCoeff = (1+0.12+0.05*this.chengwu)*this.驱夜断愁
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            //技能伤害列表中的 单体超凡日破
            dantichaofanripo(){
                const skillCoeff = (1+0.12+0.2+0.05*this.chengwu)*3.327335615780859
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            //技能伤害列表中的 日破
            ripo(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*3.327335615780859
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            //技能伤害列表中的 月破
            yuepo(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*0.5525*3
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            //技能伤害列表中的 rida
            rida(){
                return this.damageBase(4.1668, false).toFixed(0)
            },
            //技能伤害列表中的 诛邪
            zhuxie(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*2.707089
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            //技能伤害列表中的 超凡诛邪
            chaofanzhuxie(){
                const skillCoeff = (1+0.12/**秘籍*/+0.2+0.05*this.chengwu)*2.707089
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            //技能伤害列表中的 三段日月晦
            sanduanriyuehui(){
                return this.damageBase(1.265625*4, false).toFixed(0)
            },
                //  1.265625*4
            //技能伤害列表中的 手附魔
            shoudafumo(){
                return this.damageBase(0.46875, false).toFixed(0)
            },
            //技能伤害列表中的 鞋附魔
            xiedafumo(){
                return this.damageBase(0.52084, false).toFixed(0)
            },
            //技能伤害列表中的 橙戒指
            chengjiezhi(){
                return 11250
                // 0.5208333333333333 通道100 郭 内为192
            },
            //技能伤害列表中的 橙武特效
            chengwutexiao(){
                return this.damageBase(2, false).toFixed(0)
            },
            //技能伤害列表中的 会心绕背驱夜
            huixinraobeiquye(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*this.驱夜断愁
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
            //技能伤害列表中的 会心日破
            huixinripo(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*1.6574
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
            //技能伤害列表中的 会心超凡日破
            huixindantichaofanripo(){
                const skillCoeff = (1+0.12+0.2+0.05*this.chengwu)*1.6574
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
            //技能伤害列表中的 会心月破
            huixinyuepo(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*0.5525*3
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
            //技能伤害列表中的 会心rida
            huixinrida(){
                return this.damageBase(4.1668, true).toFixed(0)
            },
            //技能伤害列表中的 会心诛邪
            huixinzhuxie(){
                const skillCoeff = (1+0.12+0.05*this.chengwu)*2.707089
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
            //技能伤害列表中的 会心超凡诛邪
            huixinchaofanzhuxie(){
                const skillCoeff = (1+0.12+0.2+0.05*this.chengwu)*2.707089
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
           //技能伤害列表中的 会心三段日月晦
            huixinsanduanriyuehui(){
                return this.damageBase(1.265625*4, true).toFixed(0)
            },
            //技能伤害列表中的 会心手附魔
            huixinshoudafumo(){
                return this.damageBase(0.46875, true).toFixed(0)
            },
            //技能伤害列表中的 会心鞋附魔
            huixinxiedafumo(){
                return this.damageBase(0.52084, true).toFixed(0)
            },
            //技能伤害列表中的 会心橙戒指
            huixinchengjiezhi(){
                return 11250
            },
            //技能伤害列表中的 会心橙武特效
            huixinchengwutexiao(){
                return this.damageBase(2, true).toFixed(0)
            },
            xinbanbenrizhan(){
                const skillCoeff = 1*1.25*1.25*2*(1+0.22)*1.18540627734375
                return this.damageBase(skillCoeff, false).toFixed(0)
            },
            huixinxinbanbenrizhan(){
                const skillCoeff = (1*1.25*1.25*(1+0.22)*1.18540627734375+1.18540627734375)
                return this.damageBase(skillCoeff, true).toFixed(0)
            },
            huiXinDongRuoGuanHuo(){
                
            },
            pushJiNengXuLie(x){
                this.jiNengXuLie.push(x)
                return console.log('打印集合'+this.jiNengXuLie); ;
            },
            //崇光死了
            // chongGuangZhanE3(){
            //     return (this.chongGuangZhanE*((1-this.huixin()/100)+this.huixin()/100*this.huixiao()/100)*this.面板攻击()*((this.pofang()-0)+100)/100*this.无间影狱
            //     *(1-this.neifang()/100)*(1-this.huajin()/100) *(1-0.1*this.shengyong)*(1-0.2*this.zhanlong)*(1-0.1*this.yijifuhuodian)*(1-0.2*this.erjifuhuodian)).toFixed(0)
            
            // },

            
        },
        created() {//校验数据
            // this.pushJiNengXuLie()
        },
        computed:{
            // test驱夜断愁(){
            //     return (this.Test驱夜断愁DManage-0)/192
            // }
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
}

.el-row {
    margin-bottom: 20px;
    }
.el-col {
    border-radius: 4px;
    }
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    }
.row-bg {
    padding: 10px 0;
    }
/* .el-checkbox{
    size:mini
} */
</style>    
