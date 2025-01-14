<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    academicYears.value = [
        { id: 1, year: '2021/2022', semester: 'Ganjil', status: 'Active' },
        { id: 2, year: '2022/2023', semester: 'Genap', status: 'Active' },
        { id: 3, year: '2023/2024', semester: 'Ganjil', status: 'Inactive' }
    ];
});

const toast = useToast();
const dt = ref();
const academicYears = ref([]);
const academicYearDialog = ref(false);
const deleteAcademicYearDialog = ref(false);
const academicYear = ref({});
const selectedAcademicYears = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
]);
const semesters = ref([
    { label: 'Ganjil', value: 'Ganjil' },
    { label: 'Genap', value: 'Genap' }
]);

const openNew = () => {
    academicYear.value = {};
    submitted.value = false;
    academicYearDialog.value = true;
};

const hideDialog = () => {
    academicYearDialog.value = false;
    submitted.value = false;
};

const saveAcademicYear = () => {
    submitted.value = true;

    if (academicYear.value.year) {
        if (academicYear.value.id) {
            // Update existing academic year
            const index = academicYears.value.findIndex((a) => a.id === academicYear.value.id);
            if (index !== -1) {
                academicYears.value[index] = { ...academicYear.value };
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Academic Year Updated', life: 3000 });
            }
        } else {
            // Create new academic year
            academicYear.value.id = academicYears.value.length + 1; // Simple ID generation
            academicYears.value.push({ ...academicYear.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Academic Year Created', life: 3000 });
        }

        academicYearDialog.value = false;
        academicYear.value = {};
    }
};

const editAcademicYear = (data) => {
    academicYear.value = { ...data };
    academicYearDialog.value = true;
};

const confirmDeleteAcademicYear = (data) => {
    academicYear.value = { ...data };
    deleteAcademicYearDialog.value = true;
};

const deleteAcademicYear = () => {
    academicYears.value = academicYears.value.filter((a) => a.id !== academicYear.value.id);
    deleteAcademicYearDialog.value = false;
    academicYear.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Academic Year Deleted', life: 3000 });
};
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Academic Years</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedAcademicYears"
                :value="academicYears"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} academic years"
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

                <Column field="year" header="Year" sortable style="min-width: 12rem"></Column>
                <Column field="semester" header="Semester" sortable style="min-width: 12rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editAcademicYear(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAcademicYear(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing Academic Year -->
        <Dialog v-model:visible="academicYearDialog" :style="{ width: '450px' }" header="Academic Year Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="year" class="block font-bold mb-3">Year</label>
                    <InputText id="year" v-model.trim="academicYear.year" required="true" autofocus :invalid="submitted && !academicYear.year" fluid />
                    <small v-if="submitted && !academicYear.year" class="text-red-500">Year is required.</small>
                </div>
                <div>
                    <label for="semester" class="block font-bold mb-3">Semester</label>
                    <Select id="semester" v-model="academicYear.semester" :options="semesters" optionLabel="label" placeholder="Select a Semester" fluid />
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <Select id="status" v-model="academicYear.status" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveAcademicYear" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteAcademicYearDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="academicYear"
                    >Are you sure you want to delete <b>{{ academicYear.year }} - {{ academicYear.semester }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteAcademicYearDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteAcademicYear" />
            </template>
        </Dialog>
    </div>
</template>
