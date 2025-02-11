<template>
    <div class="project-details">
      <h1>Chi tiết dự án</h1>
        <button v-if="projectResponse.data.projectType"><RouterLink :to="{
          name:'task',
          params:{projectId : projectResponse.data.projectId}
        }">Công việc</RouterLink></button>

        <button v-if="!projectResponse.data.projectType"><RouterLink :to="{
          name:'interdepartmental-task',
          params:{projectId : projectResponse.data.projectId}
        }">Công việc</RouterLink></button>

        <button v-if="loginAccountId === projectResponse.data.projectManagerId"><RouterLink :to="{
          name:'tools-request',
          params:{projectId : projectResponse.data.projectId}
        }">Công cụ</RouterLink></button>

        <button v-if="loginAccountId === projectResponse.data.projectManagerId"><RouterLink :to="{
          name:'issues-manager',
          params:{projectId : projectResponse.data.projectId}
        }">Quản lí phát sinh</RouterLink></button>
      <!-- Thông tin chung về dự án -->
      <div class="project-info">
        <p><strong>ID dự án:</strong> {{ projectResponse.data.projectId }}</p>
        <p><strong>Tên dự án:</strong> {{ projectResponse.data.projectName }}</p>
        <p><strong>Mô tả:</strong> {{ projectResponse.data.description }}</p>
        <p><strong>Loại dự án:</strong> {{ projectResponse.data.projectType ? 'Nội bộ' : 'Liên phòng ban' }}</p>
        <p><strong>Ngày tạo:</strong> {{ formatDate(projectResponse.data.createdDate) }}</p>
        <p><strong>Ngày bắt đầu:</strong> {{ formatDate(projectResponse.data.startDate) }}</p>
        <p><strong>Ngày kết thúc dự kiến:</strong> {{ formatDate(projectResponse.data.endDate) }}</p>
        <p><strong>Ngày kết thúc thực tế:</strong> {{ formatDate(projectResponse.data.actualEndDate) }}</p>
        <p><strong>Trạng thái:</strong> <span class="status">{{ projectResponse.data.status }}</span></p>
        <p><strong>Tình trạng:</strong> <span class="status">{{ projectResponse.data.projectCondition }}</span></p>
  
        <!-- Thanh tiến trình -->
        <p><strong>Tiến độ:</strong></p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: projectResponse.data.progress + '%' }">
            {{ projectResponse.data.progress }}%
          </div>
        </div>
  
        <p><strong>ID Trưởng dự án:</strong> {{ projectResponse.data.projectManagerId }}</p>
      </div>
      <div class="project-action">
        <button
        v-if="projectResponse.data.status === 'Pending'"

         @click.stop="openUseModal('startProject')"
        >Bắt đầu</button>

      </div>
      <div class="project-action"  v-if="projectResponse.data.status === 'In Progress'">
        <button
        :disabled="projectResponse.data.progress !== 100"
         @click.stop="openUseModal('projectCompleted')"
        >Hoàn thành</button>

      </div>
      <!-- Danh sách nhân viên tham gia dự án -->
      <div class="employee-list">
        <h2>Danh sách nhân viên tham gia</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tài khoản</th>
              <th>Ngày tham gia</th>
              <th>Công việc</th>
              
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in projectResponse.data.projectDetailResponses" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ detail.userName }}</td>
              <td>{{ formatDate(detail.joinDate) }}</td>
              <td><span v-for="task in detail.taskResponses">{{ task.taskName }},</span></td>
              <td><button style="background-color: red; border: 0cap; color: aliceblue;" @click="openUseModal('DeleteProjectDT'),deletedacountId=detail.accountId">Xóa</button></td>
              
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  <div v-if="isUseModalVisible" class="modal-overlay">
    <div class="modal">
        <h2 v-if="usesActionType === 'startProject'">Bắt đầu dự án "{{ projectResponse.data.projectName }}"</h2>
        <h2 v-if="usesActionType === 'projectCompleted'">Hoàn thành công việc "{{ projectResponse.data.projectName }}"</h2>
        <h2 v-if="usesActionType === 'DeleteProjectDT'">Bạn chắc chắn muốn xóa nhân viên này khỏi dự án "{{ projectResponse.data.projectName }}"</h2>
        
        <!-- Nội dung modal thay đổi theo action -->
        <div v-if="usesActionType === 'startProject'">
          <p style="font-weight: bold;" >bạn chắc chắn muốn bắt đầu dự án vào lúc này ?</p>
        </div>
        <div v-if="usesActionType === 'projectCompleted'">
          <p style="font-weight: bold;" >bạn chắc chắn dự án đã hoàn thành?</p>
        </div>
        <div v-if="usesActionType === 'DeleteProjectDT'">
          <p style="font-weight: bold;" >bạn chắc chắn Xóa nhân viên khỏi dự án?</p>
        </div>
        <div class="form-actions">
          <button class="btn-confirm" @click.stop="submitAction">Xác nhận</button>
          <button class="btn-cancel" @click.stop="closeUseModal">Hủy</button>
        </div>
    </div>
  </div>
</template>
  
<script setup>
import API_ENDPOINTS from '@/api/api';

import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
const router = useRoute()
const projectId = router.params.projectId
console.log(projectId)
const loginAccountId = Number(sessionStorage.getItem("accountId"))
const token = sessionStorage.getItem("token")

const usesActionType = ref('')
const isUseModalVisible = ref(false)

  const projectResponse = reactive({
    data:[]
  })
// project update requets 
  const projectUpdatestartProject = reactive({
    status :'In Progress',
    startDate: new Date(),
  });
// project update requets 
const projectUpdateCompletedProject = reactive({
    status :'Completed',
    actualEndDate: new Date()
  });
  
  // Format date function
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

const handleGetProject = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_PROJECTBYID(projectId),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            console.log("get project detail success")
            projectResponse.data = response.data.result
            console.log(projectResponse.data)
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
        console.log('get project detail err', error);
    }
}

//modal dùng chung
const openUseModal = (type) => {
  usesActionType.value = type;
  
  isUseModalVisible.value = true;
};

// Đóng modal
const closeUseModal = () => {
  isUseModalVisible.value = false;
};

// Xử lý hành động xác nhận
const submitAction = async () => {
  if (usesActionType.value === "startProject") {
    console.log("call handleStartProject")
    await handleStartProject()
    handleGetProject()
    
  } else if (usesActionType.value === "projectCompleted") {
    console.log("call handleProjectCompleted");
    
    await handleProjectCompleted()
    handleGetProject()
  }
  else if (usesActionType.value === "DeleteProjectDT") {
    console.log("call handle deleteProjectDT");
    
    await handleDeletedProjectDetailDetail()
    handleGetProject()
  }

  
  closeUseModal(); // Đóng modal sau khi xử lý
};

const handleStartProject = async() =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROJECT(projectId),projectUpdatestartProject,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("start project success")
     
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
        console.log('start project  err', error);
  }
}

const handleProjectCompleted = async() =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROJECT(projectId),projectUpdateCompletedProject,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("completed project success")
     
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
        console.log('completed project  err', error);
  }
}
const deletedprojectId = projectId
const deletedacountId = ref(null)

const handleDeletedProjectDetailDetail = async() =>{
  try {
    const response = await axios.delete(API_ENDPOINTS.DELETEPROJECTDETAIL(deletedprojectId,deletedacountId.value),{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("delete project detail success")
      
     
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
        console.log('deleted project  err', error);
  }
}

onMounted(()=>{
    handleGetProject()
})
</script>
  
  <style scoped>
  .project-details {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #333;
  }
  
  .project-info p {
    margin: 8px 0;
  }
  
  .status {
    color: #4caf50;
    font-weight: bold;
  }
  
  .progress-bar {
    width: 100%;
    background: #f3f3f3;
    border-radius: 8px;
    overflow: hidden;
    margin: 10px 0;
  }
  
  .progress {
    height: 20px;
    background: #4caf50;
    text-align: center;
    color: white;
    line-height: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  table th,
  table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  table th {
    background-color: #f4f4f4;
    color: #333;
  }
  
  table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal label {
  display: block;
  margin-bottom: 10px;
}

.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-confirm {
  background-color: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
  </style>
  