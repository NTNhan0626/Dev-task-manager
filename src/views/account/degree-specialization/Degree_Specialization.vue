<template>
    <div class="information-dg_sp">
    <div class="information-card">
        <h2 class="card-title">Bằng cấp</h2>
        <table>
            <thead>
                <tr>
                    <th>Tên bằng</th>
                    <th>Ngành học</th>
                    <th>Ngày cấp bằng</th>
                    <th>Nơi cấp</th>
                    <th>Ngày hết hạn</th>
                    <th>Cấp độ</th>
                    <th>Thời gian học</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(degreedetail, index) in degreedetailresponse.data" :key="degreedetail.id">
                    <tr @click="toggleRow(index)">
                        <td>{{ degreedetail.degreeName }}</td>
                        <td>{{ degreedetail.major }}</td>
                        <td>{{ degreedetail.issueDate }}</td>
                        <td>{{ degreedetail.institution }}</td>
                        <td>{{ degreedetail.expiryDate }}</td>
                        <td>{{ degreedetail.level }}</td>
                        <td>{{ degreedetail.duration }}</td>
                        <td>{{ degreedetail.status }}</td>
                    </tr>
                    <!-- Hiển thị nút chỉ khi dòng được chọn -->
                    <tr v-if="selectedRow === index" class="action-row">
                        <td colspan="8" style="text-align: center;">
                           
                            <button style="background-color: red;" @click="openConfirmModal('dgDetail',degreedetail.id)">Xóa</button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div class="degree-action">
            <button @click="showDegreeForm = true">Thêm bằng cấp</button>
        </div>
        
        
    </div>
    <div class="information-card">
        <h2 class="card-title">Chuyên môn</h2>
        <table>
            <thead>
                <tr>
                    <th>Tên chuyên môn</th>
                    <th>Cấp độ chuyên môn</th>
                    <th>Ngày cấp</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(specializationdetail, index) in specializationdetailresponse.data" :key="specializationdetail.specializationdetailId">
                    <tr @click="toggleRow2(index)">
                        <td>{{ specializationdetail.specializationName }}</td>
                        <td>{{ specializationdetail.level }}</td>
                        <td>{{ specializationdetail.startDate }}</td>
                        <td>{{ specializationdetail.description }}</td>
                        <td>{{ specializationdetail.status }}</td>
                        <!-- Hiển thị nút chỉ khi dòng được chọn -->
                    
                    </tr>
                    <tr v-if="selectedRow2 === index" class="action-row">
                        <td colspan="8" style="text-align: center;">
                            <button style="background-color: red;" @click="openConfirmModal('spDetail',specializationdetail.specializationDetailId)">Xóa</button>
                        </td>
                    </tr>
                </template>
                
            </tbody>
        </table>
        <div class="degree-action">
            <button @click="showSpecializationForm = true">Thêm chuyên môn</button>
        </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <p v-if="types === 'dgDetail'">Bạn có chắc chắn muốn xóa bằng cấp này không?</p>
        <p v-if="types === 'spDetail'">Bạn có chắc chắn muốn xóa chuyên môn này không?</p>
        <div class="modal-actions">
          <button @click="confirmDelete">Xác nhận</button>
          <button style="background-color: red;" @click="closeConfirmModal">Hủy</button>
        </div>
      </div>
    </div>

    <div v-if="showDegreeForm" class="modal-overlay">
    <div class="modal-content">
        <h3>Thêm thông tin bằng cấp</h3>
        <form @submit.prevent="handleCreateDegreeDetail()">
            <div class="form-group">
                <label for="degreeName">Tên bằng:</label>
                <select id="degreeName" v-model="degreeDetailRequest.degreeId">
                    <option v-for="degree in degreeResponse.data" :value="degree.degreeId" >{{ degree.degreeName }}-{{degree.major}}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="issueDate">Ngày cấp:</label>
                <input id="issueDate" v-model="degreeDetailRequest.issueDate" type="date" required />
            </div>
            <div class="form-group">
                <label for="institution">Nơi cấp:</label>
                <input id="institution" v-model="degreeDetailRequest.institution" type="text" required />
            </div>
            <div class="form-group">
                <label for="expiryDate">Ngày hết hạn:</label>
                <input id="expiryDate" v-model="degreeDetailRequest.expiryDate" type="date" />
            </div>
            <div class="form-group">
                <label for="level">Cấp độ:</label>
                <input id="level" v-model="degreeDetailRequest.level" type="text" required />
            </div>
            <div class="form-group">
                <label for="duration">Thời gian học:</label>
                <input id="duration" v-model="degreeDetailRequest.duration" type="text" required />
            </div>
            <div class="modal-actions">
                <button style="background-color: red;" type="button" @click.stop="showDegreeForm = false">Hủy</button>
                <button type="submit">Lưu</button>
            </div>
        </form>
    </div>

    
</div>
<div v-if="showSpecializationForm" class="modal-overlay">
    <div class="modal-content">
        <h3>Thêm thông tin chuyên môn</h3>
        <form @submit.prevent="handleCreateSpecializationDetail()">
            <div class="form-group">
                <label for="degreeName">Tên chuyên môn:</label>
                <select id="degreeName" v-model="specializationDetailRequest.specializationId">
                    <option v-for="specialization in specializationResponse.data" :value="specialization.specializationId" >{{ specialization.specializationName }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="issueDate">Cấp độ:</label>
                <input id="issueDate" v-model="specializationDetailRequest.level" type="text" required />
            </div>
            <div class="form-group">
                <label for="institution">Ngày bắt đầu:</label>
                <input id="institution" v-model="specializationDetailRequest.startDate" type="date" required />
            </div>
            <div class="form-group">
                <label for="expiryDate">Mô tả:</label>
                <input id="expiryDate" v-model="specializationDetailRequest.description" type="text" />
            </div>
            
            <div class="modal-actions">
                <button  style="background-color: red;" type="button" @click.stop="showSpecializationForm = false">Hủy</button>
                <button type="submit">Lưu</button>
            </div>
        </form>
    </div>
    </div>
</div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
const loginAccountId = Number(sessionStorage.getItem("accountId"))
const token = sessionStorage.getItem("token")
const showSpecializationForm = ref(false)
const specializationDetailRequest = reactive({
    accountId: loginAccountId,
    specializationId: null,
    startDate: '',
    description: '',
    status: 'Chờ duyệt',
    level: '',
   
});


// Trạng thái modal và ID được chọn
const showConfirmModal = ref(false);
const selectedId = ref(null);
const types = ref('')
// Mở modal xác nhận
const openConfirmModal = (type,id) => {
    types.value = type
    selectedId.value = id;
    showConfirmModal.value = true;
};

// Đóng modal xác nhận
const closeConfirmModal = () => {
  showConfirmModal.value = false;
  selectedId.value = null;
  types.value = null
};

// Xác nhận xóa
const confirmDelete = async () => {
  if (selectedId.value !== null && types.value === 'dgDetail') {
    console.log(selectedId.value)
    await deleteDegreeDetail(selectedId.value)
  }
  else if(selectedId.value !== null && types.value === 'spDetail'){
    console.log(selectedId.value)
    await deleteSpecializationDetail(selectedId.value)
  }
  closeConfirmModal();
};


const degreedetailresponse = reactive({
    data:[]
})
const specializationdetailresponse =reactive({
    data:[]
})
const degreeResponse = reactive({
    data:[]
})
const selectedRow = ref(null)

const toggleRow = (index) =>{
    selectedRow.value === index? selectedRow.value=null:selectedRow.value = index
}

const selectedRow2 = ref(null)

const toggleRow2 = (index) =>{
    selectedRow2.value === index? selectedRow2.value=null:selectedRow2.value = index
}

const handleGetDegree = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEGREE,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status === 200){
            console.log("get degree success")
            degreeResponse.data = response.data.result
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
        console.log('get degree err', error);
        
    }
   
}

const handleDegreeDetailGet = async() =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEGREEDETAIL(loginAccountId),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            degreedetailresponse.data = response.data.result
            console.log(degreedetailresponse.data)
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
        console.log('get degree err', error);
    }
}

const deleteDegreeDetail = async(degreedetailId) =>{
    try {
        const response = await axios.delete(API_ENDPOINTS.DELETE_DEGREEDETAIL(degreedetailId),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
           
            console.log('delete degree detail success')
            handleDegreeDetailGet()
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
        console.log('delete degree detail err', error);
    }
}

const deleteSpecializationDetail = async(specializationDetailId) =>{
    try {
        const response = await axios.delete(API_ENDPOINTS.DELETE_SPECIALIZATIONDETAIL(specializationDetailId),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
           
            console.log('delete specialization detail success')
            handleSpecializationDetailGet()
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
        console.log('delete specialization detail err', error);
    }
}


const handleSpecializationDetailGet = async() =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_SPECIALIZATIONDETAIL(loginAccountId),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            specializationdetailresponse.data = response.data.result
            console.log(specializationdetailresponse.data)
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
        console.log('get specializationdetail err', error); 
    }
}

const showDegreeForm = ref(false);

const degreeDetailRequest = reactive({
    accountId: loginAccountId,
    degreeId: null,
    issueDate: '',
    institution: '',
    expiryDate: '',
    level: '',
    duration: ''
});

const handleCreateDegreeDetail = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_DEGREEDETAIL,degreeDetailRequest,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            console.log("create degreedetail success")
            handleDegreeDetailGet()
            showDegreeForm.value = false
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
        console.log('add degreedetail err', error); 
    }
};

const handleCreateSpecializationDetail = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_SPECIALIZATIONDETAIL,specializationDetailRequest,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            console.log("create Specialization detail success")
            handleSpecializationDetailGet()
            showSpecializationForm.value = false
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
        console.log('add specialization detail err', error); 
    }
};
const specializationResponse = reactive({
    data :[]
})
const handleGetSpecialization = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_SPECIALIZATION,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status === 200){
            console.log("get specialization success")
            specializationResponse.data = response.data.result
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
        console.log('get specialization err', error);
        
    }
   
}
onMounted(()=>{
    handleDegreeDetailGet()
    handleSpecializationDetailGet()
    handleGetDegree()
    handleGetSpecialization()
})
</script>
<style scoped>
.information-dg_sp {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.information-card {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-size: 1.5em;
    color: #333333;
    margin-bottom: 15px;
    text-align: center;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

table th, table td {
    text-align: center;
    padding: 12px 8px;
    border: 1px solid #ddd;
}

table th {
    background-color: #f1f1f1;
    font-weight: bold;
}

table tr:hover {
    background-color: #f9f9f9;
}

.action-row {
    background-color: #ffefe0;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

button:hover {
    background-color: #007bff;
    color: #fff;
}

.degree-action {
    text-align: right;
    margin-top: 10px;
}

.degree-action button {
    background-color: #007bff;
    color: #fff;
}

.degree-action button:hover {
    background-color: #0056b3;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
    font-size: 1.5em;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}

input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.modal-actions button {
    background-color: #007bff;
    color: #fff;
}

.modal-actions button:hover {
    background-color: #0056b3;
}


</style>
