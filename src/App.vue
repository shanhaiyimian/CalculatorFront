<template>
	<div class="layout-container">
		<app-header></app-header>
		<app-section></app-section>
		<app-footer></app-footer>
	</div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppSection from './components/AppSection.vue'
import AppFooter from './components/AppFooter.vue'
export default {
	components:{
		AppHeader,
		AppSection,
		AppFooter,

	}
}
</script>

<style>
	html,body{
		margin:0;
		padding:0;
		height: 100%;
		font-family: 喜鹊招牌体;
	}
	.layout-container{
		height:100vh;
		display: flex;
		flex-direction: column;
	}
</style>