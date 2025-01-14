<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const tracerData = ref([]);
const expandedRows = ref({});
const toast = useToast();

onMounted(() => {
    // Simulasi pengambilan data dari layanan
    tracerData.value = [
        {
            id: 1,
            status: 'Belum Mengisi',
            questionnaireName: 'Kuesioner Tracer Alumni 2024',
            questionnaireLink: 'https://example.com/questionnaire1',
            evidenceUrl: '/files/evidence1.jpg'
        },
        {
            id: 2,
            status: 'Sudah Mengisi',
            questionnaireName: 'Kuesioner Tracer Alumni 2023',
            questionnaireLink: 'https://example.com/questionnaire2',
            evidenceUrl: '/files/evidence2.jpg'
        },
        {
            id: 3,
            status: 'Sudah Mengisi',
            questionnaireName: 'Kuesioner Tracer Alumni 2022',
            questionnaireLink: 'https://example.com/questionnaire3',
            evidenceUrl: null
        }
    ];
});

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <div class="card">
        <div class="flex">
            <h4 class="font-semibold text-xl">Tracer Alumni</h4>
        </div>
        <DataTable
            :value="tracerData"
            dataKey="id"
            tableStyle="min-width: 60rem"
            removableSort
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
            <template #header> </template>
            <Column field="status" header="Status" bodyClass="text-center" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="data.status === 'Belum Mengisi' ? 'danger' : data.status === 'Sudah Mengisi' ? 'success' : 'warning'" />
                </template>
            </Column>
            <Column field="questionnaireName" header="Nama Kuesioner"></Column>
            <Column field="questionnaireLink" header="Link Kuesioner">
                <template #body="{ data }">
                    <a :href="data.questionnaireLink" target="_blank" class="text-blue-500 hover:underline">
                        {{ data.questionnaireLink }}
                    </a>
                </template>
            </Column>
            <Column header="Bukti Mengisi Kuesioner">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img v-if="data.status === 'Sudah Mengisi'" src="https://picsum.photos/200/300" class="w-24 rounded object-cover" />
                        <FileUpload v-else name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="false" accept="image/*" :maxFileSize="1000000">
                            <template #empty>
                                <span>Drag and drop files to here to upload.</span>
                            </template>
                        </FileUpload>
                    </div>
                </template>
            </Column>
        </DataTable>
        <Toast />
    </div>
</template>
