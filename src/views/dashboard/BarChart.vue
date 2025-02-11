<template>
    <div class="main-bar">
        <h2>Thống kê toàn hệ thống</h2>
        <h3 v-if="!showH3filter">Bảng thống kê tất cả dự án trong hệ thống: </h3>
        <h3 v-if="showH3filter">Bảng thống kê tất cả dự án trong hệ thống: từ ngày {{ filterDateStart }} đến ngày {{ filterDateEnd }} </h3>
        <p class="filter-container">
            Lọc: 
            <label>
                từ ngày: 
                <input v-model="filterDateStart" type="date" class="filter-input">
            </label>
            <label>
                tới ngày: 
                <input v-model="filterDateEnd" type="date" class="filter-input">
            </label>
            <button @click="applyFilters" class="filter-button apply-button">Lọc</button>
            <button @click="resetFilters" class="filter-button reset-button">Xóa lọc</button>
        </p>
        <div class="bar-chart">
            <ChartComponent :data="chartData" :options="chartOptions" />
        </div>
        <div class="project-stats-container">
            <table class="project-stats-table">
                <thead>
                    <tr>
                    <th>Loại thống kê</th>
                    <th>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Tổng số lượng dự án</td>
                    <td>{{ projectStats[0] }}</td>
                    </tr>
                    <tr>
                    <td>Số lượng dự án hoàn thành</td>
                    <td>{{ projectStats[1] }}</td>
                    </tr>
                    <tr>
                    <td>Số lượng dự án chưa hoàn thành</td>
                    <td>{{ projectStats[2] }}</td>
                    </tr>
                    <tr>
                    <td>Số dự án hoàn thành đúng hạn</td>
                    <td>{{ projectStats[3] }}</td>
                    </tr>
                    <tr>
                    <td>Số dự án trễ hạn</td>
                    <td>{{ projectStats[4] }}</td>
                    </tr>
                    <tr>
                    <td>Số dự án bị hủy</td>
                    <td>{{ projectStats[5] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import API_ENDPOINTS from '@/api/api';
import ChartComponent from '@/components/ChartComponent.vue';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from "vue";


const chartData = ref({
    labels: ['Số dự án', 'Hoàn thành', 'Chưa hoàn thành', 'Hoàn thành đúng hạn', 'Hoàn thành trễ hạn', 'Bị hủy'],
    datasets: [
      {
        label: 'Số lượng dự án',
        data: [100,40,20,48,10,20], // Mặc định không có dữ liệu
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
});


const updateGraph = (array) => {
  // Cập nhật chartData với dữ liệu mới, xóa dữ liệu cũ
  chartData.value = {
    labels: ['Số dự án', 'Hoàn thành', 'Chưa hoàn thành', 'Hoàn thành đúng hạn', 'Hoàn thành trễ hạn', 'Bị hủy'],
    datasets: [
      {
        label: 'Số lượng dự án',
        data: array, // Mặc định không có dữ liệu
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

  const token = sessionStorage.getItem("token");
  const projectResponse = reactive({ data: [] });

  const filterDateStart = ref(null);
  const filterDateEnd = ref(null)

  // Dự án đã lọc
const filteredProjects = ref([]);
const showH3filter =ref(false)
// Hàm lọc dữ liệu


const applyFilters = () => {
    showH3filter.value = true
  const start = filterDateStart.value ? new Date(filterDateStart.value) : null;
  const end = filterDateEnd.value
    ? new Date(new Date(filterDateEnd.value).setHours(23, 59, 59, 999))
    : null;

  filteredProjects.value = projectResponse.data.filter((project) => {
    const cdDate = new Date(project.createdDate);
    return (
      (!start || cdDate >= start) &&
      (!end || cdDate   <= end)
    );
  });
  updateGraph(projectStats.value)
};

// Hàm xóa lọc
const resetFilters = () => {
    showH3filter.value = false
    filterDateStart.value = null;
    filterDateEnd.value = null;
    filteredProjects.value = projectResponse.data; // Hiển thị tất cả khi xóa lọc
    updateGraph(projectStats.value)
};

  
  const projectStats = computed(() => {
    const totalProjects = filteredProjects.value.length;
    const completedProjects = filteredProjects.value.filter(project => project.status === 'Completed').length;
    const inProgressProjects = filteredProjects.value.filter(project => project.status === 'In Progress').length;
    
    const completedOnTime = filteredProjects.value.filter(project => {
      const actualEndDate = project.actualEndDate ? new Date(project.actualEndDate) : null;
      const endDate = new Date(project.endDate);
      return project.status === 'Completed' && actualEndDate && actualEndDate <= endDate;
    }).length;
  
    const completedLate = filteredProjects.value.filter(project => {
      const actualEndDate = project.actualEndDate ? new Date(project.actualEndDate) : null;
      const endDate = new Date(project.endDate);
      return project.status === 'Completed' && actualEndDate && actualEndDate > endDate;
    }).length;
  
    const canceledProjects = filteredProjects.value.filter(project => project.projectCondition === 'canceled').length;
  
    return [
      totalProjects,         // Tổng số dự án
      completedProjects,     // Số dự án hoàn thành
      inProgressProjects,    // Số dự án chưa hoàn thành
      completedOnTime,       // Số dự án hoàn thành đúng hạn
      completedLate,         // Số dự án hoàn thành trễ hạn
      canceledProjects       // Số dự án bị hủy
    ];    
  });

  // Tùy chỉnh biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    },
    scales: {
    x: {
      title: {
        display: false,
        text: "Danh mục",
      },
    },
    y: {
      title: {
        display: true,
        text: "Số lượng",
      },
    },
  },
  };
    
  // Hàm lấy dữ liệu dự án
  const handleGetProject = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GETALL_PROJECT, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data.result)
        projectResponse.data = response.data.result;
        filteredProjects.value = response.data.result;
        updateGraph(projectStats.value)
      }
    } catch (error) {
      console.error(error);
    }
  };
onMounted(()=>{
    handleGetProject()
})
</script>
<style scoped>
.bar-chart{
    width: 90%;
    height: 500px;
    display: flex;
    justify-content: center;
}
/* Container styling */
.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Input field styling */
.filter-input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/* Button styling */
.filter-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Specific styles for each button */
.apply-button {
  background-color: #007bff;
  color: white;
}

.apply-button:hover {
  background-color: #0056b3;
}

.reset-button {
  background-color: #dc3545;
  color: white;
}

.reset-button:hover {
  background-color: #a71d2a;
}

.project-stats-container {
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.project-stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.project-stats-table th,
.project-stats-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.project-stats-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.project-stats-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.project-stats-table tr:hover {
  background-color: #f1f1f1;
}

.project-stats-table td {
  text-align: left;
}
</style>