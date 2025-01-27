<template>
  <div style="height: 5rem;"></div>
  <div class="table-head-text-container">
    <h1>จัดการข่าว</h1>
    <p>จัดการข่าวทั้งหมด</p>
  </div>
  <div class="add-btn-container"><button class="add-news-btn">
      ADD News
    </button></div>
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
      <div class="text-alert-container"><span>ต้องการที่จะ
          <span style="color: red; font-size: larger; font-weight: bolder;">ลบ</span>
        </span>
        <p>" {{ deleteName }} "</p>
      </div>

      <div class="modal-actions">
        <button @click="confirmDelete" class="confirm-btn">Yes</button>
        <button @click="cancelDelete" class="cancel-btn">No</button>
      </div>
    </div>
  </div>

  <div v-if="showModalAddnews" class="modal-overlay">
    <div class="modal">
      <div class="text-alert-container"><span>ต้องการที่จะ
          <span style="color: red; font-size: larger; font-weight: bolder;">ลบ</span>
        </span>
        <p>" {{ deleteName }} "</p>
      </div>

      <div class="modal-actions">
        <button @click="confirmDelete" class="confirm-btn">Yes</button>
        <button @click="cancelDelete" class="cancel-btn">No</button>
      </div>
    </div>
  </div>
  <div style="height: 5rem;"></div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});
import { ref, onMounted } from 'vue';

const News = ref([]);
const showModalAddnews =ref(false);
const selectAll = ref(false);
const showModal = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);


const fetchNews = async () => {
  try {
    const response = await $fetch('/api/news_table');
    News.value = response.map((news) => ({
      ...news,
      selected: false,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};


const toggleSelectAll = () => {
  News.value.forEach((news) => {
    news.selected = selectAll.value;
  });
};


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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: deleteId.value }),
    });

    const result = await response.json();

    if (response.ok) {

      News.value = News.value.filter(news => news.id !== deleteId.value);
      console.log('News deleted successfully');
    } else {
      console.error('Failed to delete news:', result.error);
    }
  } catch (error) {
    console.error('Error deleting news:', error);
  } finally {
    showModal.value = false;
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
  margin-right: 10px;
}


.action-buttons {
  display: flex;
  gap: 12px;
}


.edit-btn,
.delete-btn {
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
}


.edit-btn {
  background-color: #27ae60;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #2ecc71;
  transform: scale(1.05);
}


.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c0392b;
  transform: scale(1.05);
}


.item-list-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.confirm-btn,
.cancel-btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-btn {
  background-color: #27ae60;
  color: white;
}

.confirm-btn:hover {
  background-color: #2ecc71;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}
</style>
