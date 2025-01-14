<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    ukmList.value = [
        { id: 1, name: 'Himatif', description: 'Himpunan Mahasiswa Teknik Informatika', head: 'John Doe' },
        { id: 2, name: 'Himsi', description: 'Himpunan Mahasiswa Sistem Informasi', head: 'Jane Smith' },
        { id: 3, name: 'CSRG', description: 'Computer Science Research Group', head: 'Alice Johnson' },
        { id: 4, name: 'Robomik', description: 'Robotik AMIK', head: 'Bob Brown' },
        { id: 5, name: 'Basket', description: 'Basketball Club', head: 'Charlie Davis' }
    ];
});

const toast = useToast();
const dt = ref();
const ukmList = ref([]);
const ukmDialog = ref(false);
const deleteUKMDialog = ref(false);
const ukm = ref({});
const selectedUKM = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const openNew = () => {
    ukm.value = {};
    submitted.value = false;
    ukmDialog.value = true;
};

const hideDialog = () => {
    ukmDialog.value = false;
    submitted.value = false;
};

const saveUKM = () => {
    submitted.value = true;
    if (ukm.value.name && ukm.value.head) {
        if (ukm.value.id) {
            // Update existing UKM
            const index = ukmList.value.findIndex((u) => u.id === ukm.value.id);
            if (index !== -1) {
                ukmList.value[index] = { ...ukm.value };
                toast.add({ severity: 'success', summary: 'Successful', detail: 'UKM Updated', life: 3000 });
            }
        } else {
            // Create new UKM
            ukm.value.id = ukmList.value.length + 1; // Simple ID generation
            ukmList.value.push({ ...ukm.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'UKM Created', life: 3000 });
        }

        ukmDialog.value = false;
        ukm.value = {};
    }
};

const editUKM = (data) => {
    ukm.value = { ...data };
    ukmDialog.value = true;
};

const confirmDeleteUKM = (data) => {
    ukm.value = { ...data };
    deleteUKMDialog.value = true;
};

const deleteUKM = () => {
    ukmList.value = ukmList.value.filter((u) => u.id !== ukm.value.id);
    deleteUKMDialog.value = false;
    ukm.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'UKM Deleted', life: 3000 });
};
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage UKM (Unit Kegiatan Mahasiswa)</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedUKM"
                :value="ukmList"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} UKM"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-end">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column field="description" header="Description" sortable style="min-width: 20rem"></Column>
                <Column field="head" header="Head" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUKM(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUKM(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing UKM -->
        <Dialog v-model:visible="ukmDialog" :style="{ width: '450px' }" header="UKM Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="ukm.name" required="true" :invalid="submitted && !ukm.name" fluid />
                    <small v-if="submitted && !ukm.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="ukm.description" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="head" class="block font-bold mb-3">Head</label>
                    <InputText id="head" v-model.trim="ukm.head" required="true" :invalid="submitted && !ukm.head" fluid />
                    <small v-if="submitted && !ukm.head" class="text-red-500">Head is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveUKM" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteUKMDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="ukm"
                    >Are you sure you want to delete <b>{{ ukm.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteUKMDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteUKM" />
            </template>
        </Dialog>
    </div>
</template>
