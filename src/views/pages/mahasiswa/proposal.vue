<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const confirmPopup = useConfirm();
const proposals = ref([]);
const addProposalDialog = ref(false);
const expandedRows = ref({});
const toast = useToast();
const statusFilter = ref(null);
const activityTypeFilter = ref(null);
const searchQuery = ref('');

const proposalForm = ref({
    id: null,
    status: null,
    studentActivityUnit: null,
    studentName: null,
    title: null,
    activityType: null,
    activityDateTime: null,
    presentationDateTime: null,
    comments: null,
    proposalDocument: null,
    internalDocuments: [
        { name: 'Surat Permohonan Kegiatan', fileUrl: null },
        { name: 'SK Panitia Kegiatan', fileUrl: null },
        { name: 'Surat Pernyataan Pertanggung Jawaban Kegiatan', fileUrl: null },
        { name: 'Surat Permohonan Dispensasi Mahasiswa', fileUrl: null },
        { name: 'Surat Perizinan Tempat Kegiatan', fileUrl: null },
        { name: 'Surat Pemberitahuan Kegiatan Kemahasiswaan', fileUrl: null },
        { name: 'Surat Pemberitahuan Kegiatan Wakil Ketua', fileUrl: null },
        { name: 'Surat Pemberitahuan Kegiatan Sarpras', fileUrl: null },
        { name: 'Surat Pemberitahuan Kegiatan BEM', fileUrl: null },
        { name: 'Surat Pemberitahuan Kegiatan Pembina', fileUrl: null },
        { name: 'Term of Reference (TOR) Kegiatan', fileUrl: null }
    ],
    externalDocuments: [
        { name: 'Proposal Pengajuan Dana', fileUrl: null },
        { name: 'Surat Permohonan Kegiatan Keuangan', fileUrl: null },
        { name: 'Surat Pemberitahuan Keuangan', fileUrl: null },
        { name: 'Surat Persetujuan Kegiatan Pengelola Tempat Kegiatan', fileUrl: null },
        { name: 'Surat Izin Orang Tua', fileUrl: null },
        { name: 'Surat Keterangan Sehat', fileUrl: null }
    ]
});

const statusOptions = [
    { label: 'Semua Status', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' }
];

const activityTypeOptions = [
    { label: 'Semua Jenis Kegiatan', value: null },
    { label: 'Internal', value: 'Internal' },
    { label: 'Eksternal', value: 'Eksternal' }
];

const filteredProposals = computed(() => {
    return proposals.value.filter((proposal) => {
        let matchesStatus = statusFilter.value ? proposal.status === statusFilter.value : true;
        let matchesActivityType = activityTypeFilter.value ? proposal.activityType === activityTypeFilter.value : true;
        let matchesSearch = searchQuery.value
            ? proposal.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || proposal.status.toLowerCase().includes(searchQuery.value.toLowerCase()) || proposal.activityType.toLowerCase().includes(searchQuery.value.toLowerCase())
            : true;

        return matchesStatus && matchesActivityType && matchesSearch;
    });
});

onMounted(() => {
    // Simulasi pengambilan data dari layanan
    proposals.value = [
        {
            id: 1,
            status: 'Pending',
            studentActivityUnit: 'HIMATIF',
            studentName: 'John Doe',
            title: 'Seminar Teknologi Terkini',
            activityType: 'Internal',
            activityDateTime: new Date('2025-01-15T10:00:00'),
            presentationDateTime: new Date('2025-01-14T14:00:00'),
            comments: 'Menunggu persetujuan dari BEM',
            proposalDocument: '/files/proposal.pdf',
            internalDocuments: [
                { name: 'Surat Permohonan Kegiatan', fileUrl: null },
                { name: 'SK Panitia Kegiatan', fileUrl: '/files/sk_panitia_kegiatan.pdf' },
                { name: 'Surat Pernyataan Pertanggung Jawaban Kegiatan', fileUrl: '/files/surat_pertanggung_jawaban.pdf' },
                { name: 'Surat Permohonan Dispensasi Mahasiswa', fileUrl: '/files/surat_perizinan_tempat_kegiatan.pdf' },
                { name: 'Surat Perizinan Tempat Kegiatan', fileUrl: '/files/surat_permohonan_dispensasi.pdf' },
                { name: 'Surat Pemberitahuan Kegiatan Kemahasiswaan', fileUrl: '/files/surat_pemberitahuan_kemahasiswaan.pdf' },
                { name: 'Surat Pemberitahuan Kegiatan Wakil Ketua', fileUrl: '/files/surat_pemberitahuan_wakil_ketua.pdf' },
                { name: 'Surat Pemberitahuan Kegiatan Sarpras', fileUrl: '/files/surat_pemberitahuan_sarpras.pdf' },
                { name: 'Surat Pemberitahuan Kegiatan BEM', fileUrl: '/files/surat_pemberitahuan_bem.pdf' },
                { name: 'Surat Pemberitahuan Kegiatan Pembina', fileUrl: '/files/surat_pemberitahuan_pembina.pdf' },
                { name: 'Term of Reference (TOR) Kegiatan', fileUrl: '/files/tor_kegiatan.pdf' }
            ],
            externalDocuments: [
                { name: 'Proposal Pengajuan Dana', fileUrl: null },
                { name: 'Surat Permohonan Kegiatan Keuangan', fileUrl: null },
                { name: 'Surat Pemberitahuan Keuangan', fileUrl: null },
                { name: 'Surat Persetujuan Kegiatan Pengelola Tempat Kegiatan', fileUrl: null },
                { name: 'Surat Izin Orang Tua', fileUrl: null },
                { name: 'Surat Keterangan Sehat', fileUrl: null }
            ]
        },
        {
            id: 2,
            status: 'Approved',
            title: 'Konferensi Nasional',
            student_activity_unit: 'HIMATIF',
            student_name: 'Jane Doe',
            activityType: 'Eksternal',
            activityDateTime: new Date('2025-02-20T09:00:00'),
            presentationDateTime: new Date('2025-02-19T15:00:00'),
            comments: 'Semua berkas lengkap',
            proposalDocument: '/files/proposal.pdf',
            internalDocuments: [
                { name: 'Surat Permohonan Kegiatan', fileUrl: null },
                { name: 'SK Panitia Kegiatan', fileUrl: null },
                { name: 'Surat Pernyataan Pertanggung Jawaban Kegiatan', fileUrl: null },
                { name: 'Surat Permohonan Dispensasi Mahasiswa', fileUrl: null },
                { name: 'Surat Perizinan Tempat Kegiatan', fileUrl: null },
                { name: 'Surat Pemberitahuan Kegiatan Kemahasiswaan', fileUrl: null },
                { name: 'Surat Pemberitahuan Kegiatan Wakil Ketua', fileUrl: null },
                { name: 'Surat Pemberitahuan Kegiatan Sarpras', fileUrl: null },
                { name: 'Surat Pemberitahuan Kegiatan BEM', fileUrl: null },
                { name: 'Surat Pemberitahuan Kegiatan Pembina', fileUrl: null },
                { name: 'Term of Reference (TOR) Kegiatan', fileUrl: null }
            ],
            externalDocuments: [
                { name: 'Proposal Pengajuan Dana', fileUrl: '/files/proposal_pengajuan_dana.pdf' },
                { name: 'Surat Permohonan Kegiatan Keuangan', fileUrl: '/files/surat_permohonan_keuangan.pdf' },
                { name: 'Surat Pemberitahuan Keuangan', fileUrl: '/files/surat_pemberitahuan_keuangan.pdf' },
                { name: 'Surat Persetujuan Kegiatan Pengelola Tempat Kegiatan', fileUrl: '/files/surat_persetujuan_kegiatan_pengelola_tempat.pdf' },
                { name: 'Surat Izin Orang Tua', fileUrl: '/files/surat_izin_orang_tua.pdf' },
                { name: 'Surat Keterangan Sehat', fileUrl: '/files/surat_keterangan_sehat.pdf' }
            ]
        }
    ];
});

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
    return new Date(date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
};

const getDocuments = (proposal) => {
    return proposal.activityType === 'Internal' ? proposal.internalDocuments : proposal.externalDocuments;
};

const previewDocument = (fileUrl) => {
    if (fileUrl) {
        window.open(fileUrl, '_blank');
    } else {
        toast.add({ severity: 'warn', summary: 'File Tidak Tersedia', detail: 'Berkas tidak tersedia untuk dilihat.', life: 3000 });
    }
};

const applyFilters = () => {
    expandedRows.value = null;
};
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
            :value="filteredProposals"
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
                            <Dropdown id="status" v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Semua Status" @change="applyFilters" />
                        </div>
                        <div class="field">
                            <label for="activityType" class="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
                            <Dropdown id="activityType" v-model="activityTypeFilter" :options="activityTypeOptions" optionLabel="label" optionValue="value" placeholder="Semua Jenis Kegiatan" @change="applyFilters" />
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
            <Column field="activityType" header="Jenis Kegiatan" sortable></Column>
            <Column field="activityDateTime" header="Waktu Kegiatan" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.activityDateTime) }}
                </template>
            </Column>
            <Column field="presentationDateTime" header="Waktu Presentasi" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.presentationDateTime) }}
                </template>
            </Column>
            <Column field="proposalDocument" header="Proposal">
                <template #body="{ data }">
                    <a @click="previewDocument(data.proposalDocument)" class="text-blue-500 hover:underline">Lihat</a>
                </template>
            </Column>
            <Column field="comments" header="Komentar"></Column>
            <Column header="Aksi">
                <template #body="{ data }">
                    <ConfirmPopup></ConfirmPopup>
                    <Button v-if="data.status === 'Pending'" ref="popup" @click="confirm($event, data)" icon="pi pi-times" label="Batalkan" class="p-button-danger"></Button>
                </template>
            </Column>
            <template #expansion="{ data }">
                <div class="p-4">
                    <h5>Berkas untuk {{ data.title }}</h5>
                    <DataTable :value="getDocuments(data)">
                        <Column field="name" header="Nama Berkas"></Column>
                        <Column header="Aksi">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Button icon="pi pi-eye" class="p-button-outlined p-button-rounded" @click="previewDocument(data.fileUrl)" :disabled="!data.fileUrl" />
                                    <span class="text-sm text-gray-600">{{ data.fileUrl ? 'Lihat Berkas' : 'Tidak Tersedia' }}</span>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
    <Dialog v-model:visible="addProposalDialog" :style="{ width: '45rem' }" header="Buat Pengajuan Proposal" :modal="true">
        <div class="field">
            <div class="field">
                <label for="file" class="block text-sm font-medium text-gray-700">Berkas Proposal</label>
                <FileUpload ref="fileupload" v-model="proposalForm.proposalDocument" mode="basic" name="demo[]" url="/api/upload" accept=".pdf" :maxFileSize="1000000" :customUpload="true" />
            </div>
        </div>
        <div class="field mt-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Judul Proposal</label>
            <InputText id="title" v-model="proposalForm.title" placeholder="Masukkan judul proposal" class="mt-1 block w-full" required />
        </div>
        <div class="field mt-4">
            <label for="activityDateTime" class="block text-sm font-medium text-gray-700">Waktu Kegiatan</label>
            <Calendar id="activityDateTime" v-model="proposalForm.activityDateTime" :minDate="new Date()" :showTime="true" :showSeconds="true" class="mt-1 block w-full" />
        </div>
        <div class="field mt-4">
            <label for="activityType" class="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
            <Select placeholder="Pilih jenis kegiatan" class="mt-1 block w-full" required v-model="proposalForm.activityType" :options="activityTypeOptions.slice(1)" optionLabel="label" optionValue="value" />
        </div>
        <div class="field mt-4">
            <label class="block text-sm font-medium text-gray-700">Berkas Pendukung</label>
            <div v-if="proposalForm.activityType === 'Internal'">
                <div v-for="(doc, index) in proposalForm.internalDocuments" :key="index" class="mt-2">
                    <label class="block text-sm font-medium text-gray-700">{{ doc.name }}</label>
                    <FileUpload :ref="'internalDocument' + index" mode="basic" :name="'internalDocument' + index" url="/api/upload" accept=".pdf" :maxFileSize="1000000" :customUpload="true" @upload="onInternalDocumentUpload(index)" />
                </div>
            </div>
            <div v-else-if="proposalForm.activityType === 'Eksternal'">
                <div v-for="(doc, index) in proposalForm.externalDocuments" :key="index" class="mt-2">
                    <label class="block text-sm font-medium text-gray-700">{{ doc.name }}</label>
                    <FileUpload :ref="'externalDocument' + index" mode="basic" :name="'externalDocument' + index" url="/api/upload" accept=".pdf" :maxFileSize="1000000" :customUpload="true" @upload="onExternalDocumentUpload(index)" />
                </div>
            </div>
        </div>
        <div v-if="activityTypeOptions.find((option) => option.value === 'Eksternal')" class=""></div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" severity="secondary" text @click="addProposalDialog = !addProposalDialog" />
            <Button label="Simpan" icon="pi pi-check" @click="saveProposal" />
        </template>
    </Dialog>
</template>
