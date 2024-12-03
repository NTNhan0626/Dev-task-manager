<template>
    <div class="category-content">
        <div class="category-block-content">
            <div class="category-colum" v-for="category in categoryResponses.data" :key="category.categoryId" @click="showModalCategoryDetail(category.categoryId),categoryName='Nghề nghiệp'" >
                <p>{{ category.categoryName }}</p>
                <p>icon</p>
                
           </div>
           
           <div class="category-colum" @click.stop ="showModalCreateCategory = true , columnName='projectType'">
                <p>Thêm dự án</p>
                <p>icon</p>
                
           </div>
           <div class="modal-overlay" v-if="showModal">
                <div class="modal-category">
                    <p>Danh mục của {{ categoryName }}</p>
                    <ul>
                        <li v-for="item in selectedCategory.categoryDetailResponses" :key="item">{{ item.categoryDetailName }}</li>
                    </ul>
                    <div class="input-content" v-if="showAddCategory">
                        <input type="text"  v-model.lazy="cagerogyInputValue">
                        <button @click="handleCategoryDetailAdd()">xác nhận</button>
                    </div>
                    <div class="modal-action">
                        <button @click="showAddCategory = true">Thêm mới</button>
                        <button @click="showModal = false, cagerogyInputValue =''">Quay lại</button>
                    </div>
                </div>
           </div>

           <div class="modal-overlay" v-if="showModalCreateCategory">
                <div class="modal-category">
                    <p>Thêm danh mục mới:</p>
                    
                    <div class="input-content">
                        <input type="text"  v-model.lazy="categoryRequest.categoryName">
                        
                    </div>
                    <div class="modal-action">
                        <button @click="handleCategoryAdd()">xác nhận</button>
                        <button @click="showModalCreateCategory = false ,categoryRequest.categoryName =''">Quay lại</button>
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

const token = sessionStorage.getItem("token")
const categoryName = ref("")
const categoryId = ref(null)
const showModal = ref(false)
const showAddCategory = ref(false)
const showModalCreateCategory = ref(false)
const cagerogyInputValue = ref("")
const categoryResponses =  reactive({
    data:[]
})

const categoryRequest =  reactive({
    categoryName : ""
})
const selectedCategory = computed(() => {
    return categoryResponses.data.find(category => category.categoryId === categoryId.value) || null;
});

const showModalCategoryDetail = (Id) =>{
    categoryId.value = null
    showModal.value= true
    categoryId.value = Id
    console.log(categoryId.value)
}



const handleCategoryGet = async() =>{
    try {
        const respone = await axios.get(API_ENDPOINTS.GET_CATEGORY,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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
        const respone = await axios.post(API_ENDPOINTS.ADD_CATEGORY,categoryRequest,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
const handleCategoryDetailAdd = async() => {
    try {
        const respone = await axios.post(API_ENDPOINTS.ADD_CATEGORY_DETAIL(categoryId.value),{
            categoryDetailName: cagerogyInputValue.value
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            handleCategoryGet()
            showAddCategory.value = false
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
    max-width: calc(25% - 10px);
}

/* Modal Overlay Styling */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Background semi-transparent */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Make sure it's above everything else */
}

/* Modal Container */
.modal-category {
    background-color: #fff; /* White background */
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Smooth shadow */
    width: 90%;
    max-width: 400px;
    padding: 20px;
    animation: fadeIn 0.3s ease-in-out; /* Subtle fade-in effect */
    position: relative;
}

/* Modal Header */
.modal-category p {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
}

/* Modal Input Content */
.input-content {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}

.input-content input {
    width: calc(100% - 120px); /* Dynamic width for input */
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
}

.input-content button {
    padding: 8px 12px;
    background-color: #007bff; /* Primary blue */
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease-in-out;
}

.input-content button:hover {
    background-color: #0056b3; /* Darker blue on hover */
}

/* Modal Actions */
.modal-action {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.modal-action button {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modal-action button:first-child {
    background-color: #28a745; /* Green */
    color: #fff;
}

.modal-action button:first-child:hover {
    background-color: #218838; /* Darker green */
}

.modal-action button:last-child {
    background-color: #dc3545; /* Red */
    color: #fff;
}

.modal-action button:last-child:hover {
    background-color: #c82333; /* Darker red */
}

/* Animation for Modal */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

ul {
    list-style-type: none;
}
</style>