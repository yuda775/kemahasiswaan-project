<script setup>
import { decodeJWT } from '@/service/decodeJWT';
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const token = localStorage.getItem('token');
const payload = decodeJWT(token);

const model = ref([]);

if (payload.role === 'student') {
    model.value = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Mahasiswa',
            items: [
                { label: 'Aktivitas', icon: 'pi pi-fw pi-graduation-cap', to: '/student/kredit-aktivitas' },
                { label: 'Proposal', icon: 'pi pi-fw pi-file', to: '/student/proposal-kegiatan' },
                { label: 'Tracer Alumni', icon: 'pi pi-fw pi-users', to: '/student/tracer-alumni' }
            ]
        }
    ];
} else if (payload.role === 'lecturer') {
    model.value = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Dosen',
            items: [{ label: 'Aktivitas', icon: 'pi pi-fw pi-graduation-cap', to: '/lecturer/kredit-aktivitas' }]
        }
    ];
} else if (payload.role === 'student-affairs') {
    model.value = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Kemahasiswaan',
            items: [
                { label: 'Kredit Aktivitas', icon: 'pi pi-fw pi-graduation-cap', to: '/student-affair/kredit-aktivitas' },
                { label: 'Proposal Kegiatan', icon: 'pi pi-fw pi-file', to: '/student-affair/proposal-kegiatan' },
                { label: 'Tracer Alumni', icon: 'pi pi-fw pi-users', to: '/student-affair/tracer-alumni' }
            ]
        }
    ];
} else if (payload.role === 'admin') {
    model.value = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Master Data',
            items: [
                { label: 'Program Studi', icon: 'pi pi-fw pi-tags', to: '/master-data/program-studi' },
                { label: 'Tahun Akademik', icon: 'pi pi-fw pi-calendar', to: '/master-data/tahun-akademik' },
                { label: 'Unit Kegiatan Mahasiswa', icon: 'pi pi-fw pi-users', to: '/master-data/unit-kegiatan-mahasiswa' },
                { label: 'Dosen', icon: 'pi pi-fw pi-user', to: '/master-data/dosen' },
                { label: 'Mahasiswa', icon: 'pi pi-fw pi-user', to: '/master-data/mahasiswa' },
                { label: 'Kemahasiswaan', icon: 'pi pi-fw pi-user', to: '/master-data/kemahasiswaan' }
            ]
        }
    ];
}
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
