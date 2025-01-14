<script setup>
import MahasiswaActivityCRUD from '@/components/mahasiswa/MahasiswaActivityCRUD.vue';
import StatsWidget from '@/components/mahasiswa/MahasiswaStatsWidget.vue';
</script>

<template>
    <div>
        <div class="grid grid-cols-12 gap-4">
            <StatsWidget />

            <div class="col-span-12">
                <MahasiswaActivityCRUD />
            </div>
        </div>
    </div>
</template>
