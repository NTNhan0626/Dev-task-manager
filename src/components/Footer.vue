<template>
    <footer>
      <div class="footer">
        <ul>
          <li @click="toggleMenu('categories')">
            Quản lý danh mục
            <ul v-if="activeMenu === 'categories'">
              <li><RouterLink to="/home/category">Danh sách</RouterLink></li>
            </ul>
          </li>
          <li @click="toggleMenu('employees')">
            Quản lý nhân viên
            <ul v-if="activeMenu === 'employees'">
              <li><RouterLink to="/home/account/add">Thêm</RouterLink> </li>
              <li><RouterLink to="/home/account/get">Danh sách</RouterLink></li>
              <li><RouterLink to="/home/account/degree-specialization">Bằng cấp - Chuyên môn</RouterLink></li>
            </ul>
          </li>
          <li @click="toggleMenu('roles')">
            Phân quyền 
              <ul v-if="activeMenu === 'roles'">
                  <li><RouterLink to="/home/roles/add">Phân quyền phòng ban</RouterLink></li>
                  <li><RouterLink to="/home/roles/rolesdepartment">Phân quyền chung</RouterLink></li>
              </ul>
          </li>
          <li @click="toggleMenu('department')">
            Quản lí Phòng ban
            <ul v-if="activeMenu === 'department'">
                <li><RouterLink to="/home/department">Danh sách</RouterLink></li>
            </ul>

          </li>
        </ul>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { RouterLink,RouterView } from 'vue-router';
  import router from '@/router';
  
  const activeMenu = ref(null); // Khởi tạo biến để lưu menu đang mở
  
  const toggleMenu = (menu) => {
    activeMenu.value = activeMenu.value === menu ? null : menu; // Toggle menu visibility
  };
  
  const categoryGetList = () =>{
    router.push()
  }

  const addCategory = () => {
    console.log("Thêm danh mục");
    // Logic cho thêm danh mục
  };
  
  const editCategory = () => {
    console.log("Sửa danh mục");
    // Logic cho sửa danh mục
  };
  
  const deleteCategory = () => {
    console.log("Xóa danh mục");
    // Logic cho xóa danh mục
  };
  
  const addEmployee = () => {
    console.log("Thêm nhân viên");
    // Logic cho thêm nhân viên
  };
  
  const editEmployee = () => {
    console.log("Sửa nhân viên");
    // Logic cho sửa nhân viên
  };
  
  const deleteEmployee = () => {
    console.log("Xóa nhân viên");
    // Logic cho xóa nhân viên
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #f8f8f8;
    padding:  1rem 0 1rem 0;
    border-top: 1px solid #e0e0e0;
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
  }
  
  ul ul {
    margin-left: 20px;
  }
  </style>
  