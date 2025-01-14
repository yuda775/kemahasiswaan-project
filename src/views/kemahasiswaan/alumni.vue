<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const tracerData = ref([]);
const expandedRows = ref({});
const addTracerDialog = ref(false);

const expandAll = () => {
    expandedRows.value = tracerData.value.reduce((acc, p) => ({ ...acc, [p.id]: true }), {});
};

const collapseAll = () => {
    expandedRows.value = {};
};

const form = ref({
    questionnaireName: null,
    questionnaireLink: null,
    questionnairePurpose: null,
    graduationYearRange: null
});

const saveTracer = () => {
    const newTracer = {
        id: tracerData.value.length + 1,
        questionnaireName: form.value.questionnaireName,
        questionnaireLink: form.value.questionnaireLink,
        questionnairePurpose: form.value.questionnairePurpose,
        graduationYearRange: form.value.graduationYearRange,
        students: []
    };
    tracerData.value.push(newTracer);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Tracer Alumni berhasil ditambahkan', life: 3000 });
    addTracerDialog.value = false;
    console.log(tracerData.value);
};

onMounted(() => {
    tracerData.value = [
        {
            id: 1,
            status: 'Belum Mengisi',
            questionnaireName: 'Kuesioner Tracer Alumni 2024',
            questionnaireLink: 'https://example.com/questionnaire1',
            graduationYearRange: [2024, 2024],
            students: [
                { name: 'John Doe', npm: '1808101001', programStudi: 'Teknik Informatika', graduationYear: 2024 },
                { name: 'Jane Doe', npm: '1808101002', programStudi: 'Sistem Informasi', graduationYear: 2024 },
                { name: 'Bob Smith', npm: '1808101003', programStudi: 'Teknik Informatika', graduationYear: 2024 }
            ]
        },
        {
            id: 2,
            status: 'Sudah Mengisi',
            questionnaireName: 'Kuesioner Tracer Alumni 2023',
            questionnaireLink: 'https://example.com/questionnaire2',
            graduationYearRange: [2023, 2023],
            students: [
                { name: 'Alice Johnson', npm: '1808101004', programStudi: 'Teknik Elektro', graduationYear: 2023 },
                { name: 'Mike Brown', npm: '1808101005', programStudi: 'Teknik Mesin', graduationYear: 2023 },
                { name: 'Eve Davis', npm: '1808101006', programStudi: 'Teknik Kimia', graduationYear: 2023 }
            ]
        },
        {
            id: 3,
            status: 'Sudah Mengisi',
            questionnaireName: 'Kuesioner Tracer Alumni 2022',
            questionnaireLink: 'https://example.com/questionnaire3',
            graduationYearRange: [2022, 2022],
            students: [
                { name: 'Sarah Taylor', npm: '1808101007', programStudi: 'Teknik Lingkungan', graduationYear: 2022 },
                { name: 'Kevin White', npm: '1808101008', programStudi: 'Teknik Geologi', graduationYear: 2022 },
                { name: 'Linda Lee', npm: '1808101009', programStudi: 'Teknik Biomedis', graduationYear: 2022 }
            ]
        }
    ];
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
            :value="tracerData"
            dataKey="id"
            tableStyle="min-width: 60rem"
            removableSort
            editMode="cell"
            @cell-edit-complete="onCellEditComplete"
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
            <Column field="questionnaireName" header="Nama Kuesioner" sortable editor>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column header="Rentang Tahun Kelulusan" editor>
                <template #body="{ data }">
                    <span>{{ data.graduationYearRange[0] }} - {{ data.graduationYearRange[1] }}</span>
                </template>
                <template #editor="{ data, field }">
                    <Calendar v-model="data[field]" selectionMode="range" view="year" dateFormat="yy" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column field="questionnaireLink" header="Link Kuesioner" editor>
                <template #body="{ data }">
                    <a :href="data.questionnaireLink" target="_blank" class="text-blue-500 hover:underline">
                        {{ data.questionnaireLink }}
                    </a>
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-4">
                    <h5>Daftar Mahasiswa</h5>
                    <DataTable :value="data.students" removableSort>
                        <Column field="name" header="Nama Mahasiswa" sortable></Column>
                        <Column field="npm" header="NPM" sortable></Column>
                        <Column field="programStudi" header="Program Studi" sortable></Column>
                        <Column field="graduationYear" header="Tahun Kelulusan" sortable></Column>
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
                <InputText id="questionnaireName" v-model="form.questionnaireName" class="mt-1 block w-full" />
            </div>
            <div class="field mt-2">
                <label for="questionnaireLink" class="block text-sm font-medium text-gray-700">Link Kuesioner</label>
                <InputText id="questionnaireLink" v-model="form.questionnaireLink" class="mt-1 block w-full" />
            </div>
            <div class="field mt-2">
                <label for="questionnairePurpose" class="block text-sm font-medium text-gray-700">Tujuan Kuesioner</label>
                <InputText id="questionnairePurpose" v-model="form.questionnairePurpose" class="mt-1 block w-full" />
            </div>
            <div class="field mt-2">
                <label for="yearRange" class="block text-sm font-medium text-gray-700">Rentang Tahun Kelulusan</label>
                <div class="flex gap-2">
                    <Calendar id="yearRange" v-model="form.graduationYearRange" selectionMode="range" view="year" dateFormat="yy" class="mt-1 block w-full" />
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" severity="secondary" class="p-button-text" @click="addTracerDialog = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveTracer" />
        </template>
    </Dialog>
</template>
