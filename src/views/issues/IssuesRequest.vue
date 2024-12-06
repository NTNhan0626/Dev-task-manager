<template>
    <div class="container">
      <h1>Phát sinh trong công việc</h1>
  
      <!-- Danh sách yêu cầu -->
      <div v-if="!showForm">
        <h2>Danh Sách Yêu Cầu</h2>
        <button @click="toggleForm" class="add-button">Thêm Phát Sinh Mới</button>
        <table>
          <thead>
            <tr>
              <th>Tên Phát Sinh</th>
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
              <td>{{ issues.description }}</td>
              <td>{{ issues.status }}</td>
              <td>{{ issues.type }}</td>
              
              <td>{{ formatDate(issues.reportedDate) }}</td>
              <td>{{ formatDate(issues.resolvedDate) }}</td>
             
              <td>
                <button v-if="issues.type === 'tool'" @click="showToolIssuesDetail(index)">Xem chi tiết</button>
                <button v-if="issues.status === 'Pending'"
                @click.stop="openUseModal('Deleted'),issuesId = issues.issuesId"
                style="background-color: red;">Xóa</button>
                <button v-if="issues.status==='Approve' && issues.type ==='tool'"
                @click.stop="openUseModal('Returned'),issuesId =issues.issueId">Gửi trả</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  

      <!-- Modal for adding request -->
      <div v-if="showForm" class="modal-overlay" @click="toggleForm">
        <div class="modal-content" @click.stop>
          <h2>Thêm Yêu Cầu Mới</h2>
          <form @submit.prevent="handleCreateIssuesAndIssuesDetail">
            <div class="form-group">
              <label for="toolName">Tên yêu cầu:</label>
              <input id="toolName" type="text" v-model="issuesRequest.issueName">
            </div>
            <div class="form-group">
              <label for="description">Mô tả:</label>
              <input id="description" type="text" v-model="issuesRequest.description">
            </div>
            <div class="form-group">
              <label for="type">Loại yêu cầu:</label>
              <select id="type" v-model="issuesRequest.type">
                <option value="tool">Công Cụ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div class="form-group" v-if="issuesRequest.type ==='tool' && showAddTool ">
                
                <p v-for="tool in toolIssuesDetails">Công cụ: {{ tool.toolId }}  Số lượng: {{ tool.quantity }}</p>
                <div class="form-group">
                    <label for="toolName">Tên công cụ:</label>
                    <select v-model="toolIssuesDetailRequest.toolId" id="toolName" required>
                         <option v-for="tool in toolResponse.data" 
                                :value="tool.toolId" 
                                :key="tool.toolId">
                            {{ tool.toolName }}
                        </option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="number">Số lượng:</label>
                    <input id="number" type="number" v-model="toolIssuesDetailRequest.quantity">
                </div>
                <button type="button" @click.stop="addToolIssue">Thêm công cụ</button>
                <button type="button" @click.stop="showAddTool = false, toolIssuesDetailRequest.quantity = 0, toolIssuesDetailRequest.toolId = null;">Xong</button>

            </div>
            <div class="modal-buttons">
              <button type="submit">Thêm Yêu Cầu</button>
              <button type="button" @click="toggleForm">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- modal xem chi tiết issues -->
     <!-- modal xác nhận -->
    <div v-if="showModalToolIssuesDetail" class="modal-overlay">
          <div class="modal">
            <h2>Chi tiết yêu cầu</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Tên Công Cụ</th>
                        <th>Tổng Số Lượng</th>
                        
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in issuesResponse.data[issuesResponseIndex].toolIssuesDetailResponses" :key="index">
                        <td>{{ item.toolName }}</td>
                    
                        <td>{{ item.quantity }}</td>
                        
                    </tr>
                    </tbody>

                </table>
                <button @click="showModalToolIssuesDetail=false">Ok</button>
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
              <p style="font-weight: bold;" >Xác nhận trả các công cụ?</p>
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
  const showAddTool = ref(true)
  const router = useRoute()
  const taskId = router.params.taskId
  const projectId = router.params.projectId
  const loginAccountId = Number(sessionStorage.getItem("accountId"))
  const token = sessionStorage.getItem("token");
  const requests = reactive([]);
  const quantityUsed = ref(0)
  const toolIssuesDetailRequest = reactive({
    quantity: 0,
    toolId: null,
  });
  const toolIssuesDetails = reactive([]); // Mảng lưu các đối tượng toolIssuesDetailRequest

// Thêm công cụ vào mảng
const addToolIssue = () => {
    if (toolIssuesDetailRequest.toolId && toolIssuesDetailRequest.quantity > 0) {
        toolIssuesDetails.push({ ...toolIssuesDetailRequest }); // Thêm bản sao của đối tượng vào mảng
        // Reset lại form công cụ để chuẩn bị cho lựa chọn tiếp theo
        toolIssuesDetailRequest.quantity = 0;
        toolIssuesDetailRequest.toolId = null;
        
    } else {
        alert("Vui lòng chọn công cụ và nhập số lượng hợp lệ.");
    }
};
const issuesId = ref(null)
const issuesResponseIndex = ref(null)
const showModalToolIssuesDetail =ref(false)
const showToolIssuesDetail = (index) =>{
    issuesResponseIndex.value = index
    showModalToolIssuesDetail.value=true;
} 


const issuesRequest = reactive({
    issueName:"",
    description: projectId,
    status: 0,
    type: "",
    reportedDate: "",
    resolvedDate: "",
  });
  const toolResponse = reactive({
    data:[]
  })
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
    if (usesActionType.value === "Returned") {
      console.log("call hand approve tool project detail")
      await updateStatus("Returned")
      
      
    } else if (usesActionType.value === "Deleted") {
      console.log("call handleDelete issues project detail");
      await handleDeleteIssues()
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
      issuesRequest.status = st
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
    showAddTool.value = true
    showForm.value = !showForm.value;
    issuesRequest.status ="Pending"
    if (!showForm.value) resetForm();
  };
  
  
  const handleCreateIssuesAndIssuesDetail = async () => {
    try {
       showAddTool.value = true
       issuesRequest.reportedDate = new Date()
        const response = await axios.post(API_ENDPOINTS.CREATE_ISSUES_ISUESDETAIL(loginAccountId,taskId),{
        issuesRequest:issuesRequest,
        toolIssuesDetailRequestList:toolIssuesDetails
      },{
        headers: {
                  'Authorization': `Bearer ${token}`
              }
      })
      if(response.status === 200){
        console.log("create issues and issues detail success")
        handleGetAllIssuesInTask()
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
          console.log('create issues and issues detail err', error);
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
              
              handleGetAllIssuesInTask()
              
  
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
    issuesRequest.description = ""
    issuesRequest.issueName=""
    issuesRequest.reportedDate=""
    issuesRequest.resolvedDate=""
    issuesRequest.status=""
    issuesRequest.type=""
    
  };
  
  const handleGetAllIssuesInTask = async () =>{
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALLISSUESINTASK(taskId),{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
        if(response.status === 200){
          console.log("get all issues in task success")
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
          console.log('get all issues in task err', error);
      }
    }
  
    const handleDeleteIssues = async () =>{
      try {
        const response = await axios.delete(API_ENDPOINTS.DELETED_ISSUES(issuesId.value),{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
        if(response.status === 200){
          console.log("delete isues success")
          handleGetAllIssuesInTask()
          
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
          console.log('delete issues  err', error);
      }
    }
  
  onMounted( async () => {
    await handleGetAllTool()
    await handleGetAllIssuesInTask();
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
  