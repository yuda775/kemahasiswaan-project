import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/mahasiswa',
            name: 'mahasiswa',
            component: AppLayout,
            children: [
                {
                    path: '/mahasiswa/kredit-aktivitas',
                    name: 'mahasiswa-kredit-aktivitas',
                    component: () => import('@/views/mahasiswa/aktivitas.vue')
                },
                {
                    path: '/mahasiswa/proposal-kegiatan',
                    name: 'mahasiswa-proposal',
                    component: () => import('@/views/mahasiswa/proposal.vue')
                },
                {
                    path: '/mahasiswa/tracer-alumni',
                    name: 'mahasiswa-tracer-alumni',
                    component: () => import('@/views/mahasiswa/alumni.vue')
                }
            ]
        },
        {
            path: '/dosen',
            name: 'dosen',
            component: AppLayout,
            children: [
                {
                    path: '/dosen/kredit-aktivitas',
                    name: 'dosen-kredit-aktivitas',
                    component: () => import('@/views/dosen/aktivitas.vue')
                }
            ]
        },
        {
            path: '/kemahasiswaan',
            name: 'kemahasiswaan',
            component: AppLayout,
            children: [
                {
                    path: '/kemahasiswaan/kredit-aktivitas',
                    name: 'kemahasiswaan-kredit-aktivitas',
                    component: () => import('@/views/kemahasiswaan/aktivitas.vue')
                },
                {
                    path: '/kemahasiswaan/proposal-kegiatan',
                    name: 'kemahasiswaan-proposal',
                    component: () => import('@/views/kemahasiswaan/proposal.vue')
                },
                {
                    path: '/kemahasiswaan/tracer-alumni',
                    name: 'kemahasiswaan-tracer-alumni',
                    component: () => import('@/views/kemahasiswaan/alumni.vue')
                }
            ]
        },
        {
            path: '/master-data',
            component: AppLayout,
            children: [
                {
                    path: '/master-data/program-studi',
                    name: 'program-studi',
                    component: () => import('@/views/masterData/programStudi.vue')
                },
                {
                    path: '/master-data/tahun-akademik',
                    name: 'tahun-akademik',
                    component: () => import('@/views/masterData/tahunAkademik.vue')
                },
                {
                    path: '/master-data/unit-kegiatan-mahasiswa',
                    name: 'unit-kegiatan-mahasiswa',
                    component: () => import('@/views/masterData/UKM.vue')
                },
                {
                    path: '/master-data/dosen',
                    name: 'dosen',
                    component: () => import('@/views/masterData/dosen.vue')
                },
                {
                    path: '/master-data/mahasiswa',
                    name: 'mahasiswa',
                    component: () => import('@/views/masterData/mahasiswa.vue')
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
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
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

export default router;
