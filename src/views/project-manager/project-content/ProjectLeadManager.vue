<template>
    <div class="project-manager-content">
      <h3><span> Dự án liên phòng ban </span></h3> 
      <button class="create-project-button" @click.self="showmodalCreateInterDepartmentalProject = true" >Tạo dự án liên phòng ban</button>
      <p class="projects-title">Các dự án hiện tại:</p>
      <div class="projects">
      <div  v-for="(project,index) in interDepartmentalProjectResponse.data" :key="project.projectId"  >
        <div class="project"
        @click.self="showProjectAction === project.projectId? showProjectAction=null:showProjectAction=project.projectId"
        v-if="accountId === project.createrId ">
          <p class="project-name">{{ project.projectName }}</p>
          <p class="project-id">Mã dự án: {{ project.projectId }}</p>
          <p class="created-date">Ngày tạo: {{ formatDate(project.createdDate) }}</p>
          <p class="start-date">Ngày bắt đầu:{{ formatDate(project.startDate) }}</p>
          <p class="end-date">Ngày kết thúc: {{ formatDate(project.endDate) }}</p>
          <p class="actual-end-date">Ngày hoàn thành: {{ formatDate(project.actualEndDate) }}</p>
          <p class="status">Trạng thái: {{ project.status }}</p>
          <p class="status">Tình trạng: {{ project.projectCondition }}</p>
          <p class="progress">Tiến độ: {{ project.progress }}%</p>

          <div class="project-action" v-if="showProjectAction === project.projectId">
            <button><RouterLink :to="{
              name:'project-detail',
              params:{projectId:project.projectId}
            }">Chi tiết</RouterLink></button>
            <button @click="openEmployeeSelectionModal(index,project.projectId)">Chọn nhân viên</button>
            <button v-if="project.projectCondition === 'Active'" @click.stop="openUseModal('pausedProject',project.projectId)">Tạm dừng</button>
            <button v-if="project.projectCondition === 'Paused'" @click.stop="openUseModal('continuedProject',project.projectId)">Tiếp tục</button>
            <button @click.stop="openUseModal('cancelledProject',project.projectId)">Hủy</button>
          </div>
          
          <div v-if="isUseModalVisible === project.projectId" class="modal-overlay">
            <div class="modal">
                <h2 v-if="usesActionType === 'pausedProject'">Tạm dừng dự án "{{ project.projectName }}"</h2>
                <h2 v-if="usesActionType === 'continuedProject'">Tiếp tục dự án "{{ project.projectName }}"</h2>
                <h2 v-if="usesActionType === 'cancelledProject'">Hủy dự án "{{ project.projectName }}"</h2>
                <!-- Nội dung modal thay đổi theo action -->
                <div v-if="usesActionType === 'pausedProject'">
                  <p style="font-weight: bold;" >bạn chắc chắn muốn tạm dừng ?</p>
                </div>
                <div v-if="usesActionType === 'continuedProject'">
                  <p style="font-weight: bold;" >bạn chắc chắn muốn tiếp tục dự án ?</p>
                </div>
                <div v-if="usesActionType === 'cancelledProject'">
                  <p style="font-weight: bold;" >bạn chắc chắn hủy dự án?</p>
                </div>
                <div class="form-actions">
                  <button class="btn-confirm" @click.stop="submitAction(project.projectId)">Xác nhận</button>
                  <button class="btn-cancel" @click.stop="closeUseModal(project.projectId)">Hủy</button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>

      <div v-if="showmodalCreateInterDepartmentalProject" class="modal-overlay">
        <div class="modal-content">
            <h3>Tạo dự án liên phòng ban mới</h3>
            <form @submit.prevent.stop="handleCreateInterDepartmentalProject()">
                <label for="projectName">Tên dự án:</label>
                <input type="text" v-model="interDepartmentalProjectRequest.projectName" id="projectName" required />
                
                <label for="description">Mô tả:</label>
                <textarea v-model="interDepartmentalProjectRequest.description" id="description" required></textarea>

                <label for="endDate">Ngày kết thúc:</label>
                <input type="date" v-model="interDepartmentalProjectRequest.endDate" id="endDate" required />
                <label for="projectManagerId">Người phụ trách:</label>
                <select v-model="interDepartmentalProjectRequest.projectManagerId" id="projectManagerId">
                    <option v-for="account in accountsResponse.data" :key="account.accountId" :value="account.accountId" style="color: black;">{{ account.username }}</option>
                </select>

                <p>{{ interDepartmentalProjectRequest.departmentIds }}</p>
                <label v-for="department in departmentsResponse.data" :key="department.departmentId" style="display: flex;">
                    <div>Phòng ban:{{ department.departmentName }}</div>
                    <input type="checkbox"  :value="department.departmentId"  v-model="interDepartmentalProjectRequest.departmentIds">
                </label>

                <div class="modal-buttons">
                    <button type="submit">Lưu</button>
                    <button type="button" @click.stop="showmodalCreateInterDepartmentalProject = false">Hủy</button>
                </div>
            </form>
        </div>
      </div>
      
      <div v-if="showEmployeeSelectionModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Chọn nhân viên tham gia dự án</h3>
          <div class="select-department">
            <label>
                Phòng ban:
                <select v-model="selectedDepartmentId">
                    <option v-for="department in interDepartmentalProjectResponse.data[indexProject].projectDepartmentDetailResponses" :value="department.departmentId">{{department.departmentName}}</option>
                </select>
            </label>
          </div>
            
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Tên nhân viên</th>
                <!-- <th>Chức vụ</th> -->
                <!-- <th>Bằng cấp</th> -->
                <th>Chuyên môn</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees.data" :key="employee.username">
                <td>
                  <input type="checkbox" v-model="selectedEmployees" :value="employee.accountId" />
                </td>
                <td>{{ employee.username }}</td>
                <!-- <td>{{ employee.position }}</td>
                <td>{{ employee.degree }}</td> -->
                <td>{{ employee.specializations }}</td>
                <td>{{ employee.statusProject }}</td>
                
              </tr>
            </tbody>
          </table>

          <div class="modal-buttons">
            <button type="button" @click="addEmployeesToProject">Gửi yêu cầu</button>
            <button type="button" @click="showEmployeeSelectionModal = false">Hủy</button>
          </div>
        </div>
      </div>
  </div>
</template>
  
<script setup>
  import API_ENDPOINTS from '@/api/api';
  import axios, { AxiosHeaders } from 'axios';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { RouterLink } from 'vue-router';
    
    const accountId = Number(sessionStorage.getItem("accountId"))
    const departmentName = sessionStorage.getItem("departmentName");
    const departmentId = sessionStorage.getItem("departmentId");
    const token = sessionStorage.getItem("token");
    const selectedProjectId = ref(null)
    const showmodalCreateInterDepartmentalProject = ref(false);
    const indexProject = ref(null)

    const showProjectAction = ref(null)
    
    const employees = reactive({
      data:[]
    }); // Danh sách nhân viên trong phòng ban
    const selectedEmployees = ref([]); // Mảng chứa các nhân viên được chọn
    const showEmployeeSelectionModal = ref(false); // Hiển thị modal chọn nhân viên


    const interDepartmentalProjectResponse = reactive({
        data: []
    });
    

    // id của phòng được chọn để thêm nhan viên
    const selectedDepartmentId = ref(null)

    watch(selectedDepartmentId,(newValue,oldValue) =>{
        if(newValue){
            handleGetEmployeesInDepartment(newValue)
        }
    })
    // danh sách tất cả nhân viên dùng để chỉ đinjh người quản lí 
    const accountsResponse = reactive({ 
        data:[]
    })
    //danh sách tất cả phòng ban để chọn phònh ban tham gia dự án
    const departmentsResponse = reactive({

    })

    const interDepartmentalProjectRequest = reactive({
        projectName: '',
        description: '',
        projectType: false, // hoặc false tùy thuộc vào giá trị mặc định true là dự án phongf ban 
        createdDate:new Date(),
        startDate: '',
        endDate: '',
        status: 'Pending',
        progress: 0,
        projectManagerId: null,
        departmentIds: [],
        createrId: Number (accountId),
        projectCondition:'Active'
    });

  
  const handlegetInterDepartmentalProject = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_INTERDEPARTMENTALPROJECT, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log("get inter department project success");
        interDepartmentalProjectResponse.data = response.data.result;
        console.log(interDepartmentalProjectResponse.data)
       
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
        console.log('get inter department project  err', error);
    }
  };

const handleCreateInterDepartmentalProject = async () =>{
    try {
        const response = await axios.post(API_ENDPOINTS.CREATE_INTERDEPARTMENTALPROJECT,interDepartmentalProjectRequest,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            console.log("create inter department project success")
            handlegetInterDepartmentalProject()
            console.log(response.data.result)
            showmodalCreateInterDepartmentalProject.value=false
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
        console.log('create inter department project  err', error);
    }
  }

  const handleDepartmentGet = async ()=>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENT)
        if(response.status === 200 ){
            console.log('get department success')
            departmentsResponse.data = response.data.result
           
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
        console.log('get department err', error);
    }
    
    
}

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

  // Lấy danh sách nhân viên từ backend
const handleGetEmployeesInDepartment = async (departmentId) => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_EMPLOYEESINDEPARTMENTNOTINPROJECT(selectedProjectId.value,departmentId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      console.log("get account in department success")
      employees.data = response.data.result // Cập nhật danh sách nhân viên
      console.log(employees.data)
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
        console.log('get account  err', error);
  }
};

// Hàm thêm nhân viên vào dự án
const addEmployeesToProject = async () => {
  try {
    const response = await axios.post(API_ENDPOINTS.CREATE_INTERDEPARTMENTALPROJECTDETAIL(selectedProjectId.value),
      selectedEmployees.value
    , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      console.log("Nhân viên đã được thêm vào dự án.");
      showEmployeeSelectionModal.value = false; // Đóng modal sau khi thêm thành công
      selectedProjectId.value =null
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
        console.log('create project detail err', error);
  }
};
const handleGetAccount = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GETACCOUNT)
       
        if(response.status === 200){
           
            console.log("get account success")
            accountsResponse.data = response.data.result
            console.log(accountsResponse.data)
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
        console.log('get acounsts err', error);
    }
    
}

// Mở modal khi nhấn "Chọn nhân viên"
const openEmployeeSelectionModal = (index,projectId) => {
  showEmployeeSelectionModal.value = true;
  indexProject.value = index
  selectedProjectId.value = projectId

  
};
//modal dùng chung
const openUseModal = (type,projectId) => {
  usesActionType.value = type;
  
  isUseModalVisible.value = projectId;
};

// Đóng modal
const closeUseModal = () => {
  isUseModalVisible.value = false;
};
const usesActionType = ref('')
const isUseModalVisible = ref(false)

// project pause requets 
const projectUpdatesPauseProject = reactive({
  projectCondition :'Paused',
    
  });
// project canceld requets 
const projectUpdateCancelledProject = reactive({
  projectCondition :'Canceled',
    
  });
// project continued requets 
const projectUpdateContinuedProject = reactive({
  projectCondition :'Active',
    
  });
  

// Xử lý hành động xác nhận
const submitAction = async (projectId) => {
  if (usesActionType.value === "pausedProject") {
    console.log("call handlePausedProject")
    await handlePausedProject(projectId)
    handlegetInterDepartmentalProject()
    
    
  } else if (usesActionType.value === "cancelledProject") {
    console.log("call handleProjectCancelled");
    
    await handleProjectCancelled(projectId)
    handlegetInterDepartmentalProject()
    
  } else if (usesActionType.value === "continuedProject") {
    console.log("call handleProjectContinued");
    
    await handleProjectContinued(projectId)
    handlegetInterDepartmentalProject()
    
  }

  closeUseModal(); // Đóng modal sau khi xử lý
};
const handlePausedProject = async(projectId) =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROJECT(projectId),projectUpdatesPauseProject,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("pause project success")
     
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
        console.log('pause project  err', error);
  }
}

const handleProjectCancelled = async(projectId) =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROJECT(projectId),projectUpdateCancelledProject,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("cancelled project success")
      handleDeletedTaskInProjectIsCanceled(response.data.result.taskParentId)
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
        console.log('cancelled project  err', error);
  }
}

const handleDeletedTaskInProjectIsCanceled = async (taskParentId) =>{
    try {
        const respone = await axios.delete(API_ENDPOINTS.DELETE_TASK(Number(taskParentId)),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('deleted task success')
           
            
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
        console.log('deleted task err', error);
    }
}
const handleProjectContinued = async(projectId) =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROJECT(projectId),projectUpdateContinuedProject,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("continued project success")
     
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
        console.log('continued project  err', error);
  }
}

  
onMounted(() => {
    handlegetInterDepartmentalProject();
    handleGetAccount();
    handleDepartmentGet();
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
  text-align: center;
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
td {
  text-align: center; /* Căn giữa nội dung trong ô */
  vertical-align: middle; /* Đảm bảo nội dung căn giữa theo chiều dọc */
}

input[type="radio"] {
  display: inline-block;
  vertical-align: middle; /* Căn giữa so với dòng chữ */
  margin: 0; /* Loại bỏ khoảng cách thừa */
}

</style>
  