<template>
    <div class="category-content">
        <div class="category-block-content">
            <div class="category-colum" v-for="(category,index) in categoryResponses.data" :key="category.categoryId" @click="showCategoryActions = showCategoryActions === index ? null : index"
            >
                <p>{{ category.categoryName }}</p>
                <div class="category-actions" v-if="showCategoryActions===index">
                    <button @click="showModalCategoryDetail(category.categoryId),categoryName=category.categoryName">Chi tiết</button>
                    <button 
                    v-if="['ADMIN','categoryU'].some(role => roles.includes(role))"
                    @click.stop="showEditCategoryModal = true,editingCategoryId = category.categoryId ">Chỉnh sửa</button>
                    <button 
                    v-if="['ADMIN', 'categoryD'].some(role => roles.includes(role))" @click="Conform('DeleteCategory'),editingCategoryId = category.categoryId" style="background-color: red;"
                    >Xóa</button>
                   
                </div>
           </div>
           
           <div v-if="['ADMIN', 'categoryC'].some(role => roles.includes(role))" class="category-colum" @click.stop ="showModalCreateCategory = true , columnName='projectType'">
                <p>+</p>
           </div>
            <div class="modal-overlay" v-if="showModal">
                    <div class="modal-category">
                        <p>Chi tiết của {{ categoryName }}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên chi tiết </th>
                                    <th v-if="['ADMIN', 'categoryD','categoryU'].some(role => roles.includes(role))">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody v-for="item in selectedCategory.categoryDetailResponses" :key="item">
                                <tr>
                                    <td>{{ item.categoryDetailName }}</td>
                                    <td v-if="['ADMIN','categoryU'].some(role => roles.includes(role))">
                                        <button @click="showEditModal = true; editCategoryDetailName.categoryDetailName = item.categoryDetailName; editingCategoryDetailId = item.categoryDetailId;">Chỉnh sửa</button>
                                    </td>

                                    <td v-if="['ADMIN', 'categoryD'].some(role => roles.includes(role))"><button @click="Conform('Delete'); editCategoryDetailName.categoryDetailName = item.categoryDetailName; editingCategoryDetailId = item.categoryDetailId;" style="background-color: red;">Xóa</button></td>
                                </tr>
                            </tbody>
                        </table>
                    
                        <div class="input-content" v-if="showAddCategory">
                            <input type="text"  v-model.lazy="cagerogyInputValue">
                            <button @click="handleCategoryDetailAdd()">xác nhận</button>
                        </div>
                        <div class="modal-action">
                            <button v-if="['ADMIN', 'categoryC'].some(role => roles.includes(role))" @click="showAddCategory = true">Thêm mới</button>
                            <button @click="showModal = false, cagerogyInputValue ='',showAddCategory =false">Quay lại</button>
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

           <div class="modal-overlay" v-if="showEditCategoryModal">
                <div class="modal-category">
                    <p>Chỉnh sửa danh mục</p>
                    <div class="input-content">
                        <input type="text" v-model="categoryRequest.categoryName" />
                    </div>
                    <div class="modal-action">
                        <button @click="Conform('EditCategory')">Xác nhận</button>
                        <button @click="closeConformModal(); categoryRequest.categoryName = '';">Hủy</button>
                    </div>
                </div>
            </div>


           <div class="modal-overlay" v-if="showEditModal">
                <div class="modal-category">
                    <p>Chỉnh sửa chi tiết</p>
                    <div class="input-content">
                        <input type="text" v-model="editCategoryDetailName.categoryDetailName" />
                    </div>
                    <div class="modal-action">
                        <button @click="Conform('Edit')">Xác nhận</button>
                        <button @click="closeConformModal(); editCategoryDetailName.categoryDetailName = '';">Hủy</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" v-if="showConformModal">
                <div class="modal-category">
                    <p v-if="isUseActiontype === 'Edit'">Bạn chắc chắn muốn chỉnh sửa </p>
                    <p v-if="isUseActiontype === 'EditCategory'">Bạn chắc chắn muốn chỉnh sửa danh mục </p>
                    <p v-if="isUseActiontype === 'Delete'">Bạn chắc chắn muốn xóa </p>
                    <p v-if="isUseActiontype === 'DeleteCategory'">Bạn chắc chắn muốn xóa danh mục này</p>
                    <div class="input-content" v-if="['Edit','Delete'].includes(isUseActiontype)">
                        <span type="text">{{editCategoryDetailName.categoryDetailName}}</span> 
                    </div>
                    <div class="input-content" v-if="['EditCategory','DeleteCategory'].includes(isUseActiontype)">
                        <span type="text">{{categoryRequest.categoryName}}</span> 
                    </div>
                    <div class="modal-action">
                        <button @click="submitAction()">Xác nhận</button>
                        <button @click=" closeConformModal(); editCategoryDetailName.categoryDetailName = '';">Hủy</button>
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
const roles = sessionStorage.getItem("roles").split(",")
const token = sessionStorage.getItem("token")
const categoryName = ref("")
const categoryId = ref(null)
const showModal = ref(false)
const showAddCategory = ref(false)
const showModalCreateCategory = ref(false)
const cagerogyInputValue = ref("")
const showEditModal = ref(false)
const showEditCategoryModal = ref(false)
const showConformModal = ref(false)
const showCategoryActions = ref(null)
const categoryResponses =  reactive({
    data:[]
})

const editCategoryDetailName = reactive({
    categoryDetailName:""
})
const editingCategoryDetailId = ref(null)
const editingCategoryId = ref(null)


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
const isUseActiontype = ref("")

const submitAction = async () =>{
    
    if(isUseActiontype.value === 'Edit'){
        console.log('call handleUpdateCategoryDetail')
        await handleUpdateCategoryDetail()
    }else if(isUseActiontype.value === 'EditCategory')
    {
        console.log('call handleDeletedCategory')
        await handleUpdateCategory()
    }
    else if(isUseActiontype.value === 'Delete')
    {
        console.log('call handleDeletedCategoryDetail')
        await handleDeletedCategoryDetail()
    }
    else if(isUseActiontype.value === 'DeleteCategory')
    {
        console.log('call handleDeletedCategory')
        await handleDeletedCategory()
    }

    
    closeConformModal()
}

const Conform = (type) =>{
    isUseActiontype.value = type
    showConformModal.value = true
}
const closeConformModal = () =>{
    showConformModal.value=false
    showEditModal.value=false
    showEditCategoryModal.value = false 
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

const handleUpdateCategory = async () =>{
    try {
        const respone = await axios.put(API_ENDPOINTS.UPDATE_CATEGORY(Number(editingCategoryId.value)),categoryRequest,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('update category success')
            handleCategoryGet()
            closeConformModal()
            
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
        console.log('update category err', error);
    }
}


const handleUpdateCategoryDetail = async () =>{
    try {
        const respone = await axios.put(API_ENDPOINTS.UPDATE_CATEGORY_DETAIL(Number(editingCategoryDetailId.value)),editCategoryDetailName,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('update category detail success')
            handleCategoryGet()
            closeConformModal()
            
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
        console.log('update category detail err', error);
    }
}
const handleDeletedCategoryDetail = async () =>{
    try {
        const respone = await axios.delete(API_ENDPOINTS.DELETE_CATEGORY_DETAIL(Number(editingCategoryDetailId.value)),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('deleted category detail success')
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
        console.log('deleted category detail err', error);
    }
}

const handleDeletedCategory = async () =>{
    try {
        const respone = await axios.delete(API_ENDPOINTS.DELETE_CATEGORY(Number(editingCategoryId.value)),{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(respone.status === 200){
            console.log('deleted category success')
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
        console.log('deleted category err', error);
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

/* Phong cách cho tiêu đề modal */
.modal-category p {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 15px;
}

/* Phong cách cho bảng */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

thead {
    background-color: #f5f5f5;
}

th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    font-weight: bold;
    color: #333;
}

tr:hover {
    background-color: #f9f9f9;
}

/* Phong cách cho nút */
button {
    padding: 8px 12px;
    font-size: 0.9rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Phong cách cho input */
.input-content input {
    padding: 8px;
    width: calc(100% - 100px);
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.input-content button {
    background-color: #28a745;
}

.input-content button:hover {
    background-color: #218838;
}

/* Phong cách cho modal action */
.modal-action {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.modal-action button:first-child {
    background-color: #ffc107;
}

.modal-action button:first-child:hover {
    background-color: #e0a800;
}

.modal-action button:last-child {
    background-color: #dc3545;
}

.modal-action button:last-child:hover {
    background-color: #c82333;
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