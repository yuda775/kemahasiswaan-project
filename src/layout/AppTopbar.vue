<script setup>
import { useLayout } from '@/layout/composables/layout';
import { decodeJWT } from '@/service/decodeJWT';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppConfigurator from './AppConfigurator.vue';
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const router = useRouter();

const payload = ref('');
const token = localStorage.getItem('token');
payload.value = decodeJWT(token);

const menu = ref();
const items = ref([
    {
        label: 'User Profile',
        icon: 'pi pi-user-edit'
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog'
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
            localStorage.removeItem('token');
            router.push('/auth/login');
        }
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img alt="logo" src="/images/logo-amik.png" style="width: 2.5rem" />
                <span class="text-lg font-bold">STMIK AMIK BANDUNG</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <button type="button" @click="toggle">
                <i class="pi pi-user mr-2"></i>
                <span>{{ payload.name }}</span>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            </button>
        </div>
    </div>
</template>
