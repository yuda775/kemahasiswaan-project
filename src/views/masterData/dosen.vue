<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    lecturers.value = [
        { id: 1, name: 'Dr. John Doe', email: 'john.doe@example.com', password: 'password123', employee_number: 'EMP001' },
        { id: 2, name: 'Prof. Jane Smith', email: 'jane.smith@example.com', password: 'password123', employee_number: 'EMP002' },
        { id: 3, name: 'Dr. Alice Johnson', email: 'alice.johnson@example.com', password: 'password123', employee_number: 'EMP003' }
    ];
});

const toast = useToast();
const dt = ref();
const lecturers = ref([]);
const lecturerDialog = ref(false);
const deleteLecturerDialog = ref(false);
const lecturer = ref({});
const selectedLecturers = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const openNew = () => {
    lecturer.value = {};
    submitted.value = false;
    lecturerDialog.value = true;
};

const hideDialog = () => {
    lecturerDialog.value = false;
    submitted.value = false;
};

const saveLecturer = () => {
    submitted.value = true;

    if (lecturer.value.name && lecturer.value.email && lecturer.value.password && lecturer.value.employee_number) {
        if (lecturer.value.id) {
            // Update existing lecturer
            const index = lecturers.value.findIndex((l) => l.id === lecturer.value.id);
            if (index !== -1) {
                lecturers.value[index] = { ...lecturer.value };
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Lecturer Updated', life: 3000 });
            }
        } else {
            // Create new lecturer
            lecturer.value.id = lecturers.value.length + 1; // Simple ID generation
            lecturers.value.push({ ...lecturer.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Lecturer Created', life: 3000 });
        }

        lecturerDialog.value = false;
        lecturer.value = {};
    }
};

const editLecturer = (data) => {
    lecturer.value = { ...data };
    lecturerDialog.value = true;
};

const confirmDeleteLecturer = (data) => {
    lecturer.value = { ...data };
    deleteLecturerDialog.value = true;
};

const deleteLecturer = () => {
    lecturers.value = lecturers.value.filter((l) => l.id !== lecturer.value.id);
    deleteLecturerDialog.value = false;
    lecturer.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Lecturer Deleted', life: 3000 });
};
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
                <Column field="employee_number" header="Employee Number" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editLecturer(data)" />
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
                    <InputText id="name" v-model.trim="lecturer.name" required="true" autofocus :invalid="submitted && !lecturer.name" fluid />
                    <small v-if="submitted && !lecturer.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="lecturer.email" required="true" :invalid="submitted && !lecturer.email" fluid />
                    <small v-if="submitted && !lecturer.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <InputText id="password" v-model.trim="lecturer.password" required="true" :invalid="submitted && !lecturer.password" type="password" fluid />
                    <small v-if="submitted && !lecturer.password" class="text-red-500">Password is required.</small>
                </div>
                <div>
                    <label for="employee_number" class="block font-bold mb-3">Employee Number</label>
                    <InputText id="employee_number" v-model.trim="lecturer.employee_number" required="true" :invalid="submitted && !lecturer.employee_number" fluid />
                    <small v-if="submitted && !lecturer.employee_number" class="text-red-500">Employee Number is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveLecturer" />
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
