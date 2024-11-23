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
    CREATE_DEPARTMENTPROJECT: (departmentId) =>`http://localhost:8080/project/create/${departmentId}`


  };
  
  export default API_ENDPOINTS;
  