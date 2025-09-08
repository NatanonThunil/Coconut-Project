<template>
    <div style="height: 5 rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการผู้เชี่ยวชาญ</h1>
        <p>มีผู้เชี่ยวชาญทั้งหมด {{ expertsNum }}</p>
    </div>

    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ, ที่อยู่ หรือ เบอร์โทร" />

        <div class="expert-check-publish">
            <button class="published-news-btn" @click="bulkUpdateStatus(true)">All Checked Publish</button>
            <button class="unpublished-news-btn" @click="bulkUpdateStatus(false)">All Checked Unpublish</button>
            <button class="add-news-btn" @click="openAddExpertModal">ADD Expert</button>
        </div>
    </div>

    <div class="table-container">
        <table class="item-list-table">
            <thead>
                <tr>
                    <th>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                class="checkbox-decorate" />
                            <span>ID</span>
                            <button @click="toggleSort('id')">
                                <div :class="{ 'rotate': sortBy === 'id' && sortDirection === -1 }">▲</div>
                            </button>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Name
                                <button @click="toggleSort('name')">
                                    <div :class="{ 'rotate': sortBy === 'name' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Email
                                <button @click="toggleSort('email')">
                                    <div :class="{ 'rotate': sortBy === 'email' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Address
                                <button @click="toggleSort('address')">
                                    <div :class="{ 'rotate': sortBy === 'address' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Phone Number
                                <button @click="toggleSort('phoneNumber')">
                                    <div :class="{ 'rotate': sortBy === 'phoneNumber' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Tags
                                <button @click="toggleSort('tags')">
                                    <div :class="{ 'rotate': sortBy === 'tags' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Status
                                <button @click="toggleSort('status')">
                                    <div :class="{ 'rotate': sortBy === 'status' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th></th>
                </tr>
            </thead>

            <tbody v-if="filteredSortedExperts.length">
                <tr v-for="expert in filteredSortedExperts" :key="expert.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="expert.selected" />
                            <p>{{ expert.id }}</p>
                        </div>
                    </td>
                    <td>{{ expert.name }}</td>
                    <td>{{ expert.email }}</td>
                    <td>{{ expert.address }}</td>
                    <td>{{ expert.phoneNumber }}</td>
                    <td>{{ expert.tags.join(', ') }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="expert.status" @change="toggleStatus(expert)" />
                            <img class="eyesicon" :src="expert.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <div class="action-btn-container">
                            <button @click="editItem(expert)" class="edit-btn"><img src="/icon/pen.png"
                                    alt="" /></button>
                            <button @click="askDelete(expert.id, expert.name)" class="delete-btn"><img
                                    src="/icon/trash.png" alt="" /></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Delete modal -->
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

    <!-- Add/Edit modal -->
    <div v-if="showModalAddExpert || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขผู้เชี่ยวชาญ' : 'เพิ่มผู้เชี่ยวชาญ' }}</h2>
            <div class="divider"></div>

            <div class="modal-content">
                <section>
                    <label>ชื่อ</label>
                    <input class="add-text-input" v-model="currentExpert.name" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter name" required />
                    <label>ชื่อ (อังกฤษ)</label>
                    <input class="add-text-input" v-model="currentExpert.name_en" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter name in English" required />
                    <label>ที่อยู่</label>
                    <input class="add-text-input" v-model="currentExpert.address" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter address" required />
                    <label>ที่อยู่ (อังกฤษ)</label>
                    <input class="add-text-input" v-model="currentExpert.address_en" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter address in English" required />
                    <label>เบอร์โทร</label>
                    <input class="add-text-input" v-model="currentExpert.phoneNumber" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter phone number" required />
                    <label>Email</label>
                    <input class="add-text-input" v-model="currentExpert.email" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter email" required />
                    <label>คำอธิบาย</label>
                    <textarea class="add-text-input" v-model="currentExpert.description" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit" placeholder="Enter description"></textarea>
                    <label>คำอธิบาย (อังกฤษ)</label>
                    <textarea class="add-text-input" v-model="currentExpert.description_en" @input="handleInputChange"
                        @keydown.enter.prevent="preventFormSubmit"
                        placeholder="Enter description in English"></textarea>

                    <!-- TAGS with Google-like predictions -->
                    <label>Tags</label>
                    <div class="tags-input-container" style="position: relative;">
                        <input class="add-text-input" v-model="newTag" @input="onTagInput" @focus="onTagFocus"
                            @keydown.down.prevent="moveTagHighlight(1)" @keydown.up.prevent="moveTagHighlight(-1)"
                            @keydown.enter.prevent="confirmTag" @keydown.esc.prevent="closeTagDropdown"
                            placeholder="Add a tag (max 5)" autocomplete="off" />

                        <div class="tag" v-for="(tag, index) in currentExpert.tags" :key="index">
                            {{ tag }}
                            <button type="button" @click="removeTag(index)">x</button>
                        </div>

                        
                    </div>

                    <label>ประเภท</label>
                    <select class="add-text-input" v-model="currentExpert.type" @input="handleInputChange" required>
                        <option value="1">Type 1</option>
                        <option value="2">Type 2</option>
                        <option value="3">Type 3</option>
                    </select>

                    <label>Image</label>
                    <div class="image-upload-container">
                        <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
                            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDragDrop">
                            <img v-if="!currentExpert.image" src="/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentExpert.image">Drag & Drop or Click to Upload</h2>

                            <div v-if="currentExpert.image" class="image-preview">
                                <img :src="currentExpert.image" alt="Uploaded Image" class="preview-image" />
                                <button class="remove-btn" @click="removeImage">X</button>
                            </div>

                            <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload"
                                class="file-uploader" ref="fileInput" />
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
                        </div>
                    </div>
                </section>
            </div>

            <div class="modal-actions">
                <button type="button" class="confirme-btn" @click.prevent="submitExpert(false)">
                    {{ showModalEdit ? 'Update without publish' : 'Add without publish' }}
                </button>
                <button type="button" class="confirm-btn" @click.prevent="submitExpert(true)">
                    {{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}
                </button>
                <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </form>
    </div>

    <!-- Hidden input + Cropper -->
    <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/jpeg, image/png" hidden />
    <div v-if="showCropper" class="cropper-container">
        <div class="cropper-wrapper">
            <img ref="cropperImage" :src="croppingImage" class="cropper-preview" />
        </div>
        <div class="cropper-actions">
            <button @click="cropImage" class="crop-btn">Crop & Upload</button>
            <button @click="cancelCrop" class="cancel-btn">Cancel</button>
        </div>
    </div>

    <div style="height: 5rem;"></div>
 
</template>


<script setup>
definePageMeta({ layout: "admin" });

import { ref, onMounted, computed, nextTick } from 'vue';
import eye from '/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '/icon/eye-slash-alt-svgrepo-com.svg';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import { useExperts } from '~/composables/useExperts';
import { useUpload } from '~/composables/useUpload';

const {
  getExperts,
  updateExpert,
  createExpert,
  deleteExpert,
  getTagsByExpert,
  setTagsForExpert,
} = useExperts();

const { uploadImage } = useUpload();

/* ---------------- Table / State ---------------- */
const searchQuery = ref('');
const experts = ref([]);
const expertsNum = ref(0);
const selectAll = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModal = ref(false);
const showModalAddExpert = ref(false);
const showModalEdit = ref(false);
const sortBy = ref(null);
const sortDirection = ref(1);
const isDragging = ref(false);

const currentExpert = ref({
  id: null,
  name: '',
  name_en: '',
  address: '',
  address_en: '',
  phoneNumber: '',
  email: '',
  description: '',
  description_en: '',
  status: 1,
  tags: [],
  image: null,
  type: 1,
});

/* ---------------- Image cropper ---------------- */
const fileInput = ref(null);
const showCropper = ref(false);
const croppingImage = ref(null);
const cropperInstance = ref(null);
const cropperImage = ref(null);
const pendingImageFile = ref(null);

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });

const triggerFileInput = () => fileInput.value && fileInput.value.click();

const handleDragDrop = (e) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (!files?.length) return;
  handleFileUpload({ target: { files } });
};

const handleFileUpload = (event) => {
  const file = event.target?.files?.[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    alert('Only JPEG, PNG or WebP files are allowed.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    croppingImage.value = reader.result;
    showCropper.value = true;
    nextTick(() => {
      cropperInstance.value = new Cropper(cropperImage.value, {
        aspectRatio: 2 / 3,
        viewMode: 2,
        autoCropArea: 1,
      });
    });
  };
  reader.readAsDataURL(file);
};

const cropImage = async () => {
  if (!cropperInstance.value) return;
  const canvas = cropperInstance.value.getCroppedCanvas();
  if (!canvas) return alert('Crop failed. Please try again.');
  const blob = await new Promise((res) => canvas.toBlob((b) => res(b), 'image/png', 1));
  if (!blob) return alert('Could not create image blob');
  pendingImageFile.value = new File([blob], `expert_${Date.now()}.png`, { type: 'image/png' });
  currentExpert.value.image = await blobToDataURL(blob);
  showCropper.value = false;
  cropperInstance.value.destroy();
  cropperInstance.value = null;
};

const cancelCrop = () => {
  showCropper.value = false;
  cropperInstance.value?.destroy();
  cropperInstance.value = null;
};

const removeImage = () => {
  currentExpert.value.image = null;
  pendingImageFile.value = null;
};

/* ---------------- TAGS (no suggestions) ---------------- */
const newTag = ref('');

// normalize: trim, collapse spaces, strip leading/trailing commas
const normalizeTag = (s) =>
  String(s || '').replace(/^[,\s]+|[,\s]+$/g, '').replace(/\s+/g, ' ').trim();

const hasTag = (val) =>
  currentExpert.value.tags.some(t => t.toLowerCase() === String(val).toLowerCase());

// commit one tag (Enter/Tab/Comma or programmatic)
const commitTag = () => {
  const t = normalizeTag(newTag.value);
  if (!t) return;
  if (currentExpert.value.tags.length >= 5) {
    alert('An expert can have up to 5 tags.');
    newTag.value = '';
    return;
  }
  if (!hasTag(t)) currentExpert.value.tags.push(t);
  newTag.value = '';
};

// --- handlers the template expects (lightweight no-suggest versions) ---
const onTagInput = () => {
  // support comma-separated typing (e.g., "ai, data, ml")
  const raw = String(newTag.value);
  if (!raw.includes(',')) return;

  const parts = raw.split(',');
  // last piece stays in input (user is still typing it)
  const last = parts.pop() ?? '';
  for (const p of parts) {
    if (currentExpert.value.tags.length >= 5) break;
    const t = normalizeTag(p);
    if (t && !hasTag(t)) currentExpert.value.tags.push(t);
  }
  newTag.value = last; // keep the unfinished part in the box
};

const onTagFocus = () => {
  /* no suggestions anymore; nothing to do */
};

const moveTagHighlight = () => {
  /* no dropdown; nothing to do */
};

const closeTagDropdown = () => {
  /* no dropdown; nothing to do */
};

// Enter key in template calls this
const confirmTag = () => {
  commitTag();
};

const removeTag = (index) => {
  currentExpert.value.tags.splice(index, 1);
};

/* ---------------- Fetch + table ---------------- */
const fetchExperts = async () => {
  try {
    const list = await getExperts();
    const withTags = await Promise.all(
      list.map(async (e) => {
        let tags = [];
        try { tags = await getTagsByExpert(e.id); } catch {}
        return { ...e, selected: false, tags };
      })
    );
    experts.value = withTags;
    expertsNum.value = withTags.length;
  } catch (error) {
    alert('Error fetching experts.');
    console.error('Error fetching experts:', error);
  }
};

const editItem = async (expert) => {
  let tags = expert.tags;
  if (!Array.isArray(tags)) {
    try { tags = await getTagsByExpert(expert.id); } catch { tags = []; }
  }
  currentExpert.value = {
    ...expert,
    status: expert.status ? 1 : 0,
    tags: Array.isArray(tags) ? [...tags] : [],
    image: expert.image || null,
  };
  pendingImageFile.value = null;
  showModalEdit.value = true;
};

const filteredSortedExperts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let filtered = experts.value.filter((expert) => {
    const byId = String(expert.id || '').includes(q);
    const byName = (expert.name || '').toLowerCase().includes(q);
    const byAddr = (expert.address || '').toLowerCase().includes(q);
    const byPhone = (expert.phoneNumber || '').includes(q);
    const byEmail = (expert.email || '').toLowerCase().includes(q);
    const byTag = Array.isArray(expert.tags) &&
      expert.tags.some((t) => (t || '').toLowerCase().startsWith(q));
    return byId || byName || byAddr || byPhone || byEmail || byTag;
  });

  if (sortBy.value) {
    filtered.sort((a, b) => {
      let valA = a[sortBy.value];
      let valB = b[sortBy.value];
      if (sortBy.value === 'id') return (Number(valA) - Number(valB)) * sortDirection.value;
      if (['name', 'address', 'email'].includes(sortBy.value)) {
        return String(valA || '').localeCompare(String(valB || ''), 'th') * sortDirection.value;
      }
      if (sortBy.value === 'status') return ((Number(valB) || 0) - (Number(valA) || 0)) * sortDirection.value;
      if (sortBy.value === 'phoneNumber') {
        return String(valA || '').localeCompare(String(valB || '')) * sortDirection.value;
      }
      return 0;
    });
  }
  return filtered;
});

const toggleSort = (column) => {
  if (sortBy.value === column) sortDirection.value *= -1;
  else {
    sortBy.value = column;
    sortDirection.value = column === 'status' ? -1 : 1;
  }
};

const openAddExpertModal = () => {
  currentExpert.value = {
    id: null,
    name: '',
    name_en: '',
    address: '',
    address_en: '',
    phoneNumber: '',
    email: '',
    description: '',
    description_en: '',
    status: 1,
    tags: [],
    image: null,
    type: 1,
  };
  newTag.value = '';
  pendingImageFile.value = null;
  showModalAddExpert.value = true;
};

/* ---------------- Status toggle ---------------- */
const toggleStatus = async (expert) => {
  try {
    const newStatus = expert.status ? 0 : 1;
    await updateExpert(expert.id, { status: newStatus, image: expert.image ?? null });
    expert.status = newStatus;
  } catch (error) {
    alert('Error updating expert status.');
    console.error(error);
  }
};

const bulkUpdateStatus = async (publish) => {
  try {
    const selected = experts.value.filter((e) => e.selected);
    if (selected.length === 0) return alert('No experts selected.');
    await Promise.all(
      selected.map((e) => updateExpert(e.id, { status: publish ? 1 : 0, image: e.image ?? null }))
    );
    selected.forEach((e) => (e.status = publish ? 1 : 0));
    alert(`Successfully ${publish ? 'published' : 'unpublished'} selected experts.`);
  } catch (e) {
    console.error(e);
    alert('Failed to update expert status.');
  }
};

/* ---------------- Submit (upload + save tags) ---------------- */
const submitExpert = async (publish) => {
  if (
    !currentExpert.value.name.trim() ||
    !currentExpert.value.name_en.trim() ||
    !currentExpert.value.address.trim() ||
    !currentExpert.value.address_en.trim() ||
    !currentExpert.value.phoneNumber.trim() ||
    !currentExpert.value.email.trim()
  ) {
    alert('Please fill in all required fields: Name, Name (English), Address, Address (English), Phone Number, and Email.');
    return;
  }

  try {
    const isUpdate = !!currentExpert.value.id;
    let imagePath = typeof currentExpert.value.image === 'string' ? currentExpert.value.image : null;

    if (pendingImageFile.value) {
      const finalName = `expert_${Date.now()}.webp`;
      const uploadRes = await uploadImage(pendingImageFile.value, finalName);
      if (uploadRes?.error) throw new Error(uploadRes.error);
      imagePath = uploadRes?.path || `/images/${finalName}`;
    }

    const payload = {
      name: currentExpert.value.name,
      name_en: currentExpert.value.name_en,
      address: currentExpert.value.address,
      address_en: currentExpert.value.address_en,
      phoneNumber: currentExpert.value.phoneNumber,
      email: currentExpert.value.email,
      description: currentExpert.value.description,
      description_en: currentExpert.value.description_en,
      status: publish ? 1 : 0,
      image: imagePath || '',
      type: Number.isFinite(Number(currentExpert.value.type)) ? Number(currentExpert.value.type) : 1,
    };

    if (isUpdate) {
      await updateExpert(currentExpert.value.id, payload);
      await setTagsForExpert(currentExpert.value.id, currentExpert.value.tags);
      alert('Expert updated successfully.');
    } else {
      const res = await createExpert(payload);
      currentExpert.value.id = res?.id ?? null;
      await setTagsForExpert(currentExpert.value.id, currentExpert.value.tags);
      alert('Expert added successfully.');
    }

    showModalAddExpert.value = false;
    showModalEdit.value = false;
    pendingImageFile.value = null;
    fetchExperts();
  } catch (error) {
    alert('Error while submitting expert.');
    console.error('Submit Expert Error:', error);
  }
};

/* ---------------- Delete ---------------- */
const askDelete = (id, name) => {
  deleteId.value = id;
  deleteName.value = name;
  showModal.value = true;
};

const confirmDelete = async () => {
  try {
    await deleteExpert(deleteId.value);
    experts.value = experts.value.filter((e) => e.id !== deleteId.value);
    expertsNum.value = experts.value.length;
    showModal.value = false;
    alert('Expert deleted successfully.');
  } catch (error) {
    alert(`Error deleting expert: ${error?.message || 'Unknown error'}`);
    console.error(error);
  } finally {
    deleteId.value = null;
  }
};

const cancelDelete = () => (showModal.value = false);
const closeModal = () => {
  showModalAddExpert.value = false;
  showModalEdit.value = false;
};

/* ---------------- Helpers ---------------- */
const handleInputChange = () => {};
const preventFormSubmit = () => {};

onMounted(fetchExperts);

const toggleSelectAll = () => {
  experts.value.forEach((e) => (e.selected = selectAll.value));
};
</script>










<style scoped>
/* ===== Tag input + chips ===== */
.tags-input-container {
  position: relative;
  display: grid;
  gap: 8px;
}

.tags-input-container .add-text-input {
  padding-right: 40px;
}

/* Tag chip */
.tags-input-container .tag {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: 4px 10px;
  margin: 4px 6px 0 0;
  border-radius: 999px;
  border: 1px solid #b9d99a;
  background: #e9f5dc;
  color: #2e6b0c;
  font-weight: 600;
  font-size: 13px;
  line-height: 1;
  user-select: none;
  transition: transform .12s ease, box-shadow .12s ease;
}
.tags-input-container .tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 0 rgba(0,0,0,.05);
}
.tags-input-container .tag > button {
  border: 0;
  background: transparent;
  color: inherit;
  font-weight: 800;
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
}
.tags-input-container .tag > button:hover {
  filter: brightness(.9);
}

/* ===== Suggestions dropdown ===== */
.tags-suggestions {
  /* your inline :style controls position, size, etc. */
  padding: 6px;
  backdrop-filter: blur(6px);
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 16px 40px rgba(33, 43, 54, .12),
    0 2px 6px rgba(33, 43, 54, .04);
  overflow-y: auto;
}

/* Pretty scrollbar */
.tags-suggestions::-webkit-scrollbar {
  width: 10px;
}
.tags-suggestions::-webkit-scrollbar-track {
  background: transparent;
}
.tags-suggestions::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.tags-suggestions:hover::-webkit-scrollbar-thumb {
  background: #d1d5db;
}

/* Suggestion row */
.tag-suggestion {
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background .12s ease, transform .08s ease, border-color .12s ease;
  border: 1px solid transparent;
  position: relative;
}

/* Icon slot (your first <span>) */
.tag-suggestion > span:first-child {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #eef7e6;
  color: #2e6b0c;
  font-size: 13px;
  font-weight: 700;
}

/* Hover/active state */
.tag-suggestion:hover {
  background: #f7fbf2;
  border-color: #e7f1dc;
}
.tag-suggestion.active {
  background: #ecf7e5;
  border-color: #cfe8bb;
  transform: translateX(1px);
}

/* Create row gets a subtle accent */
.tag-suggestion.create {
  background: linear-gradient(0deg, #f5faf0, #ffffff);
  border-color: #e7f1dc;
}
.tag-suggestion.create > span:first-child {
  background: #dff0cf;
  color: #216a00;
}

/* Disabled row (e.g., “Start typing…”, “Searching…”) */
.tag-suggestion.disabled {
  opacity: .65;
  cursor: default;
}

/* Highlighted substring from v-html */
.tag-suggestion mark {
  background: #ffef9c;
  color: #5b4b00;
  padding: 0 2px;
  border-radius: 3px;
}

/* Optional: soft divider between groups */
.tag-suggestion + .tag-suggestion {
  margin-top: 2px;
}

/* ===== Dark mode (optional; auto if user prefers dark) ===== */
@media (prefers-color-scheme: dark) {
  .tags-suggestions {
    background: #121417;
    border-color: #1f242a;
    box-shadow:
      0 16px 40px rgba(0,0,0,.45),
      0 2px 6px rgba(0,0,0,.25);
  }
  .tag-suggestion {
    color: #e6eaf0;
  }
  .tag-suggestion:hover {
    background: #182028;
    border-color: #1f2a33;
  }
  .tag-suggestion.active {
    background: #15232d;
    border-color: #214657;
  }
  .tag-suggestion > span:first-child {
    background: #1a2a18;
    color: #cdecc2;
  }
  .tag-suggestion.create {
    background: linear-gradient(0deg, #162018, #121417);
    border-color: #1c2a20;
  }
  .tag-suggestion.create > span:first-child {
    background: #204321;
    color: #d4ffd1;
  }
  .tag-suggestion mark {
    background: #594a00;
    color: #ffe89a;
  }
  .tags-suggestions::-webkit-scrollbar-thumb {
    background: #2a2f36;
  }
  .tags-suggestions:hover::-webkit-scrollbar-thumb {
    background: #3a4048;
  }
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

.cropper-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 600px;
}

.cropper-wrapper {
    width: 100%;
    max-height: 400px;
    overflow: hidden;
    border-radius: 10px;
    margin-bottom: 20px;
}

.cropper-preview {
    width: 100%;
    height: auto;
}

.cropper-actions {
    display: flex;
    gap: 10px;
}

.crop-btn,
.cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.crop-btn {
    background-color: #4E6D16;
    color: white;
}

.crop-btn:hover {
    background-color: #6F8C28;
}

.cancel-btn {
    background-color: #D84E5E;
    color: white;
}

.cancel-btn:hover {
    background-color: #F86F70;
}

.checkbox-id-container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
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
    margin-left: 250px;
    /* This ensures content is pushed to the right */
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

.item-list-table th,
.item-list-table td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-list-table th:nth-child(1),
.item-list-table td:nth-child(1) {
    display: table-cell;
    width: 6%;
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
    width: 10%;
    text-align: center;
}

.item-list-table th:nth-child(5),
.item-list-table td:nth-child(5) {
    width: 15%;
}

.item-list-table th:nth-child(6),
.item-list-table td:nth-child(6) {
    width: 20%;
}

.item-list-table th:nth-child(7),
.item-list-table td:nth-child(7) {
    display: table-cell;
    width: 8%;
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
    flex-direction: row;
    gap: 0rem 2rem;
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

.news-check-publish {
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

@media screen and (max-width: 1550px) {

    .item-list-table th:nth-child(4),
    .item-list-table td:nth-child(4) {
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

.cropper-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 600px;
}

.cropper-preview {
    max-width: 100%;
    max-height: 400px;
    margin-bottom: 10px;
}

.tags-input-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    background-color: #4E6D16;
    color: white;
    padding: 0.5rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tag button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: bold;
}

.tag button:hover {
    color: #D84E5E;
}

.image-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.tags-suggestions {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    position: absolute;
    z-index: 1000;
    max-height: 150px;
    overflow-y: auto;
}

.tags-suggestions div {
    padding: 0.5rem;
    cursor: pointer;
}

.tags-suggestions div:hover {
    background: #f0f0f0;
}

.add-text-input {
    border-radius: 10px;
    border: 2px solid #4E6D16;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.add-text-input:focus {
    border-color: #6F8C28;
    box-shadow: 0 0 5px rgba(111, 140, 40, 0.5);
    outline: none;
}
</style>