<script setup>
import { onMounted, ref } from 'vue';
import { decodeJWT } from '@/service/decodeJWT';
import axios from 'axios';

const point = ref(0);

const token = localStorage.getItem('token');
const payload = decodeJWT(token);

async function getAccumulation() {
    try {
        const { data: response } = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/student/${payload?.id}/accumulation`);
        point.value = response.data;
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    getAccumulation();
});
</script>

<template>
    <div class="card mb-0 col-span-12 lg:col-span-6">
        <div class="flex justify-between">
            <div class="flex-1">
                <span class="block text-muted-color font-medium mb-4">Akumulasi Kredit Aktivitas</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ point }}/70 <span class="text-muted-color text-sm">Poin</span></div>
                <ProgressBar :value="point"> {{ point }}/70 </ProgressBar>
            </div>
            <div class="flex items-center justify-center bg-yellow-100 dark:bg-yellow-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-star text-yellow-500 !text-xl"></i>
            </div>
        </div>
    </div>

    <!-- <div class="card mb-0 col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Total Pengajuan</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">150</div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-file text-orange-500 !text-xl"></i>
            </div>
        </div>
        <span class="text-muted-color">Total pengajuan</span>
    </div>

    <div class="card mb-0 col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Total Pengajuan Diterima</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">120</div>
            </div>
            <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-check-circle text-green-500 !text-xl"></i>
            </div>
        </div>
        <span class="text-muted-color">Pengajuan yang diterima</span>
    </div> -->

    <div v-if="payload.advisor.name" class="card mb-0 col-span-12 lg:col-span-6">
        <div class="flex justify-between">
            <div class="flex-1">
                <span class="block text-muted-color font-medium mb-4">Dosen Wali</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ payload.advisor.name }}</div>
            </div>
            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-user text-cyan-500 !text-xl"></i>
            </div>
        </div>
        <span class="text-muted-color">NIP. {{ payload.advisor.nip }}</span>
    </div>
    <div v-else class="card mb-0 col-span-12 lg:col-span-6">
        <div class="flex justify-between">
            <div class="flex-1">
                <span class="block text-muted-color font-medium mb-4">Dosen Wali</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Belum Memiliki Dosen Wali</div>
            </div>
            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-user text-cyan-500 !text-xl"></i>
            </div>
        </div>
    </div>
</template>
