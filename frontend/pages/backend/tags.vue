<template>
    <div style="height: 5rem;"></div>

    <div class="table-head-text-container">
        <h1>จัดการแท็ก</h1>
        <p>มีแท็กทั้งหมด {{ tags.length }}</p>
    </div>

    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาชื่อ Tags"/>
        <div class="coconut-check-publish">
            <button class="published-coconut-btn" @click="refresh">รีเฟรช</button>
        </div>
    </div>

    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th>
                        <div class="checkbox-id-container">
                            <span>ID</span>
                            <button @click="toggleSort('id')">
                                <div :class="{ 'rotate': sortBy === 'id' && sortDir === -1 }">▲</div>
                            </button>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Tag Name
                                <button @click="toggleSort('text')">
                                    <div :class="{ 'rotate': sortBy === 'text' && sortDir === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Experts Using</div>
                        </div>
                    </th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody v-if="filteredSorted.length">
                <tr v-for="t in filteredSorted" :key="t.id" @click="openModal(t)" style="cursor:pointer">
                    <td>
                        <div class="checkbox-id-container">
                            <p>{{ t.id }}</p>
                        </div>
                    </td>
                    <td>{{ t.text }}</td>
                    <td style="text-align:center">{{ t.expert_count }}</td>
                    <td class="action-buttons" @click.stop>
                        <button @click="openModal(t)" class="edit-btn"><img src="/icon/pen.png" alt="Edit"></button>
                    </td>
                </tr>
            </tbody>

            <tbody v-else>
                <tr>
                    <td colspan="4" style="text-align:center;padding:1rem;">ไม่พบข้อมูล</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal: Edit Tag -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-add">
            <h2>แก้ไขแท็ก</h2>
            <div class="divider"></div>
            <div style="height: 1rem;"></div>
            <div class="mod-sl" style=" display: flex ; flex-direction: column;">


                <label>Tag Name</label>
                <input class="add-text-input" v-model.trim="editText" placeholder="เช่น: coconut, pest, exporter..." />
                <div style="height: 1rem;"></div>
                <div style="display:flex; gap:.5rem; justify-content:flex-end">
                    <button class="confirm-btn" @click="saveName">บันทึกชื่อ</button>
                    <button class="cancel-btn" @click="closeModal">ปิด</button>
                </div>
            </div>

            <div class="divider" style="margin:1rem 0;"></div>

            <h3 style="margin:.5rem 0;">รายชื่อผู้เชี่ยวชาญที่ใช้แท็กนี้ ({{ experts.length }})</h3>

            <div class="expert-list">
                <div v-if="loadingExperts" style="padding:.75rem;">กำลังโหลด...</div>
                <div v-else-if="!experts.length" style="padding:.75rem;">ไม่มีใครใช้แท็กนี้</div>

                <ul v-else class="expert-ul">
                    <li v-for="ex in experts" :key="ex.id" class="expert-li">
                        <div class="ex-left">
                            <img :src="ex.image || '/img/no-image-handle.png'" alt="" class="ex-avatar" />
                            <div class="ex-names">
                                <strong>{{ ex.name_th || ex.name_en || ('Expert #' + ex.id) }}</strong>
                                <small v-if="ex.org">{{ ex.org }}</small>
                                <small v-if="ex.email">{{ ex.email }}</small>
                            </div>
                        </div>
                        <button class="cancel-btn" @click="detach(ex.id)">ลบออก</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div style="height: 5rem;"></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' });

import { ref, computed, onMounted, watch } from 'vue';
import { useTags } from '~/composables/useTags';

const { getTags, renameTag, getExpertsByTagId, detachTagFromExpert } = useTags();

const tags = ref([]);
const searchQuery = ref('');
const sortBy = ref(null);
const sortDir = ref(1);

const showModal = ref(false);
const current = ref(null);
const editText = ref('');
const experts = ref([]);
const loadingExperts = ref(false);

const refresh = async () => {
    const data = await getTags(searchQuery.value);
    tags.value = data;
};

const toggleSort = (col) => {
    if (sortBy.value === col) sortDir.value *= -1;
    else { sortBy.value = col; sortDir.value = col === 'id' ? -1 : 1; }
};

const filteredSorted = computed(() => {
    const s = (searchQuery.value || '').toLowerCase();
    let list = tags.value.filter(t =>
        t.id.toString().includes(s) || (t.text || '').toLowerCase().includes(s)
    );
    if (sortBy.value) {
        list.sort((a, b) => {
            let A = a[sortBy.value], B = b[sortBy.value];
            if (sortBy.value === 'id') return (A - B) * sortDir.value;
            if (sortBy.value === 'text') return (A || '').localeCompare(B || '', 'th') * sortDir.value;
            return 0;
        });
    }
    return list;
});

const openModal = async (tag) => {
    current.value = { ...tag };
    editText.value = tag.text || '';
    showModal.value = true;
    await loadExperts();
};

const closeModal = () => {
    showModal.value = false;
    current.value = null;
    editText.value = '';
    experts.value = [];
};

const saveName = async () => {
    if (!current.value) return;
    if (!editText.value.trim()) return alert('กรุณากรอกชื่อแท็ก');
    try {
        const updated = await renameTag(current.value.id, editText.value.trim());
        // sync ในตาราง
        const idx = tags.value.findIndex(t => t.id === current.value.id);
        if (idx !== -1) tags.value[idx] = { ...tags.value[idx], ...updated };
        current.value.text = updated.text;
        alert('บันทึกสำเร็จ');
        closeModal();
    } catch (e) {
        alert(e.message || 'บันทึกไม่สำเร็จ');
    }
};

const loadExperts = async () => {
    if (!current.value) return;
    loadingExperts.value = true;
    try {
        const list = await getExpertsByTag(current.value.id);
        experts.value = list;
    } catch (e) {
        experts.value = [];
    } finally {
        loadingExperts.value = false;
    }
};

const detach = async (expertId) => {
    if (!current.value) return;
    if (!confirm('ลบแท็กนี้ออกจากผู้เชี่ยวชาญคนนี้?')) return;
    try {
        await detachTagFromExpert(expertId, current.value.id);
        experts.value = experts.value.filter(e => e.id !== expertId);
        // อัปเดตตัวเลขบนตาราง
        const idx = tags.value.findIndex(t => t.id === current.value.id);
        if (idx !== -1) tags.value[idx].expert_count = Math.max(0, (tags.value[idx].expert_count || 1) - 1);
    } catch (e) {
        alert(e.message || 'ลบไม่สำเร็จ');
    }
};

onMounted(refresh);
watch(searchQuery, () => refresh());
</script>

<style scoped>
/* ใช้สไตล์เดิมจากเพจที่อ้างอิงเพื่อความกลมกลืน */
.table-head-text-container {
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    width: 85%;
}

.add-btn-container {
    display: flex;
    justify-content: end;
    width: 90%;
    padding: 1rem;
    gap: 1rem;
}

.coconut-v-input {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem .75rem;
    border: 2px solid #4E6D16;
    border-radius: 10px;
    background: #fff;
}

.coconut-v-input input {
    all: unset;
    width: 100%;
}

.coconut-check-publish {
    display: flex;
    gap: 1.5rem;
}

.published-coconut-btn,
.cancel-btn,
.confirm-btn {
    padding: .5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.published-coconut-btn {
    background: #7eb9af;
    color: #fff;
    font-weight: 600;
}

.confirm-btn {
    background: #4E6D16;
    color: #fff;
}

.cancel-btn {
    background: #D84E5E;
    color: #fff;
}

.table-container {
    display: flex;
    justify-content: center;
}

.item-list-table {
    width: 90%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    table-layout: fixed;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
}

.item-list-table thead {
    background: #DADADA;
    color: #000;
}

.item-list-table th {
    padding: 15px 1rem;
    outline: 1px solid #000;
}

.item-list-table tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.item-list-table td {
    padding: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.checkbox-id-container {
    display: flex;
    justify-content:center;
    gap: .5rem;
    align-items: center;
    width: 100%;
}


.checkbox-id-container div button, .checkbox-id-container  button  {
   all: unset;
   cursor: pointer;
   
    
}

.rotate {
    transform: rotate(180deg);
}

.action-buttons button img {
    height: 1.5rem;
}

.action-buttons button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: .25rem;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.action-buttons {
    display: flex;
    gap: .5rem;
    justify-content: center;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .5);
}

.modal-add {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    max-height: 80dvh;
    width: min(900px, 92vw);
    overflow: auto;
}

.add-text-input {
    border-radius: 10px;
    border: 2px solid #4E6D16;
    padding: .5rem;
}

.expert-list {
    margin-top: .5rem;
}

.expert-ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: 0;
    margin: 0;
}

.expert-li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
}

.ex-left {
    display: flex;
    align-items: center;
    gap: .75rem;
}

.ex-avatar {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 8px;
}

.ex-names {
    display: flex;
    flex-direction: column;
}
</style>
