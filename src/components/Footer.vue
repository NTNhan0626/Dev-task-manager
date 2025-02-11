<template>
  <footer>  
    <div class="footer">
      <ul v-if="['ADMIN', 'category', 'StaffManager','ToolManager'].some(role => roles.includes(role))">
        <li @click="toggleMenu('categories')" v-if="['ADMIN', 'category'].some(role => roles.includes(role))" class="menu-item-container">
          <span class="menu-item">Quản lý danh mục</span>
          <ul v-if="activeMenu === 'categories'" class="submenu">
            <li><RouterLink to="/home/category">Danh sách</RouterLink></li>
          </ul>
        </li>
        <li @click="toggleMenu('employees')" v-if="['ADMIN', 'StaffManager'].some(role => roles.includes(role))" class="menu-item-container">
          <span class="menu-item">Quản lý nhân viên</span>
          <ul v-if="activeMenu === 'employees'" class="submenu">
            <li><RouterLink to="/home/account/add" v-if="['ADMIN', 'StaffManagerC'].some(role => roles.includes(role))">Thêm</RouterLink> </li>
            <li><RouterLink to="/home/account/get" v-if="['ADMIN', 'StaffManagerR'].some(role => roles.includes(role))">Danh sách</RouterLink></li>
            <li><RouterLink to="/home/account/degree-specialization" v-if="['ADMIN', 'StaffManagerR']">Bằng cấp - Chuyên môn</RouterLink></li>
          </ul>
        </li>
        
        <li @click="toggleMenu('department')" v-if="['ADMIN'].some(role => roles.includes(role))" class="menu-item-container">
          <span class="menu-item">Quản lí Phòng ban</span>
          <ul v-if="activeMenu === 'department'" class="submenu">
            <li><RouterLink to="/home/department">Danh sách</RouterLink></li>
          </ul>
        </li>
        <li @click="toggleMenu('roles')" v-if="['ADMIN'].some(role => roles.includes(role))" class="menu-item-container">
          <span class="menu-item">Phân quyền</span>
          <ul v-if="activeMenu === 'roles'" class="submenu">
            <li><RouterLink to="/home/roles/add">Phân quyền chung</RouterLink></li>
            <li><RouterLink to="/home/roles/rolesdepartment">Phân quyền phòng ban</RouterLink></li>
          </ul>
        </li>   
        <li @click="toggleMenu('tools')" v-if="['ADMIN', 'ToolManager'].some(role => roles.includes(role))" class="menu-item-container">
          <span class="menu-item">Quản lí: Công cụ</span>
          <ul v-if="activeMenu === 'tools'" class="submenu">
            <li><RouterLink to="/home/tools">Danh sách</RouterLink></li>
            <li><RouterLink to="/home/managerTool">Phiếu mượn</RouterLink></li>
          </ul>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import router from '@/router';
const roles = sessionStorage.getItem("roles").split(",")
console.log(roles)

const activeMenu = ref(null); // Khởi tạo biến để lưu menu đang mở

const toggleMenu = (menu) => {
  activeMenu.value = activeMenu.value === menu ? null : menu; // Toggle menu visibility
};
</script>

<style scoped>
.footer {
  background-color: #ffffff;
  padding: 1rem 0;
  border-top: 2px solid #e0e0e0;
  width: 100%;
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
}

.menu-item-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
}

.menu-item {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
  display: inline-block;
}

ul ul {
  margin-left: 20px;
}

.submenu {
  margin-top: 0.5rem;
  padding-left: 1rem;
}

.submenu li {
  font-size: 0.95rem;
  padding: 0.5rem 0;
}


li:active {
  background-color: #d0d0d0;
}

.menu-item-container:hover {
  background-color: #e9e9e9;
}

.submenu a {
  text-decoration: none;
  color: #4a90e2;
  transition: color 0.3s ease;
}

.submenu a:hover {
  color: #1d72b8;
}
</style>
