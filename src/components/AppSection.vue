<template>
    <section class="section">
        <app-aside></app-aside>
        <app-main></app-main>
        
    </section>
</template>

<script>
import AppAside from './AppAside.vue'
import AppMain from './AppMain.vue'
    export default {
        components:{
        AppAside,
        AppMain,
        }
    }
</script>

<style scoped>
.section{
    flex:1;
    display: flex;
}

</style>
