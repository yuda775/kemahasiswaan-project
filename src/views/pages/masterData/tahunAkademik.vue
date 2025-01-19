<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const academicYears = ref([]);
const academicYearDialog = ref(false);
const deleteAcademicYearDialog = ref(false);
const academicYear = ref({});
const selectedAcademicYears = ref([]);
const editingRows = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const statuses = ref([
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
]);

const semesters = ref([
    { label: 'GANJIL', value: 'GANJIL' },
    { label: 'GENAP', value: 'GENAP' }
]);

const handleApiCall = async (method, url, data = null) => {
    try {
        const response = await axios[method](url, data);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: response.config.method === 'delete' ? 'Academic Year deleted successfully' : 'Academic Year updated successfully',
            life: 3000
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: method === 'delete' ? 'Failed to delete Academic Year' : 'Failed to update Academic Year',
            life: 3000
        });
    }
};

const updateAcademicYear = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/${id}`, data);
const createAcademicYear = (data) => handleApiCall('post', `${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/`, data);
const deleteAcademicYearApi = (id) => handleApiCall('delete', `${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/${id}`);

const onCellEditComplete = (event) => {
    const { data, newValue, field } = event;
    updateAcademicYear(data.id, { [field]: newValue }).then(() => {
        getDataAcademicYears();
    });
};

const openNew = () => {
    academicYear.value = {};
    submitted.value = false;
    academicYearDialog.value = true;
};

const hideDialog = () => {
    academicYearDialog.value = false;
    submitted.value = false;
};

const saveAcademicYear = () => {
    submitted.value = true;
    createAcademicYear({
        year: academicYear.value.year,
        semester: academicYear.value.semester,
        startDate: academicYear.value.startDate,
        endDate: academicYear.value.endDate
    }).then((response) => {
        if (response) {
            academicYears.value.push(response.data.data);
            hideDialog();
        }
    });
};

const confirmDeleteAcademicYear = (data) => {
    academicYear.value = { ...data };
    deleteAcademicYearDialog.value = true;
};

const deleteAcademicYear = () => {
    deleteAcademicYearApi(academicYear.value.id).then((response) => {
        if (response) {
            academicYears.value = academicYears.value.filter((ay) => ay.id !== academicYear.value.id);
            deleteAcademicYearDialog.value = false;
        }
    });
};

const fetchData = async (endpoint, target) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/${endpoint}/`);
        if (response.status === 200) {
            target.value = response.data.data.map((ay) => ({
                ...ay,
                year: formatYearRange(ay.year)
            }));
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

const getDataAcademicYears = () => fetchData('academic-year', academicYears);

const formatYearRange = (yearString) => {
    const dates = yearString.split(', ');
    if (dates.length === 2) {
        const startYear = new Date(dates[0]).getFullYear();
        const endYear = new Date(dates[1]).getFullYear();
        return `${startYear}/${endYear}`;
    }
    return yearString;
};

onMounted(() => {
    getDataAcademicYears();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Academic Years</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedAcademicYears"
                v-model:editingRows="editingRows"
                :value="academicYears"
                editMode="cell"
                @cell-edit-complete="onCellEditComplete"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} academic years"
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

                <Column field="year" header="Year" sortable style="min-width: 12rem"></Column>
                <Column field="semester" header="Semester" sortable style="min-width: 12rem"></Column>
                <Column field="isActive" header="Status" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                        <Tag :value="data.isActive ? 'Active' : 'Inactive'" :severity="data.isActive ? 'success' : 'danger'" />
                    </template>
                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select a Status" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAcademicYear(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating -->
        <Dialog v-model:visible="academicYearDialog" :style="{ width: '450px' }" header="Tambahkan Tahun Akademik" :modal="true">
            <div class="flex flex-col gap-6 w-full">
                <div class="w-full">
                    <label for="year" class="block font-bold mb-3">Year</label>
                    <InputText id="year" v-model="academicYear.year" placeholder="Enter Year (e.g., 2024/2025)" class="w-full" />
                    <small v-if="submitted && !academicYear.year" class="text-red-500">Year is required.</small>
                </div>
                <div class="w-full">
                    <label for="semester" class="block font-bold mb-3">Semester</label>
                    <Select id="semester" v-model="academicYear.semester" :options="semesters" optionLabel="label" optionValue="value" placeholder="Select a Semester" class="w-full" />
                </div>
                <div class="flex flex-wrap justify-between">
                    <div class="flex flex-col gap-2">
                        <label for="startDate" class="font-bold">Start Date</label>
                        <Datepicker v-model="academicYear.startDate" auto-apply :enable-time-picker="false" :format="'dd/MM/yyyy'" input-class="p-inputtext p-component" wrapper-class="p-inputgroup p-component p-inputgroup-md" />
                        <small v-if="submitted && !academicYear.startDate" class="text-red-500">Start date is required.</small>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="endDate" class="font-bold">End Date</label>
                        <Datepicker v-model="academicYear.endDate" auto-apply :enable-time-picker="false" :format="'dd/MM/yyyy'" input-class="p-inputtext p-component" wrapper-class="p-inputgroup p-component p-inputgroup-md" />
                        <small v-if="submitted && !academicYear.endDate" class="text-red-500">End date is required.</small>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveAcademicYear" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteAcademicYearDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="academicYear"
                    >Are you sure you want to delete <b>{{ academicYear.year }} - {{ academicYear.semester }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteAcademicYearDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteAcademicYear" />
            </template>
        </Dialog>
    </div>
</template>
