<template>
    <div class="account-create-content">
        <div class="sigin-box">
            <form @submit.prevent="handleSigin">
                <div class="input-group">
                    <label for="username">Nhập tài khoản</label>
                    <input type="text" id="username" placeholder="tài khoản" v-model="account.username">

                    <label for="password">Nhập mật khẩu</label>
                    <input type="password" id="password" placeholder="mật khẩu" v-model="account.password">

                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="email" v-model="account.email">

                    <button type="submit" class="sigin-btn">Đăng kí</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { reactive } from 'vue';

const account = reactive(
    {
        username :'',
        password:'',
        email:''
    }
)

const handleSigin = async () =>{
    try {
            const response = await axios.post(API_ENDPOINTS.REGISTER,
            {
                username : account.username,
                password : account.password,
                email : account.email
            }
        )
        if(response.status === 200){
            console.log('add account success')
            console.log(response.data.result)
            alert('Tạo tài khoản thành công')
        }
    } catch (error) {
        alert('Tạo tài khoản thất bại')
    }
    
}


</script>
<style scoped>
.account-create-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.signin-box {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 300px;
}

.input-group {
    display: flex;
    flex-direction: column;
}

.input-group label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}

.input-group input {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
}

.signin-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.signin-btn:hover {
    background-color: #45a049;
}

.signin-btn:active {
    background-color: #3e8e41;
}

</style>