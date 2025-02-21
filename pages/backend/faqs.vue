<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>{{ config.title }}</h1>
        <p>มีคำถามทั้งหมด {{ dataCount }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" :placeholder="config.searchPlaceholder" />
        <div class="faq-check-publish">
            <button class="published-faq-btn" @click="bulkUpdateStatus(true)">All Checked Publish</button>
            <button class="unpublished-faq-btn" @click="bulkUpdateStatus(false)">All Checked Unpublish</button>
            <button class="add-faq-btn" @click="openAddFaqModal">ADD FAQ</button>
        </div>
    </div>
    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th v-for="col in config.columns" :key="col.key">{{ col.label }}</th>
                    <th>Question (English)</th>
                    <th>Answer (English)</th>
                    <th>Is Advice</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody v-if="apisdatas.length">
                <tr v-for="item in apisdatas" :key="item.id">
                    <td v-for="col in config.columns" :key="col.key">{{ item[col.key] }}</td>
                    <td>{{ item.question_en }}</td>
                    <td>{{ item.answer_en }}</td>
                    <td>{{ item.isadvice ? 'Yes' : 'No' }}</td>
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
                        <span>Is Advice</span>
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
import '@/assets/styles/be-faqs.css';
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

const fetchApi = async () => {
    try {
        const response = await fetch(`/api/${config.value.apiEndpoint}`);
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus ? 1 : 0 }),
        });
        if (!response.ok) throw new Error('Failed to update status.');
        faq.status = newStatus;
    } catch (error) {
        console.error('Error updating status:', error);
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
            headers: { 'Content-Type': 'application/json' },
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: publish ? 1 : 0 })
            })
        );

        await Promise.all(updatePromises);

        selectedFaqs.forEach(faq => {
            faq.status = publish ? 1 : 0;
        });

        alert(`Successfully ${publish ? 'published' : 'unpublished'} selected FAQs.`);
    } catch {
        alert('Failed to update FAQ status.');
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
            headers: { 'Content-Type': 'application/json' },
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
