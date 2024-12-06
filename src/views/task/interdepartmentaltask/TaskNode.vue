<template>
  <div class="task-node">
    <div class="task">
      <span
        class="task-title"
        @click="showTaskAction === task.taskId ? (showTaskAction = null) : (showTaskAction = task.taskId) , showDetails = false"
      >
        {{ task.taskName }} + {{ task.taskId }}
      </span>
      <div class="task-actions" v-if="showTaskAction === task.taskId && ((roles.includes('leadmanager') && loginAcountId===task.projectCreaterId) || loginAcountId === task.managerTaskId || loginAcountId === task.parentManagerTaskId || loginAcountId === task.projectManagerId) && task.taskCondition==='Active'">
        <button class="btn-details" @click.stop="toggleDetails">🔍 Xem chi tiết</button>
        <button v-if="task.taskDetailResponses.length !==1 || task.parentTaskEmployeeSize !==1" class="btn-add-child" @click.self="openModal(task.taskDetailResponses.length)">➕ Công việc con</button>
        <button v-if="task.taskDetailResponses.length !==1 || task.parentTaskEmployeeSize !==1" class="btn-add-child" @click="openEmployeeSelectionModal(task.projectId)">Thêm nhân viên</button>

        <button class="btn-add-child" v-if="(loginAcountId === task.parentManagerTaskId || loginAcountId === task.managerTaskId || (roles.includes('leadmanager') && loginAcountId===task.projectCreaterId) || loginAcountId === task.projectManagerId) && (task.managerTaskId !==task.parentManagerTaskId || task.parentTaskEmployeeSize!==1)"
        @click.stop="showModalReadLogwork = true , handleGetLogWork(task.taskId)"
        >Xem Logwork</button>
        
        <button class="btn-add-child" v-if="(loginAcountId === task.managerTaskId) && (task.managerTaskId !==task.parentManagerTaskId)"
        @click.stop="showModalCreateLogwork = true"
        >Thêm Logwork</button>
      </div>
      
    </div>
    <!-- modal thêm công việc con -->
    <div v-if="showModalAddChildTask" class="modal-overlay">
      <div class="modal">
        <h3>Thêm công việc con</h3>
        <form @submit.prevent="submitChildTask">
          <label>
            Tên công việc:
            <input v-model="childTask.taskName" type="text" required />
          </label>
          <label>
            Mô tả:
            <textarea v-model="childTask.description" rows="3"></textarea>
          </label>
          <label>
            Trạng thái:
            <select v-model="childTask.status">
              <option value="Pending">Pending</option>
            </select>
          </label>
          <label>
            Ngày kết thúc dự kiến:
            <input v-model="childTask.endDate" type="date" />
          </label>

          <div class="form-actions">
            <button type="submit" class="btn-confirm">Thêm</button>
            <button type="button" class="btn-cancel" @click="closeModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEmployeeSelectionModal" class="modal-overlay">
        <div class="modal">
          <h3>Chọn nhân viên tham gia dự án</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Tên nhân viên</th>
                <th>Chuyên môn</th>
                <th>Trạng thái</th>
                <th v-if="task.managerTaskId === null">Phụ trách</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filterAccountResponse" :key="employee.username">
                <td>
                  <input type="checkbox" v-model="selectedEmployees" :value="employee.accountId" />
                </td>
                <td>{{ employee.username }}</td>
                <td>{{ employee.specializations }}</td>
                <td>{{ employee.statusProject }}</td>
                <td v-if="task.managerTaskId === null" ><input type="radio" name="manager" @click.stop="selectedManagerTaskId(employee.accountId)" ></td>
                
              </tr>
            </tbody>
          </table>

          <div class="form-action">
            <button type="button" @click="handlecreateTaskDetailResponseList()">Thêm nhân viên</button>
            <button type="button" @click="showEmployeeSelectionModal = false">Hủy</button>
          </div>
        </div>
      </div>

    <div class="children">
      <TaskNode
        v-for="(child, index) in task.taskResponseList"
        :key="child.taskId"
        :task="child"
        @add-child="$emit('add-child', $event)"
        @update-task="$emit('update-task',$event)"
      />
    </div>
  </div>

  <div class="project-details" v-if="showDetails">
      <h1>Chi tiết công việc</h1>
      <!-- Thông tin chung về dự án -->
      <div class="project-info">
        <p><strong>ID công việc:</strong> {{ task.taskId }}</p>
        <p><strong>Tên công việc:</strong> {{ task.taskName }}</p>
        <p><strong>Mô tả:</strong> {{ task.description }}</p>
        <p><strong>Loại công việc:</strong> {{ task.projectType ? 'Nội bộ' : 'Liên phòng ban' }}</p>
        <p><strong>Ngày tạo:</strong> {{ formatDate(task.createDate) }}</p>
        <p><strong>Ngày bắt đầu:</strong> {{ formatDate(task.startDate) }}</p>
        <p><strong>Ngày kết thúc dự kiến:</strong> {{ formatDate(task.endDate) }}</p>
        <p><strong>Ngày kết thúc thực tế:</strong> {{ formatDate(task.actualEndDate) }}</p>
        <p><strong>Trạng thái:</strong> <span class="status">{{ task.status }}</span></p>
        <p><strong>Tình trạng:</strong> <span class="status">{{ task.taskCondition }}</span></p>
  
        <!-- Thanh tiến trình -->
        <p><strong>Tiến độ:</strong></p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: task.progress + '%' }">
            {{ task.progress }}%
          </div>
        </div>
  
        <p><strong>Tài khoản phụ trách:</strong> {{ task.parentTaskName }}</p>
      </div>
      <div>
        <button v-if="loginAcountId === task.managerTaskId">
          <RouterLink
          :to="{
            name:'issues-request',
            params:{taskId:task.taskId}
          }"
          >Phát sinh</RouterLink>
          </button>
      </div>
      
      <!-- Danh sách nhân viên tham gia dự án -->
      <div class="employee-list">
        <h2>Danh sách nhân viên tham gia</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tài khoản</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Công việc</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in task.taskDetailResponses" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ detail.accountName }}</td>
              <td>{{ detail.status }}</td>
              <td>{{ formatDate(detail.joinDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="taskdetail-actions" v-if="loginAcountId === task.managerTaskId">
        <button v-if="task.status !== 'In Progress' && task.status !== 'Completed'" 
        :disabled="task.parentTaskStatus !== 'In Progress' && task.parentTaskStatus !== null"
        @click.stop="openUseModal('startTask')"
        >Bắt đầu</button>
      </div>
      <div class="taskdetail-actions" v-if="task.status === 'In Progress' && loginAcountId === task.managerTaskId">
        <button :disabled="!((roles.includes('leadmanager') && loginAcountId===task.projectCreaterId) || loginAcountId===task.parentManagerTaskId || loginAcountId === task.projectManagerId)" @click.stop="showmodalUpdateStask = true">Chỉnh sửa</button>
        <button v-if="loginAcountId===task.managerTaskId" @click="openModalUpdateTaskProgress() ">Cập nhật tiến độ</button>
        <button :disabled="task.progress !== '100' || loginAcountId !==task.managerTaskId"
        @click.stop="openUseModal('taskCompleted')"
        >Hoàn thành</button>
      </div>
  </div>

  <!-- Modal nhập tiến độ -->
  <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Cập nhật tiến độ</h2>
        <label for="progress">Tiến độ:</label>
        <input type="number" v-model="progress" min="0" max="100" />
        <div class="form-actions">
          <button class="btn-confirm" @click="handleUpdateTaskProgress(task.taskId)">Xác nhận</button>
          <button class="btn-cancel" @click="closeModalUpdateTaskProgress">Hủy</button>
        </div>
      </div>
    </div>

  <!-- modal chỉnh sưar công việc -->
  <div v-if="showmodalUpdateStask" class="modal-overlay">
      <div class="modal">
        <h3>Chỉnh sửa thông tin công việc {{ task.taskName }}</h3>
        <form @submit.prevent="handleUpdateTask()">
          <label>
            Tên công việc:
            <input v-model="taskUpdateRequest.taskName" type="text" required />
          </label>
          <label>
            Mô tả:
            <textarea v-model="taskUpdateRequest.description" rows="3"></textarea>
          </label>
          <label>
            Ngày kết thúc dự kiến:
            <input v-model="taskUpdateRequest.endDate" type="date" />
          </label>
          <p>Phụ trách hiện tại: {{ task.parentTaskName }}</p>
          <p>Thay đổi tài khoản phụ trách:</p>
          <label v-for="account in task.taskDetailResponses" class="radio-selected">
            <div>{{ account.accountName }}</div>
            <input  v-model="taskUpdateRequest.managerTaskId" type="radio" name="updateidmanager" :value="account.accountId" :checked="account.accountId===taskUpdateRequest.managerTaskId?true:false">
          </label>

          <div class="form-actions">
            <button type="submit" class="btn-confirm">Chỉnh sửa</button>
            <button type="button" class="btn-cancel" @click="showmodalUpdateStask=false">Hủy</button>
          </div>
        </form>
      </div>
  </div>
  <!-- modal thêm logwork -->
  <div v-if="showModalCreateLogwork" class="modal-overlay">
      <div class="modal">
        <h3>Thêm logwork cho công việc: {{ task.taskName }}</h3>
        <form @submit.prevent="handleCreateLogwork(task.taskId)">
          <label>
            Tên Logwork:
            <input v-model="logWorkRequest.logworkName" type="text" required />
          </label>
          <label>
            Mô tả:
            <textarea v-model="logWorkRequest.description" rows="3"></textarea>
          </label>
          <label>
            thời gian làm:
            <input type="text" v-model="logWorkRequest.time" placeholder="vd: 1h20p">
          </label>

          <div class="form-actions">
            <button type="submit" class="btn-confirm">Tạo</button>
            <button type="button" class="btn-cancel" @click="showModalCreateLogwork=false">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- modal xem logwork -->
  <div v-if="showModalReadLogwork" class="modal-overlay">
    <div class="modal">
    <h3>Logwork cho công việc: {{ task.taskName }}</h3>
    
    <!-- Bảng hiển thị danh sách logwork -->
    <table class="logwork-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tên Logwork</th>
        <th>Mô tả</th>
        <th>Ngày tạo</th>
        <th>Thời gian</th>
        <th>Trạng thái</th>
        <th v-if="logworkResponse.data.status === 'Chờ duyệt'">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="logwork in logworkResponse.data" :key="logwork.logworkId" :class="getRowClass(logwork)">
        <td>{{ logwork.logworkId }}</td>
        <td>{{ logwork.logworkName }}</td>
        <td>{{ logwork.description }}</td>
        <td class="description" :title="logwork.description">{{ new Date(logwork.createDate).toLocaleDateString() }}</td>
        <td>{{ logwork.time }}</td>
        <td>{{ logwork.status }}</td>
        <td v-if="((roles.includes('leadmanager') && loginAcountId===task.projectCreaterId) && logwork.status ==='Chờ duyệt') || (loginAcountId === task.parentManagerTaskId && logwork.status ==='Chờ duyệt') || (loginAcountId === task.projectManagerId && logwork.status ==='Chờ duyệt')">
          <button @click.stop="showConfirmationModal('Duyệt', logwork.logworkId)">Duyệt</button>
          <button @click.stop="showConfirmationModal('Không duyệt', logwork.logworkId)">Không duyệt</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div><button @click.stop="showModalReadLogwork = false"> Đóng </button></div>

  <!-- Modal Xác Nhận Logwork -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h3>Xác nhận {{ actionType }} logwork</h3>
      <p>Bạn có chắc chắn muốn {{ actionType }} logwork này?</p>
      <button @click="confirmAction">Xác nhận</button>
      <button @click="cancelAction">Hủy</button>
    </div>
  </div>
  </div>
</div>

<!-- Modal xác nhận dùng chung cho nhiều hành động-->
<div v-if="isUseModalVisible" class="modal-overlay">
    <div class="modal">
        <h2 v-if="usesActionType === 'startTask'">Bắt đầu công việc "{{ task.taskName }}"</h2>
        <h2 v-if="usesActionType === 'taskCompleted'">Hoàn thành công việc "{{ task.taskName }}"</h2>

        <!-- Nội dung modal thay đổi theo action -->
        <div v-if="usesActionType === 'startTask'">
          <p style="font-weight: bold;" >bạn chắc chắn muốn bắt đầu công việc vào lúc này ?</p>
        </div>
        <div v-if="usesActionType === 'taskCompleted'">
          <p style="font-weight: bold;" >bạn chắc chắn công việc đã hoàn thành?</p>
        </div>
        <div class="form-actions">
          <button class="btn-confirm" @click.stop="submitAction">Xác nhận</button>
          <button class="btn-cancel" @click.stop="closeUseModal">Hủy</button>
        </div>
    </div>
</div>

</template>

<script setup>
import API_ENDPOINTS from "@/api/api";
import axios from "axios";
import { computed, reactive, ref } from "vue";
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const token = sessionStorage.getItem("token")
const showEmployeeSelectionModal = ref(false); // Hiển thị modal chọn nhân viên
const selectedEmployees = ref([]);
// lấy các quyền của tài khoản đăng nhập
const roles = sessionStorage.getItem("roles").split(",")
// lấy id tài khoản đăng nhập
const loginAcountId = Number( sessionStorage.getItem("accountId") )
console.log( loginAcountId)
console.log(props.task.parentManagerTaskId)
console.log(roles)

const showmodalUpdateStask = ref(null)
const showModalCreateLogwork = ref(null)
const showModalReadLogwork = ref(null)
const actionType = ref('');
const formatDate = (date) => {
  if (!date || isNaN(new Date(date).getTime())) {
    return 'Chưa xác định'; // Giá trị mặc định nếu `date` không hợp lệ
  }
  
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng trong JavaScript bắt đầu từ 0
  const day = String(formattedDate.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số

  return `${year}-${month}-${day}`; // Trả về ngày theo định dạng YYYY-MM-DD
};
console.log(props.task.projectId)
const emit = defineEmits(["add-child","update-task"]);

const showDetails = ref(false);
const showTaskAction = ref(null);
const showModal = ref(false);
const showModalAddChildTask =ref(false)
const selectedProjectId = ref(null)
const logworkStatus = ref(null)
const selectedLogworkId = ref(null);
const isModalVisible = ref('')
const progress = ref('');  
const usesActionType = ref('')
const isUseModalVisible = ref(false)
const childTask = ref({
  taskName: "",
  description: "",
  status: "Pending",
  progress: 0,
  createDate: new Date(),
  endDate: "",
  actualEndDate: "",
  managerTaskId: null,
  taskParentId: null,
  taskCondition: "Active"
});
const taskUpdateRequest = ref({
  taskName: "",
  description: "",
  endDate: "",
  managerTaskId: props.task.managerTaskId,
});

const taskStartRequest = reactive({
  status :'In Progress',
  startDate: new Date()
});
const taskCompletedRequest = reactive({
  status :'Completed',
  actualEndDate: new Date()
});

const logWorkRequest = reactive({
  logworkName : "",
  description: "",
  createDate: new Date(),
  time:"",
  status: "Chờ duyệt"
})
const accountResponse = reactive({
  data:[]
})
const logworkResponse = reactive({
  data:[]
})

const openModalUpdateTaskProgress = () => {
  isModalVisible.value = true;
};

const closeModalUpdateTaskProgress = () => {
  isModalVisible.value = false;
  progress.value = '';

};
//modal dùng chung
const openUseModal = (type) => {
  usesActionType.value = type;
  
  isUseModalVisible.value = true;
};

// Đóng modal
const closeUseModal = () => {
  isUseModalVisible.value = false;
};

// Xử lý hành động xác nhận
const submitAction = async () => {
  if (usesActionType.value === "startTask") {
    console.log("call handleStartTask")
    await handleStartTask()
    
    
  } else if (usesActionType.value === "taskCompleted") {
    console.log("call handleTaskCompleted");
    
    await handleTaskCompleted()
  }
  closeUseModal(); // Đóng modal sau khi xử lý
};

const filterAccountResponse = computed(() => {
  // Lấy danh sách ID nhân viên đã được gán trong công việc
  const assignedEmployeeIds = props.task.taskDetailResponses.map((employee) => employee.accountId);
  console.log(assignedEmployeeIds)
  // Lọc ra nhân viên chưa có trong danh sách taskDetailResponses
  return accountResponse.data.filter(
    (employee) => (!assignedEmployeeIds.includes(employee.accountId) && employee.statusInProject ==='inproject')
  );
});

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
// truyền vào số lượng nhân viên trong công việc hiện tại nếu hiện tại chỉ có 1 nhân
//viên thì khi tạo task con phải gán luôn nhân viên đó vào taskcon và cho làm quản lí task luôn (tạo nút rễ)
const openModal = (taskDetaillength) => {
  if(taskDetaillength===1){
    childTask.value.managerTaskId = loginAcountId;
  }
  childTask.value.taskParentId = props.task.taskId;
  showModalAddChildTask.value = true;
};

const closeModal = () => {
  showModalAddChildTask.value = false;
};

const submitChildTask = () => {
  console.log(childTask.value.taskParentId);
  emit("add-child", {
    childTask: childTask.value,
  });
  closeModal();
};
const managerTaskId = ref(props.task.managerTaskId);

const selectedManagerTaskId = (id) => {
  managerTaskId.value = id;
  console.log(managerTaskId.value);
};

const handleGetAccountINProject = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_ACCOUNTINPROJECT(props.task.projectId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      console.log("get account in project success")
      console.log(response.data.result)
      console.log(accountResponse.data)
      accountResponse.data = response.data.result // Cập nhật danh sách nhân viên
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
        console.log('get account  err', error);
  }
};

const handlecreateTaskDetailResponseList = async () =>{
  try {
    const response = await axios.post(API_ENDPOINTS.CREATE_TASKDETAIL(props.task.taskId,managerTaskId.value),selectedEmployees.value,
  {
    headers: {
        'Authorization': `Bearer ${token}`
      }
  })
  if(response.status === 200){
    console.log("create task detail success")
    emit("update-task",null)
    showEmployeeSelectionModal.value = false
    selectedEmployees.value = []
  }
  } 
    catch (error) {
    if (error.response) {
            console.log('Request failed with status:', error.response.status);
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error setting up request:', error.message);
        }
        console.log('create task detail  err', error);
  }
}

const handleUpdateTask = async() =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_TASK(props.task.taskId),taskUpdateRequest.value,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("update task success")
      emit("update-task",null)
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
        console.log('update task  err', error);
  }
}

const handleStartTask = async() =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_START_TASK(props.task.taskId),taskStartRequest,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("start task success")
      emit("update-task",null)
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
        console.log('start task  err', error);
  }
}

const handleTaskCompleted = async() =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_START_TASK(props.task.taskId),taskCompletedRequest,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("start complated success")
      emit("update-task",null)
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
        console.log('complated task  err', error);
  }
}



const handleCreateLogwork = async (taskId) =>{
  try {
    console.log(logWorkRequest)
    const response = await axios.post(API_ENDPOINTS.CREATE_LOGWORK(taskId),logWorkRequest,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if(response.status === 200){
      console.log("create logwork success")
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
        console.log('create logwork err', error);
  }
}

const handleGetLogWork = async (taskId) =>{
  try {
    const response = await axios.get(API_ENDPOINTS.GET_LOGWORK(taskId),{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if( response.status === 200){
      console.log("get logwork success")
      logworkResponse.data = response.data.result
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
        console.log('create logwork err', error);
  }
}

const showConfirmationModal = (action, logworkId) => {
  actionType.value = action;
  selectedLogworkId.value = logworkId;
  showModal.value = true;
};

// Xác nhận hành động và cập nhật trạng thái logwork
const confirmAction = async () => {
  const status = actionType.value === 'Duyệt' ? 'Đã duyệt' : 'Không duyệt';
  await handleUpdateLogworkStastus(selectedLogworkId.value, status);
  showModal.value = false; // Đóng modal
};

// Hủy hành động và đóng modal
const cancelAction = () => {
  showModal.value = false; // Đóng modal
};

const getRowClass = (logwork) => {
  if (logwork.status === 'Đã duyệt') {
    return 'approved';
  } else if (logwork.status === 'Không duyệt') {
    return 'rejected';
  }
  return '';
};

const handleUpdateLogworkStastus = async (logworkId, status) => {
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATESTATUS_LOGWORK(logworkId), status, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
    });
    if (response.status === 200) {
      console.log("update logwork status success");
      // Cập nhật lại danh sách logwork sau khi thay đổi
      await handleGetLogWork(props.task.taskId);
    }
  } catch (error) {
    console.error('update logwork status err', error);
  }
};

const handleUpdateTaskProgress = async (taskId) =>{
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_TASKPROGRESS(taskId),progress.value,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
    })
    if(response.status === 200){
      console.log("update task progress success")
      emit("update-task",null)
      closeModalUpdateTaskProgress()
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
        console.log('update task progress  err', error);
  }
}

const openEmployeeSelectionModal = (projectId) => {
  showEmployeeSelectionModal.value = true;
  selectedProjectId.value = projectId
  handleGetAccountINProject(); // Lấy danh sách nhân viên khi modal được mở
};

</script>

<style scoped>
.task-node {
  margin-left: 20px;
  border-left: 2px dashed #ccc;
  padding-left: 15px;
}

.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-title {
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

.task-title:hover {
  color: #007bff;
}

.btn-details,
.btn-add-child {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 5px;
  font-size: 14px;
}

.btn-details:hover,
.btn-add-child:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal label {
  display: block;
  margin-bottom: 10px;
}

.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-confirm {
  background-color: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* css phần chi tiết */
.project-details {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #333;
  }
  
  .project-info p {
    margin: 8px 0;
  }
  
  .status {
    color: #4caf50;
    font-weight: bold;
  }
  
  .progress-bar {
    width: 100%;
    background: #f3f3f3;
    border-radius: 8px;
    overflow: hidden;
    margin: 10px 0;
  }
  
  .progress {
    height: 20px;
    background: #4caf50;
    text-align: center;
    color: white;
    line-height: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  table td {
    text-align: center;
  }
  
  table th {
    background-color: #f4f4f4;
    color: #333;
  }
  
  /* nút không khả dụng */
  button:disabled {
    background-color: #ccc; /* Màu xám nhạt */
    color: #666;           /* Màu chữ xám đậm hơn */
    cursor: not-allowed;   /* Con trỏ hiển thị trạng thái không thể click */
    opacity: 0.7;          /* Tăng hiệu ứng bị mờ */
  }
  .radio-selected {
  display: flex !important;             /* Sử dụng flexbox để căn chỉnh các phần tử con */
  align-items: center;       /* Căn chỉnh các phần tử theo chiều dọc */
  gap: 8px;                  /* Khoảng cách giữa radio button và tên tài khoản */
}
/* table readlogwork */
.logwork-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  background-color: #fff;
}

.logwork-table th,
.logwork-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
  word-wrap: break-word; /* Cho phép từ dài xuống dòng */
}

.logwork-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}



.logwork-table tr:hover {
  background-color: #e8e8e8; /* Đổi màu khi hover */
}

.logwork-table td {
  max-width: 300px; /* Giới hạn chiều rộng tối đa */
  white-space: normal; /* Cho phép văn bản xuống dòng */
  overflow-wrap: break-word; /* Ngắt từ khi cần thiết */
}

.logwork-table td.description {
  max-width: 300px; /* Giới hạn chiều rộng tối đa cho cột mô tả */
  white-space: normal; /* Văn bản sẽ xuống dòng khi cần */
  overflow-wrap: break-word; /* Ngắt từ khi cần thiết */
}

/* Nút đóng modal */
.close-btn {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: #ff4c4c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.close-btn:hover {
  background-color: #e43c3c;
}

.approved{
  background-color: #d4f8e8; /* Màu xanh nhạt */
}
.rejected {
  background-color: #f8d4d4; /* Màu đỏ nhạt */
}


</style>
