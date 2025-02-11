<template>
    <div class="information-content">
      <div class="information-card">
        <h2 class="card-title">Thông tin cá nhân</h2>
  
        <div class="info-item">
          <label class="info-label">Họ và tên:</label>
          <span class="info-value">{{ informationResponse.data.firstName}} {{ informationResponse.data.lastName }}</span>
        </div>
  
        <div class="info-item">
          <label class="info-label">Số điện thoại:</label>
          <span class="info-value">{{ informationResponse.data.phoneNumber }}</span>
        </div>
  
        <div class="info-item">
          <label class="info-label">Địa chỉ:</label>
          <span class="info-value">{{ informationResponse.data.address }}</span>
        </div>
  
        <div class="info-item">
          <label class="info-label">Giới tính:</label>
          <span class="info-value">{{ informationResponse.data.gender? 'Nam':'Nữ' }}</span>
        </div>
  
        <div class="info-item">
          <label class="info-label">Ngày sinh:</label>
          <span class="info-value">{{ formattedDateOfBirth }}</span>
        </div>
        <div class="infor-action">
            <button style="background-color: #007bff;color: white;" v-if="informationResponse.data.length === 0" @click="showModalCreate=true">Bổ sung thông tin</button>
            <button style="background-color: #007bff;color: white;" v-if="informationResponse.data.length !== 0" @click="showModal=true">Chỉnh sửa thông tin</button>
            <button style="background-color: yellowgreen;color: white;" @click="modalChangePassword=true ">Đổi mật khẩu</button>
        </div>
      </div>
      <Degree_Specialization></Degree_Specialization>
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-update-info">
            <form @submit.prevent="handleUpdateInfor()">
                <label>Họ và tên đệm:
                    <input style="" v-model="informationResquest.firstName" type="text">
                </label>
                <label >Tên:
                    <input style="" type="text" v-model="informationResquest.lastName">
                </label>
                <label>Số điện thoại:
                    <input style="" type="tel" v-model="informationResquest.phoneNumber">
                </label>
                <label>Địa chỉ
                    <select v-model="informationResquest.address">
                        <option v-for="(address,index) in address" :key="index" :value="address">{{ address }}</option>
                    </select>
                </label>
                
                <label>
                    Giới tính:
                    Nam
                    <input type="radio" name="gender" :value= "true" v-model="informationResquest.gender">
                    Nữ
                    <input type="radio" name="gender" :value= "false" v-model="informationResquest.gender">
                </label>
                <label>
                    Ngày sinh
                    <input type="date" v-model="informationResquest.dateOfBirth">
                </label>
                <div class="modal-action">
                    <button style="background-color: #007bff; color: white;" type="submit">Xác nhận</button>
                    <button style="background-color: red; color: white;" @click.stop="showModal = false">Hủy</button>

                </div>
            </form>
        </div>
      </div>
        <!-- modal add ìnormation -->
      <div class="modal-overlay" v-if="showModalCreate">
        <div class="modal-update-info">
          
            <form @submit.prevent="handleUpdateInfor()">
                <label>Họ và tên đệm
                    <input v-model="informationResquest.firstName" type="text">
                </label>
                <label >Tên
                    <input type="text" v-model="informationResquest.lastName">
                </label>
                <label>Số điện thoại
                    <input type="tel" v-model="informationResquest.phoneNumber">
                </label>
                <label>Địa chỉ
                    <select v-model="informationResquest.address">
                        <option v-for="(address,index) in address" :key="index" :value="address">{{ address }}</option>
                    </select>
                </label>
                
                <label>
                    Giới tính:
                    Nam
                    <input type="radio" name="gender" :value= "true" v-model="informationResquest.gender">
                    Nữ
                    <input type="radio" name="gender" :value="false" v-model="informationResquest.gender">
                </label>
                <label>
                    Ngày sinh
                    <input type="date" v-model="informationResquest.dateOfBirth">
                </label>
                <div class="modal-action">
                    <button  type="submit">Xác nhận</button>
                    <button  @click.stop="showModalCreate = false">Hủy</button>

                </div>
            </form>
        </div>
      </div>
    </div>
    <!-- đổi mật khẩukhẩu -->
    <div v-if="modalChangePassword" class="modal-overlay">
    <div class="modal-content">
        <h3>Đổi mật khẩu</h3>
        <form @submit.prevent="submitChangePassword()">
            
            <div class="form-group">
                <label for="issueDate">Mật khẩu hiện tại:</label>
                <input id="issueDate" v-model="oldPassword" type="password" required />
            </div>
            <div class="form-group">
                <label for="institution">Mật khẩu mới:</label>
                <input id="institution" v-model="newPassword" type="password" required />
            </div>
            <div class="form-group">
                <label for="expiryDate">Nhập lại mật khẩu mới:</label>
                <input id="expiryDate" v-model="comfirmNewPassword" type="password" />
            </div>
            
            <div class="modal-actions">
                <button  style="background-color: red;" type="button" @click.stop="modalChangePassword = false">Hủy</button>
                <button type="submit">Xác nhận</button>
            </div>
        </form>
    </div>
  </div>
</template>
  
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import Degree_Specialization from '../degree-specialization/Degree_Specialization.vue';
const loginAccountId = sessionStorage.getItem("accountId")
const token = sessionStorage.getItem("token")
  const showModal = ref(false)
  const showModalCreate = ref(false)
  const address = ['HCM',"HN"]
  const modalChangePassword = ref(false)
  
  const oldPassword = ref("")
  const newPassword = ref("")
  const comfirmNewPassword = ref("")

  const informationResponse = reactive({
    data:[]
  })
  const informationResquest = reactive({
    firstName:'',
    lastName:'',
    phoneNumber:'',
    address:'',
    gender:null,
    dateOfBirth:null ,
  })
  const formattedDateOfBirth = computed(() => {
  // Kiểm tra nếu `dateOfBirth` đã có giá trị trước khi gọi `toLocaleDateString`
  return informationResponse.data.dateOfBirth
    ? new Date(informationResponse.data.dateOfBirth).toLocaleDateString("vi-VN")
    : "N/A"; // Trả về giá trị mặc định nếu `dateOfBirth` không có
});

const submitChangePassword = async() =>{
  if(newPassword.value !== comfirmNewPassword.value){
    alert("Mật khẩu xác nhận không chính xác!")
    oldPassword.value = ""
    newPassword.value = ""
    comfirmNewPassword.value = ""
    modalChangePassword.value = false
  }
  else{
    await handleChangePassword()
  }
}
const handleChangePassword = async ()=>{
    try {
        const respone = await axios.post(API_ENDPOINTS.CHANGE_PASSWORD,{
          newPassword:newPassword.value,
          oldPassword:oldPassword.value
        },{
            headers: {
                'Authorization': `Bearer ${token}`,
               
            }
        })
        if(respone.status===200){
          console.log('change password success')
          alert("Đổi mật khẩu thành công")
          oldPassword.value = ""
          newPassword.value = ""
          comfirmNewPassword.value = ""
          modalChangePassword.value = false
          
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
        console.log('change password err', error);
    }
  }


const handleInformationGet = async ()=>{
    try {
        const respone = await axios.get(API_ENDPOINTS.GET_INFORMATION(loginAccountId))
        if(respone.status===200){
          console.log('get information success')
          informationResponse.data = respone.data.result
          console.log(informationResponse.data)
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
        console.log('get information err', error);
    }
  }
  const handleUpdateInfor = async () =>{
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_INFORMATION(loginAccountId),{
        ...informationResquest
      },{
        headers: {
                'Authorization': `Bearer ${token}`
            }
      })
      if(response.status === 200){
        console.log('update information success')
        handleInformationGet()
        showModal.value = false
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
        console.log('update information err', error);
    }
  }
  const handleCreateInformation = async () =>{
    try {
      const response = await axios.post(API_ENDPOINTS.CREATE_INFORMATION(loginAccountId),{
        ...informationResquest
      },{
        headers: {
                'Authorization': `Bearer ${token}`
            }
      })
      if(response.status === 200){
        console.log('create information success')
        handleInformationGet()
        showModal.value = false
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
        console.log('update information err', error);
    }
  }

  
  onMounted(()=>{
    handleInformationGet()
  })
</script>
  
<style scoped>
  .information-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .information-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 400px;
    max-width: 100%;
  }
  
  .card-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .info-label {
    font-weight: bold;
    color: #333;
  }
  
  .info-value {
    color: #555;
    font-size: 16px;
    text-align: right;
  }
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
.modal-update-info {
    display: flex;

    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
}
form{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
.infor-action {
  display: flex;
  justify-content: space-between;
}
.modal-action{
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  width: 95%;
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


</style>
  