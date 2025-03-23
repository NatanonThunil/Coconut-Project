<template>

    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการความสำเร็จ</h1>
        <p>มีความสำเร็จทั้งหมด {{ achievementsNum }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ, ผู้เขียน หรือ วันที่" />

        <div class="news-check-publish"><button class="published-news-btn" @click="bulkUpdateStatus(true)">All
                Checked
                Publish</button>
            <button class="unpublished-news-btn" @click="bulkUpdateStatus(false)">All Checked
                Unpublish</button>

            <button class="add-news-btn" @click="openAddAchievementModal">ADD Achievement</button>
        </div>
    </div>

    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                class="checkbox-decorate" />
                            <span>ID</span>
                            <button @click="toggleSort('id')"><div :class="{'rotate': sortBy === 'id' && sortDirection === -1}">▲</div></button>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Title<button @click="toggleSort('title')"><div :class="{'rotate': sortBy === 'title' && sortDirection === -1}">▲</div></button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Author<button @click="toggleSort('author')"><div :class="{'rotate': sortBy === 'author' && sortDirection === -1}">▲</div></button></div>
                        </div>
                    </th>
                    <th><div class="checkbox-id-container">
                            <div>Upload Date<button @click="toggleSort('uploadDate')"><div :class="{'rotate': sortBy === 'uploadDate' && sortDirection === -1}">▲</div></button></div>
                        </div></th>
                    <th><div class="checkbox-id-container">
                            <div>Status <button @click="toggleSort('status')"><div :class="{'rotate': sortBy === 'id' && sortDirection === -1}">▲</div></button></div>
                        </div></th>
                    <th></th>
                </tr>
            </thead>

            <tbody v-if="filteredSortedAchievements.length">
                <tr v-for="achievement in filteredSortedAchievements" :key="achievement.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="achievement.selected" />
                            <p>{{ achievement.id }}</p>
                        </div>
                    </td>
                    <td>{{ achievement.title }}</td>
                    <td>{{ achievement.author }}</td>
                    <td>{{ formatDate(achievement.uploadDate) }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="achievement.status" @change="toggleStatus(achievement)" />
                            <img class="eyesicon" :src="achievement.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <div class="action-btn-container"> <button @click="editItem(achievement)" class="edit-btn"><img
                                    src="@/assets/icon/pen.png" alt=""></button>
                            <button @click="askDelete(achievement.id, achievement.title)" class="delete-btn"><img
                                    src="@/assets/icon/trash.png" alt=""></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal">
            <div class="text-alert-container">
                <span>ต้องการที่จะ <span style="color: red; font-size: larger; font-weight: bolder;">ลบ</span></span>
                <p>" {{ deleteName }} "</p>
            </div>
            <div class="modal-actions">
                <button @click="confirmDelete" class="confirm-btn">Yes</button>
                <button @click="cancelDelete" class="cancel-btn">No</button>
            </div>
        </div>
    </div>

    <div v-if="showModalAddAchievement || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขความสำเร็จ' : 'เพิ่มความสำเร็จ' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>หัวข้อ</label>
                    <input class="add-text-input" v-model="currentAchievement.title" placeholder="Enter title" required />
                    <label>ชื่อผู้เขียน</label>
                    <input class="add-text-input" v-model="currentAchievement.author" placeholder="Enter author name"
                        required />
                    <label>รองรับไฟล์ PDF</label>
                    <div class="pdf-upload-container">
                        <div class="pdf-input-drag-n-drop-container" :class="{ dragover: isDragging }"
                            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDragDrop">
                            <img v-if="!currentAchievement.pdf" src="@/assets/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentAchievement.pdf">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>
                            <div v-if="currentAchievement.pdf" class="pdf-preview">
                                <embed :src="currentAchievement.pdf" type="application/pdf" class="preview-pdf" />
                                <button class="remove-btn" @click="removePdf">X</button>
                            </div>
                            <input type="file" accept="application/pdf" @change="handleFileUpload"
                                class="file-uploader" ref="fileInput" />
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse
                                File</button>
                        </div>
                    </div>
                </section>
                <section>
                    <label>Description</label>
                    <TiptapEditor v-model="currentAchievement.description" />

                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirm-btn" @click.prevent="submitAchievement(true)">{{ showModalEdit ?
                    'Update & Publish' : 'Add & Publish' }}</button>
                <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </form>
    </div>
    <div style="height: 5rem;"></div>

</template>

<script setup>
definePageMeta({
    layout: "admin",
});
import { ref, onMounted, computed, nextTick } from 'vue';
import eye from '@/assets/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '@/assets/icon/eye-slash-alt-svgrepo-com.svg';
import TiptapEditor from '@/components/TiptapEditor.vue';
import '@/assets/styles/be-news.css';

const apiEndpoint = 'achievements';
const searchQuery = ref('');
const achievements = ref([]);
const achievementsNum = ref(0);
const selectAll = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModal = ref(false);
const showModalAddAchievement = ref(false);
const showModalEdit = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const sortBy = ref(null);
const sortDirection = ref(1);
const currentAchievement = ref({
    id: null,
    title: '',
    pdf: '',
    author: '',
    description: '',
    uploadDate: new Date().toISOString().split('T')[0],
    status: false,
});

const toggleStatus = async (achievement) => {
    try {
        const newStatus = !achievement.status;
        achievement.status = newStatus ? 1 : 0;

        // Fix for date formatting issue
        const formattedDate = new Date(achievement.uploadDate).toISOString().slice(0, 19).replace('T', ' ');

        const response = await fetch(`/api/${apiEndpoint}/${achievement.id}`, {
            method: 'PUT',
            headers: {
                'CKH': '541986Cocon',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...achievement,
                status: newStatus,
                uploadDate: formattedDate 
            }),
        });

        if (!response.ok) {
            achievement.status = newStatus ? 0 : 1;
            throw new Error('Failed to update achievement status.');
        }

        const updatedAchievement = await response.json();
        console.log('Updated achievement:', updatedAchievement);

    } catch (error) {
        alert('Error updating achievement status.');
        console.error(error);
    }
};


const triggerFileInput = () => {
    fileInput.value.click();
};

const fetchAchievements = async () => {
    try {
        const response = await fetch(`/api/${apiEndpoint}`, {
            headers: {
                "CKH": '541986Cocon',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch achievements.');
        }
        const data = await response.json();
        achievements.value = data.achievements.map(achievement => ({ ...achievement, selected: false }));
        achievementsNum.value = achievements.value.length;
    } catch (error) {
        alert('Error fetching achievements.');
        console.error(error);
    }
};

const editItem = (achievement) => {
    currentAchievement.value = {
        ...achievement,
        status: !!achievement.status,
        description: achievement.description || "", // Ensure description is set
        pdf: achievement.pdf || '', // Ensure pdf is set
    };

    showModalEdit.value = true; // Open modal first

    nextTick(() => {
        console.log("Setting Tiptap Content:", currentAchievement.value.description);
    });
};

const filteredSortedAchievements = computed(() => {
    let filtered = achievements.value.filter(achievement =>
        achievement.id.toString().includes(searchQuery.value) ||
        achievement.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        achievement.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        achievement.uploadDate.includes(searchQuery.value)
    );

    if (sortBy.value) {
        filtered.sort((a, b) => {
            let valA = a[sortBy.value];
            let valB = b[sortBy.value];

            if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
            if (sortBy.value === 'title' || sortBy.value === 'author') return valA.localeCompare(valB, 'th') * sortDirection.value;
            if (sortBy.value === 'status') return (valB - valA) * sortDirection.value;
            if (sortBy.value === 'uploadDate') return (new Date(valB) - new Date(valA)) * sortDirection.value;
            return 0;
        });
    }
    return filtered;
});

const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortDirection.value *= -1;
    } else {
        sortBy.value = column;
        sortDirection.value = column === 'status' ? -1 : 1;
    }
};

const openAddAchievementModal = () => {
    currentAchievement.value = {
        id: null,
        title: '',
        pdf: '',
        author: '',
        description: '',
        uploadDate: new Date().toISOString().split('T')[0],
        status: false,
    };
    showModalAddAchievement.value = true;
};
const bulkUpdateStatus = async (publish) => {
    try {
        const selectedAchievements = achievements.value.filter(achievement => achievement.selected);
        if (selectedAchievements.length === 0) {
            alert('No achievements selected.');
            return;
        }

        // Loop through selected achievements and format uploadDate
        const updatePromises = selectedAchievements.map(achievement => {
            // Format the date to 'YYYY-MM-DD HH:MM:SS' before sending
            const formattedDate = new Date(achievement.uploadDate).toISOString().slice(0, 19).replace('T', ' ');

            return fetch(`/api/${apiEndpoint}/${achievement.id}`, {
                method: 'PUT',
                headers: {
                    'CKH': '541986Cocon',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...achievement,
                    status: publish ? 1 : 0,
                    uploadDate: formattedDate,  // Ensure correct date format
                }),
            });
        });

        await Promise.all(updatePromises);

        // Update the local state after success
        selectedAchievements.forEach(achievement => {
            achievement.status = publish ? 1 : 0;
        });

        alert(`Successfully ${publish ? 'published' : 'unpublished'} selected achievements.`);
    } catch (error) {
        alert('Failed to update achievement status.');
        console.error(error);
    }
};


const submitAchievement = async (publish) => {
    if (!currentAchievement.value.title.trim() || !currentAchievement.value.author.trim()) {
        alert('Please fill in all required fields: Title and Author.');
        return;
    }

    try {
        const userTime = new Date();
        const bangkokOffset = 7 * 60 * 60 * 1000;
        const bangkokTime = new Date(userTime.getTime() + bangkokOffset);

        currentAchievement.value.uploadDate = bangkokTime
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        const isUpdate = !!currentAchievement.value.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `/api/${apiEndpoint}/${currentAchievement.value.id}` : `/api/${apiEndpoint}`;

        const payload = {
            id: currentAchievement.value.id,
            title: currentAchievement.value.title,
            description: currentAchievement.value.description,
            author: currentAchievement.value.author,
            uploadDate: currentAchievement.value.uploadDate,
            status: publish ? 1 : 0,
            pdf: currentAchievement.value.pdf || '',
        };

        const response = await fetch(url, {
            method,
            headers: { 'CKH': '541986Cocon' ,'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Error saving the achievement.');
        }

        if (!isUpdate) {
            currentAchievement.value.id = await response.json();
            alert('Achievement added successfully.');
        } else {
            alert('Achievement updated successfully.');
        }

        showModalAddAchievement.value = false;
        showModalEdit.value = false;
        fetchAchievements();

    } catch (error) {
        alert('Error while submitting achievement.');
        console.error(error);
    }
};

const closeModal = () => {
    showModalAddAchievement.value = false;
    showModalEdit.value = false;
};

const removePdf = () => {
    currentAchievement.value.pdf = '';
};

const handleDragDrop = (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload({ target: { files } });
    }
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => {
            currentAchievement.value.pdf = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

const askDelete = (id, title) => {
    deleteId.value = id;
    deleteName.value = title;
    showModal.value = true;
};

const confirmDelete = async () => {
    try {
        const response = await fetch(`/api/${apiEndpoint}/${deleteId.value}`, {
            method: 'DELETE',
            headers: { 'CKH': '541986Cocon','Content-Type': 'application/json'  },
            body: JSON.stringify({ id: deleteId.value }),
        });

        const result = await response.json();
        console.log("Delete API Response:", result);

        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete achievement.');
        }

        achievements.value = achievements.value.filter(achievement => achievement.id !== deleteId.value);
        achievementsNum.value = achievements.value.length;

        showModal.value = false;
        alert('Achievement deleted successfully.');
    } catch (error) {
        alert(`Error deleting achievement: ${error.message}`);
        console.error(error);
    } finally {
        deleteId.value = null;
    }
};

const cancelDelete = () => {
    showModal.value = false;
};

onMounted(() => {
    fetchAchievements();
});

const toggleSelectAll = () => {
    achievements.value.forEach(achievement => achievement.selected = selectAll.value);
};
</script>