<script setup>
import { decodeJWT } from '@/service/decodeJWT';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const tracerData = ref([]);
const token = localStorage.getItem('token');
const payload = decodeJWT(token);

const fetchTracerData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/alumni/questionnaire-submissions/${payload.id}`);

        const submissions = response.data.submission || []; // Default to empty array if undefined

        tracerData.value = submissions.map((submission) => {
            const hasSubmitted = submission.answers && submission.answers.length > 0;
            return {
                id: submission.id,
                status: hasSubmitted ? 'Sudah Mengisi' : 'Belum Mengisi',
                questionnaireName: submission.title,
                questionnaireLink: submission.submissionLink,
                filePath: hasSubmitted ? submission.answers[0].filePath : null
            };
        });
    } catch (error) {
        console.error('Error fetching tracer data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal mengambil data tracer',
            life: 3000
        });
    }
};
const getImageUrl = (filePath) => {
    if (!filePath) return null;
    return `${import.meta.env.VITE_APP_BASE_URL}/file/questionnaire/${filePath}`;
};

const onUpload = async (event, questionnaireSubmissionId) => {
    console.log('onUpload called with event:', event, 'and questionnaireSubmissionId:', questionnaireSubmissionId);
    const file = event.target.files?.[0];
    if (!file) {
        console.log('No file selected for upload');
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Tidak ada file yang dipilih untuk diunggah',
            life: 3000
        });
        return;
    }

    const formData = new FormData();
    formData.append('questionnaireSubmissionId', questionnaireSubmissionId);
    formData.append('studentId', payload?.id);
    formData.append('filePath', file);

    console.log('Uploading file:', file, 'with formData:', formData);

    try {
        const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/alumni/answer-questionnaire/`, formData);
        console.log('File uploaded successfully:', response?.data);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File berhasil diunggah',
            life: 3000
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal mengunggah file',
            life: 3000
        });
    } finally {
        console.log('Fetching tracer data again after upload');
        fetchTracerData();
    }
};

const cancelAnswer = async (questionnaireSubmissionId) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/alumni/answer-questionnaire/${questionnaireSubmissionId}/${payload.id}`);
        console.log('File deleted successfully:', response?.data);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File berhasil dihapus',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal menghapus file',
            life: 3000
        });
    } finally {
        console.log('Fetching tracer data again after delete');
        fetchTracerData();
    }
};

onMounted(() => {
    fetchTracerData();
});
</script>

<template>
    <div class="card">
        <div class="flex">
            <h4 class="font-semibold text-xl">Tracer Alumni</h4>
        </div>
        <DataTable
            :value="tracerData"
            tableStyle="min-width: 60rem"
            removableSort
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
            <Column field="status" header="Status" bodyClass="text-center" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="data.status === 'Belum Mengisi' ? 'danger' : 'success'" />
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
                        <div class="" v-if="data.status === 'Sudah Mengisi' && data.filePath">
                            <div class="flex items-center gap-2" v-if="data.status === 'Sudah Mengisi' && data.filePath">
                                <img crossorigin="anonymous" :src="getImageUrl(data.filePath)" alt="Uploaded file preview" class="w-24 rounded object-cover" />
                                <input type="file" accept="image/*" :ref="`fileInput-${data.id}`" style="display: none" @change="(e) => onUpload(e, data.id)" />
                                <Button type="button" @click="$refs[`fileInput-${data.id}`].click()" icon="pi pi-pencil" class="p-button-outlined p-button-rounded" />
                                <Button type="button" @click="cancelAnswer(data.id)" icon="pi pi-trash" class="p-button-outlined p-button-rounded p-button-danger" />
                            </div>
                        </div>
                        <div v-else class="flex flex-col items-center">
                            <input type="file" accept="image/*" :ref="`fileInput-${data.id}`" style="display: none" @change="(e) => onUpload(e, data.id)" />
                            <Button type="button" @click="$refs[`fileInput-${data.id}`].click()" label="Unggah Bukti" class="p-button-outlined" />
                        </div>
                    </div>
                </template>
            </Column>
        </DataTable>
        <Toast />
    </div>
</template>
