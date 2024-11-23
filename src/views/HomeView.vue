<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { RouterLink,RouterView } from 'vue-router';
import IconAler from '@/components/icons/IconAler.vue';
import Footer from '@/components/Footer.vue';
import DepartmentDetail from './department/DepartmentDetail.vue';
import Header from '@/components/Header.vue';
</script>

<template>
  <header>
    <Header></Header>
  </header>
  <main>
    <Footer></Footer>
    <div class="main-content">
     
      <RouterView/>
      
    </div>
  </main>
  <footer>
    <p>Footer information</p>
  </footer>
</template>
<style>
header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 20%;
  width: 100%;
  border-bottom: 1px solid #000;
}


main{
  display: flex;
  flex-direction: row;

}
.footer{
  width: 15%;
  
}
.main-content{
  flex: 1;
  border-left:3px solid #d8d4d4;
  min-height: 100vh;
  padding: 1rem;
}

</style>