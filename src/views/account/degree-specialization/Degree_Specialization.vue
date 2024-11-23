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
                <template v-for="(degreedetail, index) in degreedetailresponse.data" :key="degreedetail.degreedetailId">
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
                    <tr v-if="selectedRow === index && (degreedetail.status ==='Không duyệt' || degreedetail.status ==='Đã duyệt')" class="action-row">
                        <td colspan="8" style="text-align: center;">
                            <button @click="updateDegree(degreedetail)">Cập nhật</button>
                            <button @click="deleteDegree(degreedetail)">Xóa</button>
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
        <h2 class="card-title">Chứng chỉ</h2>
        <table>
            <thead>
                <tr>
                    <th>Tên chứng chỉ</th>
                    <th>Cấp độ chuyên môn</th>
                    <th>Ngày cấp</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="specializationdetail in specializationdetailresponse.data" :key="specializationdetail.specializationdetailId">
                    <td>{{ specializationdetail.specializationName }}</td>
                    <td>{{ specializationdetail.level }}</td>
                    <td>{{ specializationdetail.startDate }}</td>
                    <td>{{ specializationdetail.description }}</td>
                    <td>{{ specializationdetail.status }}</td>
                </tr>
            </tbody>
        </table>
        <div class="degree-action">
            <button @click="showSpecializationForm = true">Thêm chuyên môn</button>
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
                <button type="button" @click="showDegreeForm = false">Hủy</button>
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
                <button type="button" @click="showSpecializationForm = false">Hủy</button>
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

const showSpecializationForm = ref(false)
const specializationDetailRequest = reactive({
    accountId: 2,
    specializationId: null,
    startDate: '',
    description: '',
    status: 'Chờ duyệt',
    level: '',
   
});



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

const handleGetDegree = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEGREE)
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
        const response = await axios.get(API_ENDPOINTS.GET_DEGREEDETAIL(2))
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

const handleSpecializationDetailGet = async() =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_SPECIALIZATIONDETAIL(2))
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
    accountId: 2,
    degreeId: null,
    issueDate: '',
    institution: '',
    expiryDate: '',
    level: '',
    duration: ''
});

const handleCreateDegreeDetail = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_DEGREEDETAIL,degreeDetailRequest)
        if(response.status === 200){
            console.log("create degreedetail success")
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
        console.log('add degreedetail err', error); 
    }
};

const handleCreateSpecializationDetail = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_SPECIALIZATIONDETAIL,specializationDetailRequest)
        if(response.status === 200){
            console.log("create Specialization detail success")
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
        console.log('add specialization detail err', error); 
    }
};
const specializationResponse = reactive({
    data :[]
})
const handleGetSpecialization = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_SPECIALIZATION)
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
.information-dg_sp{
    display: inline-flex;
    border: 2px solid blue;
}
table{
    border: 2px solid red;
}
/* Nền mờ */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Cửa sổ */
.modal-content {
    background: white;
    padding: 25px 30px;
    border-radius: 8px;
    width: 420px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s;
}

.form-group input:focus {
    border-color: #66afe9;
    box-shadow: 0 0 5px rgba(102, 175, 233, 0.5);
}

/* Nút hành động */
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions button {
    padding: 10px 18px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
}

.modal-actions button:hover {
    opacity: 0.9;
}

.modal-actions button:first-child {
    background-color: #f0f0f0;
    color: #333;
}

.modal-actions button:last-child {
    background-color: #4CAF50;
    color: white;
}

.modal-actions button:last-child:hover {
    background-color: #45a049;
}


</style>