<script setup>
import axios from 'axios';
import { useConfirm } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();
const editingRows = ref([]);
const addCategoryDialog = ref(false);
const loading = ref(false);
const categories = ref([]);
const categoryName = ref('');
const categoryPoints = ref(0);

const onRowEditSave = (event) => {
    const { newData } = event;
    const { id, name, points: pointsStr } = newData;
    const points = parseInt(pointsStr, 10);
    axios
        .patch(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/${id}`, {
            name,
            points
        })
        .then((response) => {
            const index = categories.value.findIndex((category) => category.id === id);
            if (index > -1) {
                categories.value[index] = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    points: response.data.data.points
                };
            }
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data berhasil diperbarui',
                life: 3000
            });
        })
        .catch((error) => {
            console.error('Error updating data:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal memperbarui data',
                life: 3000
            });
        });
};
const saveCategory = async () => {
    await axios
        .post(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/`, {
            name: categoryName.value.trim(),
            points: categoryPoints.value
        })
        .then((response) => {
            categories.value.push(response.data.data);
            addCategoryDialog.value = false;
        })
        .catch((error) => {
            console.error('Error saving data:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal menambahkan data',
                life: 3000
            });
        })
        .finally(() => {
            categoryName.value = '';
            categoryPoints.value = 0;
        });
};

const confirmDelete = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Ya',
            severity: 'danger'
        },
        accept: () => {
            deleteCategory(data);
        },
        reject: () => {}
    });
};

const deleteCategory = (category) => {
    axios
        .delete(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/${category.id}`)
        .then(() => {
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Data berhasil dihapus',
                life: 3000
            });
            const index = categories.value.indexOf(category);
            if (index > -1) {
                categories.value.splice(index, 1);
            }
        })
        .catch((error) => {
            console.error('Error deleting data:', error);
        });
};

const getActivityCategories = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/activity-category/`)
        .then((response) => {
            categories.value = response.data.data;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};

onMounted(() => {
    getActivityCategories();
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h2 class="text-2xl font-semibold">Kategori Aktivitas</h2>
            <Button label="Tambah Kategori" icon="pi pi-plus" class="p-button-primary" @click="addCategoryDialog = true" />
        </div>

        <DataTable
            v-model:editingRows="editingRows"
            :value="categories"
            editMode="row"
            dataKey="id"
            @row-edit-save="onRowEditSave"
            :scrollable="true"
            scrollHeight="500px"
            resizableColumns
            columnResizeMode="fit"
            :loading="loading"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem'
                    })
                }
            }"
        >
            <Column field="name" header="Nama Kategori" :sortable="true" editor>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column field="points" header="Poin" :sortable="true" editor>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="number" class="mt-1 block w-full" />
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 0rem" bodyStyle="text-align:end"></Column>
            <Column :rowEditor="true" style="width: 0%; min-width: 0rem" bodyStyle="text-align: center">
                <template #body="{ data }">
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-trash" class="p-button-outlined p-button-rounded p-button-danger" @click="confirmDelete($event, data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="addCategoryDialog" :style="{ width: '450px' }" header="Tambah Kategori" :modal="true">
            <form @submit.prevent="saveCategory">
                <div class="field">
                    <label for="categoryName" class="block text-sm font-medium text-gray-700">Nama Kategori</label>
                    <InputText id="categoryName" v-model.trim="categoryName" placeholder="Masukkan nama kategori" class="mt-1 block w-full" required />
                </div>
                <div class="field mt-4">
                    <label for="categoryPoints" class="block text-sm font-medium text-gray-700">Poin</label>
                    <InputNumber id="categoryPoints" v-model="categoryPoints" class="mt-1 block w-full" required />
                </div>
            </form>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="addCategoryDialog = false" />
                <Button label="Simpan" icon="pi pi-check" @click="saveCategory" />
            </template>
        </Dialog>
    </div>
</template>
