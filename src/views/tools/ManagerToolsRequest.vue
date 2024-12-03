<template>
    <div class="tool-management">
      <h1>Danh sách các yêu cầu cấp công cụ:</h1>  
       
      <!-- Tool List Table -->
      <table class="tool-table">
        <thead>
          <tr>
            <th>Tên công cụ</th>
            <th>Loại công cụ</th>
            <th>Dự án yêu cầu</th>
            <th>Số lượng yêu cầu</th>
            <th>Trạng thái</th>
          
          </tr>
        </thead>
        <tbody>
          <tr v-for="toolProjectDetail in toolProjectDetailResponse.data" :key="toolProjectDetail.toolProjectDetailId">
            <td>{{ toolProjectDetail.toolName }}</td>
            <td>{{ toolProjectDetail.toolType }}</td>
            <td>{{ toolProjectDetail.projectName }}</td>
            <td>{{ toolProjectDetail.totalQuantity }}</td>
            <td>{{ toolProjectDetail.status }}</td>
            <td v-if="toolProjectDetail.status ==='Pending'"> 
                <!-- updateStatus('Approve',toolProjectDetail.toolProjectDetailId) -->
              <button  @click.stop="openUseModal('Approve') ,toolProjectDetailId = toolProjectDetail.toolProjectDetailId" >Duyệt</button>
              <button  style="color: red;" @click.stop="openUseModal('Reject') ,toolProjectDetailId = toolProjectDetail.toolProjectDetailId">Không duyệt</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isUseModalVisible" class="modal-overlay">
        <div class="modal">
            <h2 v-if="usesActionType === 'Approve'">Duyệt các công cụ </h2>
            <h2 v-if="usesActionType === 'Reject'">Không duyệt các công cụ</h2>

            <!-- Nội dung modal thay đổi theo action -->
            <div v-if="usesActionType === 'Approve'">
            <p style="font-weight: bold;" >Xác nhận duyệt các công cụ?</p>
            </div>
            <div v-if="usesActionType === 'Reject'">
            <p style="font-weight: bold;" >Xác nhận không duyệt các công cụ?</p>
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
  
const token = sessionStorage.getItem("token")

  // State for tools
const toolProjectDetailResponse = reactive({
    data:[]
})
const status = ref("")
const toolProjectDetailId = ref(null)

const toolProjectDetailRequest = reactive({
    status:"",    
    allocatedDate:""

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
  

//modal dùng chung
const usesActionType = ref('')
const isUseModalVisible = ref(false)
const openUseModal = (type) => {
  usesActionType.value = type;
  isUseModalVisible.value = true;
};
const submitAction = async () => {
  if (usesActionType.value === "Approve") {
    console.log("call hand approve tool project detail")
    await updateStatus("Approve")
    
    
  } else if (usesActionType.value === "Reject") {
    console.log("call hand rệct tool project detail");
    await updateStatus("Reject")
  }
  closeUseModal(); // Đóng modal sau khi xử lý
};
const closeUseModal = () => {
  isUseModalVisible.value = false;
};


const handleGetAllToolProjectDetail = async() => {
    try {
        const respone = await axios.get(API_ENDPOINTS.GET_ALL_TOOLPROJECTDETAIL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log("get all tool project detail success")
            toolProjectDetailResponse.data = respone.data.result

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
        console.log('get all tool projec detail err', error);
    }
}
const updateStatus = async (st) =>{
    status.value = st
    toolProjectDetailRequest.status = st
    if(status.value === 'Approve'){
        toolProjectDetailRequest.allocatedDate = new Date()
    }
    console.log(toolProjectDetailRequest.allocatedDate)
    console.log(status.value)
    await handleUpdateToolProjectDetail()
    status.value = ""
    toolProjectDetailId.value = ""
}

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
            
            handleGetAllToolProjectDetail()
            

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

onMounted(()=>{
    handleGetAllToolProjectDetail()
    
})
</script>
  
<style scoped>
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

button {
    margin-right: 5px;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
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
  