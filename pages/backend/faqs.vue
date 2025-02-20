<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>{{ config.title }}</h1>
        <p>มีคำถามทั้งหมด {{ dataCount }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" :placeholder="config.searchPlaceholder" />
    </div>
    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th v-for="col in config.columns" :key="col.key">{{ col.label }}</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody v-if="apisdatas.length">
                <tr v-for="item in apisdatas" :key="item.id">
                    <td v-for="col in config.columns" :key="col.key">{{ item[col.key] }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="item.status" @change="toggleStatus(item)" />
                            <img class="eyesicon" :src="item.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
definePageMeta({ layout: "admin" });
import { ref, onMounted } from 'vue';
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

const fetchApi = async () => {
    try {
        const response = await fetch(`/api/${config.value.apiEndpoint}`);
        if (!response.ok) throw new Error('Failed to fetch Data.');
        const data = await response.json();
        apisdatas.value = Array.isArray(data.faqs) ? data.faqs.map(faq => ({ ...faq, selected: false })) : [];
        dataCount.value = apisdatas.value.length;
    } catch (error) {
        console.error('Error fetching data:', error);
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

onMounted(fetchApi);
</script>
