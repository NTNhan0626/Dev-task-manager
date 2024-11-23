<template>
    <div class="project-manager-content">
      <h3>Phòng ban: <span class="department-name">{{ departmentName }}</span></h3>
      <button class="create-project-button" @click="showmodalCreateDepartmentProject = true" >Tạo dự án mới</button>
      <p class="projects-title">Các dự án hiện tại:</p>
      <div class="projects">
        <div class="project" v-for="project in departmentProjectResponse.data" :key="project.projectId">
          <p class="project-name">{{ project.projectName }}</p>
          <p class="project-id">Mã dự án: {{ project.projectId }}</p>
          <p class="created-date">Ngày tạo: {{ project.createdDate }}</p>
          <p class="start-date" v-if="project.startDate !== ''">Ngày bắt đầu: {{ project.startDate }}</p>
          <p class="end-date">Ngày kết thúc: {{ project.endDate }}</p>
          <p class="actual-end-date" v-if="project.actualEndDate !== ''">Ngày hoàn thành: {{ project.actualEndDate }}</p>
          <p class="status">Trạng thái: {{ project.status }}</p>
          <p class="progress">Tiến độ: {{ project.progress }}%</p>
        </div>
      </div>

      <div v-if="showmodalCreateDepartmentProject" class="modal-overlay">
        <div class="modal-content">
            <h3>Tạo dự án mới</h3>
            <form @submit.prevent="handleCreateDepartmentProject()">
                <label for="projectName">Tên dự án:</label>
                <input type="text" v-model="newProject.projectName" id="projectName" required />
                
                <label for="description">Mô tả:</label>
                <textarea v-model="newProject.description" id="description" required></textarea>

                <label for="endDate">Ngày kết thúc:</label>
                <input type="date" v-model="newProject.endDate" id="endDate" required />

                <div class="modal-buttons">
                    <button type="submit">Lưu</button>
                    <button type="button" @click="showmodalCreateDepartmentProject = false">Hủy</button>
                </div>
            </form>
  </div>
</div>
    </div>
  </template>
  
<script setup>
    import API_ENDPOINTS from '@/api/api';
    import axios, { AxiosHeaders } from 'axios';
    import { onMounted, reactive, ref } from 'vue';
    
    const accountId = sessionStorage.getItem("accountId")
    const departmentName = sessionStorage.getItem("departmentName");
    const departmentId = sessionStorage.getItem("departmentId");
    const token = sessionStorage.getItem("token");
  
    const showmodalCreateDepartmentProject = ref(false);

    
    const departmentProjectResponse = reactive({
        data: []
    });

    const newProject = reactive({
        projectName: '',
        description: '',
        projectType: true, // hoặc false tùy thuộc vào giá trị mặc định
        createdDate:new Date(),
        startDate: '',
        endDate: '',
        status: 'Chuẩn bị',
        progress: 0,
        projectManagerId: accountId
    });

  
  const handlegetAllByDepartmentIdIdAndProjectType = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PROJECTBDP(departmentId), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log("get department project success");
        departmentProjectResponse.data = response.data.result;
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
        console.log('get department project  err', error);
    }
  };

  const handleCreateDepartmentProject = async () =>{
    try {
        const response = await axios.post(API_ENDPOINTS.CREATE_DEPARTMENTPROJECT(departmentId),newProject,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            console.log("create department project success")
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
        console.log('create department project  err', error);
    }
  }
  
  onMounted(() => {
    handlegetAllByDepartmentIdIdAndProjectType();
  });
  </script>
  
  <style scoped>
  .project-manager-content {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f4f4f9;
    border-radius: 8px;
  }
  
  .department-name {
    color: brown;
    font-weight: bold;
  }
  
  .create-project-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .create-project-button:hover {
    background-color: #0056b3;
  }
  
  .projects-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
  }
  
  .projects {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .project {
    background-color: white;
    padding: 15px;
    width: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .project-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .project-id, .created-date, .start-date, .end-date, .actual-end-date, .status, .progress {
    color: #666;
    font-size: 14px;
  }
  
  .project p {
    margin: 5px 0;
  }
  
  .project-name {
    color: #4CAF50;
  }
  
  .project-id, .created-date {
    color: #9E9E9E;
  }
  
  .project p {
    font-size: 14px;
  }
  
  .progress {
    font-weight: bold;
    color: #FF9800;
  }
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

label {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

input, select, textarea {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
}

textarea {
  height: 100px;
  resize: vertical;
}

input[type="date"] {
  font-size: 16px;
}

.select-wrapper {
  position: relative;
}

select {
  padding: 10px;
  margin-bottom: 15px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;
  font-size: 16px;
}

.modal-buttons button[type="button"] {
  background-color: #f44336;
}

.modal-buttons button:hover {
  opacity: 0.8;
}

.modal-buttons button[type="submit"]:hover {
  background-color: #0056b3;
}

.modal-buttons button[type="button"]:hover {
  background-color: #d32f2f;
}

input:focus, select:focus, textarea:focus {
  border-color: #007bff;
  outline: none;
}

input, select, textarea {
  transition: border-color 0.3s ease;
}

  </style>
  