<template>
    <div class="mingzun">
        <el-row :gutter="10" style="margin:0px">
            <el-col :span="17" >
                <div class="grid-content bg-purple">
                    <div class="shuzhi">
                        <h3>输入自身数值(0增益裸面板)</h3>
                        <div>
                            力道数值：<input type="text" name="lidao" id="lidao" v-model="lidao1"  placeholder="请输入具体的力道数值" required>
                            基础攻击：<input type="text" name="jichugongji" v-model="jichugongji1" placeholder="请输入具体的基础攻击数值" required>
                            最低武伤：<input type="text" name="minwuqishanghai" v-model="minwuqishanghai" placeholder="请输入最低武器伤害" required>
                            最高武伤：<input type="text" name="maxwuqishanghai" v-model="maxwuqishanghai" placeholder="请输入最高武器伤害" required>
                        </div>
                        <div>
                            会心数值：<input type="text" name="huixin" v-model="huixin1" placeholder="请输入具体的会心数值" required>
                            会效数值：<input type="text" name="huixiao" v-model="huixiao1" placeholder="请输入具体的会效数值" required>
                            破防数值：<input type="text" name="pofang" v-model="pofang1" placeholder="请输入具体的破防数值" required>
                        </div>
                        <h3>敌方数值</h3>
                        <div>
                            化劲数值：<input type="text" name="huajin" v-model="huajin1" placeholder="请输入具体的化劲数值" required>
                            御劲数值：<input type="text" name="yujin" v-model="yujin1" placeholder="请输入具体的御劲数值" required>
                            外防数值：<input type="text" name="waifang" v-model="waifang1" placeholder="请输入具体的外防数值" required>
                        </div>

                    </div>
                    <div class="zengjianyi">
                        <h3>选择我方增益和奇穴</h3>

                        <div>
                            <div>
                                <el-checkbox v-model="zhuyijipo" label="逐一击破" size=mini border></el-checkbox>
                                <el-checkbox v-model="judian" label="据点增益" size="mini" border></el-checkbox>
                                <el-checkbox v-model="chengwu" label="橙武特效" size="mini" border></el-checkbox>
                                <el-checkbox v-model="tiexuedajiangjun" label="铁血大将军" size="mini" border></el-checkbox>
                            </div>
                            <div>
                                <el-checkbox v-model="zilidaoxiaoyao" label="紫力道药" size="mini" border></el-checkbox>
                                <el-checkbox v-model="zilidaoxiaochi" label="紫力道吃" size="mini" border></el-checkbox>
                                <el-checkbox v-model="zigongjixiaoyao" label="紫攻击药" size="mini" border></el-checkbox>
                                <el-checkbox v-model="zigongjixiaochi" label="紫攻击吃" size="mini" border></el-checkbox>
                                <br>
                                <el-checkbox v-model="ziwuqifumo" label="紫武附魔" size="mini" border></el-checkbox>
                                <el-checkbox v-model="zijiayuanjiu" label="紫家园酒" size="mini" border></el-checkbox>
                                <el-checkbox v-model="gongjijiayuancai" label="攻家园菜" size="mini" border></el-checkbox>
                                <el-checkbox v-model="texiaoyaozhui" label="特效腰椎" size="mini" border></el-checkbox>
                                <br>
                                <el-checkbox v-model="qiufengsanying" label="秋风散影" size="mini" border></el-checkbox>
                                <el-checkbox v-model="xinwupangwu" label="心无旁骛" size="mini" border></el-checkbox>
                                <el-checkbox v-model="yicengyinzhui" label="1层隐追" size="mini" border></el-checkbox>
                                <el-checkbox v-model="dalei" label="天策大雷" size="mini" border></el-checkbox>
                                <el-checkbox v-model="jingyuzhen" label="鲸鱼阵" size="mini" border></el-checkbox>
                            </div>
                        </div>
                        <h3>选择敌方减伤</h3>
                        <el-checkbox v-model="shengyong" label="圣咏" size="mini" border></el-checkbox>
                        <el-checkbox v-model="zhanlong" label="战龙" size="mini" border></el-checkbox>
                        <el-checkbox v-model="yijifuhuodian" label="10减伤复活点" size="mini" border></el-checkbox>
                        <el-checkbox v-model="erjifuhuodian" label="20减伤复活点" size="mini" border></el-checkbox>
                    </div>
                </div>
                <el-button type="text" @click="centerDialogVisible = true" round>点击打开技能伤害列表</el-button>
                <el-button type="text" @click="centerDialogVisible2 = true" round>点击打开连招伤害列表</el-button>
                <el-dialog
                    title="技能伤害列表"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                    此处的单双隐追 都是默认妙手连环<br>
                    因为本人不是鲸鱼 算法方面可能有BUG<hr>
                    夺魄箭：<span>{{duopo()}}</span><br>
                    手大附魔：<span>{{shoudafumo()}}</span><br>
                    鞋大附魔：<span>{{xiedafumo()}}</span><br>
                    橙戒指：<span>{{chengjiezhi()}}</span><hr>

                    技能会心伤害: <br>
                    夺魄箭：<span>{{huixinduopo()}}</span><br>
                    单隐追：<span>{{danyinzhui()}}</span><br>
                    双隐追：<span>{{shuangyinzhui()}}</span><br>
                    百里追魂：<span>{{bailizhuihun()}}</span><br>
                    手大附魔：<span>{{huixinshoudafumo()}}</span><br>
                    鞋大附魔：<span>{{huixinxiedafumo()}}</span><br>
                    橙戒指：<span>{{huixinchengjiezhi()}}</span><hr>
                    <span slot="footer" class="dialog-footer"></span>
                </el-dialog>
                <el-dialog
                    title="连招伤害列表"
                    :visible.sync="centerDialogVisible2"
                    width="30%"
                    center>
                    <span>数据不足还在扒拉 别急</span>
                    <span slot="footer" class="dialog-footer"></span>
                </el-dialog>
            </el-col>
            <el-col :span="7">
                <div class="grid-content bg-purple">
                    <div class="mianban">
                        <h3>自身实际面板</h3>
                        力道:<div class="mianbangongji">{{lidao()}}</div>
                        基础攻击:<div class="mianbangongji">{{jichugongji()}}</div>
                        面板攻击：<div class="mianbangongji">{{mianbangongji()}}</div>
                        会心：<div class="mianbanhuixin">{{huixin()}}%</div>
                        会效：<div class="mianbanhuixiao" min="175" max="300">{{huixiao()}}%</div>
                        破防：<div class="mianbanpofang">{{pofang()}}%</div>
                        <h3>敌方防御面板</h3>
                        外防：<div class="mianbanwaifang">{{waifang()}}%</div>
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
    import { normalDamage, critDamage } from '@/common/skills/mingzun';

    export default {
        data() {
            return {
                lidao1:3958,
                jichugongji1:28658,
                huixin1:9388,
                huixiao1:4752,
                pofang1:47336,
                minwuqishanghai:1729,
                maxwuqishanghai:2882,
                huajin1:19296,
                yujin1:362,
                waifang1:5915,

                judian:false,
                chengwu:false,
                zhuyijipo:true,
                qiufengsanying:false,
                xinwupangwu:false,
                yicengyinzhui:false,
                zilidaoxiaoyao:false,
                zilidaoxiaochi:false,
                zigongjixiaoyao:false,
                zigongjixiaochi:false,
                ziwuqifumo:false,
                zijiayuanjiu:false,
                gongjijiayuancai:false,
                tiexuedajiangjun:false,
                texiaoyaozhui:false,
                dalei:false,
                jingyuzhen:false,

                shengyong:false,
                zhanlong:false,
                yijifuhuodian:false,
                erjifuhuodian:false,

                centerDialogVisible: false,
                centerDialogVisible2: false
            }
        },
        computed: {
            //通用计算上下文，打包给 common/skills/mingzun 使用
            ctx() {
                return {
                    面板攻击: +this.mianbangongji(),
                    武器伤害: +this.wuqishanghai(),
                    pofang: +this.pofang(),
                    waifang: +this.waifang(),
                    huajin: +this.huajin(),
                    huixiao: +this.huixiao(),
                    yuxiao: +this.yuxiao(),
                    chengwu: this.chengwu ? 1 : 0,
                    tiexuedajiangjun: this.tiexuedajiangjun ? 1 : 0,
                    zhuyijipo: this.zhuyijipo ? 1 : 0,
                    shengyong: this.shengyong ? 1 : 0,
                    zhanlong: this.zhanlong ? 1 : 0,
                    yijifuhuodian: this.yijifuhuodian ? 1 : 0,
                    erjifuhuodian: this.erjifuhuodian ? 1 : 0,
                };
            },
        },
        methods: {
            //面板力道
            lidao(){
                return ((this.lidao1-0)*(1+0.03*this.jingyuzhen)
                +this.zilidaoxiaochi*284+this.zilidaoxiaoyao*365+this.zijiayuanjiu*208).toFixed(0)
            },
            //面板基础攻击
            jichugongji(){
                return ((((this.jichugongji1-0)+this.zigongjixiaoyao*733+this.zigongjixiaochi*
                    570+this.ziwuqifumo*489+this.gongjijiayuancai*708+
                    0.15*((this.lidao1-0)*(0.03*(this.jingyuzhen-0))
                    +this.zilidaoxiaochi*284+this.zilidaoxiaoyao*365+this.zijiayuanjiu*208)))).toFixed(1)
            },
            //面板攻击
            mianbangongji(){
                return((this.lidao()*1.45)+this.jichugongji()*1*(1+0.25*this.dalei+0.5*this.judian)).toFixed(1)
            },
            //面板会心
            huixin(){
                const v = ((((this.huixin1-0+0.59*(this.zilidaoxiaochi*284+this.zilidaoxiaoyao*365+this.zijiayuanjiu*208))/78622.5-0)*100)+10*this.qiufengsanying+15*this.xinwupangwu);
                return v > 100 ? 100 : v.toFixed(1);
            },
            //面板会效
            huixiao(){
                const v = (((this.huixiao1/27513.75)*100+175)+10*this.qiufengsanying+30*this.xinwupangwu);
                return v > 300 ? 300 : v.toFixed(1);
            },
            //面板破防
            pofang(){
                return (((((this.pofang1-0)+6048*this.texiaoyaozhui+0.3*(this.zilidaoxiaochi*284+this.zilidaoxiaoyao*365+this.zijiayuanjiu*208))*(1+0.2*this.dalei+0.2*this.jingyuzhen))
                /78622.5)*100).toFixed(1)
            },
            //面板外防
            waifang(){
                const eff = this.waifang1*(1+0.5*this.judian);
                const v = eff/(eff+42000.75)*100;
                return v > 80 ? 80 : v.toFixed(1);
            },
            //面板化劲
            huajin(){
                const eff = (this.huajin1-0)*(1-0.05*this.yicengyinzhui);
                const v = eff/(eff+11385.0)*100+10;
                if (v > 80) return 80;
                if (v < 10) return 10;
                return v.toFixed(1);
            },
            //面板御劲
            yujin(){
                const v = this.yujin1/78622.5*100;
                if (v < 0) return 0;
                if (v > 100) return 100;
                return v.toFixed(1);
            },
            //面板御效
            yuxiao(){
                const v = this.yujin1/21095.25*100;
                return v > 40 ? 40 : v.toFixed(1);
            },
            wuqishanghai(){
                return ((this.maxwuqishanghai-0)+(this.minwuqishanghai-0))/2
            },
            //----------------- 技能伤害（接入 common/skills/mingzun） -----------------
            duopo()              { return normalDamage.夺魄箭(this.ctx).toFixed(0); },
            shoudafumo()         { return normalDamage.手大附魔(this.ctx).toFixed(0); },
            xiedafumo()          { return normalDamage.鞋大附魔(this.ctx).toFixed(0); },
            chengjiezhi()        { return normalDamage.橙戒指(this.ctx).toFixed(0); },

            huixinduopo()        { return critDamage.夺魄箭(this.ctx).toFixed(0); },
            danyinzhui()         { return critDamage.单隐追(this.ctx).toFixed(0); },
            shuangyinzhui()      { return critDamage.双隐追(this.ctx).toFixed(0); },
            bailizhuihun()       { return critDamage.百里追魂(this.ctx).toFixed(0); },
            huixinshoudafumo()   { return critDamage.手大附魔(this.ctx).toFixed(0); },
            huixinxiedafumo()    { return critDamage.鞋大附魔(this.ctx).toFixed(0); },
            huixinchengjiezhi()  { return critDamage.橙戒指(this.ctx).toFixed(0); },
        },
    }
</script>

<style scoped>
.mingzun{
    background: url("../assets/backtangmen.png") no-repeat;
    flex: 1;
    background-size: 600px;
    background-position-x: center;
    background-position-y: center;
    background-attachment: fixed;
}

.el-row { margin-bottom: 20px; }
.el-col { border-radius: 4px; }
.grid-content { border-radius: 4px; min-height: 36px; }
.row-bg { padding: 10px 0; }
</style>
