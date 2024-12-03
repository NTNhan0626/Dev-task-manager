<template>
  <div class="container">
    <h1>Quản Lý Yêu Cầu Mượn Công Cụ</h1>

    <!-- Danh sách yêu cầu -->
    <div v-if="!showForm">
      <h2>Danh Sách Yêu Cầu</h2>
      <button @click="toggleForm" class="add-button">Thêm Yêu Cầu Mới</button>
      <table>
        <thead>
          <tr>
            <th>Tên Công Cụ</th>
            <th>Tên Dự Án</th>
            <th>Số Lượng</th>
            <th>Ngày Cấp</th>
            <th>Ngày Trả Lại</th>
            <th>Trạng Thái</th>
           
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in toolsProjectDetailResponse.data" :key="index">
            <td>{{ item.toolName }}</td>
            <td>{{ item.projectName }}</td>
            <td>{{ item.totalQuantity }}</td>
            <td>{{ formatDate(item.allocatedDate) }}</td>
            <td>{{ formatDate(item.returnDate) }}</td>
            <td>{{ item.status }}</td>
            <td>
              <button v-if="item.status ==='Pending'" @click.stop="openUseModal('Deleted'),toolProjectDetailId =item.toolProjectDetailId " style="background-color: red;">Xóa</button>
              <button v-if="((totalToolsInProject.find(totalTool => totalTool.toolName === item.toolName)?.totalQuantity)-quantityUsed >= item.totalQuantity) && item.status ==='Approve'" 
              @click.stop="openUseModal('Returned'),toolProjectDetailId =item.toolProjectDetailId">Gửi trả</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- danh sách công cụ trong dự án -->
    <div v-if="!showForm">
      <h2>Danh sách công cụ trong dự án</h2>
      <table>
        <thead>
          <tr>
            <th>Tên Công Cụ</th>
            <th>Tổng Số Lượng</th>
            <th>Số Lượng Đã Cấp</th>
            <th>Số lượng còn lại</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in totalToolsInProject" :key="index">
            <td>{{ item.toolName }}</td>
        
            <td>{{ item.totalQuantity }}</td>
            <td>{{ quantityUsed }}</td>
            <td>{{item.totalQuantity - quantityUsed }}</td>
            
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Modal for adding request -->
    <div v-if="showForm" class="modal-overlay" @click="toggleForm">
      <div class="modal-content" @click.stop>
        <h2>Thêm Yêu Cầu Mới</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="toolName">Tên công cụ:</label>
            <select v-model="toolProjectDetailRequest.toolId" id="toolName" required>
              <option v-for="tool in toolResponse.data" 
                      :value="tool.toolId" 
                      :key="tool.toolId">
                {{ tool.toolName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="totalQuantity">Số Lượng:</label>
            <input v-model.number="toolProjectDetailRequest.totalQuantity" id="totalQuantity" type="number" required />
          </div>
          <div class="modal-buttons">
            <button type="submit">Thêm Yêu Cầu</button>
            <button type="button" @click="toggleForm">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- modal xác nhận -->
  <div v-if="isUseModalVisible" class="modal-overlay">
        <div class="modal">
            <h2 v-if="usesActionType === 'Deleted'">Xóa yêu cầu </h2>
            <h2 v-if="usesActionType === 'Returned'">Trả các các công cụ trong yêu cầu</h2>

            <!-- Nội dung modal thay đổi theo action -->
            <div v-if="usesActionType === 'Deleted'">
            <p style="font-weight: bold;" >Xác nhận xóa yêu cầu đã gửi?</p>
            </div>
            <div v-if="usesActionType === 'Returned'">
            <p style="font-weight: bold;" >Xác trả các công cụ?</p>
            </div>
            <div class="form-actions" >
                <button class="btn-confirm" @click.stop="submitAction">Xác nhận</button>
                <button class="btn-cancel" @click.stop="closeUseModal">Hủy</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import API_ENDPOINTS from "@/api/api";
import axios from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
const router = useRoute()

const projectId = router.params.projectId
const token = sessionStorage.getItem("token");
const requests = reactive([]);
const quantityUsed = ref(0)
const toolProjectDetailRequest = reactive({
  toolId:"",
  projectId: projectId,
  totalQuantity: 0,
  returnDate: "",
  status: "",
});
const toolResponse = reactive({
  data:[]
})
const toolsProjectDetailResponse = reactive({
  data:[]
})

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

console.log(toolsProjectDetailResponse.data)

// Tạo nhóm dữ liệu bằng computed
const groupedTools = computed(() => {
  
  return toolsProjectDetailResponse.data.reduce((acc, { toolName, status, totalQuantity }) => {
    const key = `${toolName} - ${status}`;
    if (!acc[key]) {
      acc[key] = { toolName, status, totalQuantity: 0 };
    }
    acc[key].totalQuantity += totalQuantity;
    return acc;
  }, {});
  

});

// Lấy giá trị từ groupedTools
const totalToolsInProject = computed(() => Object.values(groupedTools.value).filter(tool => tool.status ==='Approve'));

//modal dùng chung
const usesActionType = ref('')
const isUseModalVisible = ref(false)
const openUseModal = (type) => {
  usesActionType.value = type;
  isUseModalVisible.value = true;
};
const submitAction = async () => {
  if (usesActionType.value === "Returned") {
    console.log("call hand approve tool project detail")
    await updateStatus("Returned")
    
    
  } else if (usesActionType.value === "Deleted") {
    console.log("call hand rệct tool project detail");
    await handleDeleteToolProjectDetail()
  }
  closeUseModal(); // Đóng modal sau khi xử lý
};
const closeUseModal = () => {
  isUseModalVisible.value = false;
};
const status = ref("")
const toolProjectDetailId = ref(null)
const updateStatus = async (st) =>{
    status.value = st
    toolProjectDetailRequest.status = st
    if(status.value === 'Returned'){
        toolProjectDetailRequest.returnDate = new Date()
    }
    console.log(toolProjectDetailRequest.allocatedDate)
    console.log(status.value)
    await handleUpdateToolProjectDetail()
    status.value = ""
    toolProjectDetailId.value = ""
}

const handleGetAllTool = async() => {
    try {
        const respone = await axios.get(API_ENDPOINTS.GETALL_TOOL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log("get all tool success")
            toolResponse.data = respone.data.result

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
        console.log('get all tool err', error);
    }
}
const showForm = ref(false);

const toggleForm = () => {
  showForm.value = !showForm.value;
  toolProjectDetailRequest.status ="Pending"
  if (!showForm.value) resetForm();
};

const handleSubmit = async () => {
  try {
    const response = await axios.post(API_ENDPOINTS.CREATE_TOOLPROJECTDETAILINPROJECT,toolProjectDetailRequest,{
      headers: {
                'Authorization': `Bearer ${token}`
            }
    })
    if(response.status === 200){
      console.log("create tool project detail success")
      handleGetToolProjectDetailInProject()
      showForm.value =false
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
        console.log('create tool project detail err', error);
  }
};

const handleUpdateToolProjectDetail = async() =>{
    try {
        
        console.log(toolProjectDetailRequest)
        const respone = await axios.put(API_ENDPOINTS.UPDATE_TOOLPRPOJECTDETAIL(toolProjectDetailId.value),toolProjectDetailRequest,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('update tool success')
            
            handleGetToolProjectDetailInProject()
            

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
        console.log('update tool  err', error);
    }
}


const resetForm = () => {
  
  toolProjectDetailRequest.totalQuantity = 0;
  
  toolProjectDetailRequest.returnDate = "";
  toolProjectDetailRequest.status = "";
};

const handleGetToolProjectDetailInProject = async () =>{
    try {
      const response = await axios.get(API_ENDPOINTS.GET_TOOLPROJECTDETAILINPROJECT(projectId),{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      if(response.status === 200){
        console.log("get tool project detail in project success")
        toolsProjectDetailResponse.data = response.data.result
        console.log(toolsProjectDetailResponse.data)
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
        console.log('get tool project detail in project err', error);
    }
  }

  const handleDeleteToolProjectDetail = async () =>{
    try {
      const response = await axios.delete(API_ENDPOINTS.DELETED_TOOLPROJECTDETAIL(toolProjectDetailId.value),{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      if(response.status === 200){
        console.log("delete tool project detail in project success")
        handleGetToolProjectDetailInProject()
        
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
        console.log('delete tool project detail in project err', error);
    }
  }

onMounted( async () => {
  await handleGetAllTool()
  await handleGetToolProjectDetailInProject();
});
</script>

<style scoped>
body {
  font-family: 'Open Sans', sans-serif;
  margin: 20px;
  background-color: #f9f9f9;
}

h1 {
  font-size: 28px;
  color: #4CAF50;
  text-align: center;
}

h2 {
  font-size: 20px;
  color: #555;
}

.add-button {
  display: block;
  width: 200px;
  margin: 0 auto 20px;
  padding: 10px 20px;
  background: linear-gradient(to right, #4CAF50, #2e7d32);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.add-button:hover {
  background: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 15px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  color: #333;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
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
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #f44336;
}

button[type="button"]:hover {
  background-color: #e53935;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

select, input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.tool-management {
    font-family: Arial, sans-serif;
    margin: 20px;
}

.tool-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.tool-table th,
.tool-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

.tool-table th {
    background-color: #f4f4f4;
}



button:hover {
    background-color: #0056b3;
}

/* Modal Styles */
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

</style>
