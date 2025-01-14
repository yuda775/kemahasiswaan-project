<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
const toast = useToast();

const mockData = ref([
    {
        id: 1,
        category: 'Olahraga',
        name: 'Sepak Bola',
        points: 10,
        advisorStatus: 'Disetujui',
        studentAffairsStatus: 'Disetujui',
        academicYear: '2022/2023 Ganjil',
        date: '14/09/2022',
        comment: 'Terima kasih atas kesempatan ini.',
        student: {
            name: 'Rafi Ramadhan',
            npm: '1831710055'
        }
    },
    {
        id: 2,
        category: 'Seni',
        name: 'Lukis',
        points: 8,
        advisorStatus: 'Disetujui',
        studentAffairsStatus: 'Disetujui',
        academicYear: '2022/2023 Ganjil',
        date: '18/09/2022',
        comment: 'Saya sangat senang dengan kegiatan ini.',
        student: {
            name: 'Aisyah Putri',
            npm: '1831710011'
        }
    },
    {
        id: 3,
        category: 'Musik',
        name: 'Paduan Suara',
        points: 9,
        advisorStatus: 'Ditolak',
        studentAffairsStatus: 'Disetujui',
        academicYear: '2022/2023 Ganjil',
        date: '22/09/2022',
        comment: 'Saya harap kegiatan ini dapat diadakan kembali.',
        student: {
            name: 'Muhammad Fajar',
            npm: '1831710077'
        }
    },
    {
        id: 4,
        category: 'Komunitas',
        name: 'Debat',
        points: 7,
        advisorStatus: 'Disetujui',
        studentAffairsStatus: 'Ditolak',
        academicYear: '2022/2023 Genap',
        date: '05/02/2023',
        comment: 'Kegiatan ini sangat bermanfaat bagi saya, terima kasih banyak',
        student: {
            name: 'Rafi Ramadhan',
            npm: '1831710055'
        }
    },
    {
        id: 5,
        category: 'Olahraga',
        name: 'Bulu Tangkis',
        points: 11,
        advisorStatus: 'Disetujui',
        studentAffairsStatus: 'Menuggu',
        academicYear: '2022/2023 Genap',
        date: '12/02/2023',
        comment: 'Saya sangat menikmati kegiatan ini.',
        student: {
            name: 'Aisyah Putri',
            npm: '1831710011'
        }
    },
    {
        id: 6,
        category: 'Seni',
        name: 'Teater',
        points: 6,
        advisorStatus: 'Ditolak',
        studentAffairsStatus: 'Ditolak',
        academicYear: '2022/2023 Genap',
        date: '19/02/2023',
        comment: 'Saya harap kegiatan ini dapat diadakan kembali.',
        student: {
            name: 'Muhammad Fajar',
            npm: '1831710077'
        }
    }
]);

const selectedActivity = ref(null);
const detailDialogVisible = ref(false);

const academicYearFilter = ref(null);

const filteredMockData = computed(() => {
    if (!academicYearFilter.value) return mockData.value;
    return mockData.value.filter((data) => data.academicYear === academicYearFilter.value);
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    student: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    points: { value: null, matchMode: FilterMatchMode.CONTAINS },
    advisorStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    studentAffairsStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    academicYear: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const menu = ref();
const menuItems = ref([
    {
        label: 'Options',
        items: [
            { label: 'Detail', icon: 'pi pi-eye', command: () => (detailDialogVisible.value = true) },
            { label: 'Lihat Berkas', icon: 'pi pi-file-pdf', command: () => window.open('https://unpkg.com/pdfmake@0.1.68/dist/pdfmake.js') }
        ]
    }
]);

const toggleMenu = (event, data) => {
    selectedActivity.value = data; // Set the selected activity for deletion confirmation
    menu.value.toggle(event);
    console.log(selectedActivity.value);
};

const academicYears = ref([
    { label: 'Semua Tahun Akademik', value: null },
    { label: '2022/2023 Ganjil', value: '2022/2023 Ganjil' },
    { label: '2022/2023 Genap', value: '2022/2023 Genap' },
    { label: '2023/2024 Ganjil', value: '2023/2024 Ganjil' }
]);

const statuses = ref(['Disetujui', 'Ditolak', 'Menunggu']);

const onCellEditComplete = (event) => {
    let { newData, index } = event;
    mockData.value[index] = newData;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Updated', life: 3000 });
};
</script>

<template>
    <div>
        <div class="card">
            <h4 class="mb-4 text-xl font-semibold">Daftar Aktivitas</h4>
            <DataTable
                v-model:filters="filters"
                :value="filteredMockData"
                editMode="cell"
                @cell-edit-complete="onCellEditComplete"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                dataKey="id"
                filterDisplay="row"
                size="small"
                :globalFilterFields="['category', 'name', 'advisorStatus', 'studentAffairsStatus', 'academicYear.start', 'academicYear.end', 'academicYear.semester']"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} activity"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :pt="{
                    table: { style: 'min-width: 50rem' },
                    column: {
                        bodycell: ({ state }) => ({
                            class: [{ '!py-0': state['d_editing'] }]
                        })
                    }
                }"
            >
                <template #header>
                    <div class="flex sm:flex-row flex-col gap-2 sm:gap-0 justify-between items-end">
                        <div class="field">
                            <label for="status" class="block text-sm font-medium text-gray-700">Tahun Akademik</label>
                            <Dropdown id="status" v-model="academicYearFilter" :options="academicYears" optionLabel="label" optionValue="value" placeholder="Semua Tahun Akademik" />
                        </div>
                        <div>
                            <IconField class="sm:w-auto w-full">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText class="w-full sm:min-w-[25rem]" v-model="filters.global.value" placeholder="Search" />
                            </IconField>
                        </div>
                    </div>
                </template>
                <template #empty> No data found. </template>
                <template #loading> Loading data. Please wait. </template>

                <Column field="student" header="Mahasiswa">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template>
                    <template #body="{ data }"> {{ data.student.name }} ({{ data.student.npm }}) </template>
                </Column>
                <Column field="category" header="Kategori Aktivitas">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by category" />
                    </template>
                </Column>
                <Column field="name" header="Nama Aktivitas">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="date" header="Tanggal Aktivitas">
                    <template #filter="{ filterModel, filterCallback }">
                        <Calendar v-model="filterModel.value" @change="filterCallback()" placeholder="Select a date" style="width: 100%" />
                    </template>
                </Column>

                <Column field="advisorStatus" header="Status">
                    <template #filter="{ filterModel, filterCallback }">
                        <Select v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" style="min-width: 12rem" :showClear="true" />
                    </template>
                    <template #body="{ data }">
                        <Tag
                            class="cursor-pointer"
                            :icon="data.advisorStatus === 'Disetujui' ? 'pi pi-check' : data.advisorStatus === 'Ditolak' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.advisorStatus === 'Disetujui' ? 'success' : data.advisorStatus === 'Ditolak' ? 'danger' : 'secondary'"
                            :value="data.advisorStatus"
                        ></Tag>
                    </template>
                    <template #editor="{ data, field }">
                        <Select v-model="data[field]" @change="onSave(data)" :options="statuses" placeholder="Select One" style="min-width: 12rem" :showClear="true" />
                    </template>
                </Column>
                <Column field="comment" header="Komentar" editor>
                    <template #editor="{ data, field }">
                        <textarea class="cursor-pointer w-full" v-model="data[field]" type="text" />
                    </template>
                </Column>
                <Column>
                    <template #body="{ data }">
                        <Button type="button" severity="secondary" icon="pi pi-ellipsis-h" @click="(event) => toggleMenu(event, data)" aria-haspopup="true" aria-controls="overlay_menu" />
                        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <Dialog v-model="detailDialogVisible" header="Detail Aktivitas" v-model:visible="detailDialogVisible" :modal="true" :closable="false" :style="{ width: '50vw' }">
            <div v-if="selectedActivity" class="space-y-4">
                <h4 class="text-lg font-semibold mb-3">{{ selectedActivity.name }}</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Mahasiswa</span>
                        <span class="block text-lg">{{ `${selectedActivity.student.name} (${selectedActivity.student.npm})` }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Tanggal</span>
                        <span class="block text-lg">{{ selectedActivity.date }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Kategori</span>
                        <span class="block text-lg">{{ selectedActivity.category }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Kegiatan</span>
                        <span class="block text-lg">{{ selectedActivity.name }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Poin</span>
                        <span class="block text-lg">{{ selectedActivity.points }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Status Kemahasiswaan</span>
                        <span class="block text-lg">{{ selectedActivity.studentAffairsStatus }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Tahun Akademik</span>
                        <span class="block text-lg">{{ selectedActivity.academicYear }}</span>
                    </div>
                    <div class="col-span-1 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Status Dosen Wali</span>
                        <span class="block text-lg">{{ selectedActivity.advisorStatus }}</span>
                    </div>
                    <div class="col-span-2 bg-gray-100 p-4 rounded-lg">
                        <span class="block font-semibold text-gray-600">Komentar</span>
                        <span class="block text-lg">{{ selectedActivity.comment }}</span>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" severity="secondary" @click="detailDialogVisible = false" class="p-button-text" />
            </template>
        </Dialog>
    </div>
</template>
