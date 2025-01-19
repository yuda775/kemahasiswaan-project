<script setup>
import { decodeJWT } from '@/service/decodeJWT';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';

const toast = useToast();
const token = localStorage.getItem('token');
const payload = decodeJWT(token);
const commentDialog = ref(false);
const addActivityDialog = ref(false);
const editActivityDialog = ref(false);
const deleteActivityDialog = ref(false);
const selectedActivity = ref(null);
const activities = ref([]);
const categories = ref([]);
const academicYears = ref([]);
const statusOptions = ref(['APPROVED', 'REJECTED', 'Menunggu']);
const filters = ref({});
const newActivity = ref({
    category: null,
    points: null,
    name: null,
    date: null,
    academicYear: null,
    file: null
});

// Mengambil tahun akademik aktif
const academicYear = computed(() => {
    return academicYears.value.find((year) => year.isActive)?.id;
});

// Mengambil poin berdasarkan kategori
const pointsByCategory = computed(() => {
    return categories.value.find((category) => category.name === newActivity.value.category)?.points;
});

// Mengupdate tahun akademik di newActivity
watch(academicYear, (newYear) => {
    newActivity.value.academicYear = newYear;
});

// Mengupdate poin berdasarkan kategori yang dipilih
watch(pointsByCategory, (newPoints) => {
    newActivity.value.points = newPoints;
});

const menu = ref();

const menuItems = ref([
    {
        label: 'Options',
        items: [
            { label: 'Lihat Komentar', icon: 'pi pi-comment', command: () => handleMenuCommand('viewComment', selectedActivity.value) },
            { label: 'Preview Bukti Aktivitas', icon: 'pi pi-file-pdf', command: () => window.open(`${import.meta.env.VITE_APP_BASE_URL}/file/student-activity/${selectedActivity.value.filePath}`) },
            { label: 'Edit', icon: 'pi pi-pencil', command: () => handleMenuCommand('edit', selectedActivity.value) },
            { label: 'Batalkan', icon: 'pi pi-trash', command: () => handleMenuCommand('delete', selectedActivity.value) }
        ]
    }
]);

const toggleMenu = (event, data) => {
    selectedActivity.value = data; // Set the selected activity for deletion confirmation
    menu.value.toggle(event);
};

const handleMenuCommand = (action, data) => {
    if (action === 'viewComment') viewComment(data);
    if (action === 'edit') editActivity(data);
    if (action === 'delete') confirmDelete(data);
};

const viewComment = (data) => {
    selectedActivity.value = data;
    commentDialog.value = true;
};

const editActivity = (data) => {
    editActivityDialog.value = true;
    selectedActivity.value = data;
};

const confirmDelete = (data) => {
    selectedActivity.value = data; // Set the selected activity for deletion
    deleteActivityDialog.value = true; // Show delete confirmation dialog
};

const deleteSelectedActivity = async () => {
    try {
        await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/${selectedActivity.value.id}`);
        const index = activities.value.findIndex((activity) => activity.id === selectedActivity.value.id);
        if (index > -1) {
            activities.value.splice(index, 1);
        }
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Deleted', life: 4000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete activity', life: 4000 });
    } finally {
        deleteActivityDialog.value = false;
    }
};

const onUpload = (event) => {
    newActivity.value.file = event.target.files[0];
};

const saveActivity = async () => {
    addActivityDialog.value = false;

    const formData = new FormData();
    formData.append('studentId', payload?.id);
    formData.append('academicYearId', newActivity.value.academicYear);
    formData.append('activityCategory', newActivity.value.category);
    formData.append('point', newActivity.value.points);
    formData.append('activityName', newActivity.value.name);
    formData.append('activityDate', newActivity.value.date);
    formData.append('filePath', newActivity.value.file);

    console.log('Uploading file:', newActivity.value.file, 'with formData:', formData);

    try {
        await axios
            .post(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Activity Saved', life: 4000 });
                getActivities();
            })
            .finally(() => {
                newActivity.value = {
                    category: null,
                    points: null,
                    name: null,
                    date: null,
                    academicYear: null,
                    file: null
                };
            });
    } catch (error) {
        console.error('Error saving activity:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save activity', life: 4000 });
    }
};

const updateActivity = () => {
    editActivityDialog.value = false;
    // Logic to update the selected activity can be added here
};

const getActivities = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/student-activity/student/${payload?.id}`)
        .then((response) => {
            activities.value = response.data.data;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
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

const getAcademicYears = async () => {
    await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/academic-year/`)
        .then((response) => {
            academicYears.value = response.data.data.map((x) => {
                return {
                    id: x.id,
                    year: `${x.year} ${x.semester}`,
                    isActive: x.isActive
                };
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};

onMounted(() => {
    getActivities();
    getActivityCategories();
    getAcademicYears();
});
</script>

<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-start">
                <h4 class="m-0 text-xl font-semibold">Daftar Aktivitas</h4>
                <Button label="Buat Pengajuan" icon="pi pi-plus" class="mr-2" @click="addActivityDialog = true" />
            </div>
            <DataTable
                :value="activities"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                dataKey="id"
                size="small"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} activity"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex sm:flex-row flex-wrap flex-col gap-2 sm:gap-0 justify-between items-end">
                        <div class="field flex flex-wrap gap-2">
                            <label for="academicYearFilter">
                                <span class="block text-sm font-medium text-gray-700">Tahun Akademik</span>
                                <Select id="academicYearFilter" v-model="filters.academicYear" :options="academicYears" optionLabel="year" optionValue="year" placeholder="Pilih Tahun Akademik" class="w-full" />
                            </label>
                            <label for="statusFilter">
                                <span class="block text-sm font-medium text-gray-700">Status</span>
                                <Select id="statusFilter" v-model="filters.status" :options="statusOptions" placeholder="Pilih Status" class="w-full" />
                            </label>
                        </div>
                        <IconField class="sm:w-auto w-full">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters.search" placeholder="Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> No data found. </template>
                <template #loading> Loading data. Please wait. </template>

                <Column field="academicYears" header="Tahun Akademik">
                    <template #body="{ data }"> {{ data.academicYear.year }} {{ data.academicYear.semester }} </template>
                </Column>
                <Column field="activityCategory" header="Kategori Aktivitas"></Column>
                <Column field="activityName" header="Nama Aktivitas"></Column>
                <Column field="point" header="Poin"></Column>
                <Column field="advisorVerification" header="Verifikasi Dosen Wali">
                    <template #body="{ data }">
                        <Tag
                            :icon="data.advisorVerification === 'APPROVED' ? 'pi pi-check' : data.advisorVerification === 'REJECTED' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.advisorVerification === 'APPROVED' ? 'success' : data.advisorVerification === 'REJECTED' ? 'danger' : 'secondary'"
                            :value="data.advisorVerification === 'APPROVED' ? 'Disetujui' : data.advisorVerification === 'REJECTED' ? 'Ditolak' : 'Menunggu'"
                        ></Tag>
                    </template>
                </Column>
                <Column field="studentAffairVerification" header="Verifikasi Kemahasiswaan">
                    <template #body="{ data }">
                        <Tag
                            :icon="data.studentAffairVerification === 'APPROVED' ? 'pi pi-check' : data.studentAffairVerification === 'REJECTED' ? 'pi pi-times' : 'pi pi-exclamation-triangle'"
                            :severity="data.studentAffairVerification === 'APPROVED' ? 'success' : data.studentAffairVerification === 'REJECTED' ? 'danger' : 'secondary'"
                            :value="data.studentAffairVerification"
                        ></Tag>
                    </template>
                </Column>
                <Column>
                    <template #body="{ data }">
                        <Button type="button" severity="secondary" icon="pi pi-ellipsis-h" @click="(event) => toggleMenu(event, data)" aria-haspopup="true" aria-controls="overlay_menu" />
                        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="addActivityDialog" :style="{ width: '450px' }" header="Buat Pengajuan " :modal="true">
            <div class="field">
                <label for="activityCategory" class="block text-sm font-medium text-gray-700">Kategori Aktivitas</label>
                <Select v-model="newActivity.category" :options="categories" optionLabel="name" optionValue="name" placeholder="Pilih kategori" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityPoints" class="block text-sm font-medium text-gray-700">Poin</label>
                <InputText id="activityPoints" v-model="newActivity.points" type="number" class="mt-1 block w-full" disabled />
            </div>
            <div class="field mt-4">
                <label for="activityName" class="block text-sm font-medium text-gray-700">Nama Aktivitas</label>
                <InputText id="activityName" v-model="newActivity.name" placeholder="Masukkan nama aktivitas" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityDate" class="block text-sm font-medium text-gray-700">Tanggal Aktivitas</label>
                <input type="date" id="activityDate" v-model="newActivity.date" required class="mt-1 block w-full border border-slate-400 rounded p-2" />
            </div>
            <div class="field mt-4">
                <label for="activityProof" class="block text-sm font-medium text-gray-700">Bukti Aktivitas</label>
                <input class="mt-1 block w-full" type="file" id="activityProof" accept="image/*,application/pdf" :maxFileSize="1000000" :customUpload="true" @change="onUpload" />
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="addActivityDialog = false" />
                <Button label="Simpan" icon="pi pi-check" @click="saveActivity" />
            </template>
        </Dialog>

        <Dialog v-model:visible="editActivityDialog" :style="{ width: '450px' }" header="Edit Pengajuan " :modal="true">
            <div class="field">
                <label for="activityName" class="block text-sm font-medium text-gray-700">Nama Aktivitas</label>
                <InputText id="activityName" v-model="selectedActivity.name" placeholder="Masukkan nama aktivitas" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityCategory" class="block text-sm font-medium text-gray-700">Kategori Aktivitas</label>
                <Select v-model="selectedActivity.category" :options="categories" optionLabel="name" placeholder="Pilih kategori" class="mt-1 block w-full" required />
            </div>
            <div class="field mt-4">
                <label for="activityPoints" class="block text-sm font-medium text-gray-700">Poin</label>
                <InputText id="activityPoints" v-model="selectedActivity.points" type="number" class="mt-1 block w-full" disabled />
            </div>
            <div class="field mt-4">
                <label for="activityProof" class="block text-sm font-medium text-gray-700">Bukti Aktivitas</label>
                <FileUpload ref="fileupload" mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" :customUpload="true" />
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="editActivityDialog = false" />
                <Button label="Simpan" icon="pi pi-check" @click="updateActivity" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteActivityDialog" :style="{ width: '450px' }" header="Konfirmasi" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedActivity"
                    >Are you sure you want to delete <b>{{ selectedActivity.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" severity="secondary" icon="pi pi-times" text @click="deleteActivityDialog = false" />
                <Button label="Yes" severity="danger" icon="pi pi-check" @click="deleteSelectedActivity" />
            </template>
        </Dialog>

        <Dialog v-model:visible="commentDialog" :style="{ width: '450px' }" header="Komentar" :modal="true">
            <div class="field">
                <label for="comment" class="block text-sm font-medium text-gray-700">Komentar</label>
                <Textarea id="comment" v-model="selectedActivity.comment" disabled rows="3" class="mt-1 block w-full" />
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="commentDialog = false" />
                <Button label="Simpan" icon="pi pi-check" @click="saveComment" />
            </template>
        </Dialog>
    </div>
</template>
