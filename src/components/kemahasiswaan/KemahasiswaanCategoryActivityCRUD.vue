<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();

const addCategoryDialog = ref(false);
const loading = ref(false);
const categories = ref([
    { id: 1, name: 'Olahraga', points: 50 },
    { id: 2, name: 'Seni', points: 30 },
    { id: 3, name: 'Akademik', points: 40 }
]);

const categoryName = ref('');
const categoryPoints = ref(0);

const saveCategory = () => {
    if (categoryName.value.trim() === '') {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Nama kategori harus diisi', life: 3000 });
        return;
    }

    const newCategory = {
        name: categoryName.value.trim(),
        points: categoryPoints.value
    };

    categories.value.push(newCategory);
    addCategoryDialog.value = false;
};

const editCategory = (category) => {
    categoryName.value = category.name;
    categoryPoints.value = category.points;
    addCategoryDialog.value = true;
};

const deleteCategory = (category) => {
    const index = categories.value.indexOf(category);
    if (index > -1) {
        categories.value.splice(index, 1);
    }
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h2 class="text-2xl font-semibold">Kategori Aktivitas</h2>
            <Button label="Tambah Kategori" icon="pi pi-plus" class="p-button-primary" @click="addCategoryDialog = true" />
        </div>

        <DataTable :value="categories" :scrollable="true" scrollHeight="500px" :loading="loading">
            <Column field="name" header="Nama Kategori" :sortable="true"></Column>
            <Column field="points" header="Poin" :sortable="true"></Column>
            <Column headerStyle="width: 15rem" bodyStyle="text-align: center">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info" @click="editCategory(data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteCategory(data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="addCategoryDialog" :style="{ width: '450px' }" header="Tambah Kategori" :modal="true">
            <div class="field">
                <label for="categoryName" class="block text-sm font-medium text-gray-700">Nama Kategori</label>
                <InputText id="categoryName" placeholder="Masukkan nama kategori" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="categoryPoints" class="block text-sm font-medium text-gray-700">Poin</label>
                <InputText id="categoryPoints" type="number" class="mt-1 block w-full" required />
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="addCategoryDialog = false" />
                <Button label="Simpan" icon="pi pi-check" @click="saveCategory" />
            </template>
        </Dialog>
    </div>
</template>
