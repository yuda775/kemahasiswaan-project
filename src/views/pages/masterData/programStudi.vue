<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const programs = ref([]);
const programDialog = ref(false);
const deleteProgramDialog = ref(false);
const program = ref({});
const selectedPrograms = ref([]);
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
            detail: response.config.method === 'delete' ? 'Program deleted successfully' : 'Program updated successfully',
            life: 3000
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: method === 'delete' ? 'Failed to delete Program' : 'Failed to update Program',
            life: 3000
        });
    }
};

const updateProgram = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/program-study/${id}`, data);
const createProgram = (data) => handleApiCall('post', `${import.meta.env.VITE_APP_BASE_URL}/api/program-study/`, data);
const deleteProgramApi = (id) => handleApiCall('delete', `${import.meta.env.VITE_APP_BASE_URL}/api/program-study/${id}`);

const openNew = () => {
    program.value = {};
    submitted.value = false;
    programDialog.value = true;
};

const hideDialog = () => {
    programDialog.value = false;
    submitted.value = false;
};

const saveProgram = () => {
    submitted.value = true;
    if (program.value.code && program.value.name) {
        if (program.value.id) {
            updateProgram(program.value.id, program.value).then((response) => {
                if (response) {
                    programs.value = programs.value.map((p) => (p.id === program.value.id ? { ...program.value } : p));
                    hideDialog();
                }
            });
        } else {
            createProgram(program.value).then((response) => {
                if (response) {
                    programs.value.push(response.data.data);
                    hideDialog();
                }
            });
        }
    }
};

const editProgram = (data) => {
    program.value = { ...data };
    submitted.value = false;
    programDialog.value = true;
};

const confirmDeleteProgram = (data) => {
    program.value = { ...data };
    deleteProgramDialog.value = true;
};

const deleteProgram = () => {
    deleteProgramApi(program.value.id).then((response) => {
        if (response) {
            programs.value = programs.value.filter((p) => p.id !== program.value.id);
            deleteProgramDialog.value = false;
        }
    });
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

const getDataPrograms = () => fetchData('program-study', programs);

onMounted(() => {
    getDataPrograms();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Study Programs</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedPrograms"
                :value="programs"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} programs"
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

                <Column field="code" header="Kode" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Nama" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProgram(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProgram(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing Program -->
        <Dialog v-model:visible="programDialog" :style="{ width: '450px' }" header="Program Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="code" class="block font-bold mb-3">Kode</label>
                    <InputText id="code" v-model.trim="program.code" required="true" autofocus :invalid="submitted && !program.code" class="w-full" />
                    <small v-if="submitted && !program.code" class="text-red-500">Kode diperlukan.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Nama</label>
                    <InputText id="name" v-model.trim="program.name" required="true" :invalid="submitted && !program.name" class="w-full" />
                    <small v-if="submitted && !program.name" class="text-red-500">Nama diperlukan.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProgram" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteProgramDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="program"
                    >Are you sure you want to delete <b>{{ program.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProgramDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProgram" />
            </template>
        </Dialog>
    </div>
</template>
