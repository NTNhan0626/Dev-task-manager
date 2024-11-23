<template>
    <div class="roles-add-content">
        <div class="roles-table-infor">
            <table>
                <thead>
                    <tr>
                        <th v-for="role in filteredRoles" :key="role.rolesId">
                            <RouterLink :to="{ name: 'roles-detail', params: { rolesId: role.rolesId } }">
                                {{ role.rolesName }}
                            </RouterLink>
                        </th>
                        <th><button @click="showModal = true" >Thêm Quyền</button></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-for="role in filteredRoles" :key="roles.rolesId">
                            <ul>
                                <li v-for="account in role.accountResponseList" :key="account.username"> {{ account.username }}</li>
                                
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="showModalAuthority=true">Cấp quyền</button>
            <div v-if="showModal" class="modal-overlay">
                <div class="modal">
                    <h3>Thêm quyền mới</h3>
                    <input type="text" v-model.lazy="newRoleName" placeholder="Nhập quyền mới">
                    <div class="modal-actions">
                        <button @click="handleRolesAdd">Xác nhận</button>
                        <button @click="canceAdd">Hủy</button>
                    </div>
                </div>
            </div>
            <div v-if="showModalAuthority" class="modal-overlay">
                <div class="modal-author">
                    <h3>Cấp quyền</h3>
                    <div class="input-content">
                        <div class="input-account">
                            <label for="accounts">Chọn tài khoản</label>
                            <select v-model="rolesDetail.accountId" id="accounts">
                                <option v-for="account in accounts.data" :key="account.accountId" :value="account.accountId">{{ account.username }}</option>
                            </select>
                            <p>{{rolesDetail.accountId  }}</p>
                        </div>

                        <div class="input-roles">
                            <label for="roles">Chọn quyền</label>
                            <select v-model="rolesDetail.rolesId" id="roles">
                                <option v-for="role in roles.data" :key="role.rolesId" :value="role.rolesId">{{ role.rolesName }}</option>
                            </select>
                            <p>{{ rolesDetail.rolesId }}</p>
                        </div>

                        <div class="input-roles-group">
                            <label>
                                <input type="radio" name="roles-group" @click="selectAccount('manager')" :checked="rolesDetail.manager">
                                Quản lí
                            </label>
                            <label>
                                <input type="radio" name="roles-group" @click="selectAccount('staff')" :checked="rolesDetail.staff">
                                Nhân viên
                            </label>
                            <label>
                                <input type="radio" name="roles-group" @click="selectAccount('guest')" :checked="rolesDetail.guest">
                                Phòng khác
                            </label>

                        </div>

                        <div class="input-roles-operations">
                            <label>
                                <input type="checkbox" v-model="rolesDetail.creater">
                                Tạo
                            </label>
                            <label>
                                <input type="checkbox" v-model="rolesDetail.reader">
                                Xem
                            </label>
                            <label>
                                <input type="checkbox" v-model="rolesDetail.writer">
                                Sửa
                            </label>
                            <label>
                                <input type="checkbox" v-model="rolesDetail.deleter">
                                Xóa
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button @click="handleRolesDetailAdd(rolesDetail.accountId,rolesDetail.rolesId)">Xác nhận</button>
                            <button @click="canceAddRolesDetail">Hủy</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { computed, reactive ,ref} from 'vue';
import { onMounted } from 'vue';

const roles = reactive({
    data:[]
})
const accounts = reactive({
    data:[]
})
const showModalAuthority =ref(false)

const showModal = ref(false)

const newRoleName =ref('')

const rolesDetail = reactive(
    {
        accountId : null,
        rolesId :null,
        manager :false,
        staff:false,
        guest:false,
        reader:false,
        writer:false,
        creater:false,
        deleter:false


    }
)

const selectAccount = (position) => {
    rolesDetail.manager = false;
    rolesDetail.staff = false;
    rolesDetail.guest = false;
  
    rolesDetail[position] = true; // Chọn tài khoản
};

const handleRolesGet = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GETROLES)
        if(response.status === 200){
            console.log('get roles success')
            roles.data = response.data.result
        }
    } catch (error) {
       
        console.log('err get roles')
    }
    
}

const handleAccountGet = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GETACCOUNT)
        if(response.status === 200){
            console.log('get account success from roles view')
            accounts.data = response.data.result
            console.log(accounts.data)
        }
    } catch (error) {
        console.log('err get roles')
    }
}
    

const handleRolesAdd = async () =>{
    try {
        const response = await axios.post(API_ENDPOINTS.ADDROLSE,
        {
            rolesName:newRoleName.value
        })
        if(response.status === 200){
            console.log('add roles success')
            roles.data.push({rolesName:newRoleName.value})
            showModal.value=false

        }
    } catch (error) {
        
    }
}
const canceAdd = () =>{
    showModal.value=false
    newRoleName.value=''
}

const handleRolesDetailAdd = async(accountId,rolesId) =>{
    try {
        const response = await axios.post(API_ENDPOINTS.ADDROLESDETAIL(accountId,rolesId),
        {
            manager :rolesDetail.manager,
            staff:rolesDetail.staff,
            guest:rolesDetail.guest,
            reader:rolesDetail.reader,
            writer:rolesDetail.writer,
            creater:rolesDetail.creater,
            deleter:rolesDetail.deleter
        })
        if(response.status === 200){
            console.log('add rolesdetail success')
            handleRolesGet()
            showModalAuthority.value=false
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
        console.log('add rolesdetail err', error);
    }
}
const canceAddRolesDetail = () =>{
    showModalAuthority.value=false
}
const departments = reactive({
    data:[]
})
const filteredRoles = computed(() => {
    return roles.data.filter(role => 
        !departments.data.map(department => department.departmentName).includes(role.rolesName)
    );
});
const handleGetDepartment = async() =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENT)
        if(response.status === 200){
            console.log('get depaerment success form rolesdepartment')
            departments.data = response.data.result
            console.log(departments.data)
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

onMounted( ()=>{
    handleRolesGet()
    handleAccountGet()
    handleGetDepartment()
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