<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการ Value Chain</h1>
        <p>มี Value Chain ทั้งหมด {{ dataCount }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ, ผู้เขียน หรือ วันที่" />
        <div class="chainvalue-check-publish">
            <button class="published-chainvalue-btn" @click="bulkUpdateStatus(true)">เผยแพร่ทุกอันที่เช็ค</button>
            <button class="unpublished-chainvalue-btn" @click="bulkUpdateStatus(false)">ไม่เผยแพร่ทุกอันที่เช็ค</button>
            <button class="add-chainvalue-btn" @click="openAddChainValueModal">เพิ่มห่วงโซ่คุณค่า</button>
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
                            <div>Image

                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Title<button @click="toggleSort('title')">
                                    <div :class="{ 'rotate': sortBy === 'title' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Type<button @click="toggleSort('type')">
                                    <div :class="{ 'rotate': sortBy === 'type' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Category<button @click="toggleSort('category')">
                                    <div :class="{ 'rotate': sortBy === 'category' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Status<button @click="toggleSort('status')">
                                    <div :class="{ 'rotate': sortBy === 'status' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody v-if="filteredSortedChainValues.length">
                <tr v-for="item in filteredSortedChainValues" :key="item.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="item.selected" class="checkbox-decorate" />
                            <p>{{ item.id }}</p>
                        </div>
                    </td>
                    <td><img class="items-image" :src="item.image || noimageHandle"></td>
                    <td>{{ item.title }}</td>
                    <td>{{ getTypeLabel(item.type) }}</td>
                    <td>{{ getCategoryLabel(item.category) }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="item.status" @change="toggleStatus(item)" />
                            <img class="eyesicon" :src="item.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <button @click="editItem(item)" class="edit-btn"><img src="/icon/pen.png" alt="Edit"></button>
                        <button @click="askDelete(item.id, item.name_eng)" class="delete-btn"><img src="/icon/trash.png"
                                alt="Delete"></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="showModalAddChainValue || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไข Value Chain' : 'เพิ่ม Value Chain' }}</h2>
            
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label >ชื่อ Value Chain</label>
                    <input  class="add-text-input" v-model="currentChainValue.title" placeholder="Enter title" required />
                    <label >ชื่อ Value Chain (English)</label>
                    <input class="add-text-input" v-model="currentChainValue.title_en" placeholder="Enter title (English)" required />

                    <label>รองรับรูปภาพ PNG, JPG และ JPEG(ขนาดไฟล์ไม่เกิน 25 MB)</label>
                    <div class="image-upload-container">
                        <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="handleDragDrop">
                            <img v-if="!currentChainValue.image" src="/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentChainValue.image">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>
                            <div v-if="currentChainValue.image" class="image-preview">
                                <img :src="currentChainValue.image" alt="Uploaded Image" class="preview-image" />
                                <button class="remove-btn" @click="removeImage">X</button>
                            </div>
                            <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload" class="file-uploader" ref="fileInput" />
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
                        </div>
                    </div>
                </section>
                <section>
                    <label>Description</label>
                      <TiptapEditor v-model="currentChainValue.description" :disable="[,'link','image','align']"/>
                    
                    <label>Description (English)</label>
                   <TiptapEditor v-model="currentChainValue.description_en" :disable="['link','image','align']"/>

                    <label>Type</label>
                    <select v-model="currentChainValue.type" class="category-select" required>
                        <option value="0">Upstream</option>
                        <option value="1">Midstream</option>
                        <option value="2">Downstream</option>
                    </select>

                    <label>Category</label>
                    <select v-model="currentChainValue.category" class="category-select" required>
                        <option value="0">มะพร้าวอ่อน</option>
                        <option value="1">มะพร้าวแก่</option>
                    </select>
                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirme-btn" @click.prevent="submitChainValue(false)">
                    {{ showModalEdit ? 'Update without publish' : 'Add without publish' }}
                </button>
                <button type="button" class="confirm-btn" @click.prevent="submitChainValue(true)">
                    {{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}
                </button>
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

    <!-- Cropper Overlay -->
    <div v-if="showCropper" class="cropper-overlay">
        <div class="cropper-container">
            <h3 class="cropper-title">Crop Chain Value Image</h3>
            <div class="cropper-wrapper">
                <img ref="cropperImage" :src="croppingImage" alt="Crop Image" class="cropper-img" />
            </div>
            <div class="cropper-actions">
                <button type="button" class="crop-btn" @click="cropImage">Crop & Use</button>
                <button type="button" class="cancel-btn" @click="cancelCrop">Cancel</button>
            </div>
        </div>
    </div>
    <div style="height: 5rem;"></div>


</template>
<script setup>
definePageMeta({ layout: "admin" });

import { ref, onMounted, nextTick, computed } from 'vue';
import { useChainvalues } from '~/composables/useChainvalues';
import { useUpload } from '~/composables/useUpload';
import noimageHandle from '/img/no-image-handle.png';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import eye from '/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '/icon/eye-slash-alt-svgrepo-com.svg';

const { getChainvalues, createChainvalue, updateChainvalue, deleteChainvalue } = useChainvalues();
const { uploadImage } = useUpload();

const searchQuery = ref('');
const apisdatas = ref([]);
const dataCount = ref(0);
const activeLang = ref(true); // true for Thai, false for English
const showModalAddChainValue = ref(false);
const showModalEdit = ref(false);
const showModal = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);

const currentChainValue = ref({
  id: null,
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  image: null, // string path or dataURL for preview
  status: 1,
  type: '0',
  category: '0',
});

const selectAll = ref(false);
const sortBy = ref(null);
const sortDirection = ref(1);

// --- Image cropper ---
const fileInput = ref(null);
const showCropper = ref(false);
const croppingImage = ref(null);
const cropperInstance = ref(null);
const cropperImage = ref(null);

// keep the cropped image as a real File for upload
const pendingImageFile = ref(null);

// helper: Blob -> dataURL for preview
const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    croppingImage.value = reader.result;
    showCropper.value = true;
    nextTick(() => {
      cropperInstance.value = new Cropper(cropperImage.value, {
        aspectRatio: 16/9,
        viewMode: 2,
        autoCropArea: 1,
      });
    });
  };
  reader.readAsDataURL(file);
};

// if your template still calls handleFileUpload, route it to the cropper flow
const handleFileUpload = (event) => handleFileChange(event);

const cropImage = async () => {
  if (!cropperInstance.value) return;

  const canvas = cropperInstance.value.getCroppedCanvas();
  if (!canvas) {
    alert('Crop failed. Please try again.');
    return;
  }

  // make a Blob from the cropped canvas (keep high quality; compression happens in useUpload)
  const blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b), 'image/png', 1)
  );
  if (!blob) {
    alert('Could not create image blob');
    return;
  }

  // keep a File for uploading
  pendingImageFile.value = new File([blob], `chainvalue_${Date.now()}.png`, {
    type: 'image/png',
  });

  // preview in UI
  currentChainValue.value.image = await blobToDataURL(blob);

  showCropper.value = false;
  cropperInstance.value?.destroy();
  cropperInstance.value = null;
};

const cancelCrop = () => {
  showCropper.value = false;
  cropperInstance.value?.destroy();
  cropperInstance.value = null;
};

const toggleLang = () => {
  activeLang.value = !activeLang.value;
};

// --- Table logic ---
const toggleSelectAll = () =>
  apisdatas.value.forEach((c) => (c.selected = selectAll.value));

const toggleSort = (column) => {
  if (sortBy.value === column) sortDirection.value *= -1;
  else {
    sortBy.value = column;
    sortDirection.value = column === 'status' ? -1 : 1;
  }
};

const filteredSortedChainValues = computed(() => {
  // NOTE: this still filters by name_eng/name_th/origin from your old code.
  // keep as-is to avoid changing behaviors you didn't ask to modify.
  let filtered = apisdatas.value.filter((c) =>
    c.id.toString().includes(searchQuery.value) ||
    (c.name_eng || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (c.name_th || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (c.origin || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  if (sortBy.value) {
    filtered.sort((a, b) => {
      let valA = a[sortBy.value],
        valB = b[sortBy.value];
      if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
      if (['name_eng', 'name_th', 'origin'].includes(sortBy.value))
        return String(valA).localeCompare(String(valB), 'th') * sortDirection.value;
      if (sortBy.value === 'status') return (valB - valA) * sortDirection.value;
      return 0;
    });
  }
  return filtered;
});

// --- Fetch API ---
const fetchApi = async () => {
  try {
    const data = await getChainvalues();
    apisdatas.value = data.map((c) => ({ ...c, selected: false }));
    dataCount.value = apisdatas.value.length;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    apisdatas.value = [];
    dataCount.value = 0;
  }
};

// --- Status toggle ---
const toggleStatus = async (chainValue) => {
  try {
    const newStatus = !chainValue.status;
    chainValue.status = newStatus;

    const payload = { ...chainValue, status: newStatus ? 1 : 0 };
    const updated = await updateChainvalue(chainValue.id, payload);
    Object.assign(chainValue, updated);
  } catch (error) {
    alert('Error updating chain value status.');
    console.error(error);
  }
};

// --- Add/Edit modal ---
const openAddChainValueModal = () => {
  currentChainValue.value = {
    id: null,
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    image: null,
    status: false,
    type: '0',
    category: '0',
  };
  pendingImageFile.value = null;
  showModalAddChainValue.value = true;
};

const editItem = (chainValue) => {
  currentChainValue.value = { ...chainValue };
  pendingImageFile.value = null;
  showModalEdit.value = true;
};

const bulkUpdateStatus = async (statusValue) => {
  try {
    const selectedChainValues = apisdatas.value.filter((c) => c.selected);
    if (!selectedChainValues.length) {
      alert('Please select at least one chain value.');
      return;
    }

    const updatePromises = selectedChainValues.map((chainValue) => {
      const payload = { ...chainValue, status: statusValue ? 1 : 0 };
      return updateChainvalue(chainValue.id, payload);
    });

    await Promise.all(updatePromises);

    apisdatas.value.forEach((c) => {
      if (c.selected) c.status = statusValue ? 1 : 0;
    });

    alert(`Updated ${selectedChainValues.length} chain values successfully!`);
  } catch (error) {
    alert(`Error updating chain values: ${error.message}`);
    console.error(error);
  }
};

const submitChainValue = async (publish) => {
  if (!currentChainValue.value.title.trim() || !currentChainValue.value.title_en.trim()) {
    alert('Please fill in required fields.');
    return;
  }

  try {
    let imagePath = currentChainValue.value.image;

    // If user cropped a new image, upload the File via useUpload (which compresses to WebP ≤ 50MB)
    if (pendingImageFile.value) {
      const fileName = `chainvalue_${Date.now()}.webp`;
      const resp = await uploadImage(pendingImageFile.value, fileName);
      if (resp?.error) throw new Error(resp.error);
      imagePath = resp.path || `/images/${fileName}`;
    } else if (typeof imagePath === 'string' && imagePath.startsWith('data:image')) {
      // fallback: if image is still a data URL (no pending file), upload it directly
      const fileName = `chainvalue_${Date.now()}`;
      const resp = await uploadImage(imagePath, fileName);
      if (resp?.error) throw new Error(resp.error);
      imagePath = resp.path || `/images/${fileName}`;
    }

    const payload = {
      ...currentChainValue.value,
      image: imagePath,
      status: publish ? 1 : 0,
    };

    if (currentChainValue.value.id) {
      await updateChainvalue(currentChainValue.value.id, payload);
      alert('Chain Value updated successfully.');
    } else {
      const newChainValue = await createChainvalue(
        payload.image,
        payload.title,
        payload.title_en,
        payload.description,
        payload.description_en,
        payload.status,
        payload.type,
        payload.category
      );
      currentChainValue.value.id = newChainValue.id;
      alert('Chain Value added successfully.');
    }

    showModalAddChainValue.value = false;
    showModalEdit.value = false;
    pendingImageFile.value = null;
    fetchApi();
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  }
};

// --- Delete ---
const askDelete = (id, name) => { deleteId.value = id; deleteName.value = name; showModal.value = true; };
const confirmDelete = async () => {
  try {
    await deleteChainvalue(deleteId.value);
    apisdatas.value = apisdatas.value.filter((c) => c.id !== deleteId.value);
    dataCount.value = apisdatas.value.length;
    showModal.value = false;
    alert('Chain Value deleted successfully.');
  } catch (error) {
    alert(`Error deleting chain value: ${error.message}`);
    console.error(error);
  } finally {
    deleteId.value = null;
  }
};
const cancelDelete = () => (showModal.value = false);
const closeModal = () => { showModalAddChainValue.value = false; showModalEdit.value = false; };

onMounted(fetchApi);

const getTypeLabel = (type) => {
  const types = { '0': 'Upstream', '1': 'Midstream', '2': 'Downstream' };
  return types[type] || type;
};

const getCategoryLabel = (category) => {
  const categories = { '0': 'มะพร้าวอ่อน', '1': 'มะพร้าวแก่' };
  return categories[category] || category;
};

const triggerFileInput = () => fileInput.value?.click();
</script>



<style scoped>
.items-image {
    width: 3rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 8px;
}

.cropper-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.cropper-container {
    background: #fff;
    padding: 1.5rem;
    
    width: 400px;
    max-width: 90%;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.cropper-title {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: bold;
}

.cropper-wrapper {
    width: 100%;
    height: 300px;
    overflow: hidden;
   
    margin-bottom: 1rem;
}

.cropper-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.cropper-actions {
    display: flex;
    justify-content: space-around;
}

.cropper-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s all;
}

.cropper-actions .crop-btn {
    background-color: #4caf50;
    color: #fff;
}

.cropper-actions .crop-btn:hover {
    background-color: #45a049;
}

.cropper-actions .cancel-btn {
    background-color: #f44336;
    color: #fff;
}

.cropper-actions .cancel-btn:hover {
    background-color: #d32f2f;
}

.image-upload-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.upload-btn {
    padding: 0.5rem 1rem;
    background-color: #B6E3DB;
    color: black;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
}

.upload-btn:hover {
    background-color: #88b1a9;
}

.image-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 6px;
    border: 1px solid #ccc;
    object-fit: cover;
}

.add-text-input,
.category-select {
    border-radius: 10px;
    border: 2px solid #4E6D16;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.add-text-input:focus,
.category-select:focus {
    border-color: #6F8C28;
    box-shadow: 0 0 5px rgba(111, 140, 40, 0.5);
    outline: none;
}

textarea.add-text-input {
    resize: none;
    height: 8rem;
    overflow-y: auto;
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

.item-list-table th:nth-child(1),
.item-list-table td:nth-child(1) {
    display: table-cell;
    width: 5%;
}

.item-list-table th:nth-child(2),
.item-list-table td:nth-child(2) {
    text-align: center;   /* horizontal center */
    vertical-align: middle;
    width: 5%;
}

.item-list-table th:nth-child(3),
.item-list-table td:nth-child(3) {
   
      text-align: center;
    width: 8%;
}

.item-list-table th:nth-child(4),
.item-list-table td:nth-child(4) {
    width: 8%;
    text-align: center;
}

.item-list-table th:nth-child(5),
.item-list-table td:nth-child(5) {
     text-align: center;
    width: 5%;
}

.item-list-table th:nth-child(6),
.item-list-table td:nth-child(6) {
    text-align: center;
    width: 8%;
}

.item-list-table th:nth-child(7),
.item-list-table td:nth-child(7) {
  text-align: center;
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
    display: flex;
    justify-content: center;
    height: fit-content;
    width: 100%;
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
    width: 85%;
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

.published-chainvalue-btn {
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

.published-chainvalue-btn:hover {
    color: white;
    background-color: #599c91;
}

.published-chainvalue-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.unpublished-chainvalue-btn {
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

.unpublished-chainvalue-btn:hover {
    color: white;
    background-color: #569187;
}

.unpublished-chainvalue-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.add-chainvalue-btn {
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

.add-chainvalue-btn:hover {
    color: white;
    background-color: #4E6D16;
}

.add-chainvalue-btn:active {
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

.lang-toggle {
    margin-bottom: 1rem;
    text-align: center;
}

.lang-toggle button {
    background-color: #4E6D16;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.lang-toggle button:hover {
    background-color: #3c5213;
    transform: scale(1.05);
}

.lang-toggle button:active {
    transform: scale(0.98);
}
</style>