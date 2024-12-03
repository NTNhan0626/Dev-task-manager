<template>
    <div class="project-manager-content">
      <h3>Các dự án cá có tham gia:</h3>

      <p class="projects-title">Các dự án phòng ban:</p>
      <div class="projects">
        <div class="project" v-for="project in departmentalProject" :key="project.projectId" @click="showProjectAction === project.projectId? showProjectAction=null:showProjectAction=project.projectId">
          <p class="project-name">{{ project.projectName }}</p>
          <p class="project-id">Mã dự án: {{ project.projectId }}</p>
          <p class="created-date">Ngày tạo: {{ project.createdDate }}</p>
          <p class="start-date" v-if="project.startDate !== ''">Ngày bắt đầu: {{ project.startDate }}</p>
          <p class="end-date">Ngày kết thúc: {{ project.endDate }}</p>
          <p class="actual-end-date" v-if="project.actualEndDate !== ''">Ngày hoàn thành: {{ project.actualEndDate }}</p>
          <p class="status">Trạng thái: {{ project.status }}</p>
          <p class="progress">Tiến độ: {{ project.progress }}%</p>

          <div class="project-action" v-if="showProjectAction === project.projectId">
            <button><RouterLink :to="{
                name:'task',
                params: { projectId: project.projectId }
            }">Công việc</RouterLink></button>
          </div>

        </div>
      </div>

      <p class="projects-title">Các dự án liên phòng ban:</p>
      <div class="projects">
        <div class="project" v-for="project in interDepartmentalProject" :key="project.projectId" @click="showProjectAction === project.projectId? showProjectAction=null:showProjectAction=project.projectId">
          <p class="project-name">{{ project.projectName }}</p>
          <p class="project-id">Mã dự án: {{ project.projectId }}</p>
          <p class="created-date">Ngày tạo: {{ project.createdDate }}</p>
          <p class="start-date" v-if="project.startDate !== ''">Ngày bắt đầu: {{ project.startDate }}</p>
          <p class="end-date">Ngày kết thúc: {{ project.endDate }}</p>
          <p class="actual-end-date" v-if="project.actualEndDate !== ''">Ngày hoàn thành: {{ project.actualEndDate }}</p>
          <p class="status">Trạng thái: {{ project.status }}</p>
          <p class="progress">Tiến độ: {{ project.progress }}%</p>

          <div class="project-action" v-if="(showProjectAction === project.projectId && accountId !==project.projectManagerId)">
            <button><RouterLink :to="{
                name:'interdepartmental-task',
                params: { projectId: project.projectId }
            }">Công việc</RouterLink></button>
          </div>

          <div class="project-action" v-if="(showProjectAction === project.projectId && accountId === project.projectManagerId)" >
            <button><RouterLink :to="{
              name:'project-detail',
              params:{projectId:project.projectId}
            }">Chi tiết</RouterLink></button>
            <button @click="openEmployeeSelectionModal(index,project.projectId)">Chọn nhân viên</button>
            <button v-if="project.projectCondition === 'Active'" @click.stop="openUseModal('pausedProject',project.projectId)">Tạm dừng</button>
            <button v-if="project.projectCondition === 'Paused'" @click.stop="openUseModal('continuedProject',project.projectId)">Tiếp tục</button>
            <button @click.stop="openUseModal('cancelledProject',project.projectId)">Hủy</button>
          </div>

        </div>
      </div>
  </div>
</template>
  
<script setup>
  import API_ENDPOINTS from '@/api/api';
  import axios, { AxiosHeaders } from 'axios';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { RouterLink } from 'vue-router';

    
const accountId = Number(sessionStorage.getItem("accountId"))
const departmentName = sessionStorage.getItem("departmentName");
const departmentId = sessionStorage.getItem("departmentId");
const token = sessionStorage.getItem("token");
const selectedProjectId = ref(null)
const showProjectAction = ref(null)
const projectResponse = reactive({
    data:[]
})

const departmentalProject = computed(() =>{
  return projectResponse.data.filter((project) => project.projectType === true )
}) 


const interDepartmentalProject = computed(() =>{
  return projectResponse.data.filter((project) => project.projectType === false )
}) 


const handlegetAllByAccountId = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PROJECTBAC(accountId), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log("get project by ac success");
        projectResponse.data = response.data.result;
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
        console.log('get project by ac  err', error);
    }
  };

  onMounted(() => {
    handlegetAllByAccountId();
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

/* Modal Chọn nhân viên */
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
  width: 600px;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f9;
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


</style>
  