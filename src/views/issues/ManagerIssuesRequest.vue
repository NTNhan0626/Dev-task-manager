<template>
    <div class="tool-management">
      <h1>Danh sách các phát sinh trong dự án:</h1>  
       
      <!-- Tool List Table -->
      <table class="tool-table">
        <thead>
          <tr>
            <th>Tên Phát Sinh</th>
            <th>Công việc phát sinh</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Loại phát sinh</th>
            <th>Ngày gửi</th>
            <th>Ngày phản hồi</th>
          
          </tr>
        </thead>
        <tbody>
          <tr v-for="(issues, index) in issuesResponse.data" :key="index">
              <td>{{ issues.issueName }}</td>
              <td>{{ issues.taskName }}</td>
              <td>{{ issues.description }}</td>
              <td>{{ issues.status }}</td>
              <td>{{ issues.type }}</td>
              <td>{{ formatDate(issues.reportedDate) }}</td>
              <td>{{ formatDate(issues.resolvedDate) }}</td>
              <td v-if="issues.status==='Pending'">
                <button v-if="issues.type === 'tool'" @click="showToolIssuesDetail(index)">Xem chi tiết</button>
                <button   
                @click.stop="openUseModal('Approve'),issuesId = issues.issuesId"
                style="background-color: red;">Duyệt</button>
                <button 
                @click.stop="openUseModal('Reject'),issuesId =issues.issueId">Không duyệt</button>
              </td>
            </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isUseModalVisible" class="modal-overlay">
        <div class="modal">
            <h2 v-if="usesActionType === 'Approve'">Duyệt phát sinh </h2>
            <h2 v-if="usesActionType === 'Reject'">Không duyệt phát sinh</h2>

            <!-- Nội dung modal thay đổi theo action -->
            <div v-if="usesActionType === 'Approve'">
            <p style="font-weight: bold;" >Xác nhận duyệt các phát sinh?</p>
            </div>
            <div v-if="usesActionType === 'Reject'">
            <p style="font-weight: bold;" >Xác nhận không duyệt các phát sinh?</p>
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
  
const token = sessionStorage.getItem("token")
const route = useRoute()
const projectId = route.params.projectId;
const issuesId = ref(null)
const status = ref("")
const issuesResponse = reactive({
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
  

//modal dùng chung
const usesActionType = ref('')
const isUseModalVisible = ref(false)
const openUseModal = (type) => {
  usesActionType.value = type;
  isUseModalVisible.value = true;
};
const submitAction = async () => {
  if (usesActionType.value === "Approve") {
    console.log("call handleupdate issues")
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


const handleGetAllIssuesInProject = async () =>{
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALLISSUESINPROJECT(projectId),{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
        if(response.status === 200){
          console.log("get all issues in project success")
          issuesResponse.data = response.data.result
          console.log(issuesResponse.data)
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
          console.log('get all issues in project err', error);
      }
    }

const issuesRequest = reactive({
    issueName:"",
    description: projectId,
    status: 0,
    type: "",
    reportedDate: "",
    resolvedDate: "",
  });
const updateStatus = async (st) =>{
    status.value = st
    issuesRequest.status = st
    if(status.value === 'Approve'){
      issuesRequest.resolvedDate = new Date()
    }
    
    await handleUpdateIssues()
    status.value = ""
    issuesId.value = null
}

const handleUpdateIssues = async() =>{
    try {
        const respone = await axios.put(API_ENDPOINTS.UPDATE_ISSUES(issuesId.value),issuesRequest,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('update issues success')
            handleGetAllIssuesInProject()
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
  handleGetAllIssuesInProject()
    
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
  