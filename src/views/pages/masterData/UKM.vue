<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const students = ref([]);
const ukmList = ref([]);
const ukmDialog = ref(false);
const deleteUKMDialog = ref(false);
const ukm = ref({});
const selectedUKM = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const editingRows = ref([]);

const handleApiCall = async (method, url, data = null) => {
    try {
        const response = await axios[method](url, data);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: response.config.method === 'delete' ? 'UKM deleted successfully' : 'UKM updated successfully',
            life: 3000
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: method === 'delete' ? 'Failed to delete UKM' : 'Failed to update UKM',
            life: 3000
        });
    }
};

const updateUkm = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/ukm/${id}`, data);
const createUkm = (data) => handleApiCall('post', `${import.meta.env.VITE_APP_BASE_URL}/api/ukm/`, data);
const deleteUkm = (id) => handleApiCall('delete', `${import.meta.env.VITE_APP_BASE_URL}/api/ukm/${id}`);

const onRowEditSave = (event) => {
    const { newData, index } = event;
    const { id, name, description, headId } = newData;
    updateUkm(id, { name, description, headId }).then((response) => {
        if (response) {
            const student = students.value.find((s) => s.id === headId);
            ukmList.value[index] = {
                ...ukmList.value[index],
                name,
                description,
                headId,
                head: student ? { name: student.name, npm: student.npm } : null
            };
        }
    });
};

const openNew = () => {
    ukm.value = {};
    submitted.value = false;
    ukmDialog.value = true;
};

const hideDialog = () => {
    ukmDialog.value = false;
    submitted.value = false;
};

const saveUKM = () => {
    submitted.value = true;
    if (ukm.value.name && ukm.value.headId) {
        createUkm(ukm.value).then((response) => {
            if (response) {
                const student = students.value.find((s) => s.id === response.data.data.headId);
                ukmList.value.push({
                    ...response.data.data,
                    head: student ? { name: student.name, npm: student.npm } : null
                });
                hideDialog();
            }
        });
    }
};

const confirmDeleteUKM = (data) => {
    ukm.value = { ...data };
    deleteUKMDialog.value = true;
};

const deleteUKM = () => {
    deleteUkm(ukm.value.id).then((response) => {
        if (response) {
            ukmList.value = ukmList.value.filter((u) => u.id !== ukm.value.id);
            deleteUKMDialog.value = false;
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

const getDataUkm = () =>
    fetchData('ukm', ukmList).then(() => {
        ukmList.value = ukmList.value.map((ukm) => ({
            ...ukm,
            head: students.value.find((s) => s.id === ukm.headId) || null
        }));
    });

const getDataStudent = () =>
    fetchData('student', students).then(() => {
        students.value = students.value.map((s) => ({ id: s.id, name: s.name, npm: s.npm }));
    });

onMounted(() => {
    getDataStudent().then(() => getDataUkm());
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage UKM (Unit Kegiatan Mahasiswa)</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                v-model:selection="selectedUKM"
                v-model:editingRows="editingRows"
                :value="ukmList"
                editMode="row"
                @row-edit-save="onRowEditSave"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} UKM"
                :pt="{
                    table: { style: 'min-width: 50rem' },
                    column: {
                        bodycell: ({ state }) => ({
                            style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem'
                        })
                    }
                }"
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

                <Column field="name" header="Nama" sortable style="min-width: 16rem">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                    </template>
                </Column>
                <Column field="description" header="Deskripsi" sortable style="min-width: 20rem">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                    </template>
                </Column>
                <Column header="Ketua" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                        <span v-if="data.head">{{ data.head.name }} ({{ data.head.npm }})</span>
                        <span v-else>No Head Assigned</span>
                    </template>
                    <template #editor="{ data }">
                        <Select v-model="data.headId" :options="students" :optionLabel="(student) => `${student.name} (${student.npm})`" optionValue="id" placeholder="Select Head" filter class="w-full" />
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUKM(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing UKM -->
        <Dialog v-model:visible="ukmDialog" :style="{ width: '40rem' }" header="UKM" :modal="true">
            <div class="flex flex-col gap-6 w-full">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="ukm.name" required="true" :invalid="submitted && !ukm.name" class="w-full" />
                    <small v-if="submitted && !ukm.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="ukm.description" rows="3" cols="20" class="w-full" />
                </div>
                <div>
                    <label for="head" class="block font-bold mb-3">Head</label>
                    <Select id="head" v-model="ukm.headId" :options="students" :optionLabel="(student) => `${student.name} (${student.npm})`" optionValue="id" placeholder="Select Head" filter class="w-full" />
                    <small v-if="submitted && !ukm.headId" class="text-red-500">Head is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveUKM" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteUKMDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="ukm"
                    >Are you sure you want to delete <b>{{ ukm.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteUKMDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteUKM" />
            </template>
        </Dialog>
    </div>
</template>
