<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    programs.value = [
        { id: 1, code: 'IF', name: 'Teknik Informatika' },
        { id: 2, code: 'SI', name: 'Sistem Informasi' },
        { id: 3, code: 'DKV', name: 'Desain Komunikasi Visual' }
    ];
});

const toast = useToast();
const dt = ref();
const programs = ref([]);
const programDialog = ref(false);
const deleteProgramDialog = ref(false);
const program = ref({});
const selectedPrograms = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const openNew = () => {
    program.value = {};
    submitted.value = false;
    programDialog.value = true;
};

const hideDialog = () => {
    programDialog.value = false;
    submitted.value = false;
};

const saveProgram = () => {
    submitted.value = true;

    if (program.value.code && program.value.name) {
        if (program.value.id) {
            // Update existing program
            const index = programs.value.findIndex((p) => p.id === program.value.id);
            if (index !== -1) {
                programs.value[index] = { ...program.value };
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Updated', life: 3000 });
            }
        } else {
            // Create new program
            program.value.id = programs.value.length + 1; // Simple ID generation
            programs.value.push({ ...program.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Created', life: 3000 });
        }

        programDialog.value = false;
        program.value = {};
    }
};

const editProgram = (data) => {
    program.value = { ...data };
    programDialog.value = true;
};

const confirmDeleteProgram = (data) => {
    program.value = { ...data };
    deleteProgramDialog.value = true;
};

const deleteProgram = () => {
    programs.value = programs.value.filter((p) => p.id !== program.value.id);
    deleteProgramDialog.value = false;
    program.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Deleted', life: 3000 });
};
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Study Programs</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedPrograms"
                :value="programs"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} programs"
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

                <Column field="code" header="Kode" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Nama" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProgram(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProgram(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing Program -->
        <Dialog v-model:visible="programDialog" :style="{ width: '450px' }" header="Program Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="code" class="block font-bold mb-3">Kode</label>
                    <InputText id="code" v-model.trim="program.code" required="true" autofocus :invalid="submitted && !program.code" fluid />
                    <small v-if="submitted && !program.code" class="text-red-500">Kode diperlukan.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Nama</label>
                    <InputText id="name" v-model.trim="program.name" required="true" :invalid="submitted && !program.name" fluid />
                    <small v-if="submitted && !program.name" class="text-red-500">Nama diperlukan.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProgram" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteProgramDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="program"
                    >Are you sure you want to delete <b>{{ program.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProgramDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProgram" />
            </template>
        </Dialog>
    </div>
</template>
