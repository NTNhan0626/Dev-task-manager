import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home', // Đường dẫn cho route cha
      name: 'home', // Tên cho route cha
      component: () => import('../views/HomeView.vue'), // Import component cho route cha
      children: [
        {
          path: 'dashboard', // Đường dẫn cho route con (sẽ trở thành /home/about)
          name: 'dashboard',
          component: () => import('../views/dashboard/BarChart.vue'), // Import component cho route con
        },
        {
          path: 'about', // Đường dẫn cho route con (sẽ trở thành /home/about)
          name: 'about',
          component: () => import('../views/AboutView.vue'), // Import component cho route con
        },
        {
          path: 'account/add',
          name: 'account-add',
          component: () => import('../views/account/AccountCreate.vue'),
        },
        {
          path:'account/get',
          name:'account-get',
          component:() => import('../views/account/AccountGet.vue')
        },
        {
          path: 'account/information',
          name: 'account-information',
          component : () => import('../views/account/information/Information.vue')
        },

        {
          path:'roles/add',
          name:'roles-add',
          component: () => import('../views/roles/RolesAdd.vue')
        },

        {
          path:'rolesdetail/:rolesId',
          name:'roles-detail',
          component:() => import('../views/roles/RolesDetail.vue')
        },

        {
          path:'roles/rolesdepartment',
          name:'roles-department',
          component: () => import('../views/roles/RolesDepartment.vue')
        },

        {
          path:'department',
          name: 'department',
          component: () => import('../views/department/DepartmentList.vue'),
          
          
        },
        {
          path:'depaermentdetail/:departmentId/:departmentName',
          name: 'department-detail',
          component: () => import('../views/department/DepartmentDetail.vue')
        },

        {
          path: 'category',
          name: 'categorylist',
          component: () => import('../views/category/Category.vue'),
        },

        {
          path: 'account/degree-specialization',
          name: 'degree-specialization',
          component: () => import('../views/account/degree-specialization/Degree_SpecializationManager.vue')
        },
        {
          path: 'project',
          name: 'project',
          component:() => import('../views/project-manager/project.vue')
        },

        //projectDetail
        {
          path:'project/projectdetail/:projectId',
          name:'project-detail',
          component:() => import('../views/project-manager/ProjectDetail.vue')
        },
        //department-task
        {
          path:'task/:projectId',
          name:'task',
          component:() => import('../views/task/taskdepartment/Task.vue')
        },
        //interdepartmental-task
        {
          path:'interdepartmental-task/:projectId',
          name:'interdepartmental-task',
          component:() => import('../views/task/interdepartmentaltask/Task.vue')
        },
        // tools
        {
          path:'tools',
          name:'tools',
          component:() => import('../views/tools/ManagerTools.vue')
        },
        // get all tool project detail
        {
          path:'managerTool',
          name:'managerTool',
          component:() => import('../views/tools/ManagerToolsRequest.vue')
        },
        //tool request nơi yc công cụ cho dự án
        {
          path:'tools/request/:projectId',
          name:'tools-request',
          component:() => import('../views/project-manager/ToolRequest.vue')
        },
        //issues
        {
          path:'issues/request/:taskId',
          name:'issues-request',
          component:() => import('../views/issues/IssuesRequest.vue')
        },
        //issues manager
        {
          path:'issues/manager/:projectId',
          name:'issues-manager',
          component:() => import('../views/issues/ManagerIssuesRequest.vue')
        }
      ],
    },
    
    {
      path:'/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },

    {
      path: '/:pathMatch(.*)*', // Để xử lý các đường dẫn không hợp lệ
      redirect: '/', // Chuyển hướng đến trang đăng nhập
    }

  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const roles = sessionStorage.getItem('roles')?.split(",");
  console.log(isLoggedIn)
  // Kiểm tra nếu người dùng chưa đăng nhập và không truy cập vào trang login
  if (!isLoggedIn && to.name !== 'login') {
    next({ name: 'login' }); // Chuyển hướng đến trang đăng nhập
  }else if(isLoggedIn && to.name === 'home' && roles.includes('ADMIN')){
    next({name:'dashboard'});
  }
  else {
    next(); // Cho phép điều hướng đến trang đích
  }
});


export default router
