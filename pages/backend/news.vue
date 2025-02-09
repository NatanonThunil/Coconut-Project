<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการข่าว</h1>
        <p>มีข่าวทั้งหมด {{ NewsNum }}</p>
    </div>
    <div class="add-btn-container">
        <button class="add-news-btn" @click="bulkUpdateStatus(true)">All Checked Publish</button>
        <button class="add-news-btn" @click="bulkUpdateStatus(false)">All Checked Unpublish</button>
        <button class="add-news-btn" @click="openAddNewsModal">ADD News</button>
    </div>

    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th class="items-id">
                        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                        <span>ID</span>
                    </th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Hotnews</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody v-if="News.length">
                <tr v-for="news in News" :key="news.id">
                    <td class="items-id">
                        <input type="checkbox" v-model="news.selected" />
                        <p>{{ news.id }}</p>
                    </td>
                    <td>{{ news.title }}</td>
                    <td>{{ news.author }}</td>
                    <td :style="{ color: news.hot_new ? 'green' : 'red', fontWeight: '700' }">
                        {{ news.hot_new ? "✓" : "✕" }}
                    </td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="news.status" @change="toggleStatus(news)" />
                            <img class="eyesicon" :src="news.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <button @click="editItem(news)" class="edit-btn">Edit</button>
                        <button @click="askDelete(news.id, news.title)" class="delete-btn">Delete</button>
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

    <div v-if="showModalAddnews || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขข่าว' : 'เพิ่มข่าว' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>พาดหัวข่าว</label>
                    <input class="add-text-input" v-model="currentNews.title" placeholder="Enter title" required />
                    <label>ชื่อผู้เขียน</label>
                    <input class="add-text-input" v-model="currentNews.author" placeholder="Enter author name" required />
                    <label>รองรับรูปภาพ PNG, JPG และ JPEG</label>
                    <div class="image-upload-container">
                        <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
                            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDragDrop">
                            <img v-if="!currentNews.image" src="@/assets/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentNews.image">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>
                            <div v-if="currentNews.image" class="image-preview">
                                <img :src="currentNews.image" alt="Uploaded Image" class="preview-image" />
                                <button class="remove-btn" @click="removeImage">X</button>
                            </div>
                            <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload"
                                class="file-uploader" ref="fileInput" />
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
                        </div>
                    </div>
                </section>
                <section>
                    <label>เป็นข่าวใหญ่</label>
                    <input v-model="currentNews.hot_new" type="checkbox" />
                    <label>Description</label>
                    <TiptapEditor v-model="currentNews.description" />
                    <label>Summary</label>
                    <textarea v-model="currentNews.summerize" placeholder="Enter summary"></textarea>
                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirm-btn" @click.prevent="submitNews(false)">{{ showModalEdit ? 'Update without publish' : 'Add without publish' }}</button>
                <button type="button" class="confirm-btn" @click.prevent="submitNews(true)">{{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}</button>
                <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import eye from '@/assets/icon/eye-alt-svgrepo-com.svg'
import eyeBlink from '@/assets/icon/eye-slash-alt-svgrepo-com.svg'
import TiptapEditor from '@/components/TiptapEditor.vue';
import '@/assets/styles/be-news.css';
const News = ref([]);
const NewsNum = ref(0);
const selectAll = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModal = ref(false);
const showModalAddnews = ref(false);
const showModalEdit = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);

const currentNews = ref({
    id: null,
    title: '',
    image: '',
    author: '',
    description: '',
    summerize: '',
    hot_new: false,
    upload_date: new Date().toISOString().split('T')[0],
    status: false,
});

const toggleStatus = async (news) => {
    try {
        // Optimistically update the UI
        const newStatus = !news.status;

        // Send update request to the backend
        const response = await fetch(`/api/news/${news.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...news, status: newStatus ? 1 : 0 }),
        });

        if (!response.ok) {
            throw new Error('Failed to update news status.');
        }

        // Update status only after successful response
        news.status = newStatus;


    } catch (error) {
        alert('Error updating news status.');
        console.error(error);
    }
};

const triggerFileInput = () => {
    fileInput.value.click();
};
const fetchNews = async () => {
    try {
        const response = await $fetch('/api/news_table');
        News.value = response.map(news => ({ ...news, selected: false }));
        NewsNum.value = News.value.length;
    } catch (error) {
        alert('Error fetching news.');
    }
};

const editItem = (news) => {
    currentNews.value = {
        ...news,
        hot_new: !!news.hot_new,
        status: !!news.status,
    };
    showModalEdit.value = true;
};

const openAddNewsModal = () => {
    currentNews.value = {
        id: null,
        title: '',
        image: '',
        author: '',
        description: '',
        summerize: '',
        hot_new: false,
        upload_date: new Date().toISOString().split('T')[0],
        status: false,
    };
    showModalAddnews.value = true;
};

const bulkUpdateStatus = async (publish) => {
    try {
        const selectedNews = News.value.filter(news => news.selected);
        if (selectedNews.length === 0) {
            alert('No news items selected.');
            return;
        }

        const updatePromises = selectedNews.map(news =>
            fetch(`/api/news/${news.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...news, status: publish ? 1 : 0 })
            })
        );

        await Promise.all(updatePromises);

        selectedNews.forEach(news => {
            news.status = publish ? 1 : 0;
        });

        alert(`Successfully ${publish ? 'published' : 'unpublished'} selected news items.`);
    } catch {
        alert('Failed to update news status.');
    }
};

const submitNews = async (publish) => {
    if (!currentNews.value.title.trim() || !currentNews.value.author.trim()) {
        alert('Please fill in all required fields: Title and Author.');
        return;
    }

    try {

        currentNews.value.upload_date = new Date(currentNews.value.upload_date)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');


        const isUpdate = !!currentNews.value.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `/api/news/${currentNews.value.id}` : '/api/news_rest';


        const payload = {
            id: currentNews.value.id,
            title: currentNews.value.title,
            description: currentNews.value.description,
            author: currentNews.value.author,
            upload_date: currentNews.value.upload_date,
            status: publish ? 1 : 0,
            hot_new: currentNews.value.hot_new,
            summerize: currentNews.value.summerize,
            image: currentNews.value.image || '',
        };

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Error saving the news.');
        }

        if (!isUpdate) {
            currentNews.value.id = await response.json();
            alert('News added successfully.');
        } else {
            alert('News updated successfully.');
        }

        showModalAddnews.value = false;
        showModalEdit.value = false;
        fetchNews(); // refresh news list

    } catch (error) {
        alert('Error while submitting news.');
        console.error(error);
    }
};

const closeModal = () => {
    showModalAddnews.value = false;
    showModalEdit.value = false;
};

const removeImage = () => {
    currentNews.value.image = '';
};

const handleDragDrop = (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload({ target: { files } });
    }
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            currentNews.value.image = reader.result;
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
        const response = await fetch(`/api/news/${deleteId.value}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deleteId.value }),
        });

        const result = await response.json();
        console.log("Delete API Response:", result);

        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete news.');
        }

        // Update frontend list
        News.value = News.value.filter(news => news.id !== deleteId.value);
        NewsNum.value = News.value.length;

        showModal.value = false;
        alert('News deleted successfully.');
    } catch (error) {
        alert(`Error deleting news: ${error.message}`);
        console.error(error);
    } finally {
        deleteId.value = null;
    }
};



const cancelDelete = () => {
    showModal.value = false;
};

onMounted(() => {
    fetchNews();
});

const toggleSelectAll = () => {
    News.value.forEach(news => news.selected = selectAll.value);
};
</script>

<style scoped>
/* Your custom styles here */
</style>
