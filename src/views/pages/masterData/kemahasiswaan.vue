<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const studentAffairs = ref([]);
const studentAffairDialog = ref(false);
const deleteStudentAffairDialog = ref(false);
const changePasswordDialog = ref(false);
const studentAffair = ref({});
const selectedStudentAffairs = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const handleApiCall = async (method, url, data = null) => {
    try {
        const response = await axios[method](url, data);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: response.config.method === 'delete' ? 'studentAffair deleted successfully' : 'studentAffair updated successfully',
            life: 3000
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: method === 'delete' ? 'Failed to delete studentAffair' : 'Failed to update studentAffair',
            life: 3000
        });
    }
};

const updatestudentAffair = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/student-affairs/${id}`, data);
const createstudentAffair = (data) => handleApiCall('post', `${import.meta.env.VITE_APP_BASE_URL}/api/student-affairs`, data);
const deletestudentAffairApi = (id) => handleApiCall('delete', `${import.meta.env.VITE_APP_BASE_URL}/api/student-affairs${id}`);
const updatestudentAffairPassword = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/student-affairs/change-password/${id}`, data);

const openNew = () => {
    studentAffair.value = {};
    submitted.value = false;
    studentAffairDialog.value = true;
};

const hideDialog = () => {
    studentAffairDialog.value = false;
    deleteStudentAffairDialog.value = false;
    changePasswordDialog.value = false;
    submitted.value = false;
};

const savestudentAffair = () => {
    submitted.value = true;
    if (studentAffair.value.name && studentAffair.value.email && studentAffair.value.password) {
        if (studentAffair.value.id) {
            updatestudentAffair(studentAffair.value.id, studentAffair.value).then((response) => {
                if (response) {
                    studentAffairs.value = studentAffairs.value.map((l) => (l.id === studentAffair.value.id ? { ...studentAffair.value } : l));
                    hideDialog();
                }
            });
        } else {
            createstudentAffair(studentAffair.value).then((response) => {
                if (response) {
                    studentAffairs.value.push(response.data.data);
                    hideDialog();
                }
            });
        }
    }
};

const editstudentAffair = (data) => {
    studentAffair.value = { ...data };
    submitted.value = false;
    studentAffairDialog.value = true;
};

const confirmDeletestudentAffair = (data) => {
    studentAffair.value = { ...data };
    deleteStudentAffairDialog.value = true;
};

const deletestudentAffair = () => {
    deletestudentAffairApi(studentAffair.value.id).then((response) => {
        if (response) {
            studentAffairs.value = studentAffairs.value.filter((l) => l.id !== studentAffair.value.id);
            deleteStudentAffairDialog.value = false;
        }
    });
};

const openChangePasswordDialog = (data) => {
    studentAffair.value = { ...data };
    submitted.value = false;
    changePasswordDialog.value = true;
};

const changePassword = () => {
    submitted.value = true;

    if (studentAffair.value.newPassword) {
        const payload = {
            password: studentAffair.value.newPassword
        };

        updatestudentAffairPassword(studentAffair.value.id, payload).then(() => {
            hideDialog();
        });
    }
};

const fetchData = async (endpoint, target) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/${endpoint}`);
        if (response.status === 200) {
            target.value = response.data.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to fetch ${endpoint} data`,
            life: 3000
        });
    }
};

const getDatastudentAffairs = () => fetchData('student-affairs', studentAffairs);

onMounted(() => {
    getDatastudentAffairs();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage studentAffairs (Dosen)</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedStudentAffairs"
                :value="studentAffairs"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} studentAffairs"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-end">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editstudentAffair(data)" />
                        <Button icon="pi pi-key" outlined rounded class="mr-2" @click="openChangePasswordDialog(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletestudentAffair(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing studentAffair -->
        <Dialog v-model:visible="studentAffairDialog" :style="{ width: '450px' }" header="studentAffair Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="studentAffair.name" required="true" autofocus :invalid="submitted && !studentAffair.name" class="w-full" />
                    <small v-if="submitted && !studentAffair.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="studentAffair.email" required="true" :invalid="submitted && !studentAffair.email" class="w-full" />
                    <small v-if="submitted && !studentAffair.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <InputText id="password" v-model.trim="studentAffair.password" required="true" :invalid="submitted && !studentAffair.password" type="password" class="w-full" />
                    <small v-if="submitted && !studentAffair.password" class="text-red-500">Password is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="savestudentAffair" />
            </template>
        </Dialog>

        <Dialog v-model:visible="changePasswordDialog" :style="{ width: '450px' }" header="Change Password" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="newPassword" class="block font-bold mb-3">New Password</label>
                    <Password id="newPassword" v-model.trim="studentAffair.newPassword" required :invalid="submitted && !studentAffair.newPassword" type="password" fluid />
                    <small v-if="submitted && !studentAffair.newPassword" class="text-red-500">New password is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="changePassword" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteStudentAffairDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="studentAffair"
                    >Are you sure you want to delete <b>{{ studentAffair.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteStudentAffairDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deletestudentAffair" />
            </template>
        </Dialog>
    </div>
</template>
