<template>
    <div class="category-content">
        <div class="category-block-content">
            <div class="category-colum" @click="showModal = true,categoryName='Nghề nghiệp',columnName='job'">
                <p>Nghề nghiệp</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Chứng chỉ',columnName='certificate'">
                <p>Chứng chỉ</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Bằng cấp',columnName='degree'">
                <p>Bằng cấp</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Chức danh',columnName='title'">
                <p>Chức danh</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Kĩ năng- Nghiệp vụ',columnName='skill'">
                <p>Kĩ năng - Nghiệp vụ</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Công cụ - Dụng cụ',columnName='tools'">
                <p>Công cụ - Dụng cụ</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Tỉnh - Thành phố',columnName='city'">
                <p>Tỉnh - Thành phố</p>
                <p>icon</p>
                
           </div>
           <div class="category-colum"@click="showModal = true,categoryName='Loại dự án',columnName='projectType'">
                <p>Loại dự án</p>
                <p>icon</p>
                
           </div>
           <div class="modal-overlay" v-if="showModal">
                <div class="modal-category">
                    <p>Danh mục của {{ categoryName }}</p>
                    <ul>
                        <li v-for="item in selectedCategoryColumnList" :key="item">{{ item }}</li>
                    </ul>
                    <div class="input-content" v-if="showAddCategory">
                        <input type="text"  v-model.lazy="cagerogyInputValue">
                        <button @click="handleCategoryAdd()">xác nhận</button>
                    </div>
                    <div class="modal-action">
                        <button @click="showAddCategory = true">Thêm mới</button>
                        <button @click="showAddCategory = false">Quay lại</button>
                    </div>
                </div>
           </div>
        </div>
    </div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
const categoryName = ref("")
const columnName = ref("")
const showModal = ref(false)
const showAddCategory = ref(false)
const cagerogyInputValue = ref("")
const categoryResponses =  reactive({
    data:[]
})

const selectedCategoryColumnList = computed(() => {
    return categoryResponses.data.map(categoryRespone => categoryRespone[columnName.value]).filter(Boolean)
});



const handleCategoryGet = async() =>{
    try {
        const respone = await axios.get(API_ENDPOINTS.GET_CATEGORY)
        if(respone.status === 200){
            console.log('get category success')
            categoryResponses.data = respone.data.result
            console.log(categoryResponses.data)
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
        console.log('get category err', error);
    }
}
const handleCategoryAdd = async() => {
    try {
        const respone = await axios.post(API_ENDPOINTS.ADD_CATEGORY,{
            [columnName.value]: cagerogyInputValue.value
        })
        if(respone.status === 200){
            handleCategoryGet()
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
        console.log('add category err', error);
    }
}
onMounted(()=>{
        handleCategoryGet()
    })
</script>
<style scoped>
.category-block-content {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* khoảng cách giữa các khối */
}

.category-colum {
    flex: 1 1 calc(25% - 10px); /* mỗi khối chiếm 25% của container */
    box-sizing: border-box;
    padding: 20px;
    background: #f0f0f0;
    text-align: center;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-category {
    background: white;
    padding: 20px;
    border-radius: 8px;
}
ul {
    list-style-type: none;
}
</style>