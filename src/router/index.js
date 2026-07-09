import Vue from "vue";
import VueRouter from "vue-router";
import FenYing from '../views/FenYing.vue'
import MingZun from '../views/MingZun.vue'
import AppBackGround from '@/views/AppBackGround'
import ChatRoom from '@/views/ChatRoom.vue'
import KnowledgeManager from '@/views/KnowledgeManager.vue'

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
	// RAG 问答系统新页面
	{
		path:'/chat',
		component:ChatRoom,
	},
	{
		path:'/knowledge',
		component:KnowledgeManager,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
