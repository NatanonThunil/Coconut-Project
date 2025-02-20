<template>

    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการข่าว</h1>
        <p>มีข่าวทั้งหมด {{ NewsNum }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ, ผุ้เขียน หรือ วันที่" />

        <div class="news-check-publish"><button class="published-news-btn" @click="bulkUpdateStatus(true)">All
                Checked
                Publish</button>
            <button class="unpublished-news-btn" @click="bulkUpdateStatus(false)">All Checked
                Unpublish</button>

            <button class="add-news-btn" @click="openAddNewsModal">ADD Event</button>
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
                            <div>Organizer<button @click="toggleSort('organizer')"><div :class="{'rotate': sortBy === 'organizer' && sortDirection === -1}">▲</div></button></div>
                        </div>
                    </th>
                    <th><div class="checkbox-id-container">
                            <div>Date start<button @click="toggleSort('date_start')"><div :class="{'rotate': sortBy === 'date_start' && sortDirection === -1}">▲</div></button></div>
                        </div></th>
                    <th><div class="checkbox-id-container">
                            <div>Date end<button @click="toggleSort('upload_end')"><div :class="{'rotate': sortBy === 'date_end' && sortDirection === -1}">▲</div></button></div>
                        </div></th>
                    <th><div class="checkbox-id-container">
                            <div>Status <button @click="toggleSort('status')"><div :class="{'rotate': sortBy === 'id' && sortDirection === -1}">▲</div></button></div>
                        </div></th>
                    <th></th>
                </tr>
            </thead>

            <tbody v-if="filteredSortedNews.length">
                <tr v-for="news in filteredSortedNews" :key="news.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="news.selected" />
                            <p>{{ news.id }}</p>
                        </div>
                    </td>
                    <td>{{ news.title }}</td>
                    <td>{{ news.organizer }}</td>
                    <td>{{ formatDate(news.date_start) }}</td>
                    <td>{{ formatDate(news.date_end) }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="news.status" @change="toggleStatus(news)" />
                            <img class="eyesicon" :src="news.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <div class="action-btn-container"> <button @click="editItem(news)" class="edit-btn"><img
                                    src="@/assets/icon/pen.png" alt=""></button>
                            <button @click="askDelete(news.id, news.title)" class="delete-btn"><img
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

    <div v-if="showModalAddnews || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขข่าว' : 'เพิ่มข่าว' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>พาดหัวข่าว</label>
                    <input class="add-text-input" v-model="currentNews.title" placeholder="Enter title" required />
                    <label>ชื่อผู้เขียน</label>
                    <input class="add-text-input" v-model="currentNews.organizer" placeholder="Enter author name"
                        required />
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
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse
                                File</button>
                        </div>
                    </div>
                </section>
                <section>
                    <div class="hotnews-toggle-container">
                        <label class="hotnews-toggle-label">เป็นข่าวใหญ่</label>
                        <label class="hotnews-switch">
                            <input v-model="currentNews.hot_new" type="checkbox">
                            <span class="hotnews-slider"></span>
                        </label>
                    </div>
                    <label>Description</label>
                    <TiptapEditor v-model="currentNews.description" />

                    <label>Summary</label>
                    <textarea v-model="currentNews.summerize" placeholder="Enter summary"></textarea>
                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirme-btn" @click.prevent="submitNews(false)">{{ showModalEdit ?
                    'Update without publish' : 'Add without publish' }}</button>
                <button type="button" class="confirm-btn" @click.prevent="submitNews(true)">{{ showModalEdit ?
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
import { ref, onMounted, computed } from 'vue';
import eye from '@/assets/icon/eye-alt-svgrepo-com.svg'
import eyeBlink from '@/assets/icon/eye-slash-alt-svgrepo-com.svg'
import TiptapEditor from '@/components/TiptapEditor.vue';
import '@/assets/styles/be-news.css';

const apiEndpoint = 'events';
const searchQuery = ref('');
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
const sortBy = ref(null);
const sortDirection = ref(1);
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

        const newStatus = !news.status;


        const response = await fetch(`/api/${apiEndpoint}/${news.id}`, {
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
        const response = await $fetch(`/api/${apiEndpoint}`);
        News.value = response.map(news => ({ ...news, selected: false }));
        NewsNum.value = News.value.length;
    } catch (error) {
        alert('Error fetching news.');
    }
};

import { nextTick } from "vue";

const editItem = (news) => {
    currentNews.value = {
        ...news,
        hot_new: !!news.hot_new,
        status: !!news.status,
        description: news.description || "", // Ensure description is set
    };

    showModalEdit.value = true; // Open modal first

    // Wait for modal to fully open, then update Tiptap content
    nextTick(() => {
        console.log("Setting Tiptap Content:", currentNews.value.description);
    });
};


const filteredSortedNews = computed(() => {
  let filtered = News.value.filter(news =>
    news.id.toString().includes(searchQuery.value) ||
    news.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    news.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    news.upload_date.includes(searchQuery.value)
  );
  
  if (sortBy.value) {
    filtered.sort((a, b) => {
      let valA = a[sortBy.value];
      let valB = b[sortBy.value];
      
      if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
      if (sortBy.value === 'title' || sortBy.value === 'organizer') return valA.localeCompare(valB, 'th') * sortDirection.value;
      if (sortBy.value === 'hot_new' || sortBy.value === 'status') return (valB - valA) * sortDirection.value;
      if (sortBy.value === 'upload_date') return (new Date(valB) - new Date(valA)) * sortDirection.value;
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
    sortDirection.value = column === 'hot_new' || column === 'status' ? -1 : 1;
  }
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
            fetch(`/api/${apiEndpoint}/${news.id}`, {
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

        const userTime = new Date();
        const bangkokOffset = 7 * 60 * 60 * 1000;
        const bangkokTime = new Date(userTime.getTime() + bangkokOffset);

        currentNews.value.upload_date = bangkokTime
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        const isUpdate = !!currentNews.value.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `/api/${apiEndpoint}/${currentNews.value.id}` : `/api/${apiEndpoint}`;

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
        fetchNews();

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

<style scoped></style>
