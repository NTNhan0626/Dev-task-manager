<template>
    <div class="roles-add-content">
      <div class="roles-table-infor">
        <h3>Bảng phân quyền theo phòng ban</h3>
        <table>
          <thead>
            <tr>
              <th v-for="role in filteredRoles" :key="role.rolesId">
                <RouterLink :to="{ name: 'roles-detail', params: { rolesId: role.rolesId },query:{filter:'role-department'} }">
                  {{ role.rolesName }}
                </RouterLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="role in filteredRoles" :key="role.rolesId">
                <ul>
                  <li v-for="account in role.accountResponseList" :key="account.username">
                    {{ account.username }}
                  </li>
                </ul>
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
import { computed, reactive ,ref} from 'vue';
import { onMounted } from 'vue';
const token = sessionStorage.getItem("token")
const typeRoles = "rolesDepartment"
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
    
const departments = reactive({
    data:[]
})

const filteredRoles = computed(() => {
    return roles.data.filter(role => 
        departments.data.map(department => department.departmentName).includes(role.rolesName)
    );
});


const handleGetDepartment = async() =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENT,{
          headers:{
          'Authorization': `Bearer ${token}`
        }
        })
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
onMounted(async () => {
    await Promise.all([
        handleRolesGet(),
        handleAccountGet(),
        handleGetDepartment()
    ]);
    console.log('Filtered Roles after data load:', filteredRoles.value); // Kiểm tra giá trị của filteredRoles

});

</script>

<style scoped>
.roles-add-content {
  margin: 20px;
}

.roles-table-infor table {
  width: 100%;
  border-collapse: collapse;
}

.roles-table-infor th,
.roles-table-infor td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.roles-table-infor th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.roles-table-infor ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.roles-table-infor li {
  margin: 4px 0;
}
</style>
