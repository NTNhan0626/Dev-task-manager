<template>
    <RouterView></RouterView>
    <div class="department-main-content">
        <h1>Danh sách phòng ban</h1>
        <button @click="showModalDepartmenAdd = true">Thêm Phòng ban</button>
        <div class="department-table-content">
            <table class="department-table">
                <thead>
                    <tr>
                        <th>Stt</th>
                        <th>Mã Phòng</th>
                        <th>Tên Phòng</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Số nhân viên</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(department, index) in departmentRespones.data" :key="department.departmentId">
                        <td>{{ index ++ }}</td>
                        <td>{{ department.departmentId }}</td>
                        <td>{{ department.departmentName }}</td>
                        <td>{{ department.status }}</td>
                        <td>{{ department.createdDate }}</td>
                        <td>{{ department.numberStaff }}</td>
                        <td><RouterLink
                            :to="{name:'department-detail',
                            params:{departmentId: department.departmentId,departmentName:department.departmentName} }"
                            >Xem chi tiết</RouterLink></td>
                    </tr>
                </tbody>
            </table>
            <div v-if="showModalDepartmenAdd" class="modal-overlay">
                <div class="modal">
                    <h3>Thêm Phòng mới</h3>
                    <div class="input-content">
                        <label>
                            Nhập tên phòng: 
                            <input type="text" v-model="departmentRequest.departmentName" >
                        </label>
                    </div>
                    <div class="modals-action">
                        <button @click="handleDepartmentAdd(),showModalDepartmenAdd=false" >Xác nhận</button>
                        <button @click="canceAdd()">Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import { useDepartmentStore } from '@/stores/departmentStore';
import axios from 'axios';
import { onMounted, provide, reactive,ref } from 'vue';
import { RouterLink } from 'vue-router';


const showDepartMainConten = ref(true)

const showModalDepartmenAdd = ref(false)

const departmentRequest = reactive(
    {
        departmentName : '',
        // status:'',
        // createdDate:null,

    }
)
const departmentStore = useDepartmentStore()
const departmentRespones = reactive(
    {
        data:[]
    }
)



const handleDepartmentGet = async ()=>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENT)
        if(response.status === 200 ){
            console.log('get department success')
            departmentRespones.data = response.data.result
            departmentStore.putDepartmentsToStore(departmentRespones.data)
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
const canceAdd = () =>{
    showModalDepartmenAdd.value = false
    departmentRequest.departmentName=''
}

const handleDepartmentAdd = async () => {
    const now = new Date()
    try {
        const respone = await axios.post(API_ENDPOINTS.ADD_DEPARTMENT,{
            departmentName:departmentRequest.departmentName,
            status:'inprogress',
            createdDate: now.toISOString().slice(0,10)
        })
        if(respone.status===200){
            console.log('add department success')
            handleDepartmentGet()
        }

        const respone2 = await axios.post(API_ENDPOINTS.ADDROLSE,{
            rolesName:departmentRequest.departmentName,
        })
        if(respone2.status===200){
            console.log('add rolsedepartment success')
            
        }
    } catch (error) {
        if(error.respone){
            console.log('request false with status: ',error.respone.status)
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error setting up request:', error.message);
        }
        console.log('err add department',error)
    }
}
onMounted(() =>{
    handleDepartmentGet()
})
</script>
<style scoped>
.modal-overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0 ,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
}
.modal-author{
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
}
.modal-actions {
    margin-top: 20px;
}
button{
    margin: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
ul {
    list-style-type: none;
    padding: 0;
  }
</style>