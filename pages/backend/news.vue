<template>
  <div style="height: 5rem;"></div>
  <div class="table-head-text-container">
    <h1>จัดการข่าว</h1>
    <p>มีข่าวทั้งหมด {{ NewsNum }}</p>
  </div>
  <div class="add-btn-container">
    <button class="add-news-btn" @click="showModalAddnews = true">ADD News</button>
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


  <div v-if="showModalAddnews" class="modal-overlay">
    <form class="modal" @submit.prevent="addNews">
      <h2>เพิ่มข่าว</h2>
      <div class="modal-content">
        <label >พาดหัวข่าว</label>
        <input v-model="newNews.title" placeholder="Enter title" required />
        <br>
        <label>รองรับรูปภาพขนาดมากสุด 4GB</label>
        <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload" class="file-uploader" />
        <br>
        <label>ชื่อผู้เขียน </label>
        <input v-model="newNews.author" placeholder="Enter author name" required />
        <br>
        <label style="display: none;">Upload Date</label>
        <input v-model="newNews.upload_date" type="date" style="display: none;" />
        <br>
        <label>เป็นข่าวใหญ่</label>
        <input v-model="newNews.hotNew" type="checkbox" />
        <br>
        <label>Description</label><br>
        <textarea v-model="newNews.description" placeholder="Enter description"></textarea>
        <br>
        <label>Summary</label><br>
        <textarea v-model="newNews.summerize" placeholder="Enter summary"></textarea>
      </div>

      <div class="modal-actions">
        <button type="submit" class="confirm-btn">Add</button>
        <button @click="showModalAddnews = false" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>

  <div style="height: 5rem;"></div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});

import { ref, onMounted, watch } from 'vue';

const News = ref([]);
const NewsNum = ref(0);
const showModalAddnews = ref(false);
const selectAll = ref(false);
const showModal = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const newNews = ref({
  title: '',
  image: '',
  author: '',
  upload_date: new Date().toISOString().split('T')[0],
  description: '',
  summerize: '',
  hotNew: false
});

const fetchNews = async () => {
  try {
    const response = await $fetch('/api/news_table');
    News.value = response.map(news => ({ ...news, selected: false }));
    NewsNum.value = News.value.length;
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      newNews.value.image = reader.result; // Base64 encoding (includes `data:image/png;base64,`)
    };
    reader.readAsDataURL(file);
  }
};

const addNews = async () => {
  if (!newNews.value.title || !newNews.value.author || !newNews.value.image) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const response = await fetch('/api/news_rest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newNews.value,
        hotNew: newNews.value.hotNew ? 1 : 0, // Ensure Boolean handling
      }),
    });

    if (response.ok) {
      const addedNews = await response.json();
      News.value.push({ ...newNews.value, id: addedNews.id });
      showModalAddnews.value = false;

      // Reset form fields
      newNews.value = { title: '', image: '', author: '', description: '', summerize: '', hotNew: false };
    } else {
      console.error('Failed to add news');
    }
  } catch (error) {
    console.error('Error adding news:', error);
  }
};


const toggleSelectAll = () => {
  News.value.forEach(news => news.selected = selectAll.value);
};

watch(() => News.value.map(news => news.selected), (newValues) => {
  selectAll.value = newValues.every(Boolean);
}, { deep: true });

const askDelete = (id, name) => {
  showModal.value = true;
  deleteId.value = id;
  deleteName.value = name;
};

const cancelDelete = () => {
  showModal.value = false;
  deleteId.value = null;
  deleteName.value = null;
};

const confirmDelete = async () => {
  try {
    const response = await fetch('/api/news_DELETE', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId.value }),
    });

    if (response.ok) {
      News.value = News.value.filter(news => news.id !== deleteId.value);
      NewsNum.value = News.value.length; // Update count
      showModal.value = false;
    } else {
      console.error('Failed to delete news');
    }
  } catch (error) {
    console.error('Error deleting news:', error);
  } finally {
    deleteId.value = null;
  }
};

onMounted(fetchNews);
</script>

<style scoped>
.table-head-text-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  width: 90%;
}

.add-btn-container {
  display: flex;
  justify-content: end;
  justify-self: center;
  width: 90%;
  padding: 1rem;
}

.add-news-btn {
  all: unset;
  cursor: pointer;
  border: #4E6D16 solid 3px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  transition: ease-out 0.2s;
  color: #4E6D16;
  font-weight: 600;
}

.add-news-btn:hover {
  color: white;
  background-color: #4E6D16;
}

.add-news-btn:active {
  border: #364b10 solid 3px;
  background-color: #364b10;
  box-shadow: outset 0px 0px 0px 3px white;
}

.text-alert-container {
  padding: 1rem;
}

.table-container {
  display: flex;
  justify-content: center;
}

.item-list-table {
  width: 90%;
  border-collapse: collapse;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.item-list-table thead {
  background-color: #2c3e50;
  color: white;
}

.item-list-table th {
  padding: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.item-list-table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.item-list-table td {
  padding: 12px;
  text-align: left;
  color: #555;
  font-size: 14px;
}

.items-id {
  display: flex;
  align-items: center;
  gap: 10px;
}

.items-id input {
  margin: 0;
}

.edit-btn,
.delete-btn {
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin: 0.2rem;
  border-radius: 5px;
  transition: 0.3s;
}

.edit-btn {
  background-color: #4E6D16;
  color: white;
}

.delete-btn {
  background-color: red;
  color: white;
}

.edit-btn:hover {
  background-color: #6F8C28;
}

.delete-btn:hover {
  background-color: #D84E5E;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.confirm-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: 0.2s;
}

.confirm-btn {
  background-color: #4E6D16;
  color: white;
}

.cancel-btn {
  background-color: #D84E5E;
  color: white;
}

.confirm-btn:hover {
  background-color: #6F8C28;
}

.cancel-btn:hover {
  background-color: #F86F70;
}
</style>
