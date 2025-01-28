<template>
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


            <div v-if="newNews.image" class="image-preview">
              <img :src="newNews.image" alt="Uploaded Image" class="preview-image" />
              <button class="remove-btn" @click="removeImage">X</button>
            </div>


            <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload" class="file-uploader"
              ref="fileInput" />


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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const isDragging = ref(false);
const showModalAddnews = ref(true);
const removeImage = () => {
  newNews.value.image = '';
};
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  processFile(file);
};
const handleDragDrop = (event) => {
  const file = event.dataTransfer.files[0];
  processFile(file);
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
const triggerFileInput = () => {
  fileInput.value.click();
};
const newNews = ref({
  title: '',
  image: '',
  author: '',
  upload_date: new Date().toISOString().split('T')[0],
  description: '',
  summerize: '',
  hot_new: false
});


</script>