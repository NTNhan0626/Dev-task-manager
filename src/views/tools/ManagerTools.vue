<template>
    <div class="tool-management">
      <h1>Quản lý công cụ</h1>  
        <!-- Button to open Create Tool Modal -->
        <button @click="openCreateToolModal">Thêm công cụ mới</button>

      <!-- Tool List Table -->
      <table class="tool-table">
        <thead>
          <tr>
            <th>Tên công cụ</th>
            <th>Mô tả</th>
            <th>Loại công cụ</th>
            <th>Số lượng</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in toolResponse.data" :key="tool.toolId">
            <td>{{ tool.toolName }}</td>
            <td>{{ tool.description }}</td>
            <td>{{ tool.toolType }}</td>
            <td>{{ tool.quantityAvailable }}</td>
            <td>{{ formatDate(tool.createdDate) }}</td>
            <td>{{ formatDate(tool.updatedDate) }}</td>
            <td>
              <button @click="viewTool(tool)">Xem</button>
              <button @click="editTool(tool)">Chỉnh sửa</button>
              <button @click="deleteTool(tool.toolId)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Tool Detail Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Chi tiết công cụ</h2>
          <p><strong>Tên công cụ:</strong> {{ selectedTool.toolName }}</p>
          <p><strong>Mô tả:</strong> {{ selectedTool.description }}</p>
          <p><strong>Loại công cụ:</strong> {{ selectedTool.toolType }}</p>
          <p><strong>Số lượng:</strong> {{ selectedTool.quantityAvailable }}</p>
          <p><strong>Ngày tạo:</strong> {{ formatDate(selectedTool.createdDate) }}</p>
          <p><strong>Ngày cập nhật:</strong> {{ formatDate(selectedTool.updatedDate) }}</p>
          <button @click="showModal = false">Đóng</button>
        </div>
      </div>
    </div>

        <!-- Tool Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
        <div class="modal-content">
            <h2>Thêm công cụ mới</h2>
            <form @submit.prevent="handleCrateTool">
            <div>
                <label for="toolName">Tên công cụ:</label>
                <select v-model="toolRequest.toolName"  id="toolName">
                    <option v-for="categoryDetail in toolCategoryResponses.categoryDetailResponses" :value="categoryDetail.categoryDetailName" :key="categoryDetail">{{ categoryDetail.categoryDetailName }}</option>
                </select>
                
            </div>
            <div>
                <label for="description">Mô tả:</label>
                <input type="text" id="description" v-model="toolRequest.description" required />
            </div>
            <div>
                <label for="toolType">Loại công cụ:</label>
                <input type="text" id="toolType" v-model="toolRequest.toolType" required />
            </div>
            <div>
                <label for="quantityAvailable">Số lượng:</label>
                <input type="number" id="quantityAvailable" v-model="toolRequest.quantityAvailable" required />
            </div>
            <button type="submit">Lưu công cụ</button>
            <button type="button" @click="showCreateModal = false">Đóng</button>
            </form>
        </div>
    </div>
    <!-- modal update công việc -->
    <div v-if="showUpdateModal" class="modal-overlay">
        <div class="modal-content">
            <h2>Thêm công cụ mới</h2>
            <form @submit.prevent="handleUpdateTool">
            <div>
                <p>cập nhật thông tin cho công cụ: {{ selectedTool.toolName  }}</p>
                
            </div>
            <div>
                <label for="description">Mô tả:</label>
                <input type="text" id="description" v-model="toolRequest.description" required />
            </div>
            <div>
                <label for="toolType">Loại công cụ:</label>
                <input type="text" id="toolType" v-model="toolRequest.toolType" required />
            </div>
            <div>
                <label for="quantityAvailable">Số lượng:</label>
                <input type="number" id="quantityAvailable" v-model="toolRequest.quantityAvailable" required />
            </div>
            <button type="submit">Cập nhật công cụ</button>
            <button type="button" @click="showUpdateModal = false">Đóng</button>
            </form>
        </div>
    </div>

</template>
  
<script setup>
import API_ENDPOINTS from "@/api/api";
import axios from "axios";
import { computed, onMounted, reactive, ref } from "vue";
  
const token = sessionStorage.getItem("token")
const showCreateModal = ref(false);
const showUpdateModal = ref(false);
  // State for tools
const toolResponse = reactive({
    data:[]
})
const categoryResponses =  reactive({
    data:[]
})
const toolCategoryResponses = computed(()=>{
    return categoryResponses.data.find(category => category.categoryName ==="Công cụ" )
})
const toolRequest = reactive({
    toolName: "",
    description: "",
    toolType: "",
    quantityAvailable: null,
    createdDate: new Date(),
    updatedDate: new Date(),

})

const openCreateToolModal = async () => {
  showCreateModal.value = true;
  toolRequest.toolName = '';
  toolRequest.description = '';
  toolRequest.toolType = '';
  toolRequest.quantityAvailable = null;

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
  
// State for modal
const showModal = ref(false);
const selectedTool = ref({});
  
// Functions
const viewTool = (tool) => {
    selectedTool.value = tool;
    showModal.value = true;
};

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

const handleCrateTool = async() => {
    try {
        const respone = await axios.post(API_ENDPOINTS.CREATE_TOOL,toolRequest,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log("create tool success")
            handleGetAllTool()
           showModal.value =false
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
        console.log('create tool  err', error);
    }
}
const handleCategoryGet = async() =>{
    try {
        const respone = await axios.get(API_ENDPOINTS.GET_CATEGORY,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('get category success')
            categoryResponses.data = respone.data.result
            console.log(categoryResponses.data)
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
        console.log('get category err', error);
    }
}

const handleUpdateTool = async() =>{
    try {
        const respone = await axios.put(API_ENDPOINTS.UPDATE_TOOL(selectedTool.value.toolId),toolRequest,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('update tool success')
            showUpdateModal.value = false
            handleGetAllTool()
            

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

  
const editTool = (tool) => {
    toolRequest.toolName = ""
    showUpdateModal.value = true
    selectedTool.value = tool
    
    alert(`Chỉnh sửa công cụ: ${tool.toolName}`);
    
};
  
const deleteTool = (toolId) => {
    const index = tools.findIndex((tool) => tool.toolId === toolId);
    if (index !== -1) {
      tools.splice(index, 1);
      alert("Công cụ đã được xóa!");
    }
};

onMounted(()=>{
    handleGetAllTool()
    handleCategoryGet()
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
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Đảm bảo modal luôn hiển thị phía trên các phần tử khác */
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
    margin-top: 0;
    font-size: 1.5rem;
    text-align: center;
}

/* Đảm bảo input và select có chiều rộng đồng nhất và được căn chỉnh đẹp */
.modal-content input,
.modal-content select {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem; /* Giúp văn bản trong các input, select dễ đọc hơn */
}

.modal-content select {
    /* Thêm margin-bottom cho select để tránh bị dính với các phần tử khác */
    margin-bottom: 15px;
}

.modal-content label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 1rem;
}

/* Chỉnh sửa button để có kiểu dáng đồng nhất */
.modal-content button {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 48%; /* Tạo các nút đồng đều */
    margin-top: 10px;
    font-size: 1rem;
}

.modal-content button:hover {
    background-color: #0056b3;
}

/* Đảm bảo nút "Đóng" và "Lưu công cụ" không bị lệch */
.modal-content .btn-container {
    display: flex;
    justify-content: space-between;
}

/* Cải thiện kiểu dáng của nút trong container */
.modal-content .btn-container button {
    width: 48%; /* Căn chỉnh chiều rộng các nút */
    font-size: 1rem;
}


</style>
  