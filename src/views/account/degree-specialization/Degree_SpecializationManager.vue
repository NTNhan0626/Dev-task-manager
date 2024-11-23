<template>
    <div class="degree-specialization-content">
        <h2>Bằng cấp</h2>
        <div class="degree-block-content">
           
            <div class="degree-object" v-for="degree in degreeResponse.data" :key="degree.degreeId" style="max-height: 134.4px;"
            @click="showDegreeAction === degree.degreeId?showDegreeAction=null:showDegreeAction = degree.degreeId">
                <p>{{ degree.degreeName }} - {{ degree.major }}</p>
                <div style="display: flex; flex-direction: row; justify-content: space-around;" v-if="showDegreeAction === degree.degreeId">
                    <button @click.stop="showDropdownDegree = true,handleGetDegreeDetailByDegreeId(degree.degreeId)">Chi tiết</button>
                    <button style="background-color: red; color: azure; border: 0cap;" @click="handleDeleteDegree(degree.degreeId)"> Xóa </button>
                </div>
            </div>
            <div class="degree-object" @click.self="showInputDegree=true" style="max-height: 134.4px;">
                <div class="input-degree" v-if="showInputDegree">
                    <label>
                        Tên bằng:
                        <input type="text" v-model="degreeName">
                    </label>
                    <label>
                        Ngành học:
                        <input type="text" v-model="major">
                    </label>
                    <div class="degree-action">
                        <button @click="handleCreateDegree()">Xác nhận</button>
                        <button @click="cancelShowInput()">Hủy</button>
                    </div>
                </div>
                
                <p v-if="!showInputDegree" style="font-size: 30px; color: blue;">+</p>
            </div>
        </div>
        <h2>Chuyên môn</h2>
        <div class="specialization-block-content">
            
            <div class="specialization-object" v-for="specialization in specializationResponse.data" :key="specialization.specializationId" style="max-height: 134.4px;"
            @click="showSpecializationAction === specialization.specializationId?showSpecializationAction=null:showSpecializationAction = specialization.specializationId">
                <p>{{ specialization.specializationName }}</p>
                <div style="display: flex; flex-direction: row; justify-content: space-around;" v-if="showSpecializationAction === specialization.specializationId">
                    <button @click.stop="showDropdownSpecialization = true ,handleGetSpecializationBySpecializationId(specialization.specializationId)">Chi tiết</button>
                    <button style="background-color: red; color: azure; border: 0cap;"> Xóa </button>
                </div>
            </div>

            <div class="specialization-object" @click="showInputSpecialization = true" style="max-height: 134.4px;">
                <div class="input-degree" v-if="showInputSpecialization">
                    <label>
                        Tên chuyên môn:
                        <input type="text" v-model="specializationName">
                    </label>
                   
                    <div class="degree-action">
                        <button @click.stop="handleCreateSpecialization()">Xác nhận</button>
                        <button @click.stop="cancelShowSpecializationInput()">Hủy</button>
                    </div>
                </div>
                <p @click="" v-if="!showInputSpecialization" style="font-size: 30px; color: blue;" >+</p>
            </div>
        </div>

        <div class="dropdown-degree" v-if="showDropdownDegree">
            <table>
                <thead>
                    <tr>
                        <th>Tên bằng</th>
                        <th>Tài khoản</th>
                        <th>Ngành học</th>
                        <th>Nơi cấp</th>
                        <th>Ngày cấp</th>
                        <th>Ngày hết hạn</th>
                        <th>Cấp độ</th>
                        <th>Số năm học</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(degreeDetail, index) in degreeDetailResponse.data" :key="degreeDetail.id">
                        <td>{{ degreeDetail.degreeName }}</td>
                        <td>{{ degreeDetail.accountName }}</td>
                        <td>{{ degreeDetail.major }}</td>
                        <td>{{ degreeDetail.institution }}</td>
                        <td>{{ degreeDetail.issueDate }}</td>
                        <td>{{ degreeDetail.expiryDate }}</td>
                        <td>{{ degreeDetail.level }}</td>
                        <td>{{ degreeDetail.duration }}</td>
                        <td>{{ degreeDetail.status }}</td>
                        <td>
                            <button @click="handleApproveOrRejectDegree('Đã duyệt',degreeDetail.id,degreeDetail.degreeId)">Duyệt</button>
                            <button @click="handleApproveOrRejectDegree('Không duyệt',degreeDetail.id,degreeDetail.degreeId)">Không duyệt</button>
                            <button @click="handleApproveOrRejectDegree('Cần chỉnh sửa',degreeDetail.id,degreeDetail.degreeId)">Yêu cầu chỉnh sửa</button>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>

        <div class="dropdown-specialization" v-if="showDropdownSpecialization">
            <table>
                <thead>
                    <tr>
                        <th>Tên chuyên môn</th>
                        <th>Tài khoản</th>
                        <th>Cấp độ</th>
                        <th>Ngày cấp</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(specalizationDetail, index) in specializationDetailResponse.data" :key="specalizationDetail.specializationDetailId">
                        <td>{{ specalizationDetail.specializationName }}</td>
                        <td>{{ specalizationDetail.accountName }}</td>
                        <td>{{ specalizationDetail.level }}</td>
                        <td>{{ specalizationDetail.startDate }}</td>
                        <td>{{ specalizationDetail.description }}</td>
                        <td>{{ specalizationDetail.status }}</td>
                        <td>
                            <button @click="handleApproveOrRejectSpecialization('Đã duyệt',specalizationDetail.specializationDetailId,specalizationDetail.specializationId)">Duyệt</button>
                            <button @click="handleApproveOrRejectSpecialization('Không duyệt',specalizationDetail.specializationDetailId,specalizationDetail.specializationId)">Không duyệt</button>
                            <button @click="handleApproveOrRejectSpecialization('Cần chỉnh sửa',specalizationDetail.specializationDetailId,specalizationDetail.specializationId)">Yêu cầu chỉnh sửa</button>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>


    </div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';

const showInputSpecialization = ref(false)
const showInputDegree = ref(false)
const showDegreeAction =ref(null)
const showSpecializationAction = ref(null)
const showDropdownDegree =ref(false)
const showDropdownSpecialization = ref(false)

const degreeName = ref("")
const major = ref("")
const specializationName = ref("")
const degreeResponse = reactive({
    data :[]
})
const specializationResponse = reactive({
    data :[]
})
const degreeDetailResponse = reactive({
    data:[]
})
const specializationDetailResponse = reactive({
    data :[]
})
const cancelShowInput = () =>{
    degreeName.value = ""
    major.value = ""
    showInputDegree.value = false
    console.log(showInputDegree.value)
}

const cancelShowSpecializationInput = () =>{
    specializationName.value = ""
   
    showInputSpecialization.value = false
    
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
const handleCreateDegree = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_DEGREE,{
            degreeName:degreeName.value,
            major:major.value
        })
        if(response.status === 200){
            console.log("create degree success")
            handleGetDegree()
            cancelShowInput()
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
        console.log('create degree err', error);
    }

}
const handleCreateSpecialization = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_SPECIALIZATON,{
            specializationName:specializationName.value,
           
        })
        if(response.status === 200){
            console.log("create specialization success")
            handleGetSpecialization()
            cancelShowSpecializationInput()
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
        console.log('create specialization err', error);
    }

}
const handleGetDegreeDetailByDegreeId = async (degreeId) =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEGREEDETAILDG(degreeId))
        if(response.status === 200){
            console.log("get degreedetail by degreeId success")
            degreeDetailResponse.data = response.data.result
            console.log(response.data.result)
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
        console.log('get degreedetail err', error);
    }
}
const handleDeleteDegree = async(degreeId)=>{
    try {
        alert("xóa bằng cấp đồng thời sẽ xóa danh sách các tài khoản có bằng cấp đó bạn có chắc muốn xóa?")
        const response = await axios.delete(API_ENDPOINTS.DELETE_DEGREE(degreeId))
        if(response.status === 200){
            console.log("delete degreesuccess")
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
        console.log('delete degree err', error);
    }
}

const handleApproveOrRejectDegree = async (status,degreedetailId,degreeId)=>{
    try {
        const response = await axios.put(API_ENDPOINTS.UPDATE_DEGREEDETAIL(degreedetailId),{
            status:status
        })
        if(response.status === 200){
            console.log("update status degreedetail success")
            handleGetDegreeDetailByDegreeId(degreeId)

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
        console.log('update status degreedetail err', error);
    }
}

const handleGetSpecializationBySpecializationId = async (specializationId) =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_SPECIALIZATIONDETAILBSP(specializationId))
        if(response.status === 200){
            console.log("get specializationDetail by specializationId success")
            specializationDetailResponse.data = response.data.result
            console.log(response.data.result)
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
        console.log('get specializationDetail by specializationId err', error);
    }
}

const handleApproveOrRejectSpecialization = async (status,specializationDetailId,specializationId)=>{
    try {
        const response = await axios.put(API_ENDPOINTS.UPDATE_SPECIALIZATIONDETAIL(specializationDetailId),{
            status:status
        })
        if(response.status === 200){
            console.log("update status specializationDetail success")
            handleGetSpecializationBySpecializationId(specializationId)

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
        console.log('update status specializationDetail err', error);
    }
}
onMounted (()=>{
    handleGetDegree()
    handleGetSpecialization()
})

</script>
<style scoped>
.degree-specialization-content{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 10px;
}
.degree-block-content,.specialization-block-content{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;  
}
.degree-object, .specialization-object{
    flex:0 1 calc(25% - 10px);
    box-sizing: border-box;
    padding: 20px;
    background: #f0f0f0;
    text-align: center;
    cursor: pointer;
}

.input-degree {
    display: block; /* Đảm bảo các phần tử nằm theo chiều dọc */
    margin-bottom: 15px; /* Khoảng cách giữa các dòng */
    padding: 0 20px; /* Thêm khoảng cách cho cả hai bên */
}

.input-degree label {
    display: block; /* Đảm bảo label và input nằm trên cùng một dòng */
    margin-bottom: 10px; /* Khoảng cách giữa các label và input */
    text-align: left; /* Canh lề trái cho nhãn */
}

.input-degree input {
    width: 100%; /* Đảm bảo ô nhập liệu chiếm hết chiều rộng */
    padding: 8px; /* Thêm padding để ô nhập liệu rộng hơn */
    box-sizing: border-box; /* Đảm bảo input không bị tràn ra ngoài */
}
.degree-action{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

thead tr {
    background-color: #4CAF50;
    color: white;
    text-align: left;
}

th, td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
}

tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

tbody tr:hover {
    background-color: #f1f1f1;
}

th {
    font-weight: bold;
}

td {
    color: #333;
}

tbody tr:last-child td {
    border-bottom: none;
}

</style>