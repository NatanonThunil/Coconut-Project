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
                    <td
                        :style="[!news.hot_new ? 'font-size:1.2rem; font-weight: 700; color: red;' : 'font-size:1.2rem; font-weight: 700; color: green;  ', 'text-align: center,']">
                        {{ news.hot_new ? "✓" : "✕" }}</td>
                    <td
                        :style="(news.status == 0) ? 'font-size:1.2rem; font-weight: 700; color: #ffce54; text-shadow: 1px 1px 2px black;' : 'font-size:1.2rem; font-weight: 700; color: #DFF169; text-shadow: 1px 1px 2px black;'">
                        {{ (news.status == 0) ? 'Pending' : 'Published' }}</td>
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
        <form class="modal-add" >
            <h2>{{ showModalEdit ? 'แก้ไขข่าว' : 'เพิ่มข่าว' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>พาดหัวข่าว</label>
                    <input class="add-text-input" v-model="currentNews.title" placeholder="Enter title" required />
                    <label>ชื่อผู้เขียน</label>
                    <input class="add-text-input" v-model="currentNews.author" placeholder="Enter author name"
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
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
                        </div>
                    </div>
                </section>
                <section>
                    <label>เป็นข่าวใหญ่</label>
                    <input v-model="currentNews.hot_new" type="checkbox" />
                    <label>Description</label>
                    <textarea v-model="currentNews.description" placeholder="Enter description"></textarea>
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
    <div style="height: 5rem;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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
            image: currentNews.value.image || null,
            hot_new: currentNews.value.hot_new ? 1 : 0,
            summerize: currentNews.value.summerize,
            status: publish ? 1 : 0,
        };

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`${method === 'POST' ? 'Adding' : 'Updating'} news failed.`);
        }

        const data = await response.json();

        if (isUpdate) {
            
            const index = News.value.findIndex((news) => news.id === currentNews.value.id);
            if (index !== -1) {
                News.value[index] = { ...payload, id: currentNews.value.id };
            }
        } else {
         
            News.value.push({ ...payload, id: data.id });
            NewsNum.value = News.value.length;
        }

        closeModal();
        alert(`${isUpdate ? 'News updated' : 'News added'} successfully!`);
    } catch (error) {
        alert('An error occurred while saving the news. Please try again.');
    }
};


const closeModal = () => {
    showModalAddnews.value = false;
    showModalEdit.value = false;
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
    if (!file || !file.type.startsWith('image/')) {
        alert('Please upload an image file (JPEG/PNG)');
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        currentNews.value.image = reader.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    currentNews.value.image = '';
};

const toggleSelectAll = () => {
    News.value.forEach(news => news.selected = selectAll.value);
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deleteId.value }),
        });

        if (response.ok) {
            News.value = News.value.filter(news => news.id !== deleteId.value);
            NewsNum.value = News.value.length;
            showModal.value = false;
        }
    } finally {
        deleteId.value = null;
    }
};

onMounted(fetchNews);
</script>

<style scoped>
.modal-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-self: center;
    width: 40%;
    justify-content: space-evenly;
}

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

.add-text-input,
.modal-add .modal-content section textarea {
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
    gap: 1.5rem;
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