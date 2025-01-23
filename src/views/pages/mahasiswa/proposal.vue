<script setup>
import axios from 'axios';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const confirmPopup = useConfirm();
const proposals = ref([]);
const addProposalDialog = ref(false);
const expandedRows = ref({});
const toast = useToast();
const statusFilter = ref(null);
const categoryFilter = ref(null);
const searchQuery = ref('');

const proposalForm = ref({
    title: null,
    category: null,
    activityDate: null,
    files: []
});

const statusOptions = [
    { label: 'Semua Status', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' }
];

const categoryOptions = [
    { label: 'Semua Jenis Kegiatan', value: null },
    { label: 'Internal', value: 'INTERNAL' },
    { label: 'Eksternal', value: 'EXTERNAL' }
];

function confirm(event) {
    confirmPopup.require({
        target: event.target,
        message: 'Apakah anda yakin untuk membatalkan proposal ini?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Yes',
            severity: 'danger'
        },
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

const expandAll = () => {
    expandedRows.value = proposals.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
};

const collapseAll = () => {
    expandedRows.value = null;
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });
};

const previewDocument = (fileUrl) => {
    if (fileUrl) {
        window.open(`${import.meta.env.VITE_APP_BASE_URL}/file/proposal/${fileUrl}`, '_blank');
    } else {
        toast.add({ severity: 'warn', summary: 'File Tidak Tersedia', detail: 'Berkas tidak tersedia untuk dilihat.', life: 3000 });
    }
};

const onFileUpload = (event) => {
    proposalForm.value.files = Array.from(event.target.files);
};

const removeFile = (file) => {
    proposalForm.value.files = proposalForm.value.files.filter((f) => f !== file);
};

const saveProposal = async () => {
    console.log(proposalForm.value);

    const formData = new FormData();
    formData.append('title', proposalForm.value.title);
    formData.append('category', proposalForm.value.category);
    formData.append('activityDate', proposalForm.value.activityDate);
    for (const file of proposalForm.value.files) {
        formData.append('files', file);
    }

    await axios
        .post(`${import.meta.env.VITE_APP_BASE_URL}/api/proposal`, formData)
        .then(() => {
            fetchData();
            toast.add({ severity: 'success', summary: 'Proposal Saved', detail: 'Your proposal has been saved successfully.', life: 3000 });
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Proposal Failed', detail: error.response.data.message, life: 3000 });
        })
        .finally(() => {
            proposalForm.value = {
                title: null,
                category: null,
                activityDate: null,
                files: []
            };
            addProposalDialog.value = false;
        });
};

const resetForm = () => {
    proposalForm.value = {
        title: null,
        category: null,
        activityDate: null,
        files: []
    };
};

const closeDialog = () => {
    resetForm();
    addProposalDialog.value = false;
};

const fetchData = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/proposal`)
        .then((response) => {
            proposals.value = response.data.data;
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Proposal Failed', detail: error.response.data.message, life: 3000 });
        });
};

onMounted(() => {
    fetchData();
});
</script>

<template>
    <Toast />
    <div class="card">
        <div class="flex">
            <h4 class="font-semibold text-xl">Proposal Kegiatan</h4>
            <Button class="ml-auto" label="Tambah Proposal" icon="pi pi-plus" @click="addProposalDialog = !addProposalDialog" />
        </div>
        <DataTable
            v-model:expandedRows="expandedRows"
            :value="proposals"
            dataKey="id"
            tableStyle="min-width: 60rem"
            removableSort
            paginator
            size="small"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} activity"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
                <div class="flex flex-wrap justify-between items-end">
                    <div class="flex gap-2">
                        <div class="field">
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <Select id="status" v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Semua Status" />
                        </div>
                        <div class="field">
                            <label for="category" class="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
                            <Select id="category" v-model="categoryFilter" :options="categoryOptions" optionLabel="label" optionValue="value" placeholder="Semua Jenis Kegiatan" />
                        </div>
                    </div>
                    <div>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText class="w-[25rem]" v-model="searchQuery" placeholder="Search" />
                        </IconField>
                    </div>
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <Tag
                        :value="data.status"
                        :severity="data.status === 'Pending' ? 'secondary' : data.status === 'Approved' ? 'success' : 'danger'"
                        :icon="data.status === 'Pending' ? 'pi pi-clock' : data.status === 'Approved' ? 'pi pi-check' : 'pi pi-times'"
                    />
                </template>
            </Column>
            <Column field="title" header="Judul Proposal"></Column>
            <Column field="category" header="Jenis Kegiatan" sortable></Column>
            <Column field="activityDate" header="Waktu Kegiatan" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.activityDate) }}
                </template>
            </Column>
            <Column field="presentationDate" header="Waktu Presentasi" sortable>
                <template #body="{ data }">
                    {{ data.presentationDate ? formatDate(data.presentationDate) : '' }}
                </template>
            </Column>
            <Column field="comments" header="Komentar"></Column>
            <Column header="Aksi">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <Button icon="pi pi-times" severity="danger" class="p-button-outlined p-button-rounded" @click="confirm(data)" />
                    </div>
                </template>
            </Column>
            <template #expansion="{ data }">
                <div class="p-4">
                    <h5>Berkas untuk {{ data.title }}</h5>
                    <DataTable :value="data.files">
                        <Column field="name" header="Nama Berkas"></Column>
                        <Column header="Aksi">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Button icon="pi pi-eye" class="p-button-outlined p-button-rounded" @click="previewDocument(data.path)" :disabled="!data.path" />
                                    <span class="text-sm text-gray-600">{{ data.path ? 'Lihat Berkas' : 'Tidak Tersedia' }}</span>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
    <Dialog v-model:visible="addProposalDialog" :style="{ width: '50rem' }" header="Buat Pengajuan Proposal" :modal="true" @hide="closeDialog">
        <form @submit.prevent="saveProposal">
            <div class="field mt-4">
                <label for="title" class="block text-sm font-medium text-gray-700">Judul Proposal</label>
                <InputText id="title" v-model="proposalForm.title" placeholder="Masukkan judul proposal" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityDate" class="block text-sm font-medium text-gray-700">Waktu Kegiatan</label>
                <DatePicker id="activityDate" v-model="proposalForm.activityDate" class="mt-1 block w-full" />
            </div>
            <div class="field mt-4">
                <label for="category" class="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
                <Select placeholder="Pilih jenis kegiatan" class="mt-1 block w-full" required v-model="proposalForm.category" :options="categoryOptions.slice(1)" optionLabel="label" optionValue="value" />
            </div>
            <div class="field mt-4 text-sm text-gray-700">
                <h5 class="font-bold">Daftar berkas yang harus di upload dalam format PDF:</h5>
                <ol v-if="proposalForm.category === 'INTERNAL'" class="list-decimal ml-4">
                    <li>Proposal kegiatan</li>
                    <li>Surat permohonan kegiatan (Waka, Sarpras, Kemahasiswaan, BEM, Pembina Ormawa)</li>
                    <li>SK panitia kegiatan</li>
                    <li>Surat pernyataan pertanggung jawaban kegiatan</li>
                    <li>Surat permohonan dispensasi mahasiswa</li>
                    <li>Surat perizinan tempat kegiatan</li>
                    <li>Surat pemberitahuan kegiatan (Kemahasiswaan, Sarpras, BEM, Pembina Ormawa)</li>
                    <li>Term of Reference (TOR) kegiatan</li>
                </ol>
                <ol v-else-if="proposalForm.category === 'EXTERNAL'" class="list-decimal ml-4">
                    <li>Proposal pengajuan dana</li>
                    <li>Surat permohonan kegiatan keuangan</li>
                    <li>Surat permohonan pemberitahuan keuangan</li>
                    <li>Surat persetujuan kegiatan pengelola tempat kegiatan</li>
                    <li>Surat izin orang tua</li>
                    <li>Surat keterangan surat</li>
                </ol>
                <p class="mt-2 text-sm text-gray-700">Pastikan nama file sesuai dengan nama berkas yang di upload, contoh: "Proposal Pengajuan Dana.pdf".</p>
            </div>
            <div class="field mt-4">
                <label class="block text-sm font-medium text-gray-700">Unggah Berkas</label>
                <div class="mt-1 block w-full">
                    <input
                        id="files"
                        type="file"
                        @change="onFileUpload"
                        multiple
                        accept=".pdf"
                        required
                        class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <ul v-if="proposalForm.files.length > 0" class="ml-4 mt-2 space-y-1">
                        <li v-for="file in proposalForm.files" :key="file.name" class="flex items-center">
                            <span class="flex-1">{{ file.name }}</span>
                            <Button icon="pi pi-times" severity="danger" rounded variant="outlined" aria-label="Cancel" @click="removeFile(file)" />
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="categoryOptions.find((option) => option.value === 'Eksternal')" class=""></div>

            <div class="flex justify-end gap-2 mt-8">
                <Button label="Cancel" icon="pi pi-times" severity="secondary" text @click="closeDialog" />
                <Button label="Simpan" icon="pi pi-check" type="submit" />
            </div>
        </form>
    </Dialog>
</template>
