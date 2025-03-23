<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>{{ config.title }}</h1>
        <p>มีคำถามทั้งหมด {{ dataCount }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" :placeholder="config.searchPlaceholder" />
        <div class="faq-check-publish">
            <button class="published-news-btn" @click="bulkUpdateStatus(true)">All Checked Publish</button>
            <button class="unpublished-news-btn" @click="bulkUpdateStatus(false)">All Checked Unpublish</button>
            <button class="add-news-btn" @click="openAddFaqModal">ADD FAQ</button>
        </div>
    </div>
    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="checkbox-decorate" />
                            <span>ID</span>
                            <button @click="toggleSort('id')">
                                <div :class="{'rotate': sortBy === 'id' && sortDirection === -1}">▲</div>
                            </button>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Question<button @click="toggleSort('question')">
                                <div :class="{'rotate': sortBy === 'question' && sortDirection === -1}">▲</div>
                            </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Answer<button @click="toggleSort('answer')">
                                <div :class="{'rotate': sortBy === 'answer' && sortDirection === -1}">▲</div>
                            </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Category<button @click="toggleSort('isadvice')">
                                <div :class="{'rotate': sortBy === 'isadvice' && sortDirection === -1}">▲</div>
                            </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Status<button @click="toggleSort('status')">
                                <div :class="{'rotate': sortBy === 'status' && sortDirection === -1}">▲</div>
                            </button></div>
                        </div>
                    </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody v-if="filteredSortedFaqs.length">
                <tr v-for="item in filteredSortedFaqs" :key="item.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="item.selected" class="checkbox-decorate" />
                            <p>{{ item.id }}</p>
                        </div>
                    </td>
                    <td>{{ item.question }}</td>
                    <td>{{ item.answer }}</td>
                    <td>{{ item.isadvice ? 'คำแนะนำ' : 'คำถามทั่วไป' }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="item.status" @change="toggleStatus(item)" />
                            <img class="eyesicon" :src="item.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <button @click="editItem(item)" class="edit-btn"><img src="@/assets/icon/pen.png" alt="Edit"></button>
                        <button @click="askDelete(item.id, item.question)" class="delete-btn"><img src="@/assets/icon/trash.png" alt="Delete"></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="showModalAddFaq || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขคำถาม' : 'เพิ่มคำถาม' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>คำถาม</label>
                    <input class="add-text-input" v-model="currentFaq.question" placeholder="Enter question" required />
                    <label>คำตอบ</label>
                    <textarea class="add-text-input" v-model="currentFaq.answer" placeholder="Enter answer" required></textarea>
                    <label>Question (English)</label>
                    <input class="add-text-input" v-model="currentFaq.question_en" placeholder="Enter question in English" />
                    <label>Answer (English)</label>
                    <textarea class="add-text-input" v-model="currentFaq.answer_en" placeholder="Enter answer in English"></textarea>
                    <label class="advice-toggle">
                        <input type="checkbox" v-model="currentFaq.isadvice" />
                        <span>Category (คำแนะนำ / คำถามทั่วไป)</span>
                    </label>
                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirm-btn" @click.prevent="submitFaq(true)">{{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}</button>
                <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </form>
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
</template>

<script setup>
definePageMeta({ layout: "admin" });
import { ref, onMounted, computed } from 'vue';
import '@/assets/styles/backend_style.css'; // Import shared CSS
import eye from '@/assets/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '@/assets/icon/eye-slash-alt-svgrepo-com.svg';

const config = ref({
    title: "จัดการคำถามที่พบบ่อย",
    apiEndpoint: 'faqs',
    searchPlaceholder: "ค้นหาด้วย id, ชื่อ, ผู้เขียน หรือ วันที่",
    columns: [
        { key: 'id', label: 'ID' },
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' }
    ]
});

const searchQuery = ref('');
const apisdatas = ref([]);
const dataCount = ref(0);
const showModalAddFaq = ref(false);
const showModalEdit = ref(false);
const showModal = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const currentFaq = ref({
    id: null,
    question: '',
    answer: '',
    question_en: '',
    answer_en: '',
    status: false,
    isadvice: false,
});

const selectAll = ref(false);
const sortBy = ref(null);
const sortDirection = ref(1);

const toggleSelectAll = () => {
    apisdatas.value.forEach(faq => faq.selected = selectAll.value);
};

const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortDirection.value *= -1;
    } else {
        sortBy.value = column;
        sortDirection.value = column === 'status' || column === 'isadvice' ? -1 : 1;
    }
};

const filteredSortedFaqs = computed(() => {
    let filtered = apisdatas.value.filter(faq =>
        faq.id.toString().includes(searchQuery.value) ||
        faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    if (sortBy.value) {
        filtered.sort((a, b) => {
            let valA = a[sortBy.value];
            let valB = b[sortBy.value];

            if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
            if (sortBy.value === 'question' || sortBy.value === 'answer') return valA.localeCompare(valB, 'th') * sortDirection.value;
            if (sortBy.value === 'status' || sortBy.value === 'isadvice') return (valB - valA) * sortDirection.value;
            return 0;
        });
    }
    return filtered;
});

const fetchApi = async () => {
    try {
        const response = await fetch(`/api/${config.value.apiEndpoint}`,{headers: { 'CKH': '541986Cocon' },});
        if (!response.ok) throw new Error(`Failed to fetch Data: ${response.statusText}`);
        const data = await response.json();
        apisdatas.value = Array.isArray(data.faqs) ? data.faqs.map(faq => ({ ...faq, selected: false })) : [];
        dataCount.value = apisdatas.value.length;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        apisdatas.value = [];
        dataCount.value = 0;
    }
};


const toggleStatus = async (faq) => {
    try {
        const newStatus = !faq.status;
        const response = await fetch(`/api/${config.value.apiEndpoint}/${faq.id}`, {
            method: 'PUT',
            headers: { 'CKH': '541986Cocon' },
            body: JSON.stringify({ ...faq, status: newStatus ? 1 : 0 }),
        });

        if (!response.ok) {
            throw new Error('Failed to update FAQ status.');
        }

        faq.status = newStatus;
    } catch (error) {
        alert('Error updating FAQ status.');
        console.error(error);
    }
};

const openAddFaqModal = () => {
    currentFaq.value = {
        id: null,
        question: '',
        answer: '',
        question_en: '',
        answer_en: '',
        status: false,
        isadvice: false,
    };
    showModalAddFaq.value = true;
};

const editItem = (faq) => {
    currentFaq.value = { ...faq };
    showModalEdit.value = true;
};

const submitFaq = async (publish) => {
    if (!currentFaq.value.question.trim() || !currentFaq.value.answer.trim()) {
        alert('Please fill in all required fields: Question and Answer.');
        return;
    }

    try {
        const isUpdate = !!currentFaq.value.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `/api/faqs/${currentFaq.value.id}` : '/api/faqs';

        // Prepare payload
        const payload = {
            question: currentFaq.value.question,
            answer: currentFaq.value.answer,
            question_en: currentFaq.value.question_en,
            answer_en: currentFaq.value.answer_en,
            status: publish ? 1 : 0,
            isadvice: currentFaq.value.isadvice ? 1 : 0,
        };

        const response = await fetch(url, {
            method,
            headers: {'CKH': '541986Cocon' , 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error saving the FAQ.');
        }

        if (!isUpdate) {
            currentFaq.value.id = result.id;
            alert('FAQ added successfully.');
        } else {
            alert('FAQ updated successfully.');
        }

        showModalAddFaq.value = false;
        showModalEdit.value = false;
        fetchApi();

    } catch (error) {
        alert(`Error while submitting FAQ: ${error.message}`);
        console.error(error);
    }
};


const bulkUpdateStatus = async (publish) => {
    try {
        const selectedFaqs = apisdatas.value.filter(faq => faq.selected);
        if (selectedFaqs.length === 0) {
            alert('No FAQs selected.');
            return;
        }

        const updatePromises = selectedFaqs.map(faq =>
            fetch(`/api/faqs/${faq.id}`, {
                method: 'PUT',
                headers: { 'CKH': '541986Cocon' },
                body: JSON.stringify({ ...faq, status: publish ? 1 : 0 })
            })
        );

        await Promise.all(updatePromises);

        selectedFaqs.forEach(faq => {
            faq.status = publish ? 1 : 0;
        });

        alert(`Successfully ${publish ? 'published' : 'unpublished'} selected FAQs.`);
    } catch (error) {
        alert('Failed to update FAQ status.');
        console.error(error);
    }
};

const askDelete = (id, question) => {
    deleteId.value = id;
    deleteName.value = question;
    showModal.value = true;
};

const confirmDelete = async () => {
    try {
        const response = await fetch(`/api/faqs/${deleteId.value}`, {
            method: 'DELETE',
            headers: { 'CKH': '541986Cocon' },
            body: JSON.stringify({ id: deleteId.value }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete FAQ.');
        }

        apisdatas.value = apisdatas.value.filter(faq => faq.id !== deleteId.value);
        dataCount.value = apisdatas.value.length;

        showModal.value = false;
        alert('FAQ deleted successfully.');
    } catch (error) {
        alert(`Error deleting FAQ: ${error.message}`);
        console.error(error);
    } finally {
        deleteId.value = null;
    }
};

const cancelDelete = () => {
    showModal.value = false;
};

const closeModal = () => {
    showModalAddFaq.value = false;
    showModalEdit.value = false;
};

onMounted(fetchApi);
</script>

<style scoped>

.published-news-btn {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #7eb9af solid 3px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition: ease-out 0.2s;
    color: white;
    background-color: #7eb9af;
    font-weight: 600;
}

.published-news-btn:hover {
    color: white;
    background-color: #599c91;
}

.published-news-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.unpublished-news-btn {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #7eb9af solid 2px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition: ease-out 0.2s;
    color: #7eb9af;
    font-weight: 600;
}

.unpublished-news-btn:hover {
    color: white;
    background-color: #569187;
}

.unpublished-news-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.add-news-btn {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #4E6D16 solid 3px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition: ease-out 0.2s;
    color: white;
    background-color: #4E6D16;
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

.checkbox-decorate {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    accent-color: #4E6D16;
}
.status-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}
.rotate {
    transform: rotate(180deg);
}
.status-toggle input {
    display: none;
}

.eyesicon {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
}

.eyesicon:hover {
    opacity: 0.7;
}

.icon-center {
    display: flex;
    justify-content: center;
}

.modal-actions {
    margin-top: 1.5rem;
    gap: 1rem;
    display: flex;
    justify-self: center;
    width: auto;
    justify-content: space-evenly;
}

.admin-content {
    display: flex;
    height: 100dvh;
}

.admin-content-l {
    display: flex;
}

.admin-content-r {
    margin-left: 250px; /* This ensures content is pushed to the right */
}

.checkbox-id-container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
}
.checkbox-id-container div {
    display: flex;
    gap: 0.5rem;
}

.checkbox-id-container button div {
    transition: ease-in-out 0.3s;
}

.checkbox-id-container button {
    all: unset;
    cursor: pointer;
}

.item-list-table th:nth-child(1),
.item-list-table td:nth-child(1) {
    display: table-cell;
    width: 5%;
}

.item-list-table th:nth-child(2),
.item-list-table td:nth-child(2) {
    width: 15%;
}

.item-list-table th:nth-child(3),
.item-list-table td:nth-child(3) {
    width: 15%;
}

.item-list-table th:nth-child(4),
.item-list-table td:nth-child(4) {
    width: 8%;
    text-align: center;
}

.item-list-table th:nth-child(5),
.item-list-table td:nth-child(5) {
    width: 5%;
}

.item-list-table th:nth-child(6),
.item-list-table td:nth-child(6) {
    width: 8%;
}

.item-list-table th:nth-child(7),
.item-list-table td:nth-child(7) {
    display: table-cell;
    width: 10%;
}
.action-btn-container {
    display: flex;
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

.modal-add .modal-content section:nth-child(1) {
    width: 40%;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
}

.modal-add .modal-content section:nth-child(2) {
    gap: 0.5rem;
    display: flex;
    width: 60%;
    flex-direction: column;
}

.modal-add .modal-content {
    display: flex;
    flex-direction: row;
    gap: 0rem 2rem;
}

.modal-add .modal-content section textarea {
    resize: none;
    height: 8rem;
    width: auto;
    overflow: hidden;
    overflow-y: scroll;
}

.add-text-input,
.modal-add .modal-content section textarea {
    border-radius: 10px;
    border: 2px solid #4E6D16;
    padding: 0.5rem;
}

.date-input {
    border-radius: 10px;
    border: 2px solid #4E6D16;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
}

.category-select {
    border-radius: 10px;
    border: 2px solid #4E6D16;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    color: #4E6D16;
    font-weight: bold;
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
.coconut-check-publish {
    display: flex;
    gap: 1.5rem;
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

.item-list-table thead,
.item-list-table tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

.item-list-table tbody {
    max-height: 70dvh;
    overflow-y: auto;
    display: block;
}
.item-list-table tbody tr td p {
    width: 2rem;
    text-align: center;
}
.add-btn-container div {
    display: flex;
    gap: 0.5rem;
}
.add-btn-container {
    display: flex;
    justify-content: end;
    justify-self: center;
    width: 90%;
    padding: 1rem;
    gap: 1rem;
}
.published-coconut-btn {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #7eb9af solid 3px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition: ease-out 0.2s;
    color: white;
    background-color: #7eb9af;
    font-weight: 600;
}

.published-coconut-btn:hover {
    color: white;
    background-color: #599c91;
}

.published-coconut-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}
.unpublished-coconut-btn {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #7eb9af solid 2px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition: ease-out 0.2s;
    color: #7eb9af;
    font-weight: 600;
}

.unpublished-coconut-btn:hover {
    color: white;
    background-color: #569187;
}

.unpublished-coconut-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.add-coconut-btn {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #4E6D16 solid 3px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition: ease-out 0.2s;
    color: white;
    background-color: #4E6D16;
    font-weight: 600;
}

.add-coconut-btn:hover {
    color: white;
    background-color: #4E6D16;
}

.add-coconut-btn:active {
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
    table-layout: fixed;
}

.item-list-table thead {
    background-color: #DADADA;
    color: black;
}

.item-list-table th {
    padding: 15px 1rem;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 1px;
    outline: solid black 1px;
}

.item-list-table tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.item-list-table td {
    padding: 12px;
    text-align: left;
    color: #555;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.items-id {
    display: flex;
    align-items: center;
    gap: 10px;
}

.items-id input {
    margin: 0;
}

.edit-btn img,
.delete-btn img {
    height: 1.5rem;
}

.edit-btn,
.delete-btn {
    all: unset;
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin: 0.2rem;
    transition: 0.3s ease-in-out;
}

.edit-btn {
    transition: 0.3s ease-in-out;
    background-color: transparent;
    color: white;
}

.delete-btn {
    transition: 0.3s ease-in-out;
    background-color: transparent;
    color: white;
}

.edit-btn:hover img {
    transform: scale(1.2);
}

.delete-btn:hover img {
    transform: scale(1.2);
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
    overflow-y: scroll;
    max-height: 80dvh;
    width: clamp(300px, 60%, 60%);
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    max-width: 400px;
    width: 100%;
}

.confirme-btn,
.confirm-btn,
.cancel-btn {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition: 0.2s;
}
.confirme-btn {
    background-color: transparent;
    outline: #4E6D16 3px solid;
    color: #4E6D16;
}

.confirme-btn:active {
    background-color: rgba(0, 0, 0, 0.2);
    outline: #4E6D16 3px solid;
    color: #4E6D16;
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

.hotnews-toggle-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Label Styles */
.hotnews-toggle-label {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

/* Switch Container */
.hotnews-switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
}

/* Hide default checkbox */
.hotnews-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* Toggle Background */
.hotnews-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
}

/* Circle inside Toggle */
.hotnews-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

/* Checked State */
input:checked+.hotnews-slider {
    background-color: #4E6D16;
}

input:checked+.hotnews-slider:before {
    transform: translateX(18px);
}

@media screen and (max-width: 1750px) {
    .item-list-table th:nth-child(3),
    .item-list-table td:nth-child(3) {
        display: none;
    }
}

@media screen and (max-width: 1440px) {
    .item-list-table th:nth-child(2),
    .item-list-table td:nth-child(2) {
        width: 10%;
    }
}

@media screen and (max-width: 1052px) {
    .add-btn-container {
        flex-direction: column;
    }
    .modal-add .modal-content {
        display: flex;
        flex-direction: column;
    }

    .modal-add .modal-content section:nth-child(1) {
        width: 100%;
    }

    .modal-add .modal-content section:nth-child(2) {
        width: 100%;
    }
}

@media screen and (max-width: 865px) {
    .item-list-table th:nth-child(4),
    .item-list-table td:nth-child(4) {
        display: none;
    }
}
</style>