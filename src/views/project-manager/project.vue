<template>
    <div class="project-content">
        <div class="project-manager-department" v-if="typeRoles === 'manager'">
            <ProjectManager></ProjectManager>
        </div>
        <div class="project-staff" v-if="typeRoles === 'staff'">
            <ProjectStaff></ProjectStaff>
        </div>
        <div class="project-lead-manager" v-if="typeRoles === 'leadmanager'">
            <ProjectLeadManager></ProjectLeadManager>
        </div>
    </div>
</template>
<script setup>
import ProjectLeadManager from './project-content/ProjectLeadManager.vue';
import ProjectManager from './project-content/ProjectManager.vue';
import ProjectStaff from './project-content/ProjectStaff.vue';


const typeRoles = sessionStorage.getItem("typeRoles")
const departmentName = sessionStorage.getItem("departmentName")

</script>
<style scoped></style>