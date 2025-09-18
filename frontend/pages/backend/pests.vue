<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการศัตรูพืช</h1>
        <p>มีศัตรูพืชทั้งหมด {{ dataCount }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ หรือ วันที่" />
        <div class="pest-check-publish">
            <button class="published-pest-btn" @click="bulkUpdateStatus(true)">All Checked Publish</button>
            <button class="unpublished-pest-btn" @click="bulkUpdateStatus(false)">All Checked Unpublish</button>
            <button class="add-pest-btn" @click="openAddPestModal">ADD Pest</button>
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
                            <div>Image</div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>English Name<button @click="toggleSort('name_en')">
                                    <div :class="{ 'rotate': sortBy === 'name_en' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Thai Name<button @click="toggleSort('name')">
                                    <div :class="{ 'rotate': sortBy === 'name' && sortDirection === -1 }">▲</div>
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
            <tbody v-if="filteredSortedPests.length">
                <tr v-for="item in filteredSortedPests" :key="item.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="item.selected" class="checkbox-decorate" />
                            <p>{{ item.id }}</p>
                        </div>
                    </td>
                    <td><img class="items-image" :src="item.image || noimageHandle"></td>
                    <td>{{ item.name_en }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="item.status" @change="toggleStatus(item)" />
                            <img class="eyesicon" :src="item.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <button @click="editItem(item)" class="edit-btn"><img src="/icon/pen.png" alt="Edit"></button>
                        <button @click="askDelete(item.id, item.name_en)" class="delete-btn"><img src="/icon/trash.png"
                                alt="Delete"></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="showModalAddPest || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขศัตรูพืช' : 'เพิ่มศัตรูพืช' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>รองรับรูปภาพ PNG, JPG และ JPEG (ขนาดไฟล์ไม่เกิน 50 MB)</label>
                    <div class="image-upload-container">
                        <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
                            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handlePestDragDrop">

                            <!-- Placeholder when no image -->
                            <img v-if="!currentPest.image" src="/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentPest.image">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>

                            <!-- Preview if image exists -->
                            <div v-if="currentPest.image" class="image-preview">
                                <img :src="currentPest.image" alt="Uploaded Pest Image" class="preview-image" />
                                <button class="remove-btn" @click="removePestImage">X</button>
                            </div>

                            <!-- Hidden file input -->
                            <input type="file" accept="image/jpeg, image/png" class="file-uploader" ref="pestFileInput"
                                @change="handlePestFileUpload" />

                            <!-- Browse button -->
                            <button type="button" class="browse-btn" @click="triggerPestFileInput">
                                Browse File
                            </button>
                        </div>
                    </div>
                    <label>English Name</label>
                    <input class="add-text-input" v-model="currentPest.name_en" placeholder="Enter English name"
                        required />
                    <label>Thai Name</label>
                    <input class="add-text-input" v-model="currentPest.name" placeholder="Enter Thai name" required />
                    <label>Scientific Name</label>
                    <input class="add-text-input" v-model="currentPest.sci_name" placeholder="Enter scientific name"
                        required />
                    <label>Lifecycle</label>
                    <textarea class="add-text-input" v-model="currentPest.lifecycle" placeholder="Enter lifecycle"
                        required></textarea>
                    <label>Prevent</label>
                    <textarea class="add-text-input" v-model="currentPest.prevent" placeholder="Enter prevent"
                        required></textarea>
                    <label>Lifecycle (English)</label>
                    <textarea class="add-text-input" v-model="currentPest.lifecycle_en"
                        placeholder="Enter lifecycle (English)" required></textarea>
                    <label>Prevent (English)</label>
                    <textarea class="add-text-input" v-model="currentPest.prevent_en"
                        placeholder="Enter prevent (English)" required></textarea>
                    <label>Status</label>
                    <select v-model="currentPest.status" class="category-select" required>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <label>Type</label>
                    <select v-model="currentPest.type" class="category-select" required>
                        <option value="1">Pest</option>
                        <option value="2">Weed</option>
                        <option value="3">Disease</option>
                        <option value="4">Insect</option>
                    </select>
                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirm-btn" @click.prevent="submitPest(true)">{{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}</button>
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
            <h3 class="cropper-title">Crop Coconut Image</h3>
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
    <Loading :isLoading="loadingstate" :LoadingText="loadingstatetext" />

</template>
<script setup>
import noimageHandle from '/img/no-image-handle.png';
definePageMeta({ layout: "admin" });
import { ref, onMounted, nextTick, computed } from 'vue';
import { usePests } from '~/composables/usePests';
import { useUpload } from '~/composables/useUpload';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import eye from '/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '/icon/eye-slash-alt-svgrepo-com.svg';

const { getPests, createPest, updatePest, deletePest } = usePests();
const { uploadImage } = useUpload();
const loadingstate = ref(false);
const loadingstatetext = ref('Loading');
const searchQuery = ref('');
const apisdatas = ref([]);
const dataCount = ref(0);

const showModalAddPest = ref(false);
const showModalEdit = ref(false);
const showModal = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);

const currentPest = ref({
    id: null,
    name_en: '',
    name: '',
    sci_name: '',
    lifecycle: '',
    prevent: '',
    lifecycle_en: '',
    prevent_en: '',
    image: null,
    status: 1,
    type: '1',
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
const isDragging = ref(false);
const pestFileInput = ref(null);


const triggerPestFileInput = () => {
  pestFileInput.value?.click();
};

const handlePestFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size <= 50 * 1024 * 1024) {
    const reader = new FileReader();
    reader.onload = () => {
      currentPest.value.image = reader.result; // Base64 string
    };
    reader.readAsDataURL(file);
  } else {
    alert("ไฟล์ต้องไม่เกิน 50MB และต้องเป็น PNG/JPG/JPEG เท่านั้น");
  }
};

const handlePestDragDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.size <= 50 * 1024 * 1024) {
    const reader = new FileReader();
    reader.onload = () => {
      currentPest.value.image = reader.result; // Base64 string
    };
    reader.readAsDataURL(file);
  } else {
    alert("ไฟล์ต้องไม่เกิน 50MB และต้องเป็น PNG/JPG/JPEG เท่านั้น");
  }
  isDragging.value = false;
};

const removePestImage = () => {
  currentPest.value.image = null;
  pestFileInput.value.value = ""; // reset input
};


const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        croppingImage.value = reader.result;
        showCropper.value = true;
        nextTick(() => {
            cropperInstance.value = new Cropper(cropperImage.value, {
                aspectRatio: 1, // square crop for coconut
                viewMode: 2,
                autoCropArea: 1,
            });
        });
    };
    reader.readAsDataURL(file);
};

const cropImage = () => {
    if (cropperInstance.value) {
        const canvas = cropperInstance.value.getCroppedCanvas();
        currentPest.value.image = canvas.toDataURL('image/jpeg');
        showCropper.value = false;
        cropperInstance.value.destroy();
    }
};

const cancelCrop = () => {
    showCropper.value = false;
    cropperInstance.value.destroy();
};

// --- Table logic ---
const toggleSelectAll = () => apisdatas.value.forEach(p => p.selected = selectAll.value);

const toggleSort = (column) => {
    if (sortBy.value === column) sortDirection.value *= -1;
    else {
        sortBy.value = column;
        sortDirection.value = column === 'status' ? -1 : 1;
    }
};

const filteredSortedPests = computed(() => {
    let filtered = apisdatas.value.filter(p =>
        p.id.toString().includes(searchQuery.value) ||
        p.name_en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (sortBy.value) {
        filtered.sort((a, b) => {
            let valA = a[sortBy.value], valB = b[sortBy.value];
            if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
            if (['name_en', 'name'].includes(sortBy.value)) return valA.localeCompare(valB, 'th') * sortDirection.value;
            if (sortBy.value === 'status') return (valB - valA) * sortDirection.value;
            return 0;
        });
    }
    return filtered;
});

// --- Fetch API ---
const fetchApi = async () => {
    try {
        const data = await getPests();
        apisdatas.value = data.map(p => ({ ...p, selected: false }));
        dataCount.value = apisdatas.value.length;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        apisdatas.value = [];
        dataCount.value = 0;
    }
};

// --- Status toggle ---
const toggleStatus = async (pest) => {
    try {
        const newStatus = !pest.status;
        pest.status = newStatus;

        const payload = { ...pest, status: newStatus ? 1 : 0 };
        const updated = await updatePest(pest.id, payload);
        Object.assign(pest, updated);
    } catch (error) {
        alert('Error updating pest status.');
        console.error(error);
    }
};

// --- Add/Edit modal ---
const openAddPestModal = () => {
    currentPest.value = {
        id: null, name_en: '', name: '', sci_name: '', lifecycle: '', prevent: '',
        lifecycle_en: '', prevent_en: '', image: null, status: 1, type: '1'
    };
    showModalAddPest.value = true;
};

const editItem = (pest) => {
    currentPest.value = { ...pest };
    showModalEdit.value = true;
};

const bulkUpdateStatus = async (statusValue) => {
    loadingstatetext.value = statusValue ? 'Publishing selected pests' : 'Unpublishing selected pests';
    loadingstate.value = true;
    try {

        const selectedPests = apisdatas.value.filter(p => p.selected);
        if (!selectedPests.length) {
            alert('Please select at least one pest.');
            return;
        }


        const updatePromises = selectedPests.map(pest => {
            const payload = { ...pest, status: statusValue ? 1 : 0 };
            return updatePest(pest.id, payload);
        });


        await Promise.all(updatePromises);


        apisdatas.value.forEach(p => {
            if (p.selected) p.status = statusValue ? 1 : 0;
        });


    } catch (error) {
        alert(`Error updating pests: ${error.message}`);
        console.error(error);
    }
    loadingstatetext.value = statusValue ? 'Publishing selected pests' : 'Unpublishing selected pests';
    loadingstate.value = false;
};

const submitPest = async (publish) => {
    loadingstatetext.value = publish ? 'Adding & Publishing pest' : 'Adding pest';
    loadingstate.value = true;
    if (!currentPest.value.name_en.trim() || !currentPest.value.name.trim()) {
        alert('Please fill in required fields.');
        return;
    }

    try {
        let imagePath = currentPest.value.image;

        // Upload image if it’s new
        if (imagePath?.startsWith('data:image')) {
            const base64Image = imagePath.split(',')[1];
            const imageName = `pest_${Date.now()}`;
            imagePath = `/images/${imageName}.webp`;
            const uploadResponse = await uploadImage(base64Image, imagePath);
            if (uploadResponse.error) throw new Error(uploadResponse.error);
        }

        const payload = { ...currentPest.value, image: imagePath, status: publish ? 1 : 0 };

        if (currentPest.value.id) {
            await updatePest(currentPest.value.id, payload);

        } else {
            const newPest = await createPest(
                payload.image, payload.name, payload.name_en, payload.sci_name,
                payload.lifecycle, payload.prevent, payload.lifecycle_en,
                payload.prevent_en, payload.status, payload.type
            );
            currentPest.value.id = newPest.id;
            loadingstatetext.value = 'Successfully added pest';
        }
        loadingstate.value = false;

        showModalAddPest.value = false;
        showModalEdit.value = false;
        fetchApi();
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);

    }
    loadingstate.value = false;
};

// --- Delete ---
const askDelete = (id, name) => { deleteId.value = id; deleteName.value = name; showModal.value = true; };
const confirmDelete = async () => {
    try {
        await deletePest(deleteId.value);
        apisdatas.value = apisdatas.value.filter(p => p.id !== deleteId.value);
        dataCount.value = apisdatas.value.length;
        showModal.value = false;
        alert('Pest deleted successfully.');
    } catch (error) {
        alert(`Error deleting pest: ${error.message}`);
        console.error(error);
    } finally { deleteId.value = null; }
};
const cancelDelete = () => showModal.value = false;
const closeModal = () => { showModalAddPest.value = false; showModalEdit.value = false; };

onMounted(fetchApi);
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
    text-align: center;
    /* horizontal center */
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

.pest-check-publish {
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

.published-pest-btn {
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

.published-pest-btn:hover {
    color: white;
    background-color: #599c91;
}

.published-pest-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.unpublished-pest-btn {
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

.unpublished-pest-btn:hover {
    color: white;
    background-color: #569187;
}

.unpublished-pest-btn:active {
    border: #569187 solid 3px;
    background-color: #569187;
    box-shadow: outset 0px 0px 0px 3px white;
}

.add-pest-btn {
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

.add-pest-btn:hover {
    color: white;
    background-color: #4E6D16;
}

.add-pest-btn:active {
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