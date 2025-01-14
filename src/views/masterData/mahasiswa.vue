<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    students.value = [
        {
            id: 1,
            name: 'John Doe',
            npm: '123456',
            email: 'john.doe@example.com',
            password: 'password123',
            birth_date: '2000-01-01',
            birth_place: 'City A',
            gender: 'male',
            address: 'Address 1',
            phone_number: '08123456789',
            graduation_year: '2024',
            enrollment_year: '2020',
            advisor_id: 1,
            program_id: 1
        },
        {
            id: 2,
            name: 'Jane Smith',
            npm: '234567',
            email: 'jane.smith@example.com',
            password: 'password123',
            birth_date: '2001-02-02',
            birth_place: 'City B',
            gender: 'female',
            address: 'Address 2',
            phone_number: '08123456780',
            graduation_year: '2025',
            enrollment_year: '2021',
            advisor_id: 2,
            program_id: 2
        },
        {
            id: 3,
            name: 'Alice Johnson',
            npm: '345678',
            email: 'alice.johnson@example.com',
            password: 'password123',
            birth_date: '2002-03-03',
            birth_place: 'City C',
            gender: 'female',
            address: 'Address 3',
            phone_number: '08123456781',
            graduation_year: '2026',
            enrollment_year: '2022',
            advisor_id: 3,
            program_id: 3
        }
    ];
});

const toast = useToast();
const dt = ref();
const students = ref([]);
const studentDialog = ref(false);
const deleteStudentDialog = ref(false);
const student = ref({});
const selectedStudents = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const genders = ref([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
]);

const openNew = () => {
    student.value = {};
    submitted.value = false;
    studentDialog.value = true;
};

const hideDialog = () => {
    studentDialog.value = false;
    submitted.value = false;
};

const saveStudent = () => {
    submitted.value = true;

    if (student.value.name && student.value.npm && student.value.email && student.value.password && student.value.birth_date && student.value.birth_place && student.value.gender && student.value.phone_number && student.value.enrollment_year) {
        if (student.value.id) {
            // Update existing student
            const index = students.value.findIndex((s) => s.id === student.value.id);
            if (index !== -1) {
                students.value[index] = { ...student.value };
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
            }
        } else {
            // Create new student
            student.value.id = students.value.length + 1; // Simple ID generation
            students.value.push({ ...student.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
        }

        studentDialog.value = false;
        student.value = {};
    }
};

const editStudent = (data) => {
    student.value = { ...data };
    studentDialog.value = true;
};

const confirmDeleteStudent = (data) => {
    student.value = { ...data };
    deleteStudentDialog.value = true;
};

const deleteStudent = () => {
    students.value = students.value.filter((s) => s.id !== student.value.id);
    deleteStudentDialog.value = false;
    student.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
};
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Students (Data Mahasiswa)</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </div>

            <DataTable
                ref="dt"
                v-model:selection="selectedStudents"
                :value="students"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
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
                <Column field="npm" header="NPM" sortable style="min-width: 12rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
                <Column field="birth_date" header="Birth Date" sortable style="min-width: 12rem"></Column>
                <Column field="birth_place" header="Birth Place" sortable style="min-width: 12rem"></Column>
                <Column field="gender" header="Gender" sortable style="min-width: 10rem"></Column>
                <Column field="phone_number" header="Phone Number" sortable style="min-width: 12rem"></Column>
                <Column field="enrollment_year" header="Enrollment Year" sortable style="min-width: 12rem"></Column>
                <Column field="graduation_year" header="Graduation Year" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editStudent(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteStudent(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Creating/Editing Student -->
        <Dialog v-model:visible="studentDialog" :style="{ width: '450px' }" header="Student Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="student.name" required="true" autofocus :invalid="submitted && !student.name" fluid />
                    <small v-if="submitted && !student.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="npm" class="block font-bold mb-3">NPM</label>
                    <InputText id="npm" v-model.trim="student.npm" required="true" :invalid="submitted && !student.npm" fluid />
                    <small v-if="submitted && !student.npm" class="text-red-500">NPM is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="student.email" required="true" :invalid="submitted && !student.email" fluid />
                    <small v-if="submitted && !student.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <InputText id="password" v-model.trim="student.password" required="true" :invalid="submitted && !student.password" type="password" fluid />
                    <small v-if="submitted && !student.password" class="text-red-500">Password is required.</small>
                </div>
                <div>
                    <label for="birth_date" class="block font-bold mb-3">Birth Date</label>
                    <InputText id="birth_date" v-model.trim="student.birth_date" required="true" :invalid="submitted && !student.birth_date" type="date" fluid />
                    <small v-if="submitted && !student.birth_date" class="text-red-500">Birth date is required.</small>
                </div>
                <div>
                    <label for="birth_place" class="block font-bold mb-3">Birth Place</label>
                    <InputText id="birth_place" v-model.trim="student.birth_place" required="true" :invalid="submitted && !student.birth_place" fluid />
                    <small v-if="submitted && !student.birth_place" class="text-red-500">Birth place is required.</small>
                </div>
                <div>
                    <label for="gender" class="block font-bold mb-3">Gender</label>
                    <Select id="gender" v-model="student.gender" :options="genders" optionLabel="label" placeholder="Select Gender" />
                </div>
                <div>
                    <label for="address" class="block font-bold mb-3">Address</label>
                    <Textarea id="address" v-model="student.address" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="phone_number" class="block font-bold mb-3">Phone Number</label>
                    <InputText id="phone_number" v-model.trim="student.phone_number" required="true" :invalid="submitted && !student.phone_number" fluid />
                    <small v-if="submitted && !student.phone_number" class="text-red-500">Phone number is required.</small>
                </div>
                <div>
                    <label for="enrollment_year" class="block font-bold mb-3">Enrollment Year</label>
                    <InputText id="enrollment_year" v-model.trim="student.enrollment_year" required="true" :invalid="submitted && !student.enrollment_year" fluid />
                    <small v-if="submitted && !student.enrollment_year" class="text-red-500">Enrollment year is required.</small>
                </div>
                <div>
                    <label for="graduation_year" class="block font-bold mb-3">Graduation Year</label>
                    <InputText id="graduation_year" v-model.trim="student.graduation_year" fluid />
                </div>
                <div>
                    <label for="advisor_id" class="block font-bold mb-3">Advisor ID</label>
                    <InputText id="advisor_id" v-model.trim="student.advisor_id" fluid />
                </div>
                <div>
                    <label for="program_id" class="block font-bold mb-3">Program ID</label>
                    <InputText id="program_id" v-model.trim="student.program_id" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveStudent" />
            </template>
        </Dialog>

        <!-- Dialog for Confirming Deletion -->
        <Dialog v-model:visible="deleteStudentDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="student"
                    >Are you sure you want to delete <b>{{ student.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteStudentDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteStudent" />
            </template>
        </Dialog>
    </div>
</template>
