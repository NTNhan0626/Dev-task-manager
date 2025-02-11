<template>
    <div class="account-get-content">
        <div class="account-table-infor">
            <h3>Danh sách tài khoản nhân viên:</h3>
            <table>
                <thead>
                    <tr>
                        <th>
                            Mã tài khoản
                        </th>
                        <th>
                            Tên đăng nhập
                        </th>
                        <th>
                            Mail
                        </th>
                        <th>
                            Trạng thái
                        </th>
                        
                        <th>Ngày tạo</th>
                       
                        <th>Bằng cấp</th>
                        <th>Chuyên môn</th>
                        

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(account,index) in accounts.data" :key="account.accountId" @click="showAction = (showAction === index ? false : index)">
                        <td>{{ account.accountId }}</td>
                        <td>{{ account.username }}</td>
                        <td>{{ account.email }}</td>
                        <td>{{ account.status }}</td>
                        <td>{{ formatDate(account.dateCreate)  }}</td>
                        
                        <td><span v-for="degree in account.detailResponses">{{ degree.degreeName }}, </span></td>
                        <td><span v-for="specialization in account.specializationDetailResponses">{{ specialization.specializationName }}, </span></td>
                        
                        <td v-if="showAction === index">
                            <button v-if="account.informationResponse !== null" @click="isDetailModalVisible = true ,selectedAccount = account.informationResponse">Xem chi tiết</button>
                            <button v-if="account.status === 'Active'&&['ADMIN', 'StaffManagerU'].some(role => roles.includes(role))"  @click="openUseModal('Paused'),accountId = account.accountId" >Khóa</button>
                            <button v-if="account.status === 'Paused' && ['ADMIN', 'StaffManagerU'].some(role => roles.includes(role))" @click="openUseModal('Continued'),accountId = account.accountId">Mở khóa</button>
                            <button v-if="['ADMIN', 'StaffManagerD'].some(role => roles.includes(role))"  @click="openUseModal('Deleted'),accountId = account.accountId">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- modal infomation -->
        <div v-if="isDetailModalVisible" class="modal-overlay">
          <div class="modal" style="width: 400px; margin: auto; padding: 20px; background-color: #fff; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
              <h2 style="font-size: 1.5rem; color: #333; text-align: center; margin-bottom: 20px;">Chi tiết tài khoản</h2>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #555;">
                      <span style="flex: 0 0 150px; text-align: left; font-weight: bold; color: #333;">Họ:</span>
                      <span style="flex: 1; text-align: left;">{{ selectedAccount.firstName }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #555;">
                      <span style="flex: 0 0 150px; text-align: left; font-weight: bold; color: #333;">Tên:</span>
                      <span style="flex: 1; text-align: left;">{{ selectedAccount.lastName }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #555;">
                      <span style="flex: 0 0 150px; text-align: left; font-weight: bold; color: #333;">Số điện thoại:</span>
                      <span style="flex: 1; text-align: left;">{{ selectedAccount.phoneNumber }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #555;">
                      <span style="flex: 0 0 150px; text-align: left; font-weight: bold; color: #333;">Địa chỉ:</span>
                      <span style="flex: 1; text-align: left;">{{ selectedAccount.address }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #555;">
                      <span style="flex: 0 0 150px; text-align: left; font-weight: bold; color: #333;">Giới tính:</span>
                      <span style="flex: 1; text-align: left;">{{ selectedAccount.gender ? 'Nam' : 'Nữ' }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #555;">
                      <span style="flex: 0 0 150px; text-align: left; font-weight: bold; color: #333;">Ngày sinh:</span>
                      <span style="flex: 1; text-align: left;">{{ formatDate(selectedAccount.dateOfBirth) }}</span>
                  </div>
              </div>
              <div class="form-actions" style="text-align: center; margin-top: 20px;">
                  <button @click="isDetailModalVisible = false" style="padding: 10px 20px; font-size: 1rem; color: #fff; background-color: #007BFF; border: none; border-radius: 4px; cursor: pointer;">Đóng</button>
              </div>
          </div>

        </div>
        <!-- modal dùng chung cắt ra từ modal để xử lí các thao tasc của project như hoàn thành ...-->
        <div v-if="isUseModalVisible === true" class="modal-overlay">
            <div class="modal">
                
                <h2 v-if="usesActionType === 'Paused'">Xác nhận khóa tài khoản nhân viên</h2>
                <h2 v-if="usesActionType === 'Continued'">Xác nhận mở khóa tài khoản nhân viên</h2>
                
                <h2 v-if="usesActionType === 'Deleted'">Xác nhận xóa tài khoản nhân viên</h2>
                <!-- Nội dung modal thay đổi theo action -->
                
                <div v-if="usesActionType === 'Paused'">
                  <p style="font-weight: bold;" >bạn chắc chắn khóa tài khoản nhân viên được chọn?</p>
                </div>
                <div v-if="usesActionType === 'Deleted'">
                  <p style="font-weight: bold;" >bạn chắc chắn xóa tài khoản nhân viên được chọn?</p>
                </div>
                <div v-if="usesActionType === 'Continued'">
                  <p style="font-weight: bold;" >bạn chắc chắn mở khóa tài khoản nhân viên được chọn?</p>
                </div>
                <div class="form-actions">
                  <button class="btn-confirm" @click.stop="submitAction()">Xác nhận</button>
                  <button class="btn-cancel" @click.stop="closeUseModal()">Hủy</button>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { reactive, ref } from 'vue';
import { onMounted } from 'vue';
const token = sessionStorage.getItem("token")
const roles = sessionStorage.getItem("roles").split(",")
const accounts = reactive(
    {
        data: []
    }
)
const accountRequest = reactive({
    status:"",
    outDate:null
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

const accountId = ref(null)
const showAction = ref(null)
const usesActionType = ref('')
const isDetailModalVisible = ref("")
const isUseModalVisible =ref('')
const selectedAccount = ref({})
const openUseModal = (style) =>{
    usesActionType.value = style
    isUseModalVisible.value = true
}
const closeUseModal = () => {
  isUseModalVisible.value = false;

};
const submitAction = async () =>{
    if(usesActionType.value === 'Paused'){
        accountRequest.status = 'Paused'
        console.log("call handleUpDateAccount")
        await handleUpdateAccount()
        accountRequest.status = ''
    }
    else if(usesActionType.value === 'Deleted'){
        console.log("call handleDeleteAccount")
        await handleDeleteAccount()
        accountId.value = null
    }
    else if(usesActionType.value === 'Continued'){
        console.log("call handUpDateAccount ")
        accountRequest.status = 'Active'
        await handleUpdateAccount()
        accountRequest.status = ''
    }
    closeUseModal()
}
const handleGetAccount = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GETACCOUNT,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            console.log(response)
            console.log("get account success")
            accounts.data = response.data.result
            console.log(accounts.data)
        }
        
    } catch (error) {
        console.log("err get account")
    }
    
}
const handleUpdateAccount = async () =>{
    try {
        const response = await axios.put(API_ENDPOINTS.UPDATE_ACCOUNT(accountId.value),accountRequest,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            
            console.log("update account success")
            handleGetAccount()
        }
        
    } catch (error) {
        console.log("err update account")
    }
    
}
const handleDeleteAccount = async () =>{
    try {
        const response = await axios.delete(API_ENDPOINTS.DELETED_ACCOUNT(accountId.value),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            
            console.log("delete account success")
            handleGetAccount()
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
        console.log('delete account  err', error);
    
        
    }
    
}
onMounted(()=>{
    handleGetAccount();
});

</script>
<style scoped>
/* General Styles */
/* General Styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}
table{
    width: 100%;
    border: 1px solid #090808;
}

/* Container for content */
.account-get-content {
  width:100% ;
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Table Styling */
.account-table-infor {
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
}

.account-table-infor th,
.account-table-infor td {
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #ccc;
  border: 1px solid #ddd; /* Thêm viền */
  
}

.account-table-infor th {
  background-color: #4CAF50;
  color: #fff;
  border-top: none; /* Không viền trên cùng */
  border-left: none; /* Không viền bên trái */
}
.account-table-infor td {
  border-top: none; /* Không viền trên cùng */
}

.account-table-infor tr:nth-child(even) {
  background-color: #f9f9f9;
}

.account-table-infor tr:hover {
  background-color: #f1f1f1;
}

.account-table-infor td span {
  display: inline-block;
  margin-right: 8px;
}
.account-table-infor th:nth-child(1),
.account-table-infor td:nth-child(1) {
  width: 80px; /* Đặt độ rộng cột 'Tên đăng nhập' */
}

/* Button Styling */
.account-table-infor button {
  padding: 6px 15px;
  font-size: 14px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  outline: none;
}

.account-table-infor button:nth-child(2) {
  background-color: #f1b212;
}

.account-table-infor button:nth-child(2):hover {
  background-color: #e1a111;
}
/* Nút thứ hai */
.account-table-infor button:first-child {
  background-color: #3498db; /* Màu khác cho nút thứ 2 */
}

.account-table-infor button:first-child:hover {
  background-color: #2980b9;
}

.account-table-infor button:last-child {
  background-color: #e74c3c;
}

.account-table-infor button:last-child:hover {
  background-color: #c0392b;
}

/* Modal Styling */
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

.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
  text-align: center;
  max-width: 90%;
}

.modal h2 {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

.modal p {
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-bottom: 25px;
}

.modal .form-actions {
  display: flex;
  justify-content: space-between;
}

.btn-confirm,
.btn-cancel {
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;
}

.btn-confirm {
  background-color: #4CAF50;
  color: #fff;
  border: none;
}

.btn-confirm:hover {
  background-color: #45a049;
}

.btn-cancel {
  background-color: #e74c3c;
  color: #fff;
  border: none;
}

.btn-cancel:hover {
  background-color: #c0392b;
}


/* FadeIn Animation for Modal */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


</style>