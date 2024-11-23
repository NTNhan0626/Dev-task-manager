<template>
    <div class="rolesdetail-content">
        <div class="rolesdetail-table">
            <p>Bảng chi tiết quyền </p>
            <table>
                <thead>
                    <tr>
                        <th>Tài khoản</th>
                        <!-- <th>Quyền trên</th> -->
                        <th>Quản lí</th>
                        <th>Nhân viên</th>
                        <th>Bộ phận khác</th>

                        <th>Đọc</th>
                        <th>Thêm</th>
                        <th>Sửa</th>
                        <th>Xóa</th>

                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rolesdetail in rolesDetails.data" :key="rolesdetail.rolesDetailId">
                        <td>{{ rolesdetail.accountResponse.username }}</td>
                        <td>{{ rolesdetail.manager? 'Yes': 'No' }}</td>
                        <td>{{ rolesdetail.staff? 'Yes': 'No' }}</td>
                        <td>{{ rolesdetail.guest? 'Yes': 'No' }}</td>

                        <td>{{ rolesdetail.reader? 'Yes': 'No' }}</td>
                        <td>{{ rolesdetail.creater? 'Yes': 'No' }}</td>
                        <td>{{ rolesdetail.writer? 'Yes': 'No' }}</td>
                        <td>{{ rolesdetail.deleter? 'Yes': 'No' }}</td>

                        <td><button @click="showModalEdit=true,accountId=rolesdetail.accountResponse.accountId">Chỉnh sửa</button> <button>Xóa</button></td>
                    </tr>
                </tbody>
            </table>

            <div v-if="showModalEdit" class="modal-overlay">
                <div class="modal-edit">
                    <h3>Chỉnh sửa quyền</h3>
                    <div class="input-content">
                        <div class="input-roles-groub">
                            <label>
                                <input type="radio" name="roles-groub" @click="selectAccount('manager')" :checked="rolesDetails.manager">
                                Quản lí
                            </label>
                            <label>
                                <input type="radio" name="roles-groub" @click="selectAccount('staff')" :checked="rolesDetails.staff">
                                Nhân viên
                            </label>
                            <label>
                                <input type="radio" name="roles-groub" @click="selectAccount('guest')" :checked="rolesDetails.guest">
                                Phòng khác
                            </label>
                        </div>
                        <div class="input-roles-operations">
                            <label>
                                <input type="checkbox" v-model="rolesDetails.reader">
                                Đọc
                            </label>
                            <label>
                                <input type="checkbox" v-model="rolesDetails.creater">
                                Thêm
                            </label>
                            <label>
                                <input type="checkbox" v-model="rolesDetails.writer">
                                Sửa
                            </label>
                            <label>
                                <input type="checkbox" v-model="rolesDetails.deleter">
                                Xóa
                            </label>
                        </div>
                        <div class="modal-action">
                            <button @click="handleEditRolesDetail(rolesId,accountId)">Xác nhận</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/api/api';
    const showModalEdit =ref(false)
    const rolesDetails = reactive({
        data:[]
    })
    const route = useRoute();
    const rolesId = route.params.rolesId
    const accountId = ref(null)

    const selectAccount = (position) =>{
        rolesDetails.manager = false,
        rolesDetails.staff = false,
        rolesDetails.guest = false,
        rolesDetails[position]=true
    }

    const handleGetRolesDetailByRolesId = async (rolesId)=>{
        try {
            const response = await axios.get(API_ENDPOINTS.GET_ROLESDETAILBYROLESID(rolesId))
            if(response.status === 200){
                console.log('get roles detail by rolesId success by rolesdetail')
                rolesDetails.data = response.data.result
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
            console.log('get rolesdetail err', error);
            
        }
    }

    const handleEditRolesDetail =  async (rolesId,accountId) =>{
    try {
        const response = await axios.put(API_ENDPOINTS.UPDATE_ROLESDETAIL(accountId,rolesId),{
            manager: rolesDetails.manager,
            staff: rolesDetails.staff,
            guest: rolesDetails.guest,
            reader: rolesDetails.reader,
            writer: rolesDetails.writer,
            creater: rolesDetails.creater,
            deleter: rolesDetails.deleter
        })
        if(response.status === 200){
            console.log('edit rolesdetail success')
            handleGetRolesDetailByRolesId(rolesId)
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
            console.log('edit rolesdetail err', error);
        
        }
    }
    onMounted(()=>{
        handleGetRolesDetailByRolesId(rolesId)
    })
</script>
<style>
</style>