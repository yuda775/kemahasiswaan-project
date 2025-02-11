<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { decodeJWT } from '@/service/decodeJWT';
import axios from 'axios';
import { useToast } from 'primevue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const toast = useToast();
const email = ref('');
const password = ref('');
const checked = ref(false);
const selectedRole = ref('student');

const router = useRouter();

async function onSubmit() {
    const body = {
        email: email.value,
        password: password.value
    };

    try {
        await axios
            .post(`${import.meta.env.VITE_APP_BASE_URL}/api/${selectedRole.value}/login`, body)
            .then((response) => {
                if (response.data.data.token) {
                    const token = response.data.data.token;
                    localStorage.setItem('token', token);

                    const decodedToken = decodeJWT(token);
                    console.log('Decoded Token:', decodedToken);
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Login successful',
                        life: 3000,
                        // agar toast tetap tampil walaupun sudah pindah halaman
                        sticky: true
                    });

                    if (decodedToken && decodedToken.role) {
                        switch (decodedToken.role) {
                            case 'student':
                                router.push('/');
                                break;
                            case 'lecturer':
                                router.push('/');
                                break;
                            case 'admin':
                                router.push('/');
                                break;
                            case 'student-affairs':
                                router.push('/');
                                break;
                            default:
                                console.log('Unknown role:', decodedToken.role);
                                router.push('/auth/access');
                                break;
                        }
                    } else {
                        console.log('Token tidak memiliki informasi role');
                    }

                    console.log('Login successful!');
                } else {
                    console.log('No token found in the response');
                }
            })
            .catch((error) => {
                console.error(error.response.data.message);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message,
                    life: 3000
                });
            });
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}
</script>

<template>
    <Toast />
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/images/logo-amik.png" alt="Logo" class="mb-8 w-16 shrink-0 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Selamat Datang</div>
                        <span class="text-muted-color font-medium">Login sebagai</span>
                    </div>

                    <!-- Tab Bar for Role Selection -->
                    <div class="flex justify-center mb-8">
                        <div class="flex space-x-4 border-b-2 border-gray-300 dark:border-gray-700">
                            <div class="cursor-pointer py-2 px-4 font-medium" :class="{ 'text-primary border-b-2 border-primary': selectedRole === 'student' }" @click="selectedRole = 'student'">Mahasiswa</div>
                            <div class="cursor-pointer py-2 px-4 font-medium" :class="{ 'text-primary border-b-2 border-primary': selectedRole === 'lecturer' }" @click="selectedRole = 'lecturer'">Dosen</div>
                            <div class="cursor-pointer py-2 px-4 font-medium" :class="{ 'text-primary border-b-2 border-primary': selectedRole === 'student-affairs' }" @click="selectedRole = 'student-affairs'">Kemahasiswaan</div>
                            <div class="cursor-pointer py-2 px-4 font-medium" :class="{ 'text-primary border-b-2 border-primary': selectedRole === 'admin' }" @click="selectedRole = 'admin'">Admin</div>
                        </div>
                    </div>

                    <form @submit.prevent="onSubmit">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="email" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" required="" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false" required=""></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <Button label="Sign In" class="w-full" type="submit"></Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.tab {
    display: flex;
    border-bottom: 2px solid #ddd;
}

.tab-item {
    cursor: pointer;
    padding: 10px 20px;
    font-weight: 600;
}

.tab-item.active {
    border-bottom: 2px;
}
</style>
