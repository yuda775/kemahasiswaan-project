<script setup>
import { decodeJWT } from '@/service/decodeJWT';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import AppMenuItem from './AppMenuItem.vue';

const router = useRouter();
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

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};
</script>

<template>
    <ul class="layout-menu h-full">
        <div v-ripple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 rounded-none transition-colors duration-200">
            <Avatar size="xlarge" image="https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg" class="mr-2" shape="circle" />
            <span class="inline-flex flex-col items-start">
                <span class="font-bold">{{ payload.name }}</span>
                <span class="text-sm">{{ payload.npm || payload.nip || payload.role }}</span>
                <button @click="logout" class="text-red-500 hover:font-bold mt-2">
                    <i class="pi pi-fw pi-sign-out"></i>
                    <span>Logout</span>
                </button>
            </span>
        </div>
        <div class="menu-items">
            <template v-for="(item, i) in model" :key="item">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </div>
    </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.menu-items {
    flex: 1;
}

.logout-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #f8f9fa;
    border: none;
    border-radius: 0.25rem;
    color: #495057;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;

    &:hover {
        background-color: crimson;
        color: white;
    }

    i {
        margin-right: 0.5rem;
    }
}

.menu-separator {
    height: 1px;
    background-color: #dee2e6;
    margin: 0.5rem 0;
}
</style>
