<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center">
                <h4 class="m-0 text-xl font-semibold">Manage Activities</h4>
                <Button label="Buat Pengajuan" icon="pi pi-plus" class="mr-2" @click="addActivityDialog = !addActivityDialog" />
            </div>
            <DataTable
                v-model:filters="filters"
                :value="mockData"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                dataKey="id"
                filterDisplay="row"
                size="small"
                :globalFilterFields="['category', 'name', 'advisorStatus', 'studentAffairsStatus', 'academicYear.start', 'academicYear.end', 'academicYear.semester']"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} activity"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex justify-end">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText class="min-w-[25rem]" v-model="filters.global.value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> No data found. </template>
                <template #loading> Loading data. Please wait. </template>

                <Column field="academicYear" header="Tahun Akademik">
                    <template #filter="{ filterModel, filterCallback }">
                        <Select v-model="filterModel.value" @change="filterCallback()" :options="academicYears" placeholder="Select One" style="min-width: 12rem" :showClear="true" />
                    </template>
                </Column>

                <Column field="category" header="Kategori Aktivitas">
                    <template #body="{ data }">{{ data.category }}</template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by category" />
                    </template>
                </Column>

                <Column field="name" header="Nama Aktivitas">
                    <template #body="{ data }">{{ data.name }}</template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template>
                </Column>

                <Column field="points" header="Poin">
                    <template #body="{ data }">{{ data.points }}</template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by points" />
                    </template>
                </Column>

                <Column field="advisorStatus" header="Verifikasi Dosen Wali">
                    <template #body="{ data }">
                        <Tag
                            :icon="data.advisorStatus === 'Disetujui' ? 'pi pi-check' : data.advisorStatus === 'Ditolak' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.advisorStatus === 'Disetujui' ? 'success' : data.advisorStatus === 'Ditolak' ? 'danger' : 'secondary'"
                            :value="data.advisorStatus"
                        ></Tag>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <Select v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" style="min-width: 12rem" :showClear="true" />
                    </template>
                </Column>

                <Column field="studentAffairsStatus" header="Verifikasi Kemahasiswaan">
                    <template #body="{ data }">
                        <Tag
                            :icon="data.studentAffairsStatus === 'Disetujui' ? 'pi pi-check' : data.studentAffairsStatus === 'Ditolak' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.studentAffairsStatus === 'Disetujui' ? 'success' : data.studentAffairsStatus === 'Ditolak' ? 'danger' : 'secondary'"
                            :value="data.studentAffairsStatus"
                        ></Tag>
                    </template>

                    <template #filter="{ filterModel, filterCallback }">
                        <Select v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" style="min-width: 12rem" :showClear="true" />
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

        <Dialog v-model:visible="addActivityDialog" :style="{ width: '450px' }" header="Buat Pengajuan " :modal="true">
            <div class="field">
                <label for="activityName" class="block text-sm font-medium text-gray-700">Nama Aktivitas</label>
                <InputText id="activityName" placeholder="Masukkan nama aktivitas" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityCategory" class="block text-sm font-medium text-gray-700">Kategori Aktivitas</label>
                <Select placeholder="Pilih kategori" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityPoints" class="block text-sm font-medium text-gray-700">Poin</label>
                <InputText id="activityPoints" type="number" class="mt-1 block w-full" disabled />
            </div>
            <div class="field mt-4">
                <label for="activityProof" class="block text-sm font-medium text-gray-700">Bukti Aktivitas</label>
                <FileUpload ref="fileupload" mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" :customUpload="true" />
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="addActivityDialog = !addActivityDialog" />
                <Button label="Simpan" icon="pi pi-check" @click="saveActivity" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteActivityDialog" :style="{ width: '450px' }" header="Konfirmasi" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" severity="warn" />
                <span v-if="selectedActivity"
                    >Are you sure you want to delete <b>{{ selectedActivity.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" severity="secondary" icon="pi pi-times" text @click="deleteActivityDialog = false" />
                <Button label="Yes" severity="danger" icon="pi pi-check" @click="deleteSelectedActivity" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const toast = useToast();

const addActivityDialog = ref(false);
const deleteActivityDialog = ref(false);
const selectedActivity = ref(null);
const mockData = ref([
    // Mock data remains unchanged
    { id: 1, category: 'Olahraga', name: 'Sepak Bola', points: 10, advisorStatus: 'Disetujui', studentAffairsStatus: 'Disetujui', academicYear: '2022/2023 Ganjil' },
    { id: 2, category: 'Seni', name: 'Lukis', points: 8, advisorStatus: 'Disetujui', studentAffairsStatus: 'Disetujui', academicYear: '2022/2023 Ganjil' },
    { id: 3, category: 'Musik', name: 'Paduan Suara', points: 9, advisorStatus: 'Ditolak', studentAffairsStatus: 'Disetujui', academicYear: '2022/2023 Ganjil' },
    { id: 4, category: 'Komunitas', name: 'Debat', points: 7, advisorStatus: 'Disetujui', studentAffairsStatus: 'Ditolak', academicYear: '2022/2023 Genap' },
    { id: 5, category: 'Olahraga', name: 'Bulu Tangkis', points: 11, advisorStatus: 'Disetujui', studentAffairsStatus: 'Menuggu', academicYear: '2022/2023 Genap' },
    { id: 6, category: 'Seni', name: 'Teater', points: 6, advisorStatus: 'Ditolak', studentAffairsStatus: 'Ditolak', academicYear: '2022/2023 Genap' },
    { id: 7, category: 'Musik', name: 'Band', points: 12, advisorStatus: 'Disetujui', studentAffairsStatus: 'Disetujui', academicYear: '2023/2024 Ganjil' }
]);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    points: { value: null, matchMode: FilterMatchMode.CONTAINS },
    advisorStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    studentAffairsStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    academicYear: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const academicYears = ref(['2022/2023 Ganjil', '2022/2023 Genap', '2023/2024 Ganjil']);
const statuses = ref(['Disetujui', 'Ditolak', 'Menunggu']);

const menu = ref();

const menuItems = ref([
    {
        label: 'Options',
        items: [
            { label: 'Preview PDF', icon: 'pi pi-file-pdf', command: () => window.open('https://unpkg.com/pdfmake@0.1.68/dist/pdfmake.js') },
            { label: 'Edit', icon: 'pi pi-pencil', command: () => handleMenuCommand('edit', selectedActivity.value) },
            { label: 'Delete', icon: 'pi pi-trash', command: () => handleMenuCommand('delete', selectedActivity.value) }
        ]
    }
]);

const toggleMenu = (event, data) => {
    selectedActivity.value = data; // Set the selected activity for deletion confirmation
    menu.value.toggle(event);
    console.log(selectedActivity.value);
};

const handleMenuCommand = (action, data) => {
    if (action === 'edit') editActivity(data);
    if (action === 'delete') confirmDelete(data);
};

const editActivity = (data) => {
    activityDialog.value = true;
    selectedActivity.value = data;
};

const confirmDelete = (data) => {
    selectedActivity.value = data; // Set the selected activity for deletion
    deleteActivityDialog.value = true; // Show delete confirmation dialog
};

const deleteSelectedActivity = () => {
    // Logic to delete the selected activity from mockData
    const index = mockData.value.findIndex((activity) => activity.id === selectedActivity.value.id);
    if (index > -1) {
        mockData.value.splice(index, 1);
    }
    deleteActivityDialog.value = false; // Close the delete confirmation dialog
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Deleted', life: 4000 });
};

const saveActivity = () => {
    // Logic to save the activity (add or edit)
    activityDialog.value = false; // Close the dialog after saving
};
</script>
