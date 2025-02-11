<template>
    <div class="rolesdetail-content">
      <div class="rolesdetail-table">
        <p class="title">Bảng Chi Tiết Quyền</p>
        <table class="styled-table">
          <thead>
            <tr>
            
              <th>Tài khoản</th>
              <th v-if="filter==='role-department'">Quản lý</th>
              <th v-if="filter==='role-department'">Nhân viên</th>
              
              <th v-if="filter==='role-other'">Đọc</th>
              <th v-if="filter==='role-other'" >Thêm</th>
              <th v-if="filter==='role-other'">Sửa</th>
              <th v-if="filter==='role-other'">Xóa</th>
              <th >Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rolesdetail in rolesDetails.data" :key="rolesdetail.rolesDetailId">
              <td>{{ rolesdetail.accountResponse.username }}</td>
              <td v-if="filter==='role-department'">{{ rolesdetail.manager ? 'Yes' : 'No' }}</td>
              <td v-if="filter==='role-department'">{{ rolesdetail.staff ? 'Yes' : 'No' }}</td>
             
              <td v-if="filter==='role-other'">{{ rolesdetail.reader ? 'Yes' : 'No' }}</td>
              <td v-if="filter==='role-other'">{{ rolesdetail.creater ? 'Yes' : 'No' }}</td>
              <td v-if="filter==='role-other'">{{ rolesdetail.writer ? 'Yes' : 'No' }}</td>
              <td v-if="filter==='role-other'">{{ rolesdetail.deleter ? 'Yes' : 'No' }}</td>
              <td>
                <button class="edit-btn" @click="showModalEdit = true; accountId = rolesdetail.accountResponse.accountId">Chỉnh sửa</button>
                <button class="delete-btn">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div v-if="showModalEdit" class="modal-overlay">
          <div class="modal-edit">
            <h3>Chỉnh sửa Quyền</h3>
            <div class="input-content">
              <div class="input-roles-group" v-if="filter==='role-department'">
                <label>
                  <input type="radio" name="roles-group" @click="selectAccount('manager')" :checked="rolesDetails.manager" />
                  Quản lý
                </label>
                <label>
                  <input type="radio" name="roles-group" @click="selectAccount('staff')" :checked="rolesDetails.staff" />
                  Nhân viên
                </label>
                
              </div>
  
              <div class="input-roles-operations" v-if="filter==='role-other'">
                <label>
                  <input type="checkbox" v-model="rolesDetails.reader" />
                  Đọc
                </label>
                <label>
                  <input type="checkbox" v-model="rolesDetails.creater" />
                  Thêm
                </label>
                <label>
                  <input type="checkbox" v-model="rolesDetails.writer" />
                  Sửa
                </label>
                <label>
                  <input type="checkbox" v-model="rolesDetails.deleter" />
                  Xóa
                </label>
              </div>
  
              <div class="modal-action">
                <button class="confirm-btn" @click="handleEditRolesDetail(rolesId, accountId)">Xác nhận</button>
                <button class="cancel-btn" @click="showModalEdit = false">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { onMounted, reactive, ref } from 'vue';
  import axios from 'axios';
  import API_ENDPOINTS from '@/api/api';
  
  const showModalEdit = ref(false);
  const rolesDetails = reactive({
    data: [],
  });
  const route = useRoute();
  const rolesId = route.params.rolesId;
  const filter = route.query.filter
  console.log(filter)
  const accountId = ref(null);
  
  const selectAccount = (position) => {
    rolesDetails.manager = false;
    rolesDetails.staff = false;
    rolesDetails.guest = false;
    rolesDetails[position] = true;
  };
  
  const handleGetRolesDetailByRolesId = async (rolesId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_ROLESDETAILBYROLESID(rolesId));
      if (response.status === 200) {
        rolesDetails.data = response.data.result;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEditRolesDetail = async (rolesId, accountId) => {
    try {
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_ROLESDETAIL(accountId, rolesId),
        {
          manager: rolesDetails.manager,
          staff: rolesDetails.staff,
          guest: rolesDetails.guest,
          reader: rolesDetails.reader,
          writer: rolesDetails.writer,
          creater: rolesDetails.creater,
          deleter: rolesDetails.deleter,
        }
      );
      if (response.status === 200) {
        handleGetRolesDetailByRolesId(rolesId);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  onMounted(() => {
    handleGetRolesDetailByRolesId(rolesId);
  });
  </script>
  
  <style>
  .rolesdetail-content {
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .styled-table {
    width: auto;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 1rem;
    text-align: left;
    background-color: white;
    border: 1px solid #ddd;
  }
  
  .styled-table thead tr {
    background-color: #007bff;
    color: white;
    text-align: left;
  }
  
  .styled-table th,
  .styled-table td {
    padding: 12px 15px;
  }
  
  .styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  
  .styled-table tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  .edit-btn,
  .delete-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-btn {
    background-color: #28a745;
    color: white;
    margin-right: 8px;
  }
  
  .delete-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-edit {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-edit h3 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .input-roles-group,
  .input-roles-operations {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .modal-action {
    display: flex;
    justify-content: space-between;
  }
  
  .confirm-btn {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #6c757d;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  