<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue';
import { onMounted, reactive, ref, watch } from 'vue';

const toast = useToast();
const activities = ref([]);
const categories = ref([]);
const academicYears = ref([]);
const statusOptions = ref([
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Disetujui', value: 'APPROVED' },
    { label: 'Ditolak', value: 'REJECTED' }
]);

const onCellEditComplete = async (event) => {
    let { newData, index } = event;

    await axios
        .patch(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/${activities.value[index].id}`, {
            studentAffairVerification: newData.studentAffairVerification,
            comments: newData.comments
        })
        .then(() => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Updated', life: 3000 });
            fetchData();
        });
};

const viewFile = (filePath) => {
    if (!filePath) return null;
    window.open(`${import.meta.env.VITE_APP_BASE_URL}/file/student-activity/${filePath}`, '_blank');
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const query = reactive({
    academicYear: null,
    status: null
});

onMounted(async () => {
    try {
        // Fetch academic years and filter for active ones
        const academicYearsResponse = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/`);
        academicYears.value = academicYearsResponse.data.data.map((x) => ({
            id: x.id,
            year: `${x.year} ${x.semester}`,
            isActive: x.isActive
        }));

        // Set default academic year to active one
        query.academicYear = academicYears.value.find((year) => year.isActive)?.id;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

const fetchData = async () => {
    try {
        // Fetch activities and categories
        const [activitiesResponse, categoriesResponse] = await Promise.all([
            axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/student-affair`, {
                params: {
                    academicYearId: query.academicYear,
                    status: query.status
                }
            }),
            axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/`)
        ]);

        activities.value = activitiesResponse.data.data;
        categories.value = categoriesResponse.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

watch(
    () => ({ ...query }),
    () => {
        fetchData();
    },
    { deep: true }
);
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-start mb-4">
                <h4 class="m-0 text-xl font-semibold">Daftar Aktivitas</h4>
            </div>
            <DataTable
                v-model:filters="filters"
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
                :globalFilterFields="['academicYears', 'studnet', 'activityCategory', 'activityName', 'point', 'filePath', 'studentAffairVerification', 'comments']"
            >
                <template #header>
                    <div class="flex sm:flex-row flex-wrap flex-col gap-2 sm:gap-0 justify-between items-end">
                        <div class="field flex flex-wrap gap-2">
                            <label for="academicYearFilter">
                                <span class="block text-sm font-medium text-gray-700">Tahun Akademik</span>
                                <Select
                                    id="academicYearFilter"
                                    v-model="query.academicYear"
                                    :options="[{ year: 'Semua', id: '' }, ...academicYears]"
                                    optionLabel="year"
                                    optionValue="id"
                                    placeholder="Pilih Tahun Akademik"
                                    class="w-full"
                                    @change="fetchData"
                                />
                            </label>
                            <label for="statusFilter">
                                <span class="block text-sm font-medium text-gray-700">Status</span>
                                <Select id="statusFilter" v-model="query.status" :options="[{ label: 'Semua', value: '' }, ...statusOptions]" optionLabel="label" optionValue="value" placeholder="Pilih Status" class="w-full" @change="fetchData" />
                            </label>
                        </div>
                        <IconField class="sm:w-auto w-full">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> No data found. </template>
                <template #loading> Loading data. Please wait. </template>

                <Column field="studnet" header="Mahasiswa">
                    <template #body="{ data }"> {{ data.student.name }} ({{ data.student.npm }}) </template>
                </Column>
                <Column field="activityCategory" header="Kategori Aktivitas"></Column>
                <Column field="activityName" header="Nama Aktivitas"></Column>
                <Column field="point" header="Poin"></Column>
                <Column field="filePath" header="File">
                    <template #body="{ data }">
                        <a @click="viewFile(data.filePath)" class="text-blue-500 hover:underline cursor-pointer">Lihat File</a>
                    </template>
                </Column>
                <Column field="studentAffairVerification" header="Status">
                    <template #body="{ data }">
                        <Tag
                            :icon="data.studentAffairVerification === 'APPROVED' ? 'pi pi-check' : data.studentAffairVerification === 'REJECTED' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.studentAffairVerification === 'APPROVED' ? 'success' : data.studentAffairVerification === 'REJECTED' ? 'danger' : 'secondary'"
                            :value="data.studentAffairVerification === 'APPROVED' ? 'Disetujui' : data.studentAffairVerification === 'REJECTED' ? 'Ditolak' : 'Menunggu'"
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
