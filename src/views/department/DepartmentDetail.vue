<template>
    <div class="departmentdetail-content">
      <div class="departmentdetail-header">
        <p>Bảng chi tiết nhân viên của phòng <strong>{{ departmentName }}</strong></p>
        <div class="button-group">
          <button class="btn-primary" @click="showmodalAddStaff = true">Thêm nhân viên</button>
          <button class="btn-secondary" @click="showmodalTranferStaff = true">Chuyển nhân viên</button>
        </div>
      </div>
  
      <table class="department-table">
        <thead>
          <tr>
            <th>Stt</th>
            <th>Tài khoản</th>
            <th>Vai trò</th>
            <th>Thời gian vào</th>
            <th>Thời gian ra</th>
            <th>Chuyên môn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in departmantDetails.data" :key="detail.departmentId">
            <td>{{ index + 1 }}</td>
            <td>{{ detail.accountResponse.username }}</td>
            <td>{{ detail.accountResponse.position }}</td>
            <td>{{ formatDate(detail.timeIn) }}</td>
            <td>{{ formatDate(detail.timeOut) }}</td>
            <td>
              <span v-for="(specialization, i) in detail.accountResponse.specializationDetailResponses" :key="i">
                {{ specialization.specializationName }}<span v-if="i < detail.accountResponse.specializationDetailResponses.length - 1">, </span>
              </span>
            </td>
            <td>{{ detail.timeOut === null ? 'Ở phòng' : 'Rời phòng' }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal Add Staff -->
      <div v-if="showmodalAddStaff" class="modal-overlay">
        <div class="modal-content">
          <h3>Thêm nhân viên</h3>
          <table class="table-modal">
            <thead>
              <tr>
                <th>Chọn</th>
                <th>Mã tài khoản</th>
                <th>Tên tài khoản</th>
                <th>Bằng cấp</th>
                <th>Chuyên môn</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in accountsWithNullDepartment.data" :key="account.accountId">
                <td><input type="checkbox" :value="account.accountId" v-model="selectedAccount"></td>
                <td>{{ account.accountId }}</td>
                <td>{{ account.username }}</td>
                <td>Bằng cấp</td>
                <td>Chuyên môn</td>
              </tr>
            </tbody>
          </table>
          <div class="modal-actions">
            <button class="btn-primary" @click="handleAddDepartmentDetail(); showmodalAddStaff = false">Xác nhận</button>
            <button class="btn-secondary" @click="showmodalAddStaff = false">Hủy</button>
          </div>
        </div>
      </div>
  
      <!-- Modal Transfer Staff -->
      <div v-if="showmodalTranferStaff" class="modal-overlay">
        <div class="modal-content">
          <h3>Chuyển nhân viên</h3>
          <table class="table-modal">
            <thead>
              <tr>
                <th>Chọn</th>
                <th>Mã nhân viên</th>
                <th>Tài khoản</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(detail, index) in departmantDetails.data.filter(detail => detail.timeOut === null)"
                :key="detail.departmentId"
              >
                <td><input type="checkbox" :value="detail" v-model="selectedDepartmentDetail"></td>
                <td>{{ detail.accountResponse.accountId }}</td>
                <td>{{ detail.accountResponse.username }}</td>
              </tr>
            </tbody>
          </table>
          <div class="department-selected">
            <p>Chuyển đến phòng:</p>
            <select v-model="selectedDepartment">
              <option v-for="department in filteredDepartment" :key="department.departmentId" :value="department">
                {{ department.departmentName }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="handleTranferStaff()">Xác nhận</button>
            <button class="btn-secondary" @click="showmodalTranferStaff = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import API_ENDPOINTS from '@/api/api';
import { useDepartmentStore } from '@/stores/departmentStore';
import axios from 'axios';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const router = useRoute()
const departmentId = router.params.departmentId
const departmentName = router.params.departmentName
const showmodalTranferStaff = ref(false)
const showmodalAddStaff = ref(false)

const departmentStore = useDepartmentStore()
const departments = departmentStore.getDepartment;

// filter department has a different name than the department now
const filteredDepartment = computed(()=>{
    return departments.filter(department =>
        !(department.departmentName === departmentName)
    )
})
console.log('Departments in department detail:', departments);
console.log('Department in departmentfilter:', filteredDepartment);
const selectedDepartment = ref(filteredDepartment.value[0])
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

const selectedDepartmentDetail = ref([])
//get list departmentdetailId from list departmentdetail was selected 
const selectedDepartmentDetailId = computed(() => selectedDepartmentDetail.value.map(departmentDetail => departmentDetail.id))
//get list accountid from list departmentdetail was selected 
const selectedAccountId = computed(() =>selectedDepartmentDetail.value.map(departmentDetail => Number(departmentDetail.accountResponse.accountId)))

const departmantDetails = reactive({
    data:[]
})
// when tranfer staff we need update listdepartmentDetail to seen to api 'handleGetDepartmentDetailByDepartmentId'

const accountsWithNullDepartment = reactive({
    data:[]
})

const selectedAccount = ref([])
const handleGetDepartmentDetailByDepartmentId = async () =>{
    try {
        const respone = await axios.get(API_ENDPOINTS.GET_DEPARTMENTDETAIL(departmentId))
        if(respone.status === 200){
            console.log('get departmentdetail success')
            departmantDetails.data = respone.data.result
            console.log(departmantDetails.data)
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
        console.log('get departmentdetail err', error);
    }
}
const handleGetAllByDepartmentDetailListIsNull = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GETACCOUNTBYNULLDEPARTMENT)
        if (response.status === 200){
            console.log("get account by null department success")
            accountsWithNullDepartment.data = response.data.result
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
        console.log('get account with null department err', error);
    }
}

const handleAddDepartmentDetail = async ()=>{
    try {
        //add departmentdtail list
        const respone = await axios.post(API_ENDPOINTS.ADD_DEPARTMENTDETAIL(departmentId),selectedAccount.value)
        
        //add rolesdetail list for Authorization
        const respont2 = await axios.post(API_ENDPOINTS.ADD_ROLESDETAIL_LIST(departmentName),selectedAccount.value)

        if(respone.status === 200 && respont2.status===200){
            console.log('add list departmentdetail success')
            console.log('add list rolesdetail success from departmendetail')
            handleGetDepartmentDetailByDepartmentId()
            handleGetAllByDepartmentDetailListIsNull()
            selectedAccount.value=[]
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
        console.log('add departmentdetail err', error);
    }
}
const handleTranferStaff = async () =>{
    try {
        // when trander staffs will make two actions 
        //first update departmentdetail information old with timeout and delete roles of staff in old department
        const respone = await axios.put(API_ENDPOINTS.UPDATE_DEPARTMENTDETAIL,selectedDepartmentDetailId.value)
        const respone1 = await axios.delete(API_ENDPOINTS.DELETE_ROLESDETAIL(departmentName),{
            data:selectedAccountId.value
        })
        // second create departmentdetail new with new department 
        const respone2 = await axios.post(API_ENDPOINTS.ADD_DEPARTMENTDETAIL(selectedDepartment.value.departmentId),selectedAccountId.value)
        const respont3 = await axios.post(API_ENDPOINTS.ADD_ROLESDETAIL_LIST(selectedDepartment.value.departmentName),selectedAccountId.value)
        console.log("selecttedDepartmentDetailId",selectedDepartmentDetailId)
        console.log("selectedAccountId",selectedAccountId)
        if(respone.status===200){
            console.log('update old departmentdetail for tranfer staff success')
        }
        if(respone1.status===200){
            console.log('delete rolesdetail for tranfer staff success')
            console.log(respone1.data.result)
        }
        if(respone2.status===200){
            console.log('create new departmentdetail for tranfer staff success')
            console.log(selectedAccountId.value);
        }
        if(respont3.status===200){
            console.log('create new rolse for tranfer staff success')
            console.log(selectedAccountId.value);
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
        console.log('tranfer departmentdetail err', error);
    }
    
}
const canceAddDepartment = () =>{
    showmodalAddStaff.value =false
    selectedAccount.value=[]

}
onMounted(()=>{
    handleGetDepartmentDetailByDepartmentId()
    handleGetAllByDepartmentDetailListIsNull()
    
})
</script>
<style scoped>
/* General Layout */
.departmentdetail-content {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.departmentdetail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
}

/* Table */
.department-table, .table-modal {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.department-table th, .department-table td, .table-modal th, .table-modal td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.department-table th {
  background-color: #f4f4f4;
}

.department-table tbody tr:hover, .table-modal tbody tr:hover {
  background-color: #f9f9f9;
}

/* Modal */
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
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 60%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Buttons */
.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #099740;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>