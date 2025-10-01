<template>
    <div style="height: 5rem;"></div>

    <div class="table-head-text-container">
        <h1>จัดการแท็ก</h1>
        <p>มีแท็กทั้งหมด {{ tags.length }}</p>
    </div>

    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาชื่อ Tags" />

        <!-- ปุ่มเครื่องมือ: ใช้ modal เดียวทั้งสร้าง/แก้ไข + ลบที่เลือก -->
        <div class="toolbar">
            <button class="delete-checked-btn" :disabled="!selectedCount" @click="deleteSelected"
                title="ลบแท็กทั้งหมดที่เลือก">
                ลบแท็กทั้งหมดที่เลือก ({{ selectedCount }})
            </button>
            <button class="create-btn" @click="openCreateModal">เพิ่มแท็ก</button>

        </div>
    </div>

    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th>
                        <div class="checkbox-id-container">
                            <input type="checkbox" class="row-checkbox" :checked="allVisibleChecked"
                                :indeterminate="indeterminate" @change="toggleSelectAllVisible" @click.stop />
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
                <tr v-for="t in filteredSorted" :key="t.id" @click="openEditModal(t)" style="cursor:pointer">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" class="row-checkbox" v-model="t.selected" @click.stop />
                            <p>{{ t.id }}</p>
                        </div>
                    </td>
                    <td  style="text-align:center">{{ t.text }}</td>
                    <td style="text-align:center">{{ t.expert_count ?? 0 }}</td>
                    <td class="action-buttons" @click.stop>
                        <button @click="openEditModal(t)" class="edit-btn">
                            <img src="/icon/pen.png" alt="Edit" />
                        </button>
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

    <!-- Modal: Create/Edit Tag (ตัวเดียว) -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-add">
            <div class="modal-top">
                <h2>{{ current?.id ? 'แก้ไขแท็ก' : 'สร้างแท็ก' }}</h2>

            </div>
            <div class="divider"></div>
            <div style="height: 1rem;"></div>

            <div class="mod-sl" style="display:flex; flex-direction:column;">
                <label>Tag Name</label>
                <input class="add-text-input" v-model.trim="editText" placeholder="เช่น: coconut, pest, exporter..." />
                <div style="height: 1rem;"></div>

                <div style="display:flex; gap:.5rem; justify-content:flex-end; flex-wrap: wrap;">
                    <!-- ปุ่มลบทั้งแท็ก แสดงเฉพาะตอนแก้ไข (มี id แล้ว) -->
                    <button v-if="current?.id" class="danger-btn" @click="removeTag">ลบแท็กนี้</button>
                    <!-- ปุ่มบันทึก/สร้าง -->

                </div>
            </div>

            <div class="divider" style="margin:1rem 0;"></div>

            <!-- ส่วนเพิ่ม/จัดการ Expert: แสดงก็ต่อเมื่อแท็กถูกสร้างแล้ว (มี id) -->
            <template v-if="current?.id">
                <h3 style="margin:.5rem 0;">เพิ่มผู้เชี่ยวชาญเข้าแท็กนี้</h3>
                <div style="display:flex; gap:.5rem; align-items:center; margin-bottom:.5rem; flex-wrap: wrap;">
                    <input class="add-text-input" v-model.trim="expertSearch"
                        placeholder="พิมพ์ชื่อ/อีเมล/องค์กร เพื่อค้นหา..." style="min-width:280px;" />
                    <span v-if="searching" style="font-size:.9rem;">กำลังค้นหา...</span>
                </div>

                <div v-if="expertResults.length" class="expert-search-results">
                    <ul class="expert-ul">
                        <li v-for="r in expertResults" :key="r.id" class="expert-li">
                            <div class="ex-left">
                                <img :src="r.image || '/img/no-image-handle.png'" alt="" class="ex-avatar" />
                                <div class="ex-names">
                                    <strong>{{ r.display_name || ('Expert #' + r.id) }}</strong>

                                    <small v-if="r.email">{{ r.email }}</small>
                                </div>
                            </div>
                            <button class="confirm-btn" :disabled="existingIdsSet.has(r.id) || addingIds.has(r.id)"
                                @click="attach(r)">
                                {{ existingIdsSet.has(r.id) ? 'เพิ่มแล้ว' : (addingIds.has(r.id) ? 'กำลังเพิ่ม...' :
                                    'เพิ่ม') }}
                            </button>
                        </li>
                    </ul>
                </div>
                <div v-else-if="expertSearch && !searching" style="padding:.5rem 0;">ไม่พบผลลัพธ์</div>

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
                                    <strong>{{ ex.displayName || ('Expert #' + ex.id) }}</strong>

                                    <small v-if="ex.email">{{ ex.email }}</small>
                                </div>
                            </div>
                            <button class="cancel-btn" @click="detach(ex.id)">ลบออก</button>
                        </li>
                    </ul>
                </div>
                <div class="tag-submit-container"><button class="confirm-btn" @click="saveTag">
                        {{ current?.id ? 'บันทึก' : 'สร้างแท็ก' }}
                    </button> <button class="cancel-btn" @click="closeModal">ปิด</button></div>
            </template>

            <!-- คำแนะนำตอนโหมดสร้าง (ยังไม่มี id) -->
            <template v-else>
                <div style="padding:.75rem; color:#666;">
                    บันทึกชื่อเพื่อ<strong>สร้างแท็ก</strong>ก่อน จากนั้นจะสามารถเพิ่มผู้เชี่ยวชาญเข้าแท็กนี้ได้
                </div>
                <div class="tag-submit-container"><button class="confirm-btn" @click="saveTag">
                        {{ current?.id ? 'บันทึก' : 'สร้างแท็ก' }}
                    </button> <button class="cancel-btn" @click="closeModal">ปิด</button></div>
            </template>
        </div>
    </div>

    <div style="height: 5rem;"></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' });

import { ref, computed, onMounted, watch } from 'vue';
import { useTags } from '~/composables/useTags';

const {
    getTags,
    createTag,           // ใช้สร้าง
    renameTag,           // ใช้อัปเดตชื่อ
    getExpertsByTagId,
    detachTagFromExpert,
    attachTagToExpert,
    deleteTag,
    searchExperts
} = useTags();

const tags = ref([]);
const searchQuery = ref('');
const sortBy = ref(null);
const sortDir = ref(1);

// โมดัล (ตัวเดียวทั้งสร้าง/แก้ไข)
const showModal = ref(false);
const current = ref(null); // null หรือ { id, text, ... }
const editText = ref('');

// รายชื่อผู้เชี่ยวชาญของแท็ก
const experts = ref([]);
const loadingExperts = ref(false);

// ค้นหา expert
const expertSearch = ref('');
const expertResults = ref([]);
const searching = ref(false);
const addingIds = ref(new Set());

// โหลดแท็กทั้งหมด (เติม selected=false)
const loadAll = async () => {
    const data = await getTags(searchQuery.value);
    tags.value = (data || []).map(t => ({ ...t, selected: false }));
};

const filteredSorted = computed(() => {
    const s = (searchQuery.value || '').toLowerCase();
    let list = (tags.value || []).filter(t =>
        t.id?.toString().includes(s) || (t.text || '').toLowerCase().includes(s)
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

// นับที่เลือก
const selectedCount = computed(() => (tags.value || []).filter(t => t.selected).length);

// select-all เฉพาะแถวที่มองเห็น
const allVisibleChecked = computed(() => {
    const vis = filteredSorted.value;
    if (!vis.length) return false;
    return vis.every(t => !!t.selected);
});
const indeterminate = computed(() => {
    const vis = filteredSorted.value;
    if (!vis.length) return false;
    const any = vis.some(t => !!t.selected);
    return any && !allVisibleChecked.value;
});
const toggleSelectAllVisible = () => {
    const target = !allVisibleChecked.value;
    filteredSorted.value.forEach(t => { t.selected = target; });
};

const toggleSort = (col) => {
    if (sortBy.value === col) sortDir.value *= -1;
    else { sortBy.value = col; sortDir.value = col === 'id' ? -1 : 1; }
};

// ===== Modal control =====
const openCreateModal = () => {
    current.value = { id: null, text: '' };
    editText.value = '';
    experts.value = [];
    expertSearch.value = '';
    expertResults.value = [];
    addingIds.value = new Set();
    showModal.value = true;
};

const openEditModal = async (tag) => {
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
    expertSearch.value = '';
    expertResults.value = [];
    addingIds.value = new Set();
};

// สร้าง/บันทึกชื่อในปุ่มเดียว
// เพิ่มตัวแปรไว้บนสุดใน <script setup>
const savingTag = ref(false);

// helper: หาแท็กด้วยชื่อ (ใช้ตอน fallback)
const findTagByName = async (name) => {
    const list = await getTags(name);
    return (list || []).find(t => (t.text || '').toLowerCase() === name.toLowerCase()) || null;
};

// แทนที่ฟังก์ชัน saveTag เดิมด้วยอันนี้
const saveTag = async () => {
    const name = (editText.value || '').trim();
    if (!name) return alert('กรุณากรอกชื่อแท็ก');
    if (savingTag.value) return;
    savingTag.value = true;

    try {
        // โหมด "สร้าง"
        if (!current.value?.id) {
            let created = null;

            try {
                created = await createTag(name); // ควรได้ { id, text }
            } catch (err) {
                // ถ้า backend ส่งว่าง/ไม่ใช่ JSON → ลองหาแท็กด้วยชื่อแทน (กัน error Unexpected end of JSON)
                const maybe = await findTagByName(name);
                if (maybe) created = maybe;
                else throw err; // ถ้าไม่เจอจริง ๆ ค่อยโยนต่อ
            }

            // กัน null/รูปแบบไม่ถูกต้องอีกชั้น
            if (!created || created.id == null) {
                // พยายามหาอีกรอบ
                const maybe = await findTagByName(name);
                if (!maybe) throw new Error('Create tag failed: no data returned');
                created = maybe;
            }

            // แทรก/อัปเดตในตาราง
            const i = tags.value.findIndex(t => t.id === created.id);
            if (i === -1) tags.value.unshift({ ...created, expert_count: 0, selected: false });
            else tags.value[i] = { ...tags.value[i], ...created };

            // สลับเป็นโหมดแก้ไข + โหลดรายชื่อผู้เชี่ยวชาญได้เลย
            current.value = { ...created };
            await loadExperts();
            // ไม่ alert เพื่อไม่กวน flow; จะให้เด้งก็เพิ่มได้
            return;
        }

        // โหมด "แก้ไขชื่อ"
        const updated = await renameTag(current.value.id, name);
        const idx = tags.value.findIndex(t => t.id === current.value.id);
        if (idx !== -1) tags.value[idx] = { ...tags.value[idx], ...updated };
        current.value.text = updated.text;
        alert('บันทึกสำเร็จ');
    } catch (e) {
        // แสดงข้อความที่อ่านง่ายขึ้น (กัน empty message)
        const msg = (e && e.message) ? e.message : 'ดำเนินการไม่สำเร็จ';
        alert(msg);
    } finally {
        savingTag.value = false;
    }
};


// โหลดรายชื่อ expert ของแท็กนี้
const loadExperts = async () => {
    if (!current.value?.id) return;
    loadingExperts.value = true;
    try {
        const list = await getExpertsByTagId(current.value.id);
        experts.value = (list || []).map(e => ({
            ...e,
            displayName:
                e.display_name ||
                e.name ||
                e.name_th ||
                e.name_en ||
                e.name_eng ||
                [e.first_name, e.last_name].filter(Boolean).join(' ') ||
                `Expert #${e.id}`,
        }));
    } catch {
        experts.value = [];
    } finally {
        loadingExperts.value = false;
    }
};

// set ของ id ที่มีในแท็กนี้แล้ว
const existingIdsSet = computed(() => new Set(experts.value.map(e => e.id)));

// ค้นหา expert แบบ debounce
let searchTimer = null;
watch(expertSearch, (q) => {
    if (!showModal.value || !current.value?.id) return; // ต้องสร้างแท็กก่อนถึงค้นหา/เพิ่มได้
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
        const s = (q || '').trim();
        if (!s) { expertResults.value = []; return; }
        try {
            searching.value = true;
            const rows = await searchExperts(s);
            expertResults.value = (rows || []).map(r => ({
                ...r,
                display_name: r.display_name || r.name || r.name_en || r.name_eng
            })).filter(r => !existingIdsSet.value.has(r.id));
        } finally {
            searching.value = false;
        }
    }, 300);
});

// เพิ่ม expert เข้าแท็ก
const attach = async (row) => {
    if (!current.value?.id) return;
    if (existingIdsSet.value.has(row.id)) return;
    try {
        addingIds.value.add(row.id);
        await attachTagToExpert(row.id, current.value.id);
        await loadExperts();
        const idx = tags.value.findIndex(t => t.id === current.value.id);
        if (idx !== -1) tags.value[idx].expert_count = (tags.value[idx].expert_count || 0) + 1;
    } catch (e) {
        alert(e?.message || 'เพิ่มไม่สำเร็จ');
    } finally {
        addingIds.value.delete(row.id);
        expertResults.value = expertResults.value.filter(r => r.id !== row.id);
    }
};

// ถอดแท็กออกจาก expert
const detach = async (expertId) => {
    if (!current.value?.id) return;
    if (!confirm('ลบแท็กนี้ออกจากผู้เชี่ยวชาญคนนี้?')) return;
    try {
        await detachTagFromExpert(expertId, current.value.id);
        experts.value = experts.value.filter(e => e.id !== expertId);
        const idx = tags.value.findIndex(t => t.id === current.value.id);
        if (idx !== -1) {
            tags.value[idx].expert_count = Math.max(0, (tags.value[idx].expert_count || 1) - 1);
        }
    } catch (e) {
        alert(e?.message || 'ลบไม่สำเร็จ');
    }
};

// ลบแท็กทั้งก้อน (ปุ่มในโมดัล)
const removeTag = async () => {
    if (!current.value?.id) return;
    if (!confirm(`ต้องการลบแท็ก "${current.value.text}" ทั้งหมดหรือไม่?`)) return;
    try {
        await deleteTag(current.value.id);
        tags.value = tags.value.filter(t => t.id !== current.value.id);
        closeModal();
        alert('ลบแท็กสำเร็จ');
    } catch (e) {
        alert(e?.message || 'ลบไม่สำเร็จ');
    }
};

// ลบแท็กที่เลือกทั้งหมด (ปุ่มบน toolbar)
const deleteSelected = async () => {
    const selected = (tags.value || []).filter(t => t.selected);
    if (!selected.length) return;
    if (!confirm(`ต้องการลบแท็กที่เลือกทั้งหมด ${selected.length} รายการหรือไม่?`)) return;
    try {
        const results = await Promise.allSettled(selected.map(t => deleteTag(t.id)));
        const okIds = new Set(
            results.map((r, i) => (r.status === 'fulfilled' ? selected[i].id : null)).filter(Boolean)
        );
        tags.value = tags.value.filter(t => !okIds.has(t.id));
        const failed = results.filter(r => r.status === 'rejected').length;
        if (failed) alert(`ลบสำเร็จ ${okIds.size} รายการ, ล้มเหลว ${failed} รายการ`);
    } catch (e) {
        alert(e?.message || 'ลบไม่สำเร็จ');
    }
};

onMounted(loadAll);
watch(searchQuery, () => loadAll());
</script>

<style scoped>
.delete-checked-btn:disabled {
    all: unset;
    opacity: 0.5;
    cursor: not-allowed;
    word-wrap: nowrap;

    font-size: clamp(0.8rem, 1.2vw, 1rem);

    border: #d9534f dotted 2px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition:
        ease-out 0.2s;
    color: #d9534f;
    font-weight: 600;
}

.delete-checked-btn:enabled {
    word-wrap: nowrap;
    all: unset;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    cursor: pointer;
    border: #d9534f solid 2px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    transition:
        ease-out 0.2s;
    color: #d9534f;
    font-weight: 600;
}

.delete-checked-btn:enabled:hover {
 background-color: #d9534f;
 color: white;
}

.create-btn {
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
    transition:
        ease-out 0.2s;
    color: white;
    background-color: #4E6D16;
    font-weight: 600;
}

.create-btn:hover {

    color: white;
    background-color: #4E6D16;
}

.tag-submit-container {
    gap: 1rem;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.modal-top {
    display: flex;
    justify-content: space-between;
}

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
    flex-wrap: wrap;
}

.toolbar {
    display: flex;
    gap: .5rem;
    align-items: center;
    flex-wrap: wrap;
}

.confirm-btn,
.cancel-btn {
    padding: .5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.confirm-btn {
    background: #4E6D16;
    color: #fff;
}

.cancel-btn {
    background: #D84E5E;
    color: #fff;
}

.danger-btn {
    background: #D84E5E;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: .5rem 1rem;
    cursor: pointer;
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
    justify-content: center;
    gap: .5rem;
    align-items: center;
    width: 100%;
}

.row-checkbox {
    width: 1.1rem;
    height: 1.1rem;
    cursor: pointer;
    accent-color: #4E6D16;
}

.checkbox-id-container button {
    all: unset;
    cursor: pointer;
}

.rotate {
    transform: rotate(180deg);
}

.action-buttons {
    display: flex;
    gap: .5rem;
    justify-content: center;
}

.action-buttons button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: .25rem;
    border-radius: 6px;
}

.action-buttons button img {
    height: 1.5rem;
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

.expert-search-results {
    margin-bottom: .5rem;
}
</style>
