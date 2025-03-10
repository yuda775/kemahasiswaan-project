<template>
    <div class="card">
        <h4 class="m-0 text-xl font-semibold">Rekapitulasi Angka Kredit Aktivitas</h4>
        <DataTable v-model:filters="filters" :value="activities" paginator :rows="10" removableSort tableStyle="min-width: 50rem" :globalFilterFields="['name']">
            <template #header>
                <div class="flex justify-between">
                    <Select id="academicYearFilter" v-model="query.academicYear" :options="academicYears" optionLabel="year" optionValue="id" placeholder="Select Academic Year" class="w-25" @change="fetchData" />

                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search" />
                    </IconField>
                </div>
            </template>
            <Column field="name" header="Mahasiswa" sortable style="width: 25%"></Column>
            <Column field="code" header="Point" sortable style="width: 25%"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';

const activities = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const query = reactive({
    academicYear: null,
    status: null
});

const academicYears = ref([
    { year: 'Semua', id: '' },
    { year: '2023-2024', id: '2023-2024' },
    { year: '2022-2023', id: '2022-2023' },
    { year: '2021-2022', id: '2021-2022' },
    { year: '2020-2021', id: '2020-2021' }
]);

const fetchData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/summary`);
        activities.value = response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData();
});
</script>
