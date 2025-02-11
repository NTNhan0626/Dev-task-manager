<template>
    <div class="account-create-content">
        <div class="signin-box">
            <form @submit.prevent="handleSigin">
                <h2 class="form-title">Tạo tài khoản nhân viên</h2>
                <div class="input-group">
                    <label for="username">Nhập tài khoản</label>
                    <input type="text" id="username" placeholder="Tài khoản" v-model="account.username" required>

                    <label for="password">Nhập mật khẩu</label>
                    <input type="password" id="password" placeholder="Mật khẩu" v-model="account.password" required>

                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Email" v-model="account.email" required>

                    <button type="submit" class="signin-btn">Đăng ký</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { reactive } from 'vue';

const account = reactive({
    username: '',
    password: '',
    email: '',
    status: 'Active',
    dateCreate: new Date()
});

const handleSigin = async () => {
    try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, account);
        if (response.status === 200) {
            console.log('add account success');
            console.log(response.data.result);
            alert('Tạo tài khoản thành công');
        }
    } catch (error) {
        alert('Tạo tài khoản thất bại');
    }
};
</script>

<style scoped>
/* Tổng thể */
.account-create-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    
    font-family: 'Arial', sans-serif;
}

/* Hộp đăng nhập */
.signin-box {
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    width: 360px;
    text-align: center;
}

.form-title {
    font-size: 24px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 20px;
}

/* Nhóm input */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group label {
    font-weight: 600;
    color: #333;
    text-align: left;
}

.input-group input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.input-group input:focus {
    border-color: #6e8efb;
    outline: none;
    box-shadow: 0 0 5px rgba(110, 142, 251, 0.5);
}

/* Nút đăng ký */
.signin-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.signin-btn:hover {
    background-color: #45a049;
}

.signin-btn:active {
    background-color: #3e8e41;
    transform: scale(0.98);
}
</style>