<template>
    <div class="account-get-content">
        <div class="account-table-infor">
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
                        <th>
                            Thao tác
                        </th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="account in accounts.data" :key="account.accountId">
                        <td>{{ account.accountId }}</td>
                        <td>{{ account.username }}</td>
                        <td>{{ account.email }}</td>
                        <td>{{ account.status }}</td>
                        <td>{{ account.dateCreate }}</td>
                        <td><span v-for="degree in account.detailResponses">{{ degree.degreeName }}, </span></td>
                        <td><span v-for="specialization in account.specializationDetailResponses">{{ specialization.specializationName }}, </span></td>
                        
                        <td>Thêm Sửa Xóa</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { reactive } from 'vue';
import { onMounted } from 'vue';

const accounts = reactive(
    {
        data: []
    }
)

const handleGetAccount = async () =>{
    try {
        const response = await axios.get(API_ENDPOINTS.GETACCOUNT)
       
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
onMounted(()=>{
    handleGetAccount();
});

</script>
<style scoped></style>