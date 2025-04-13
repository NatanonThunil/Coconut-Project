<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการบริการ</h1>
        <p>มีบริการทั้งหมด {{ ServicesNum }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ หรือ รายละเอียด" />
        <div class="news-check-publish">
            <button class="add-news-btn" @click="openAddServiceModal">เพิ่มบริการ</button>
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
                            <div>
                                Title
                                <button @click="toggleSort('title')">
                                    <div :class="{ 'rotate': sortBy === 'title' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>
                                Description
                                <button @click="toggleSort('description')">
                                    <div :class="{ 'rotate': sortBy === 'description' && sortDirection === -1 }">▲</div>
                                </button>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Status</div>
                        </div>
                    </th>

                    <th></th>
                </tr>
            </thead>

            <tbody v-if="filteredSortedServices.length">
                <tr v-for="service in filteredSortedServices" :key="service.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="service.selected"  class="checkbox-decorate" />
                            <p>{{ service.id }}</p>
                        </div>
                    </td>
                    <td>
                        <img v-if="service.image" :src="service.image" alt="Service Image" class="service-image" />
                    </td>
                    <td>{{ service.title }}</td>
                    <td>{{ service.description }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="service.status" @change="toggleStatus(service)" />
                            <img class="eyesicon" :src="service.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>
                    <td class="action-buttons">
                        <div class="action-btn-container">
                            <button @click="editItem(service)" class="edit-btn"><img src="/icon/pen.png"
                                    alt="Edit"></button>
                            <button @click="askDelete(service.id, service.title)" class="delete-btn"><img
                                    src="/icon/trash.png" alt="Delete"></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Delete Confirmation Modal -->
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

    <!-- Add / Edit Modal -->
    <div v-if="showModalAddService || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขบริการ' : 'เพิ่มบริการ' }}</h2>
            <div class="lang-toggle">
                <button type="button" @click="toggleLang">
                    Switch to {{ activeLang ? 'English' : 'Thai' }}
                </button>
            </div>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>รองรับรูปภาพ PNG, JPG และ JPEG</label>
                    <div class="image-upload-container">
                        <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
                            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDragDrop">
                            <img v-if="!currentService.image" src="/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentService.image">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>
                            <div v-if="currentService.image" class="image-preview">
                                <img :src="currentService.image" alt="Uploaded Image" class="preview-image" />
                                <button class="remove-btn" @click="removeImage">X</button>
                            </div>
                            <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload"
                                class="file-uploader" ref="fileInput" />
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
                        </div>
                    </div>
                    <label>{{ activeLang ? 'ชื่อบริการ' : 'ชื่อบริการ (English)' }}</label>
                    <input v-show="activeLang" class="add-text-input" v-model="currentService.title"
                        placeholder="Enter title" required />
                    <input v-show="!activeLang" class="add-text-input" v-model="currentService.title_en"
                        placeholder="Enter title" required />
                    <label>{{ activeLang ? 'รายละเอียด' : 'รายละเอียด (English)' }}</label>
                    <TiptapEditor v-show="activeLang" v-model="currentService.description" />
                    <TiptapEditor v-show="!activeLang" v-model="currentService.description_en" />

                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirme-btn" @click.prevent="submitService(false)">
                    {{ showModalEdit ? 'Update without publish' : 'Add without publish' }}
                </button>
                <button type="button" class="confirm-btn" @click.prevent="submitService(true)">
                    {{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}
                </button>
                <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </form>
    </div>

    <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" hidden />
    <div v-if="showCropper" class="cropper-container">
        <div class="cropper-wrapper">
            <img ref="cropperImage" :src="croppingImage" class="cropper-preview">
        </div>
        <div class="cropper-actions">
            <button @click="cropImage" class="crop-btn">Crop & Upload</button>
            <button @click="cancelCrop" class="cancel-btn">Cancel</button>
        </div>
    </div>

    <div style="height: 5rem;"></div>
</template>

<script setup>
definePageMeta({
    layout: "admin",
});

import { ref, onMounted, computed, nextTick } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import eye from '/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '/icon/eye-slash-alt-svgrepo-com.svg';
const apiEndpoint = 'services';
const searchQuery = ref('');
const Services = ref([]);
const ServicesNum = ref(0);
const selectAll = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModal = ref(false);
const showModalAddService = ref(false);
const showModalEdit = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const sortBy = ref(null);
const sortDirection = ref(1);
const currentService = ref({
    id: null,
    title: '',
    title_en: '',
    image: '',
    description: '',
    description_en: ''
});
const cropperInstance = ref(null);
const croppingImage = ref(null);
const showCropper = ref(false);
const cropperImage = ref(null);
const activeLang = ref(true);

const toggleLang = () => {
    activeLang.value = activeLang.value === true ? false : true;
};
const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortDirection.value *= -1;
    } else {
        sortBy.value = column;
        sortDirection.value = 1;
    }
};
const toggleStatus = async (service) => {
    try {
        const newStatus = !service.status;
        const payload = {
            status: newStatus ? 1 : 0,
            title: service.title, // Include title
            description: service.description, // Include description
            title_en: service.title_en, // Include title_en
            description_en: service.description_en, // Include description_en
            image: service.image || '', // Include image if available
        };

        const response = await fetch(`/api/${apiEndpoint}/${service.id}`, {
            method: 'PUT',
            headers: { 'CKH': '541986Cocon', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Failed to update service status:', {
                status: response.status,
                statusText: response.statusText,
                body: errorBody,
            });
            throw new Error(errorBody.error || 'Failed to update service status.');
        }

        service.status = newStatus;
    } catch (error) {
        alert(`Error updating service status: ${error.message}`);
        console.error('Error in toggleStatus:', error);
    }
};
const fetchServices = async () => {
    try {
        const response = await $fetch(`/api/${apiEndpoint}`, { headers: { 'CKH': '541986Cocon' } });
        // If response is an object with a 'services' property, use that; otherwise, try response.data or use response itself.
        const data = Array.isArray(response)
            ? response
            : response.services || response.data || [];
        Services.value = data.map(service => ({ ...service, selected: false }));
        ServicesNum.value = Services.value.length;
    } catch (error) {
        alert('Error fetching services.');
        console.error(error);
    }
};


const filteredSortedServices = computed(() => {
    let filtered = Services.value.filter(service =>
        service.id.toString().includes(searchQuery.value) ||
        service.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (sortBy.value) {
        filtered.sort((a, b) => {
            let valA = a[sortBy.value];
            let valB = b[sortBy.value];
            if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
            return valA.localeCompare(valB, 'th') * sortDirection.value;
        });
    }
    return filtered;
});

const toggleSelectAll = () => {
    Services.value.forEach(service => service.selected = selectAll.value);
};

const openAddServiceModal = () => {
    currentService.value = {
        id: null,
        title: '',
        title_en: '',
        image: '',
        description: '',
        description_en: ''
    };
    showModalAddService.value = true;
};

const editItem = (service) => {
    currentService.value = { ...service };
    showModalEdit.value = true;
    nextTick(() => {
        console.log("Editing service:", currentService.value);
    });
};

const askDelete = (id, title) => {
    deleteId.value = id;
    deleteName.value = title;
    showModal.value = true;
};

const confirmDelete = async () => {
    try {
        const response = await fetch(`/api/${apiEndpoint}/${deleteId.value}`, {
            method: 'DELETE',
            headers: { 'CKH': '541986Cocon' }
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete service.');
        }
        Services.value = Services.value.filter(service => service.id !== deleteId.value);
        ServicesNum.value = Services.value.length;
        showModal.value = false;
        alert('Service deleted successfully.');
    } catch (error) {
        alert(`Error deleting service: ${error.message}`);
        console.error(error);
    } finally {
        deleteId.value = null;
    }
};

const cancelDelete = () => {
    showModal.value = false;
};

const submitService = async (publish) => {
    if (!currentService.value.title.trim() || !currentService.value.description.trim()) {
        alert('Please fill in all required fields: Title and Description.');
        return;
    }
    try {
        const isUpdate = !!currentService.value.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `/api/${apiEndpoint}/${currentService.value.id}` : `/api/${apiEndpoint}`;
        const payload = {
            title: currentService.value.title,
            title_en: currentService.value.title_en,
            description: currentService.value.description,
            description_en: currentService.value.description_en,
            image: currentService.value.image || '',
            status: publish ? 1 : 0
        };
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'CKH': '541986Cocon'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error('Error saving the service.');
        }
        const result = await response.json();
        if (!isUpdate) {
            currentService.value.id = result.insertId;
            alert('Service added successfully.');
        } else {
            alert('Service updated successfully.');
        }
        showModalAddService.value = false;
        showModalEdit.value = false;
        fetchServices();
    } catch (error) {
        alert('Error while submitting service.');
        console.error('Submit Service Error:', error);
    }
};

const closeModal = () => {
    showModalAddService.value = false;
    showModalEdit.value = false;
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const removeImage = () => {
    currentService.value.image = '';
};

const handleDragDrop = (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload({ target: { files } });
    }
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            croppingImage.value = reader.result;
            showCropper.value = true;
            nextTick(() => {
                cropperInstance.value = new Cropper(cropperImage.value, {
                    aspectRatio: 16 / 9,
                    viewMode: 1,
                    autoCropArea: 1,
                    background: false,
                    zoomable: false,
                    movable: false,
                    rotatable: false,
                    scalable: false
                });
            });
        };
        reader.readAsDataURL(file);
    }
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        croppingImage.value = reader.result;
        showCropper.value = true;
        nextTick(() => {
            cropperInstance.value = new Cropper(cropperImage.value, {
                aspectRatio: 16 / 9,
                viewMode: 1,
                autoCropArea: 1,
            });
        });
    };
    reader.readAsDataURL(file);
};

const cropImage = () => {
    if (cropperInstance.value) {
        const canvas = cropperInstance.value.getCroppedCanvas();
        currentService.value.image = canvas.toDataURL('image/jpeg');
        showCropper.value = false;
        cropperInstance.value.destroy();
    }
};

const cancelCrop = () => {
    showCropper.value = false;
    cropperInstance.value.destroy();
};

onMounted(() => {
    fetchServices();
});
</script>

<style scoped>
.service-image {
    max-height: 5rem;
    object-fit: cover;
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
    width: 6%;
}

.item-list-table th:nth-child(2),
.item-list-table td:nth-child(2) {
    width: 8%;
}

.item-list-table th:nth-child(3),
.item-list-table td:nth-child(3) {
    width: 20%;
    max-width: max-content;
}

.item-list-table th:nth-child(4),
.item-list-table td:nth-child(4) {
    width: 10%;
}

.item-list-table th:nth-child(5),
.item-list-table td:nth-child(5) {
    width: 10%;
    text-align: center;
}

.item-list-table th:nth-child(6),
.item-list-table td:nth-child(6) {
    width: 12%;
    text-align: center;
}

.item-list-table th:nth-child(7),
.item-list-table td:nth-child(7) {
    width: 8%;
    text-align: center;
}

.item-list-table th:nth-child(8),
.item-list-table td:nth-child(8) {
    width: 8%;
    text-align: center;
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

.event-image {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 5px;
}

.checkbox-decorate {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    accent-color: #4E6D16;
}
</style>