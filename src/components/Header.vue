<template>
    <div class="header-items-left">
      <h1 style="font-size: 25px;">Devstank Manager</h1>
      <RouterLink  to="/home/about" >Công việc</RouterLink>
      <RouterLink to="/home/project">Dự án</RouterLink>
    </div>
    <div class="header-items-right">
      <IconAler ></IconAler>
      <p>username</p>
      <img src="#" alt="avatar" class="avatar" @click="toggleDropdown">
    </div>

    <div class="dropdown-menu" v-if="isDropdownOpen">
        <p>tên tài khoản</p>
        <img src="" alt="avatar" class="dropdown-avatar">
        <div class="dropdown-action">
            <RouterLink :to="{name:'account-information'}" @click="isDropdownOpen=false">Thông tin</RouterLink>
            <button>Đăng xuất</button>
        </div>
       
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import IconAler from './icons/IconAler.vue';
import { RouterLink } from 'vue-router';

const isDropdownOpen = ref(false)

const toggleDropdown = ()=>{
    isDropdownOpen.value = !isDropdownOpen.value 
}

</script>
<style scoped>
.header-items-left{
  display: flex;
  justify-content:flex-start ;
  align-items: center;
  font-size: 20px;
  padding: 10px;
}
.header-items-right{
  display: flex;
  justify-content: flex-end;
  align-items: center;

}
.avatar {
  width: 40px; /* Chiều rộng của ảnh đại diện */
  height: 40px; /* Chiều cao của ảnh đại diện */
  border-radius: 50%; /* Tạo hình tròn cho ảnh */
  margin-left: 10px; /* Khoảng cách giữa tên và avatar */
}

.dropdown-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50px;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px;
    width: 200px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5%;
}

.dropdown-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
</style>
