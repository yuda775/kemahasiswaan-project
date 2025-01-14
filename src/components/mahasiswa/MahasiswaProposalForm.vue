<script setup>
import { ref } from 'vue';

const addActivityDialog = ref(false);
const deleteActivityDialog = ref(false);
const selectedActivity = ref(null);

const saveActivity = () => {
    addActivityDialog.value = false;
};

const deleteSelectedActivity = () => {
    deleteActivityDialog.value = false;
};
</script>

<template>
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
</template>
