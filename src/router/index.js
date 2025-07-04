import Vue from "vue";
import VueRouter from "vue-router";
import MingJiao from '../views/MingJiao.vue'
import TangMen from '../views/TangMen.vue'
import AppBackGround from '@/views/AppBackGround'

Vue.use(VueRouter);

const routes = [
	{
		path:'/',
		component:AppBackGround,
	},
	{
		path:'/mingjiao',
		component:MingJiao,
	},
	{
		path:'/tangmen',
		component:TangMen,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
