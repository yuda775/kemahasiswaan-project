<script setup>
import { decodeJWT } from '@/service/decodeJWT';
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue';
import { onMounted, reactive, ref, watch } from 'vue';

const expandedRows = ref([]);

const onRowToggle = (event) => {
    expandedRows.value = event.data;
};
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

const onCellEditComplete = async (event) => {
    let { newData, data } = event;
    const activityId = data.id;

    try {
        await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/${activityId}`, {
            advisorVerification: newData.advisorVerification,
            comments: newData.comments
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Updated', life: 3000 });
        fetchData();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update activity', life: 3000 });
    }
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

const fetchData = async () => {
    try {
        const [studentsResponse, categoriesResponse, academicYearsResponse] = await Promise.all([
            axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/advisor/${payload?.id}`, {
                params: {
                    academicYearId: query.academicYear,
                    status: query.status
                }
            }),
            axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/`),
            axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/`)
        ]);

        activities.value = studentsResponse.data.data.student; // Simpan data student
        categories.value = categoriesResponse.data.data;
        academicYears.value = academicYearsResponse.data.data.map((x) => ({
            id: x.id,
            year: `${x.year} ${x.semester}`,
            isActive: x.isActive
        }));
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
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-start mb-4">
                <h4 class="m-0 text-xl font-semibold">Daftar Pengajuan Aktivitas</h4>
            </div>
            <DataTable
                v-model:filters="filters"
                :value="activities"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                dataKey="id"
                size="small"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                :expandedRows="expandedRows"
                @row-toggle="onRowToggle"
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
                            <!-- <label for="statusFilter">
                                <span class="block text-sm font-medium text-gray-700">Status</span>
                                <Select id="statusFilter" v-model="query.status" :options="[{ label: 'Semua', value: '' }, ...statusOptions]" optionLabel="label" optionValue="value" placeholder="Pilih Status" class="w-full" @change="fetchData" />
                            </label> -->
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
                <Column :expander="true" headerStyle="width: 3rem" />
                <Column field="name" header="Nama Mahasiswa">
                    <template #body="{ data }"> {{ data.name }} </template>
                </Column>
                <Column field="npm" header="NPM">
                    <template #body="{ data }"> {{ data.npm }} </template>
                </Column>
                <Column header="Menunggu">
                    <template #body="{ data }">
                        {{ data.activities.filter((a) => a.advisorVerification === 'PENDING').length }}
                    </template>
                </Column>
                <Column header="Disetujui">
                    <template #body="{ data }">
                        {{ data.activities.filter((a) => a.advisorVerification === 'APPROVED').length }}
                    </template>
                </Column>
                <Column header="Ditolak">
                    <template #body="{ data }">
                        {{ data.activities.filter((a) => a.advisorVerification === 'REJECTED').length }}
                    </template>
                </Column>
                <Column header="Total Poin">
                    <template #body="{ data }">
                        {{ data.activities.filter((activity) => activity.advisorVerification === 'APPROVED').reduce((total, activity) => total + activity.point, 0) }}
                    </template>
                </Column>
                <template #expansion="{ data }">
                    <div class="p-4">
                        <DataTable
                            :value="data.activities"
                            dataKey="id"
                            editMode="cell"
                            @cell-edit-complete="onCellEditComplete"
                            :pt="{
                                table: { style: 'min-width: 50rem' },
                                column: {
                                    bodycell: ({ state }) => ({
                                        class: [{ '!py-0': state['d_editing'] }]
                                    })
                                }
                            }"
                        >
                            <Column field="activityName" header="Nama Aktivitas"></Column>
                            <Column field="activityCategory" header="Kategori Aktivitas"></Column>
                            <Column field="point" header="Poin"></Column>
                            <Column field="filePath" header="File">
                                <template #body="{ data }">
                                    <a @click="viewFile(data.filePath)" class="text-blue-500 hover:underline cursor-pointer">Lihat File</a>
                                </template>
                            </Column>
                            <Column field="advisorVerification" header="Status">
                                <template #body="{ data: activity }">
                                    <Tag
                                        :icon="activity.advisorVerification === 'APPROVED' ? 'pi pi-check' : activity.advisorVerification === 'REJECTED' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                                        :severity="activity.advisorVerification === 'APPROVED' ? 'success' : activity.advisorVerification === 'REJECTED' ? 'danger' : 'secondary'"
                                        :value="activity.advisorVerification === 'APPROVED' ? 'Disetujui' : activity.advisorVerification === 'REJECTED' ? 'Ditolak' : 'Menunggu'"
                                    ></Tag>
                                </template>
                                <template #editor="{ data, field }">
                                    <Dropdown v-model="data[field]" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Pilih Status" class="w-full" />
                                </template>
                            </Column>
                            <Column field="comments" header="Komentar" :editable="true">
                                <template #editor="{ data, field }">
                                    <Textarea v-model="data[field]" type="text" rows="3" class="mt-1 block w-full" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>
