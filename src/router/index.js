import Vue from "vue";
import VueRouter from "vue-router";
import FenYing from '../views/FenYing.vue'
import MingZun from '../views/MingZun.vue'
import AppBackGround from '@/views/AppBackGround'

Vue.use(VueRouter);

const routes = [
	{
		path:'/',
		component:AppBackGround,
	},
	{
		path:'/fenying',
		component:FenYing,
	},
	{
		path:'/mingzun',
		component:MingZun,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
