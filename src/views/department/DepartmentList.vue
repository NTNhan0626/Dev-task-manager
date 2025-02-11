<template>
    
    <div class="department-main-content">
      <header class="department-header">
        <h1>Danh sách phòng ban</h1>
        <button class="btn-primary" @click="showModalDepartmenAdd = true">Thêm Phòng ban</button>
      </header>
  
      <div class="department-table-container">
        <table class="department-table">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Mã Phòng</th>
              <th>Tên Phòng</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Số nhân viên</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(department, index) in departmentRespones.data" :key="department.departmentId">
              <td>{{ index + 1 }}</td>
              <td>{{ department.departmentId }}</td>
              <td>{{ department.departmentName }}</td>
              <td>{{ department.status }}</td>
              <td>{{ formatDate(department.createdDate) }}</td>
              <td>{{ department.numberStaff }}</td>
              <td><button>
                <RouterLink :to="{name: 'department-detail', params: {departmentId: department.departmentId, departmentName: department.departmentName}}" class="btn-link">
                  Xem chi tiết
                </RouterLink></button>
                <button style="color: white;background-color: #007bff;" @click="showUpdateDepartment=true,selectedDepartmentId = department.departmentId">Chỉnh sửa</button>
                <button style="color: white;background-color: red;" v-if="department.checkDeleted" @click="openUseModal('Deleted'),selectedDepartmentId = department.departmentId">Xóa</button>              
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="showModalDepartmenAdd" class="modal-overlay">
        <div class="modal">
          <h3>Thêm Phòng mới</h3>
          <div class="modal-body">
            <label>
              Nhập tên phòng:
              <input type="text" v-model="departmentRequest.departmentName" class="input-field"/>
            </label>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="handleDepartmentAdd(); showModalDepartmenAdd = false">Xác nhận</button>
            <button class="btn-secondary" @click="canceAdd">Hủy</button>
          </div>
        </div>
      </div>


      <div v-if="showUpdateDepartment" class="modal-overlay">
        <div class="modal">
          <h3>Thêm đổi tên phòng ban</h3>
          <div class="modal-body">
            <label>
              Nhập tên phòng:
              <input type="text" v-model="departmentRequest.departmentName" class="input-field"/>
            </label>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="handleDepartmentUpdate(); showUpdateDepartment = false">Xác nhận</button>
            <button class="btn-secondary" @click="canceAdd">Hủy</button>
          </div>
        </div>
      </div>

      <div v-if="isUseModalVisible === true" class="modal-overlay">
            <div class="modal">
              
                <h2 v-if="usesActionType === 'Deleted'">Xác nhận xóa Phòng ban</h2>
                <!-- Nội dung modal thay đổi theo action -->
                
               
                <div v-if="usesActionType === 'Deleted'">
                  <p style="font-weight: bold;" >bạn chắc chắn xóa phòng ban được chọn?</p>
                </div>
               
                <div class="form-actions">
                  <button class="btn-confirm" @click.stop="submitAction()">Xác nhận</button>
                  <button class="btn-cancel" @click.stop="closeUseModal()">Hủy</button>
                </div>
            </div>
        </div>

    </div>
    
  </template>
  
  <script setup>
  import API_ENDPOINTS from '@/api/api';
  import { useDepartmentStore } from '@/stores/departmentStore';
  import axios from 'axios';
  import { onMounted, reactive, ref } from 'vue';
  import { RouterLink } from 'vue-router';
  
  const showModalDepartmenAdd = ref(false);
  const departmentRequest = reactive({ departmentName: '' });
  const departmentStore = useDepartmentStore();
  const departmentRespones = reactive({ data: [] });
  const showUpdateDepartment = ref(false)
  const selectedDepartmentId = ref(null)
  const handleDepartmentGet = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENT);
      if (response.status === 200) {
        departmentRespones.data = response.data.result;
        departmentStore.putDepartmentsToStore(departmentRespones.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const formatDate = (date) => {
  if (!date || isNaN(new Date(date).getTime())) {
    return 'Chưa xác định'; // Giá trị mặc định nếu `date` không hợp lệ
  }
  
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng trong JavaScript bắt đầu từ 0
  const day = String(formattedDate.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số

  return `${year}-${month}-${day}`; // Trả về ngày theo định dạng YYYY-MM-DD
};

const isUseModalVisible =ref('')
const usesActionType = ref('')
const openUseModal = (style) =>{
    usesActionType.value = style
    isUseModalVisible.value = true
}
const closeUseModal = () => {
  isUseModalVisible.value = false;

};
const submitAction = async () =>{
   if(usesActionType.value === 'Deleted'){
        console.log("call handleDeleteAccount")
        await handleDeleteDepartment()
        selectedDepartmentId.value=null
        departmentRequest.departmentName =''
    }
    
    closeUseModal()
}
  
  const canceAdd = () => {
    showModalDepartmenAdd.value = false;
    departmentRequest.departmentName = '';
  };
  
  const handleDepartmentAdd = async () => {
    try {
      const response = await axios.post(API_ENDPOINTS.ADD_DEPARTMENT, {
        departmentName: departmentRequest.departmentName,
        status: 'inprogress',
        createdDate: new Date(),
      });
      if (response.status === 200) {
        handleDepartmentGet();
      }
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };
  const handleDepartmentUpdate = async () => {
    try {
      const response = await axios.put(API_ENDPOINTS.UPDATE_DEPARTMENT(selectedDepartmentId.value), departmentRequest);
      if (response.status === 200) {
        handleDepartmentGet();
      }
    } catch (error) {
      console.error('Error update department:', error);
    }
  };
  const handleDeleteDepartment = async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.DELETE_DEPARTMENT(selectedDepartmentId.value));
      if (response.status === 200) {
        handleDepartmentGet();
      }
    } catch (error) {
      if (error.response) {
            console.log('Request failed with status:', error.response.status);
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error setting up request:', error.message);
        }
      console.error('Error delete department:', error);
    }
  };
  
  
  onMounted(handleDepartmentGet);
  </script>
  
  <style scoped>
  .department-main-content {
    padding: 20px;
    font-family: Arial, sans-serif;
    color: #333;
  }
  
  .department-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .department-table-container {
    overflow-x: auto;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .department-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .department-table th, .department-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  .department-table th {
    background-color: #007bff;
    color: white;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-body {
    margin-bottom: 20px;
  }
  
  .input-field {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  .btn-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .btn-link:hover {
    text-decoration: underline;
  }
  td button {
  padding: 8px 14px;
  font-size: 14px;
  border: 0cap  ;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
    
}
/* Nút đầu tiên (Xác nhận) */
.form-actions button:first-child {
  background-color: #4CAF50; /* Màu xanh lá */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions{
  display: flex;
    justify-content: space-between;
}
/* Hover cho nút đầu tiên */
.form-actions button:first-child:hover {
  background-color: #45a049; /* Xanh lá đậm hơn */
}

/* Nút thứ hai (Hủy) */
.form-actions button:last-child {
  background-color: #f44336; /* Màu đỏ */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Hover cho nút thứ hai */
.form-actions button:last-child:hover {
  background-color: #d32f2f; /* Đỏ đậm hơn */
}


  </style>
  