import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/student',
            name: 'student',
            component: AppLayout,
            children: [
                {
                    path: 'kredit-aktivitas',
                    name: 'mahasiswa.kredit-aktivitas',
                    component: () => import('@/views/pages/mahasiswa/aktivitas.vue')
                },
                {
                    path: 'proposal-kegiatan',
                    name: 'mahasiswa.proposal',
                    component: () => import('@/views/pages/mahasiswa/proposal.vue')
                },
                {
                    path: 'tracer-alumni',
                    name: 'mahasiswa.tracer-alumni',
                    component: () => import('@/views/pages/mahasiswa/alumni.vue')
                }
            ]
        },
        {
            path: '/lecturer',
            name: 'lecturer',
            component: AppLayout,
            children: [
                {
                    path: 'kredit-aktivitas',
                    name: 'dosen.kredit-aktivitas',
                    component: () => import('@/views/pages/dosen/aktivitas.vue')
                }
            ]
        },
        {
            path: '/student-affair',
            name: 'student-affair',
            component: AppLayout,
            children: [
                {
                    path: 'kredit-aktivitas',
                    name: 'kemahasiswaan.kredit-aktivitas',
                    component: () => import('@/views/pages/kemahasiswaan/aktivitas.vue')
                },
                {
                    path: 'proposal-kegiatan',
                    name: 'kemahasiswaan.proposal',
                    component: () => import('@/views/pages/kemahasiswaan/proposal.vue')
                },
                {
                    path: 'tracer-alumni',
                    name: 'kemahasiswaan.tracer-alumni',
                    component: () => import('@/views/pages/kemahasiswaan/alumni.vue')
                }
            ]
        },
        {
            path: '/master-data',
            name: 'master-data',
            component: AppLayout,
            children: [
                {
                    path: 'program-studi',
                    name: 'program-studi',
                    component: () => import('@/views/pages/masterData/programStudi.vue')
                },
                {
                    path: 'tahun-akademik',
                    name: 'tahun-akademik',
                    component: () => import('@/views/pages/masterData/tahunAkademik.vue')
                },
                {
                    path: 'unit-kegiatan-mahasiswa',
                    name: 'unit-kegiatan-mahasiswa',
                    component: () => import('@/views/pages/masterData/UKM.vue')
                },
                {
                    path: 'dosen',
                    name: 'dosen',
                    component: () => import('@/views/pages/masterData/dosen.vue')
                },
                {
                    path: 'mahasiswa',
                    name: 'mahasiswa',
                    component: () => import('@/views/pages/masterData/mahasiswa.vue')
                },
                {
                    path: 'kemahasiswaan',
                    name: 'kemahasiswaan',
                    component: () => import('@/views/pages/masterData/kemahasiswaan.vue')
                }
            ]
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token');

    if (token) {
        if (to.name === 'login') {
            next({ name: 'dashboard' });
        } else {
            next();
        }
    } else {
        if (to.name === 'login') {
            next();
        } else {
            next({ name: 'login' });
        }
    }
});

export default router;
