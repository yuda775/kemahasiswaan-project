<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const lecturers = ref([]);
const lecturerDialog = ref(false);
const deleteLecturerDialog = ref(false);
const changePasswordDialog = ref(false);
const lecturer = ref({});
const selectedLecturers = ref([]);
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
            detail: response.config.method === 'delete' ? 'Lecturer deleted successfully' : 'Lecturer updated successfully',
            life: 3000
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: method === 'delete' ? 'Failed to delete Lecturer' : 'Failed to update Lecturer',
            life: 3000
        });
    }
};

const updateLecturer = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/lecturer/${id}`, data);
const createLecturer = (data) => handleApiCall('post', `${import.meta.env.VITE_APP_BASE_URL}/api/lecturer/`, data);
const deleteLecturerApi = (id) => handleApiCall('delete', `${import.meta.env.VITE_APP_BASE_URL}/api/lecturer/${id}`);
const updateLecturerPassword = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/lecturer/change-password/${id}`, data);

const openNew = () => {
    lecturer.value = {};
    submitted.value = false;
    lecturerDialog.value = true;
};

const hideDialog = () => {
    lecturerDialog.value = false;
    deleteLecturerDialog.value = false;
    changePasswordDialog.value = false;
    submitted.value = false;
};

const saveLecturer = () => {
    submitted.value = true;
    if (lecturer.value.name && lecturer.value.email && lecturer.value.password && lecturer.value.employeeNumber) {
        if (lecturer.value.id) {
            updateLecturer(lecturer.value.id, lecturer.value).then((response) => {
                if (response) {
                    lecturers.value = lecturers.value.map((l) => (l.id === lecturer.value.id ? { ...lecturer.value } : l));
                    hideDialog();
                }
            });
        } else {
            createLecturer(lecturer.value).then((response) => {
                if (response) {
                    lecturers.value.push(response.data.data);
                    hideDialog();
                }
            });
        }
    }
};

const editLecturer = (data) => {
    lecturer.value = { ...data };
    submitted.value = false;
    lecturerDialog.value = true;
};

const confirmDeleteLecturer = (data) => {
    lecturer.value = { ...data };
    deleteLecturerDialog.value = true;
};

const deleteLecturer = () => {
    deleteLecturerApi(lecturer.value.id).then((response) => {
        if (response) {
            lecturers.value = lecturers.value.filter((l) => l.id !== lecturer.value.id);
            deleteLecturerDialog.value = false;
        }
    });
};

const openChangePasswordDialog = (data) => {
    lecturer.value = { ...data };
    submitted.value = false;
    changePasswordDialog.value = true;
};

const changePassword = () => {
    submitted.value = true;

    if (lecturer.value.newPassword) {
        const payload = {
            password: lecturer.value.newPassword
        };

        updateLecturerPassword(lecturer.value.id, payload).then(() => {
            hideDialog();
        });
    }
};

const fetchData = async (endpoint, target) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/${endpoint}/`);
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

const getDataLecturers = () => fetchData('lecturer', lecturers);

onMounted(() => {
    getDataLecturers();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Lecturers (Dosen)</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedLecturers"
                :value="lecturers"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} lecturers"
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
                <Column field="employeeNumber" header="Employee Number" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editLecturer(data)" />
                        <Button icon="pi pi-key" outlined rounded class="mr-2" @click="openChangePasswordDialog(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteLecturer(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing Lecturer -->
        <Dialog v-model:visible="lecturerDialog" :style="{ width: '450px' }" header="Lecturer Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="lecturer.name" required="true" autofocus :invalid="submitted && !lecturer.name" class="w-full" />
                    <small v-if="submitted && !lecturer.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="lecturer.email" required="true" :invalid="submitted && !lecturer.email" class="w-full" />
                    <small v-if="submitted && !lecturer.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <InputText id="password" v-model.trim="lecturer.password" required="true" :invalid="submitted && !lecturer.password" type="password" class="w-full" />
                    <small v-if="submitted && !lecturer.password" class="text-red-500">Password is required.</small>
                </div>
                <div>
                    <label for="employeeNumber" class="block font-bold mb-3">Employee Number</label>
                    <InputText id="employeeNumber" v-model.trim="lecturer.employeeNumber" required="true" :invalid="submitted && !lecturer.employeeNumber" class="w-full" />
                    <small v-if="submitted && !lecturer.employeeNumber" class="text-red-500">Employee Number is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveLecturer" />
            </template>
        </Dialog>

        <Dialog v-model:visible="changePasswordDialog" :style="{ width: '450px' }" header="Change Password" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="newPassword" class="block font-bold mb-3">New Password</label>
                    <Password id="newPassword" v-model.trim="lecturer.newPassword" required :invalid="submitted && !lecturer.newPassword" type="password" fluid />
                    <small v-if="submitted && !lecturer.newPassword" class="text-red-500">New password is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="changePassword" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteLecturerDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="lecturer"
                    >Are you sure you want to delete <b>{{ lecturer.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteLecturerDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteLecturer" />
            </template>
        </Dialog>
    </div>
</template>
