<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const confirmPopup = useConfirm();
const toast = useToast();
const proposals = ref([]);
const expandedRows = ref({});
const statusFilter = ref(null);
const activityTypeFilter = ref(null);
const searchQuery = ref('');

const statusOptions = [
    { label: 'Semua Status', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' }
];

const activityTypeOptions = [
    { label: 'Semua Jenis Kegiatan', value: null },
    { label: 'Internal', value: 'Internal' },
    { label: 'Eksternal', value: 'Eksternal' }
];

const filteredProposals = computed(() => {
    return proposals.value.filter((proposal) => {
        const matchesStatus = !statusFilter.value || proposal.status === statusFilter.value;
        const matchesActivityType = !activityTypeFilter.value || proposal.activityType === activityTypeFilter.value;
        const matchesSearch = !searchQuery.value || [proposal.title, proposal.status, proposal.activityType].some((field) => field.toLowerCase().includes(searchQuery.value.toLowerCase()));

        return matchesStatus && matchesActivityType && matchesSearch;
    });
});

onMounted(() => {
    proposals.value = [
        // Sample data
        {
            id: 1,
            status: 'Pending',
            title: 'Seminar Teknologi Terkini',
            activityType: 'Internal',
            activityDateTime: new Date('2025-01-15T10:00:00'),
            presentationDateTime: null,
            proposalDocument: '/files/proposal.pdf',
            internalDocuments: [
                { name: 'Surat Permohonan Kegiatan', fileUrl: '/files/surat_permohonan_kegiatan.pdf' },
                { name: 'SK Panitia Kegiatan', fileUrl: '/files/sk_panitia_kegiatan.pdf' },
                { name: 'Surat Pernyataan Pertanggung Jawaban Kegiatan', fileUrl: '/files/surat_pertanggung_jawaban.pdf' },
                { name: 'Surat Permohonan Dispensasi Mahasiswa', fileUrl: '/files/surat_permohonan_dispensasi.pdf' },
                { name: 'Surat Perizinan Tempat Kegiatan', fileUrl: '/files/surat_perizinan_tempat.pdf' },
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
            ],
            comment: ''
        },
        {
            id: 2,
            status: 'Approved',
            title: 'Konferensi Nasional',
            activityType: 'Eksternal',
            activityDateTime: new Date('2025-02-20T09:00:00'),
            presentationDateTime: new Date('2025-02-19T15:00:00'),
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
            ],
            comment: 'Semua berkas lengkap'
        }
    ];
});

const abordConfirm = (event, data) => {
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
};

const expandAll = () => {
    expandedRows.value = proposals.value.reduce((acc, p) => ({ ...acc, [p.id]: true }), {});
};

const collapseAll = () => {
    expandedRows.value = {};
};

const formatDate = (date) => {
    return date ? new Date(date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : '';
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

const getStatusIcon = (status) => {
    return status === 'Pending' ? 'pi pi-clock' : status === 'Approved' ? 'pi pi-check' : 'pi pi-times';
};

const getStatusSeverity = (status) => {
    return status === 'Pending' ? 'secondary' : status === 'Approved' ? 'success' : 'danger';
};

const onCellEditComplete = (event) => {
    let { newData, index } = event;
    proposals.value[index] = newData;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Proposal Updated', life: 3000 });
};
</script>

<template>
    <Toast />
    <div class="card">
        <h4 class="font-semibold text-xl">Proposal Kegiatan</h4>
        <DataTable
            v-model:expandedRows="expandedRows"
            :value="filteredProposals"
            dataKey="id"
            tableStyle="min-width: 60rem"
            removableSort
            paginator
            editMode="cell"
            @cell-edit-complete="onCellEditComplete"
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
                        <DropdownFilter id="status" v-model="statusFilter" :options="statusOptions" placeholder="Semua Status" />
                        <DropdownFilter id="activityType" v-model="activityTypeFilter" :options="activityTypeOptions" placeholder="Semua Jenis Kegiatan" />
                    </div>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText class="w-[25rem]" v-model="searchQuery" placeholder="Search" />
                    </IconField>
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="status" header="Status" editor>
                <template #body="{ data }">
                    <Tag class="cursor-pointer" :icon="getStatusIcon(data.status)" :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="statusOptions.slice(1)" optionLabel="label" optionValue="value" placeholder="Semua Status" />
                </template>
            </Column>
            <Column field="title" header="Judul Proposal" />
            <Column field="activityType" header="Jenis Kegiatan" sortable />
            <Column field="activityDateTime" header="Waktu Kegiatan" sortable :body="formatDate">
                <template #body="{ data }">
                    <div class="cursor-pointer">{{ formatDate(data.activityDateTime) }}</div>
                </template>
            </Column>
            <Column field="presentationDateTime" header="Waktu Presentasi" sortable>
                <template #editor="{ data }">
                    <Calendar v-model="data.presentationDateTime" showTime hourFormat="24" :manualInput="true" />
                    <Button icon="pi pi-times" class="p-button-text" @click="data.presentationDateTime = null" />
                </template>
                <template #body="{ data }">
                    <div class="cursor-pointer">{{ formatDate(data.presentationDateTime) }}</div>
                </template>
            </Column>
            <Column field="proposalDocument" header="Proposal">
                <template #body="{ data }">
                    <a @click="previewDocument(data.proposalDocument)" class="text-blue-500 hover:underline">Lihat</a>
                </template>
            </Column>
            <Column field="comment" header="Komentar" editor>
                <template #editor="{ data, field }">
                    <Textarea v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column header="Aksi">
                <template #body="{ data }">
                    <ConfirmPopup />
                    <Button v-if="data.status === 'Pending'" ref="popup" @click="abordConfirm($event, data)" icon="pi pi-times" label="Batalkan" class="p-button-danger" />
                </template>
            </Column>
            <template #expansion="{ data }">
                <div class="p-4">
                    <h5>Berkas untuk {{ data.title }}</h5>
                    <DataTable :value="getDocuments(data)">
                        <Column field="name" header="Nama Berkas" />
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
</template>
