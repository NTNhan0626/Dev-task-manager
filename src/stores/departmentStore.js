import { defineStore } from "pinia";

export const useDepartmentStore = defineStore('department',{
    state: () => ({
        departmentRespone :{
            data:[]
        }
    }),
    getters:{
        getDepartment :(state) => state.departmentRespone.data
    }
    ,actions:{
        putDepartmentsToStore(departmentResponses) {
            // Kiểm tra nếu departmentResponses là một mảng
            console.log('Adding departments to store:', departmentResponses); 
            if (Array.isArray(departmentResponses)) {
                console.log('aray')
                if(this.departmentRespone.data.length ===0){
                    this.departmentRespone.data.push(...departmentResponses);
                }
                
            } else {
                // Nếu không phải là mảng, thêm một phòng ban đơn lẻ
                this.departmentRespone.data.push(departmentResponses);
            }
        }
    }
})