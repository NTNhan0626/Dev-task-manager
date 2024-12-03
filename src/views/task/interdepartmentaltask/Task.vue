<template>
    <div>
      <h1>Quản lý công việc</h1>
      <!-- Đệ quy hiển thị cây công việc -->
      <TaskNode
        v-for="(task, index) in taskReponse.data"
        :key="task.id"
        :task="task"
        @add-child="addChild"
        @update-task="handleGetTaskInProject"
      />
    </div>
</template>
  
<script setup>
import { onMounted, reactive } from 'vue';
import TaskNode from './TaskNode.vue';
import axios from 'axios';
import API_ENDPOINTS from '@/api/api';
import { useRoute } from 'vue-router';
const token = sessionStorage.getItem("token")

const router = useRoute()
const projectId = router.params.projectId
const taskReponse = reactive({
  data:[]
})
  // Cấu trúc dữ liệu công việc dạng cây
  const tasks = reactive([
    {
      id: 1,
      title: 'Công việc cha 1',
      children: [],
    },
    {
      id: 2,
      title: 'Công việc cha 2',
      children: [],
    },
  ]);
  
  // Hàm thêm công việc con
  const addChild = ({ childTask }) => {
  
    console.log(taskReponse.data)
    // Hàm tìm công việc theo ID (đệ quy)
    const findTask = (nodes, id) => {
      for (const node of nodes) {
        if (node.taskId === id) return node;
        if (node.taskResponseList.length > 0) {
          const result = findTask(node.taskResponseList, id);
          if (result) return result;
        }
      }
      return null;
    };
  
    // Tìm công việc cha trong cây
    const parent = findTask(taskReponse.data, childTask.taskParentId);
    if (parent) {
      handleCreateTask(childTask)
      // parent.children.push({
      //   id: 22222, // Tạo ID duy nhất
      //   title: newTaskTitle,
      //   children: [],
      // });
    }
  };

  const handleGetTaskInProject = async () =>{
    try {
      const response = await axios.get(API_ENDPOINTS.GET_TASKINPROJECT(projectId),{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      if(response.status === 200){
        console.log("get task in project success")
        taskReponse.data = response.data.result
        console.log(taskReponse.data)
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
        console.log('get task in project err', error);
    }
  }
  const handleCreateTask = async (childTask) =>{
    try {
      const response = await axios.post(API_ENDPOINTS.CREATE_TASK(projectId),childTask,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })

      if(response.status === 200){
        console.log("create task success")
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
        console.log('create task err', error);
    }
  }

  onMounted(() =>{
    handleGetTaskInProject()
  })
  </script>
  
  <style>
  h1 {
    text-align: center;
  }
  </style>
  