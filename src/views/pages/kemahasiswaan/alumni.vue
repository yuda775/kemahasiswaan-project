<script setup>
import axios from 'axios';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';

const toast = useToast();
const addTracerDialog = ref(false);
const expandedRows = ref([]);
const editingRows = ref([]);
const tracerData = ref([]); // This will hold the transformed data
const form = ref({
    title: '',
    description: '',
    submissionLink: '',
    graduationYears: null
});

const fetchTracerData = async () => {
    await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/alumni/questionnaire-submissions/`).then((response) => {
        tracerData.value = response.data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            graduationYears: item.graduationYears,
            submissionLink: item.submissionLink,
            answers: item.answers
        }));
    });
};

const saveTracer = async () => {
    // Logic to save the tracer data
    addTracerDialog.value = false;
    axios
        .post(`${import.meta.env.VITE_APP_BASE_URL}/api/alumni/questionnaire-submission/`, form.value)
        .then(() => {
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data berhasil ditambahkan',
                life: 3000
            });
        })
        .catch((error) => {
            console.error('Error saving data:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal menambahkan data',
                life: 3000
            });
        });
};

const expandAll = () => {
    expandedRows.value = tracerData.value.map((item) => item.id);
};

const collapseAll = () => {
    expandedRows.value = [];
};

const onRowEditSave = async (event) => {
    const { newData } = event;
    const { id, title, description, graduationYears, submissionLink } = newData;
    await axios
        .patch(`${import.meta.env.VITE_APP_BASE_URL}/api/alumni/questionnaire-submission/${id}`, {
            title,
            description,
            graduationYears,
            submissionLink
        })
        .then((response) => {
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data berhasil diperbarui',
                life: 3000
            });
            tracerData.value.push(response.data.data);
        })
        .catch((error) => {
            console.error('Error updating data:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal memperbarui data',
                life: 3000
            });
        });
};

const getImageUrl = (filePath) => {
    if (!filePath) return null;
    return `${import.meta.env.VITE_APP_BASE_URL}/file/questionnaire/${filePath}`;
};

// Fetch data when component is mounted
onMounted(() => {
    fetchTracerData();
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between">
            <h4 class="font-semibold text-xl">Tracer Alumni</h4>
            <Button class="ml-auto" label="Tambah Tracer Alumni" icon="pi pi-plus" @click="addTracerDialog = !addTracerDialog" />
        </div>
        <DataTable
            v-model:expandedRows="expandedRows"
            v-model:editingRows="editingRows"
            :value="tracerData"
            dataKey="id"
            tableStyle="min-width: 60rem"
            removableSort
            editMode="row"
            @row-edit-save="onRowEditSave"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="title" header="Nama Kuesioner" sortable editor>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column field="description" header="Deskripsi" sortable editor>
                <template #editor="{ data, field }">
                    <Textarea v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column field="graduationYears" header="Rentang Tahun Kelulusan" editor>
                <template #body="{ data }">
                    <span>{{ data.graduationYears }}</span>
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column field="submissionLink" header="Link Kuesioner" editor>
                <template #body="{ data }">
                    <a :href="data.submissionLink" target="_blank" class="text-blue-500 hover:underline">
                        {{ data.submissionLink }}
                    </a>
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column :rowEditor="true" class="w-min" bodyStyle="text-align:center"></Column>
            <Column :exportable="false" class="w-min">
                <template #body="{ data }">
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAlumniQuestionnaire(data)" />
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-4">
                    <h5>Daftar Mahasiswa</h5>
                    <DataTable :value="data.answers" removableSort>
                        <Column field="student.name" header="Nama Mahasiswa" sortable></Column>
                        <Column field="student.npm" header="NPM" sortable></Column>
                        <Column field="filePath" header="Bukti" sortable>
                            <template #body="{ data }">
                                <img v-if="data.filePath" :src="getImageUrl(data.filePath)" class="h-24 w-auto" alt="Uploaded file preview" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <Toast />
    </div>

    <Dialog v-model:visible="addTracerDialog" header="Tambah Data Tracer Alumni" :style="{ width: '50vw' }" :modal="true" class="p-fluid">
        <div class="field gap-4">
            <div class="field mt-2">
                <label for="questionnaireName" class="block text-sm font-medium text-gray-700">Nama Kuesioner</label>
                <InputText id="questionnaireName" v-model="form.title" class="mt-1 block w-full" />
            </div>
            <div class="field mt-2">
                <label for="questionnairePurpose" class="block text-sm font-medium text-gray-700">Tujuan Kuesioner</label>
                <Textarea id="questionnairePurpose" v-model="form.description" class="mt-1 block w-full" rows="3" />
            </div>
            <div class="field mt-2">
                <label for="yearRange" class="block text-sm font-medium text-gray-700">Rentang Tahun Kelulusan</label>
                <div class="flex gap-2">
                    <InputText id="yearRange" v-model="form.graduationYears" class="mt-1 block w-full" type="text" placeholder="Contoh: 2018 2019 2020" />
                </div>
            </div>
            <div class="field mt-2">
                <label for="questionnaireLink" class="block text-sm font-medium text-gray-700">Link Kuesioner</label>
                <InputText id="questionnaireLink" v-model="form.submissionLink" class="mt-1 block w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" severity="secondary" class="p-button-text" @click="addTracerDialog = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveTracer" />
        </template>
    </Dialog>
</template>
