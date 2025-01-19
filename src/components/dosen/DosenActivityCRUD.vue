<script setup>
import { decodeJWT } from '@/service/decodeJWT';
import axios from 'axios';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';

const token = localStorage.getItem('token');
const payload = decodeJWT(token);
const toast = useToast();
const activities = ref([]);
const categories = ref([]);
const academicYears = ref([]);
const statusOptions = ref([
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Disetujui', value: 'APPROVED' },
    { label: 'Ditolak', value: 'REJECTED' }
]);
const filters = ref({});

const getActivities = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/advisor/${payload?.id}`)
        .then((response) => {
            activities.value = response.data.data;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};

const getActivityCategories = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/`)
        .then((response) => {
            categories.value = response.data.data;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};

const getAcademicYears = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/`)
        .then((response) => {
            academicYears.value = response.data.data.map((x) => {
                return {
                    id: x.id,
                    year: `${x.year} ${x.semester}`,
                    isActive: x.isActive
                };
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};

const onCellEditComplete = async (event) => {
    let { newData, index } = event;

    await axios
        .patch(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/${activities.value[index].id}`, {
            advisorVerification: newData.advisorVerification,
            comments: newData.comments
        })
        .then(() => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Updated', life: 3000 });
            getActivities();
        });
};

const viewFile = (filePath) => {
    if (!filePath) return null;
    window.open(`${import.meta.env.VITE_APP_BASE_URL}/file/student-activity/${filePath}`, '_blank');
};

onMounted(() => {
    getActivities();
    getActivityCategories();
    getAcademicYears();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-start mb-4">
                <h4 class="m-0 text-xl font-semibold">Daftar Aktivitas</h4>
            </div>
            <DataTable
                :value="activities"
                editMode="cell"
                @cell-edit-complete="onCellEditComplete"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                dataKey="id"
                size="small"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} activity"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex sm:flex-row flex-wrap flex-col gap-2 sm:gap-0 justify-between items-end">
                        <div class="field flex flex-wrap gap-2">
                            <label for="academicYearFilter">
                                <span class="block text-sm font-medium text-gray-700">Tahun Akademik</span>
                                <Select id="academicYearFilter" v-model="filters.academicYear" :options="academicYears" optionLabel="year" optionValue="year" placeholder="Pilih Tahun Akademik" class="w-full" />
                            </label>
                            <label for="statusFilter">
                                <span class="block text-sm font-medium text-gray-700">Status</span>
                                <Select id="statusFilter" v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Pilih Status" class="w-full" />
                            </label>
                        </div>
                        <IconField class="sm:w-auto w-full">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters.search" placeholder="Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> No data found. </template>
                <template #loading> Loading data. Please wait. </template>

                <Column field="academicYears" header="Tahun Akademik">
                    <template #body="{ data }"> {{ data.academicYear.year }} {{ data.academicYear.semester }} </template>
                </Column>
                <Column field="activityCategory" header="Kategori Aktivitas"></Column>
                <Column field="activityName" header="Nama Aktivitas"></Column>
                <Column field="point" header="Poin"></Column>
                <Column field="filePath" header="File">
                    <template #body="{ data }">
                        <a @click="viewFile(data.filePath)" class="text-blue-500 hover:underline cursor-pointer">Lihat File</a>
                    </template>
                </Column>
                <Column field="advisorVerification" header="Status">
                    <template #body="{ data }">
                        <Tag
                            :icon="data.advisorVerification === 'APPROVED' ? 'pi pi-check' : data.advisorVerification === 'REJECTED' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.advisorVerification === 'APPROVED' ? 'success' : data.advisorVerification === 'REJECTED' ? 'danger' : 'secondary'"
                            :value="data.advisorVerification === 'APPROVED' ? 'Disetujui' : data.advisorVerification === 'REJECTED' ? 'Ditolak' : 'Menunggu'"
                        ></Tag>
                    </template>
                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select One" class="w-full" :showClear="true" />
                    </template>
                </Column>
                <Column field="comments" header="Komentar" style="min-width: 10rem; width: 15rem">
                    <template #editor="{ data, field }">
                        <Textarea v-model="data[field]" type="text" rows="3" class="mt-1 block w-full" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
