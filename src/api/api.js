const API_ENDPOINTS = {
    LOGIN: 'http://localhost:8080/account/login',
    REGISTER: 'http://localhost:8080/account/add',
    GETACCOUNT: 'http://localhost:8080/account/getall',
    GETACCOUNTBYNULLDEPARTMENT: 'http://localhost:8080/account/get/departmentnull',

    GET_INFORMATION:(accountId) =>`http://localhost:8080/information/get/${accountId}`,
    UPDATE_INFORMATION:(accountId) =>`http://localhost:8080/information/update/${accountId}`,

    ADDROLSE:'http://localhost:8080/roles/addRole',
    GETROLES:'http://localhost:8080/roles/getall',
    ADDROLESDETAIL:(accountId, rolesId) =>`http://localhost:8080/rolesdetail/add/${accountId}/${rolesId}`,
    ADD_ROLESDETAIL_LIST:(departmentName) => `http://localhost:8080/rolesdetail/addlist/${departmentName}`,
    GET_ROLESDETAILBYROLESID:(rolesId) =>`http://localhost:8080/rolesdetail/get/${rolesId}`,
    UPDATE_ROLESDETAIL:(accountId,rolesId) =>`http://localhost:8080/rolesdetail/update/${accountId}/${rolesId}`,
    DELETE_ROLESDETAIL:(departmentName) => `http://localhost:8080/rolesdetail/deletelist/${departmentName}`,

    ADD_DEPARTMENT:'http://localhost:8080/department/add',
    GET_DEPARTMENT:'http://localhost:8080/department/getall',

    GET_DEPARTMENTDETAIL:(departmentId)=>`http://localhost:8080/departmentdetail/get/${departmentId}`,
    ADD_DEPARTMENTDETAIL:(departmentId) => `http://localhost:8080/departmentdetail/add/${departmentId}`,
    UPDATE_DEPARTMENTDETAIL :`http://localhost:8080/departmentdetail/update`,

    //category
    GET_CATEGORY :'http://localhost:8080/category/getall',
    ADD_CATEGORY :'http://localhost:8080/category/add',
    //categoryDetail
    ADD_CATEGORY_DETAIL :(categoryId) =>`http://localhost:8080/categorydetail/create/${categoryId}`,
    //degree
    GET_DEGREE :'http://localhost:8080/degree/getall',
    ADD_DEGREE :'http://localhost:8080/degree/add',
    DELETE_DEGREE :(degreeId) =>`http://localhost:8080/degree/delete/${degreeId}`,

    GET_DEGREEDETAIL:(accountId) =>`http://localhost:8080/degreedetail/getbac/${accountId}`,
    ADD_DEGREEDETAIL :'http://localhost:8080/degreedetail/add',
    UPDATE_DEGREEDETAIL :(degreedetailId) =>`http://localhost:8080/degreedetail/update/${degreedetailId}`,
    GET_DEGREEDETAILDG:(degreeId) =>`http://localhost:8080/degreedetail/getbdr/${degreeId}`,
    
    //specialization
    GET_SPECIALIZATION :'http://localhost:8080/specialization/getall',
    ADD_SPECIALIZATON :'http://localhost:8080/specialization/add',

    ADD_SPECIALIZATIONDETAIL :'http://localhost:8080/specializationdetail/create',
    GET_SPECIALIZATIONDETAIL: (accountId) => `http://localhost:8080/specializationdetail/getbac/${accountId}`,
    GET_SPECIALIZATIONDETAILBSP: (specializationId) => `http://localhost:8080/specializationdetail/getbsp/${specializationId}`,
    UPDATE_SPECIALIZATIONDETAIL: (specializationId) =>`http://localhost:8080/specializationdetail/update/${specializationId}`,

    //project
    GET_PROJECTBDP: (departmentId) =>`http://localhost:8080/project/getallbdp/${departmentId}`,
    GET_PROJECTBAC: (accountId) =>`http://localhost:8080/project/getallbac/${accountId}`,
    CREATE_DEPARTMENTPROJECT: (departmentId) =>`http://localhost:8080/project/create/${departmentId}`,
    GET_PROJECTBYID: (projectId) => `http://localhost:8080/project/get/${projectId}`,
    GET_EMPLOYEES:(departmentId) => `http://localhost:8080/departmentdetail/getac/${departmentId}`,
    UPDATE_PROJECT:(projectId) =>`http://localhost:8080/project/update/${projectId}`,
    GET_EMPLOYEESINDEPARTMENTNOTINPROJECT:(projectId,departmentId) => `http://localhost:8080/project/getaccount/${projectId}/${departmentId}`,

    GETACCOUNTSREQUEST:(projectId) => `http://localhost:8080/projectdetail/get/acrequest/${projectId}`,
      // dựu án liên phòng ban
    CREATE_INTERDEPARTMENTALPROJECT: 'http://localhost:8080/project/create/interdepartmentalproject',
    GET_INTERDEPARTMENTALPROJECT:`http://localhost:8080/project/get/interdepartmentalproject`,
    //projectDetail nhân viên trong dự án
    CREATE_PROJECTDETAIL:(projectId) => `http://localhost:8080/projectdetail/create/${projectId}`,
    //duyệt nhân viên tham gia dự án
    UPDATE_PROJECTDETAIL:`http://localhost:8080/projectdetail/update`,

    // quản lí yêu cầu cấp nhân viên cho phòng
    CREATE_INTERDEPARTMENTALPROJECTDETAIL:(projectId) => `http://localhost:8080/projectdetail/create/interdepartmentalproject/${projectId}`,

    //task
    GET_TASKINPROJECT: (projectId) =>`http://localhost:8080/project/gettask/${projectId}`,
    GET_ACCOUNTINPROJECT: (projectId) =>`http://localhost:8080/project/getaccount/${projectId}`,
    
    CREATE_TASK: (projectId) =>`http://localhost:8080/task/create/${projectId}`,
    UPDATE_TASK:(taskId) =>`http://localhost:8080/task/update/${taskId}`,
    UPDATE_TASKPROGRESS:(taskId) =>`http://localhost:8080/task/update/progress/${taskId}`,
    UPDATE_START_TASK:(taskId) =>`http://localhost:8080/task/update/${taskId}`,
    

    //taskdetail
    CREATE_TASKDETAIL:(taskId,managerTaskId) => `http://localhost:8080/taskdetail/create/${taskId}/${managerTaskId}`,
    //logwork
    CREATE_LOGWORK: (taskId) =>`http://localhost:8080/logwork/create/${taskId}`,
    GET_LOGWORK: (taskId) =>`http://localhost:8080/logwork/get/${taskId}`,
    UPDATESTATUS_LOGWORK: (logwordId) =>`http://localhost:8080/logwork/updatestatus/${logwordId}`,
    //tool
    GETALL_TOOL: `http://localhost:8080/tool/getall`,
    CREATE_TOOL: `http://localhost:8080/tool/create`,
    UPDATE_TOOL:(toolId) => `http://localhost:8080/tool/update/${toolId}`,
    //tool project detail
    GET_ALL_TOOLPROJECTDETAIL:`http://localhost:8080/tooldetail/getall`,
    GET_TOOLPROJECTDETAILINPROJECT: (projectId) =>`http://localhost:8080/tooldetail/getall/${projectId}`,
    CREATE_TOOLPROJECTDETAILINPROJECT:`http://localhost:8080/tooldetail/create`,
    UPDATE_TOOLPRPOJECTDETAIL:(toolProjectDetailId) =>`http://localhost:8080/tooldetail/update/${toolProjectDetailId}`,
    DELETED_TOOLPROJECTDETAIL:(toolProjectDetailId) =>`http://localhost:8080/tooldetail/delete/${toolProjectDetailId}`,

  };
  
  export default API_ENDPOINTS;
  