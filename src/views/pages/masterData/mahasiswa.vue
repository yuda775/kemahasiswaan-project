<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const programs = ref([]);
const lecturers = ref([]);
const students = ref([]);
const addStudentDialog = ref(false);
const editStudentDialog = ref(false);
const deleteStudentDialog = ref(false);
const changePasswordDialog = ref(false);
const student = ref({});
const selectedStudents = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const genders = ref([
    { label: 'Laki-laki', value: 'MALE' },
    { label: 'Perempuan', value: 'FEMALE' }
]);

const handleApiCall = async (method, url, data = null) => {
    try {
        const response = await axios[method](url, data);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: response.config.method === 'delete' ? 'Student deleted successfully' : 'Student updated successfully',
            life: 3000
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: method === 'delete' ? 'Failed to delete Student' : 'Failed to update Student',
            life: 3000
        });
    }
};

const updateStudent = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/student/${id}`, data);
const createStudent = (data) => handleApiCall('post', `${import.meta.env.VITE_APP_BASE_URL}/api/student/register/`, data);
const deleteStudentApi = (id) => handleApiCall('delete', `${import.meta.env.VITE_APP_BASE_URL}/api/student/${id}`);
const updateStudentPassword = (id, data) => handleApiCall('patch', `${import.meta.env.VITE_APP_BASE_URL}/api/student/change-password/${id}`, data);

const openAddStudentDialog = () => {
    student.value = {};
    submitted.value = false;
    addStudentDialog.value = true;
};

const openEditStudentDialog = (data) => {
    student.value = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        enrollmentYear: data.enrollmentYear ? new Date(data.enrollmentYear, 0, 1) : null,
        graduationYear: data.graduationYear ? new Date(data.graduationYear, 0, 1) : null
    };
    submitted.value = false;
    editStudentDialog.value = true;
};

const openChangePasswordDialog = (data) => {
    student.value = { ...data };
    submitted.value = false;
    changePasswordDialog.value = true;
};

const hideDialog = () => {
    addStudentDialog.value = false;
    editStudentDialog.value = false;
    changePasswordDialog.value = false;
    submitted.value = false;
};

const saveStudent = () => {
    submitted.value = true;

    const studentData = {
        ...student.value,
        birthDate: student.value.birthDate?.toISOString().split('T')[0] || null,
        enrollmentYear: student.value.enrollmentYear?.getFullYear() || null,
        graduationYear: student.value.graduationYear?.getFullYear() || null
    };

    const handleResponse = (response) => {
        if (response) {
            const studentIndex = students.value.findIndex((s) => s.id === response.data.data.id);
            if (studentIndex !== -1) {
                students.value[studentIndex] = {
                    ...response.data.data,
                    program: programs.value.find((p) => p.id === response.data.data.programId),
                    advisor: lecturers.value.find((l) => l.id === response.data.data.advisorId)
                };
            } else {
                students.value.push({
                    ...response.data.data,
                    program: programs.value.find((p) => p.id === response.data.data.programId),
                    advisor: lecturers.value.find((l) => l.id === response.data.data.advisorId)
                });
            }
            hideDialog();
        }
    };

    if (addStudentDialog.value) {
        createStudent(studentData).then(handleResponse);
    } else if (editStudentDialog.value) {
        // eslint-disable-next-line no-unused-vars
        const { id, password, ...studentDataWithoutPassword } = studentData;
        updateStudent(student.value.id, studentDataWithoutPassword).then(handleResponse);
    }
};

const changePassword = () => {
    submitted.value = true;

    if (student.value.newPassword) {
        const payload = {
            password: student.value.newPassword
        };

        updateStudentPassword(student.value.id, payload).then((response) => {
            if (response) {
                hideDialog();
            }
        });
    }
};

const confirmDeleteStudent = (data) => {
    student.value = { ...data };
    deleteStudentDialog.value = true;
};

const deleteStudent = () => {
    deleteStudentApi(student.value.id).then((response) => {
        if (response) {
            students.value = students.value.filter((s) => s.id !== student.value.id);
            deleteStudentDialog.value = false;
        }
    });
};

const fetchData = async (endpoint, target) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/${endpoint}/`);
        if (response.status === 200) {
            target.value = response.data.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to fetch ${endpoint} data`,
            life: 3000
        });
    }
};

const getDataStudents = () => fetchData('student', students);
const getDataPrograms = () => fetchData('program-study', programs);
const getDataLecturers = () => fetchData('lecturer', lecturers);

onMounted(() => {
    getDataStudents();
    getDataPrograms();
    getDataLecturers();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between">
                <h4 class="font-semibold text-xl">Manage Students (Data Mahasiswa)</h4>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openAddStudentDialog" />
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

                <Column field="name" header="Nama" sortable style="min-width: 16rem"></Column>
                <Column field="npm" header="NPM" sortable style="min-width: 12rem"></Column>
                <Column field="gender" header="Jenis Kelamin" sortable style="min-width: 10rem">
                    <template #body="{ data }">
                        <span v-if="data.gender === 'MALE'">Laki-laki</span>
                        <span v-else-if="data.gender === 'FEMALE'">Wanita</span>
                        <span v-else>Tidak Diketahui</span>
                    </template>
                </Column>
                <Column field="programId" header="Program Studi" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                        <span v-if="data.program">{{ data.program.code }}</span>
                        <span v-else>Tidak Diketahui</span>
                    </template>
                </Column>
                <Column field="advisorId" header="Dosen Wali" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                        <span v-if="data.advisor">{{ data.advisor.name }}</span>
                        <span v-else>Tidak Ada Dosen Wali yang Ditugaskan</span>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditStudentDialog(data)" />
                        <Button icon="pi pi-key" outlined rounded class="mr-2" @click="openChangePasswordDialog(data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteStudent(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog for Adding Student -->
        <Dialog v-model:visible="addStudentDialog" :style="{ width: '450px' }" header="Add Student" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Nama</label>
                    <InputText id="name" v-model.trim="student.name" required autofocus :invalid="submitted && !student.name" fluid />
                    <small v-if="submitted && !student.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="npm" class="block font-bold mb-3">NPM</label>
                    <InputText id="npm" v-model.trim="student.npm" required :invalid="submitted && !student.npm" fluid />
                    <small v-if="submitted && !student.npm" class="text-red-500">NPM is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" type="email" v-model.trim="student.email" required :invalid="submitted && !student.email" fluid />
                    <small v-if="submitted && !student.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <Password id="password" v-model.trim="student.password" required :invalid="submitted && !student.password" type="password" fluid />
                    <small v-if="submitted && !student.password" class="text-red-500">Password is required.</small>
                </div>
                <div>
                    <label for="birthDate" class="block font-bold mb-3">Tanggal Lahir</label>
                    <DatePicker id="birthDate" v-model="student.birthDate" required :invalid="submitted && !student.birthDate" fluid />
                    <small v-if="submitted && !student.birthDate" class="text-red-500">Birth date is required.</small>
                </div>
                <div>
                    <label for="birthPlace" class="block font-bold mb-3">Tempat Lahir</label>
                    <InputText id="birthPlace" v-model.trim="student.birthPlace" required :invalid="submitted && !student.birthPlace" fluid />
                    <small v-if="submitted && !student.birthPlace" class="text-red-500">Birth place is required.</small>
                </div>
                <div>
                    <label for="gender" class="block font-bold mb-3">Jenis Kelamin</label>
                    <Select id="gender" v-model="student.gender" :options="genders" optionLabel="label" optionValue="value" placeholder="Select Gender" fluid />
                </div>
                <div>
                    <label for="address" class="block font-bold mb-3">Alamat</label>
                    <Textarea id="address" v-model="student.address" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="phoneNumber" class="block font-bold mb-3">Nomor HP</label>
                    <InputText id="phoneNumber" v-model.trim="student.phoneNumber" required :invalid="submitted && !student.phoneNumber" fluid />
                    <small v-if="submitted && !student.phoneNumber" class="text-red-500">Phone number is required.</small>
                </div>
                <div>
                    <label for="enrollmentYear" class="block font-bold mb-3">Tahun Masuk</label>
                    <DatePicker id="enrollmentYear" v-model="student.enrollmentYear" required :invalid="submitted && !student.enrollmentYear" fluid view="year" dateFormat="yy" />
                    <small v-if="submitted && !student.enrollmentYear" class="text-red-500">Enrollment year is required.</small>
                </div>
                <div>
                    <label for="graduationYear" class="block font-bold mb-3">Tahun Lulus</label>
                    <DatePicker id="graduationYear" v-model="student.graduationYear" fluid view="year" dateFormat="yy" />
                </div>
                <div>
                    <label for="program" class="block font-bold mb-3">Program Studi</label>
                    <Select id="program" v-model="student.programId" :options="programs.map((program) => ({ label: program.name, value: program.id }))" optionLabel="label" optionValue="value" placeholder="Pilih Program Studi" fluid />
                </div>
                <div>
                    <label for="advisorId" class="block font-bold mb-3">Dosen Wali</label>
                    <Select id="advisorId" v-model="student.advisorId" :options="lecturers.map((lecturer) => ({ label: lecturer.name, value: lecturer.id }))" optionLabel="label" optionValue="value" placeholder="Pilih Dosen Wali" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveStudent" />
            </template>
        </Dialog>

        <!-- Dialog for Editing Student -->
        <Dialog v-model:visible="editStudentDialog" :style="{ width: '450px' }" header="Edit Student" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Nama</label>
                    <InputText id="name" v-model.trim="student.name" required autofocus :invalid="submitted && !student.name" fluid />
                    <small v-if="submitted && !student.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="npm" class="block font-bold mb-3">NPM</label>
                    <InputText id="npm" v-model.trim="student.npm" required :invalid="submitted && !student.npm" fluid />
                    <small v-if="submitted && !student.npm" class="text-red-500">NPM is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" type="email" v-model.trim="student.email" required :invalid="submitted && !student.email" fluid />
                    <small v-if="submitted && !student.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="birthDate" class="block font-bold mb-3">Tanggal Lahir</label>
                    <DatePicker id="birthDate" v-model="student.birthDate" required :invalid="submitted && !student.birthDate" fluid />
                    <small v-if="submitted && !student.birthDate" class="text-red-500">Birth date is required.</small>
                </div>
                <div>
                    <label for="birthPlace" class="block font-bold mb-3">Tempat Lahir</label>
                    <InputText id="birthPlace" v-model.trim="student.birthPlace" required :invalid="submitted && !student.birthPlace" fluid />
                    <small v-if="submitted && !student.birthPlace" class="text-red-500">Birth place is required.</small>
                </div>
                <div>
                    <label for="gender" class="block font-bold mb-3">Jenis Kelamin</label>
                    <Select id="gender" v-model="student.gender" :options="genders" optionLabel="label" optionValue="value" placeholder="Select Gender" fluid />
                </div>
                <div>
                    <label for="address" class="block font-bold mb-3">Alamat</label>
                    <Textarea id="address" v-model="student.address" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="phoneNumber" class="block font-bold mb-3">Nomor HP</label>
                    <InputText id="phoneNumber" v-model.trim="student.phoneNumber" required :invalid="submitted && !student.phoneNumber" fluid />
                    <small v-if="submitted && !student.phoneNumber" class="text-red-500">Phone number is required.</small>
                </div>
                <div>
                    <label for="enrollmentYear" class="block font-bold mb-3">Tahun Masuk</label>
                    <DatePicker id="enrollmentYear" v-model="student.enrollmentYear" required :invalid="submitted && !student.enrollmentYear" fluid view="year" dateFormat="yy" />
                    <small v-if="submitted && !student.enrollmentYear" class="text-red-500">Enrollment year is required.</small>
                </div>
                <div>
                    <label for="graduationYear" class="block font-bold mb-3">Tahun Lulus</label>
                    <DatePicker id="graduationYear" v-model="student.graduationYear" fluid view="year" dateFormat="yy" />
                </div>
                <div>
                    <label for="program" class="block font-bold mb-3">Program Studi</label>
                    <Select id="program" v-model="student.programId" :options="programs.map((program) => ({ label: program.name, value: program.id }))" optionLabel="label" optionValue="value" placeholder="Pilih Program Studi" fluid />
                </div>
                <div>
                    <label for="advisorId" class="block font-bold mb-3">Dosen Wali</label>
                    <Select id="advisorId" v-model="student.advisorId" :options="lecturers.map((lecturer) => ({ label: lecturer.name, value: lecturer.id }))" optionLabel="label" optionValue="value" placeholder="Pilih Dosen Wali" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveStudent" />
            </template>
        </Dialog>

        <!-- Dialog for Changing Password -->
        <Dialog v-model:visible="changePasswordDialog" :style="{ width: '450px' }" header="Change Password" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="newPassword" class="block font-bold mb-3">New Password</label>
                    <Password id="newPassword" v-model.trim="student.newPassword" required :invalid="submitted && !student.newPassword" type="password" fluid />
                    <small v-if="submitted && !student.newPassword" class="text-red-500">New password is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="changePassword" />
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
