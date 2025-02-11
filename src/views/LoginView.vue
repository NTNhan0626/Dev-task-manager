<script setup>
import { RouterView } from 'vue-router';
import {useRouter} from 'vue-router'
import { reactive } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/api/api';
import router from '@/router';

const account = reactive(
{
    username : '',
    password : ''
})
const userAuthResponse = reactive({
  data :[]
})

const handleLogin = async() => {
    try {
        const response = await axios.post(API_ENDPOINTS.LOGIN,
            {
                username: account.username,
                password : account.password
            }
        )
        if(response.status === 200){
          userAuthResponse.data = response.data.result
            console.log(userAuthResponse.data )
            // localStorage.setItem('isLoggedIn',true)
            // localStorage.setItem('token',response.data.result)
            sessionStorage.setItem('isLoggedIn',true)
            sessionStorage.setItem('roles',response.data.result.roles)
            console.log(response.data.result.roles)
            sessionStorage.setItem('departmentName',response.data.result.departmentName)
            console.log(response.data.result.departmentName)
            //typeRoles là quản lí hoạc trưởng quản lí hoặc nhân viên
            sessionStorage.setItem('typeRoles',response.data.result.typeRoles)
            console.log(response.data.result.typeRoles)
            sessionStorage.setItem('departmentId',response.data.result.departmentId)
            sessionStorage.setItem('token',response.data.result.token)
            sessionStorage.setItem('accountId',response.data.result.accountId)
            sessionStorage.setItem('username',response.data.result.userName)
            
            router.push('/home')
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
        console.log('Login failed err', error);
        if(error.response.data.code==='1014'){
          alert('Login failed. your account has been blocked')
        }
        else{
          alert('Login failed. Please check your username and password')
        }
       
        
    }
}

</script>

<template>
    <div class="login-container" >
       
        <div class="login-box">
            <form @submit.prevent="handleLogin" class="login-form" >
                <div class="input-groub">
                    <label for="username">Username: </label>
                    <input type="text" id="username" placeholder="Input Username" v-model="account.username" >
                </div>

                <div class="input-groub">
                    <label for="password">Password: </label>
                    <input type="password" id="password" placeholder="Input Password" v-model="account.password" >
                </div>

                <div class="options">
                <div class="remember-me">
                    <input
                    type="checkbox"
                    id="remember"
                    v-model="rememberMe"
                    />
                    <label for="remember">Remember me</label>
                </div>
                <a href="#" class="forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" class="login-btn" :disabled="isLoading">
                {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>
               
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(145deg, #944428, #510087);
}

.login-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  text-align: left;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
}

.login-icon {
  margin-bottom: 1.5rem;
}

.login-icon img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ff00ff;
  padding: 10px;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
}

input {
  width: 80%;
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
}

input::placeholder {
  color: #fff;
  opacity: 0.8;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.remember-me label {
  color: #fff;
}

.forgot-password {
  color: #fff;
  text-decoration: none;
}

.login-btn, .register-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.login-btn {
  background: #ff00ff;
  margin-bottom: 1rem;
}

.register-btn {
  background: transparent;
  border: 1px solid #ff00ff;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
