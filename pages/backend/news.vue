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
          <td
            :style="(news.status == 0) ? 'font-size:1.2rem; font-weight: 700; color: #ffce54;  text-shadow: 1px 1px 2px black, -1px -1px 2px black,1px -1px 2px black, -1px 1px 2px black,0px 1px 4px black,0px -1px 4px black,1px 0px 4px black,-1px 0px 4px black;' : 'font-size:1.2rem; font-weight: 700; color: #DFF169;  text-shadow: 1px 1px 2px black, -1px -1px 2px black,1px -1px 2px black, -1px 1px 2px black,0px 1px 4px black,0px -1px 4px black,1px 0px 4px black,-1px 0px 4px black;'">
            {{ (news.status == 0) ? 'Pending' :
              'Published' }}</td>
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
    <form class="modal-add" @submit.prevent="addNews">
      <h2>เพิ่มข่าว</h2>
      <div style="height: 2px; width: 100%; background-color: #4E6D16; margin: 1rem 0rem;"></div>
      <div class="modal-content">
        <section>
          <label>พาดหัวข่าว </label>
          <input class="add-text-input" v-model="newNews.title" placeholder="Enter title" required />
          <br> <label>ชื่อผู้เขียน </label>
          <input class="add-text-input" v-model="newNews.author" placeholder="Enter author name" required />
          <br>
          <label>รองรับรูปภาพ PNG, JPG และJPEG</label>
          <div class="image-upload-container">
            <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
              @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="handleDragDrop">
              <img v-if="!newNews.image" src="@/assets/icon/upload.svg" draggable="false">
              <h2 v-if="!newNews.image">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>

              <!-- Image Preview -->
              <div v-if="newNews.image" class="image-preview">
                <img :src="newNews.image" alt="Uploaded Image" class="preview-image" />
                <button class="remove-btn" @click="removeImage">X</button>
              </div>

              <!-- Hidden File Input -->
              <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload" class="file-uploader"
                ref="fileInput" />

              <!-- Browse Button -->
              <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
            </div>
          </div>
        </section>
        <section>
          <label style="display: none;">Upload Date</label>
          <input v-model="newNews.upload_date" type="date" style="display: none;" />

          <label>เป็นข่าวใหญ่</label>
          <input v-model="newNews.hot_new" type="checkbox" />
          <br>
          <label>Description</label><br>
          <textarea v-model="newNews.description" placeholder="Enter description"></textarea>
          <br>
          <label>Summary</label><br>
          <textarea v-model="newNews.summerize" placeholder="Enter summary"></textarea>
        </section>
      </div>

      <div class="modal-actions">
        <button type="submit" class="confirm-btn">Add</button>
        <button @click="showModalAddnews = false" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
  <div v-if="showModalEdit" class="modal-overlay">
    <form class="modal-edit" @submit.prevent="updateNews">
      <h2>Edit News</h2>
      <div class="modal-content">
        <div class="mod-sl">
          <label>Title</label>
          <input  v-model="currentEditNews.title" placeholder="Enter title" required />
          <br>
          <label>Author</label>
          <input  v-model="currentEditNews.author" placeholder="Enter author name" required />
          <br>
          <label>Upload Image</label>
          <div class="image-upload-container">
            <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
              @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="handleDragDrop">
              <img v-if="!currentEditNews.image" src="@/assets/icon/upload.svg" draggable="false">
              <h2 v-if="!currentEditNews.image">Drag file here or click to select</h2>
              <div v-if="currentEditNews.image" class="image-preview">
                <img :src="currentEditNews.image" alt="Uploaded Image" class="preview-image" />
                <button class="remove-btn" @click="removeImage">X</button>
              </div>
              <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload" class="file-uploader"
                ref="fileInput" />
              <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
            </div>
          </div>

          <label>Upload Date</label>
          <input v-model="currentEditNews.upload_date" type="date" />
        </div>

        <div class="mod-sr"><label>Is Hot News?</label>
          <input v-model="currentEditNews.hot_new" type="checkbox" />
          <br>
          <label>Description</label>
          <textarea v-model="currentEditNews.description" placeholder="Enter description"></textarea>
          <br>
          <label>Summary</label>
          <textarea v-model="currentEditNews.summerize" placeholder="Enter summary"></textarea>
        </div>
      </div>

      <div class="modal-actions">
        <button type="submit" class="confirm-btn">Save Changes</button>
        <button type="button" @click="cancelEdit" class="cancel-btn">Cancel</button>
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
const isDragging = ref(false);
const fileInput = ref(null);
const News = ref([]);
const NewsNum = ref(0);
const showModalAddnews = ref(true);
const selectAll = ref(false);
const showModal = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModalEdit = ref(false);
const currentEditNews = ref(null);

const newNews = ref({
  title: '',
  image: '',
  author: '',
  upload_date: new Date().toISOString().split('T')[0],
  description: '',
  summerize: '',
  hot_new: false
});
const editItem = (news) => {
  showModalEdit.value = true;
  currentEditNews.value = { ...news };  // Copy the current news to a temporary object
};

// Function to handle the form submission for editing
const updateNews = async () => {
  if (!currentEditNews.value.title || !currentEditNews.value.author || !currentEditNews.value.image) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const response = await fetch('/api/news_rest', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...currentEditNews.value,
        hot_new: currentEditNews.value.hot_new ? 1 : 0,  // Ensure Boolean handling
      }),
    });

    if (response.ok) {
      const updatedNews = await response.json();
      const index = News.value.findIndex(news => news.id === updatedNews.id);
      if (index !== -1) {
        News.value[index] = updatedNews;  // Replace old news with updated news
      }
      showModalEdit.value = false;  // Close modal
    } else {
      console.error('Failed to update news');
    }
  } catch (error) {
    console.error('Error updating news:', error);
  }
};

// Function to cancel the editing
const cancelEdit = () => {
  showModalEdit.value = false;
  currentEditNews.value = null;
};
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
  processFile(file);
};
const handleDragDrop = (event) => {
  const file = event.dataTransfer.files[0];
  processFile(file);
};

const processFile = (file) => {
  if (!file) return;

  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file (JPEG/PNG)');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    newNews.value.image = reader.result; // Store Base64 encoded image
  };
  reader.readAsDataURL(file);
};
const removeImage = () => {
  newNews.value.image = '';
};

const triggerFileInput = () => {
  fileInput.value.click();
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
        hot_new: newNews.value.hot_new ? 1 : 0, // Ensure Boolean handling
      }),
    });

    if (response.ok) {
      const addedNews = await response.json();
      News.value.push({ ...newNews.value, id: addedNews.id });
      showModalAddnews.value = false;

      // Reset form fields
      newNews.value = { title: '', image: '', author: '', description: '', summerize: '', hot_new: false };
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
.mod-sl,
.mod-sr {
  display: flex;
  flex-direction: column;
}
.modal-add .modal-content {
  display: flex;
  justify-content: center;
}
.modal-add .modal-content section {
  display: flex;
  flex-direction: column;
}

.modal-add .modal-content {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.modal-add .modal-content section textarea {
 
  resize: none;
  height: 8rem;
  width: 24rem;
  overflow: hidden;
  overflow-y: scroll;
}
.add-text-input , .modal-add .modal-content section textarea {
  border-radius: 10px;
 border: 2px solid #4E6D16;
 padding: 0.5rem; 
}



.image-input-drag-n-drop-container {
  padding: 2rem;
  max-width: 28rem;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: 3px dashed #4E6D16;
  color: #4E6D16;
  border-radius: 10px;
  margin: 1rem;
  transition: background-color 0.3s ease;
  position: relative;
}


.image-input-drag-n-drop-container.dragover {
  background-color: rgba(78, 109, 22, 0.1);
}

.image-input-drag-n-drop-container input {
  display: none;
}

.image-input-drag-n-drop-container img {
  aspect-ratio: 1;
  height: 8rem;
}

.browse-btn {
  cursor: pointer;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  background-color: #4E6D16;
  color: white;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  background-color: #6F8C28;
}

.image-preview {
  position: relative;
  height: fit-content;
  width: fit-content;
}

.preview-image {

  height: fit-content;
  width: fit-content;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  outline: 2px white solid;

  color: white;
  border: none;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: 0.3s ease;
}

.remove-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

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

.modal-add {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  min-width: 400px;
  width: 60%;

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
