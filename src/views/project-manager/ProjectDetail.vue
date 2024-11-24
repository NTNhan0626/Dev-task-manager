<template>
    <div class="project-details">
      <h1>Chi tiết dự án</h1>
  
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
  
        <!-- Thanh tiến trình -->
        <p><strong>Tiến độ:</strong></p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: projectResponse.data.progress + '%' }">
            {{ projectResponse.data.progress }}%
          </div>
        </div>
  
        <p><strong>ID Trưởng dự án:</strong> {{ projectResponse.data.projectManagerId }}</p>
      </div>
  
      <!-- Danh sách nhân viên tham gia dự án -->
      <div class="employee-list">
        <h2>Danh sách nhân viên tham gia</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in projectResponse.data.projectDetailResponses" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ detail.userName }}</td>
              <td>{{ detail.status }}</td>
              <td>{{ formatDate(detail.joinDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
  
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const router = useRoute()
const projectId = router.params.projectId
console.log(projectId)
const token = sessionStorage.getItem("token")
// Mock data
const project = ref({
    projectId: 1,
    projectName: 'Hệ thống quản lý công việc',
    description: 'Dự án xây dựng hệ thống quản lý công việc cho công ty.',
    projectType: true,
    createdDate: new Date('2024-01-01'),
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-01'),
    actualEndDate: null,
    status: 'Đang thực hiện',
    progress: 60.5,
    projectManagerId: 101,
    projectDetailResponses: [
      { employeeName: 'Nguyễn Văn A', role: 'Lập trình viên', joinDate: new Date('2024-01-16') },
      { employeeName: 'Trần Thị B', role: 'Kiểm thử viên', joinDate: new Date('2024-01-20') },
      { employeeName: 'Phạm Văn C', role: 'Quản lý dự án', joinDate: new Date('2024-01-15') },
    ],
  });

  const projectResponse = reactive({
    data:[]
  })
  
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
  </style>
  