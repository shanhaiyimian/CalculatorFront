<template>
	<aside class =job>
		<table>
			<ul class="ul">
                <li>
                    <router-link to="/fenying"><img src="../assets/mingjiao.png" width="20px" class="fenying">{{ job1 }}</router-link>
                </li>
                <!-- <li>
                    <router-link to="/mingzun"><img src="../assets/tangmen.png" width="20px" class="mingzun">{{ job2 }}</router-link>
                </li> -->
                <!-- <li>
                    <router-link to="/wanLingZong"><img src="" width="20px" class="wanLingZong">{{ job3 }}</router-link>
                </li> -->
		    </ul>
        </table>
	</aside>
</template>

<script>
export default {
	data() {
		return {
			job1: "焚影",
			job2: "明尊"
		};
	},
    methods: {
        handleOpen(key, keyPath) {
        console.log(key, keyPath);
    },
        hndleClose(key, keyPath) {
        console.log(key, keyPath);
    }
    },
	components: {},
};
</script>

<style scoped>
	.job{
    /* 侧边栏宽度 */
    width:160px;
    /* 设置背景色 */
    background-color: #545c64;
    /* 开启弹性盒子 */
    display: flex;
    /* 主轴交叉轴居中 */
    justify-content: center;
    align-items: center;
    }
	.job ul{
    /* 去掉列表徽记 */
    list-style-type: none;
    /* border:solid 2px pink; */
    padding-left: 0;
    }
	.job ul li a{
    color:whitesmoke;
    /* 去掉下划线 */
    text-decoration: none;
}
.job ul li a:hover{
    color:#ff770f;
    font-weight: bolder;
}
.job .ul .fenying{
    vertical-align: middle;
}
.job .ul .mingzun{
    vertical-align: middle;
}
.job .ul .wanLingZong{
    vertical-align: middle;
}
.job ul li{
    margin:50px;
}
</style>
