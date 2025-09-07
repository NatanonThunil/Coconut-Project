<template>
    <div style="height: 5rem;"></div>
    <div class="table-head-text-container">
        <h1>จัดการกิจกรรม</h1>
        <p>มีกิจกรรมทั้งหมด {{ EventsNum }}</p>
    </div>
    <div class="add-btn-container">
        <SearchInput v-model:search="searchQuery" placeholder="ค้นหาด้วย id, ชื่อ, ผุ้เขียน หรือ วันที่" />
        <div class="news-check-publish">
            <button class="published-news-btn" @click="bulkUpdateStatus(true)">All Checked Publish</button>
            <button class="unpublished-news-btn" @click="bulkUpdateStatus(false)">All Checked Unpublish</button>
            <button class="add-news-btn" @click="openAddEventModal">ADD Event</button>
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
                            <div>Title<button @click="toggleSort('title')">
                                    <div :class="{ 'rotate': sortBy === 'title' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Organizer<button @click="toggleSort('organizer')">
                                    <div :class="{ 'rotate': sortBy === 'organizer' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Date start<button @click="toggleSort('date_start')">
                                    <div :class="{ 'rotate': sortBy === 'date_start' && sortDirection === -1 }">▲</div>
                                </button></div>
                        </div>
                    </th>
                    <th>
                        <div class="checkbox-id-container">
                            <div>Date end<button @click="toggleSort('date_end')">
                                    <div :class="{ 'rotate': sortBy === 'date_end' && sortDirection === -1 }">▲</div>
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

                    <th></th>
                </tr>
            </thead>

            <tbody v-if="filteredSortedEvents.length">
                <tr v-for="event in filteredSortedEvents" :key="event.id">
                    <td>
                        <div class="checkbox-id-container">
                            <input type="checkbox" v-model="event.selected" class="checkbox-decorate" />
                            <p>{{ event.id }}</p>
                        </div>
                    </td>
                    <td>
                        <img v-if="event.image" :src="event.image" alt="Event Image" class="event-image" />
                    </td>
                    <td>{{ event.title }}</td>
                    <td>{{ event.organizer }}</td>
                    <td>{{ formatDate(event.date_start) }}</td>
                    <td>{{ formatDate(event.date_end) }}</td>
                    <td>
                        <label class="status-toggle">
                            <input type="checkbox" :checked="event.status" @change="toggleStatus(event)" />
                            <img class="eyesicon" :src="event.status ? eye : eyeBlink" alt="Visibility Icon" />
                        </label>
                    </td>

                    <td class="action-buttons">
                        <div class="action-btn-container">
                            <button @click="editItem(event)" class="edit-btn"><img src="/icon/pen.png" alt=""></button>
                            <button @click="askDelete(event.id, event.title)" class="delete-btn"><img
                                    src="/icon/trash.png" alt=""></button>
                        </div>
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

    <div v-if="showModalAddEvent || showModalEdit" class="modal-overlay">
        <form class="modal-add" @submit.prevent>
            <h2>{{ showModalEdit ? 'แก้ไขข่าว' : 'เพิ่มข่าว' }}</h2>
            <div class="divider"></div>
            <div class="modal-content">
                <section>
                    <label>พาดหัวข่าว</label>
                    <input class="add-text-input" v-model="currentEvent.title" placeholder="Enter title" required />
                    <label>Title (English)</label>
                    <input class="add-text-input" v-model="currentEvent.title_en" placeholder="Enter title in English"
                        required />
                    <label>ชื่อผู้เขียน</label>
                    <input class="add-text-input" v-model="currentEvent.organizer" placeholder="Enter author name"
                        required />
                    <label>รองรับรูปภาพ PNG, JPG และ JPEG</label>
                    <div class="image-upload-container">
                        <div class="image-input-drag-n-drop-container" :class="{ dragover: isDragging }"
                            @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDragDrop">
                            <img v-if="!currentEvent.image" src="/icon/upload.svg" draggable="false" />
                            <h2 v-if="!currentEvent.image">ลากไฟล์ลงที่นี่หรือคลิกเพื่อเลือก</h2>
                            <div v-if="currentEvent.image" class="image-preview">
                                <img :src="currentEvent.image" alt="Uploaded Image" class="preview-image" />
                                <button class="remove-btn" @click="removeImage">X</button>
                            </div>
                            <input type="file" accept="image/jpeg, image/png" @change="handleFileUpload"
                                class="file-uploader" ref="fileInput" />
                            <button type="button" class="browse-btn" @click="triggerFileInput">Browse File</button>
                        </div>
                    </div>
                    <label>Location Name</label>
                    <input class="add-text-input" v-model="currentEvent.location_name" placeholder="Enter location name"
                        required />
                    <label>Location Name (English)</label>
                    <input class="add-text-input" v-model="currentEvent.location_name_en"
                        placeholder="Enter location name in English" required />
                    <label>Location URL</label>
                    <input class="add-text-input" v-model="currentEvent.location_url" placeholder="Enter location URL"
                        required />
                    <label>Register URL</label>
                    <input class="add-text-input" v-model="currentEvent.register_url" placeholder="Enter register URL"
                        required />
                </section>
                <section>
                    <label>Date Start</label>
                    <input type="date" v-model="currentEvent.date_start" class="date-input" required />
                    <label>Date End</label>
                    <input type="date" v-model="currentEvent.date_end" class="date-input" required />
                    <label>Category</label>
                    <select v-model="currentEvent.category" class="category-select" required>
                        <option value="educate">Educate</option>
                        <option value="conference">Conference</option>
                        <option value="other">Other</option>
                    </select>
                    <label>Description</label>
                    <TiptapEditor v-model="currentEvent.description" />
                    <label>Description (English)</label>
                    <TiptapEditor v-model="currentEvent.description_en" />
                </section>
            </div>
            <div class="modal-actions">
                <button type="button" class="confirme-btn" @click.prevent="submitEvent(false)">{{ showModalEdit ?
                    'Update without publish' : 'Add without publish' }}</button>
                <button type="button" class="confirm-btn" @click.prevent="submitEvent(true)">{{ showModalEdit ? 'Update & Publish' : 'Add & Publish' }}</button>
                <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            </div>
        </form>
    </div>

    <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" hidden>
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
import eye from '/icon/eye-alt-svgrepo-com.svg';
import eyeBlink from '/icon/eye-slash-alt-svgrepo-com.svg';
import TiptapEditor from '@/components/TiptapEditor.vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { useEvents } from "~/composables/useEvents";
import { useUpload } from "~/composables/useUpload";

const { getEvents, createEvent, updateEvent, deleteEvent } = useEvents();
const { uploadImage } = useUpload();

const apiEndpoint = 'events';
const searchQuery = ref('');
const Events = ref([]);
const EventsNum = ref(0);
const selectAll = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModal = ref(false);
const showModalAddEvent = ref(false);
const showModalEdit = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const sortBy = ref(null);
const sortDirection = ref(1);
const currentEvent = ref({
    id: null,
    title: '',
    title_en: '',
    image: '',
    organizer: '',
    description: '',
    description_en: '',
    category: 'educate',
    date_start: '',
    date_end: '',
    status: false,
    location_name: '',
    location_name_en: '',
    location_url: '',
    register_url: '',
});
const cropper = ref(null);
const cropperInstance = ref(null);
const croppingImage = ref(null);
const showCropper = ref(false);
const cropperImage = ref(null);
const pendingImageFile = ref(null);

const fetchEvents = async () => {
    try {
        const data = await getEvents();
        Events.value = data.map(event => ({ ...event, selected: false }));
        EventsNum.value = Events.value.length;
    } catch (error) {
        alert('Error fetching events.');
    }
};

const toggleStatus = async (event) => {
    try {
        const newStatus = !event.status;
        // Format dates to MySQL format
        const formatDateForMySQL = (dateStr) => {
            if (!dateStr) return null;
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return `${dateStr} 00:00:00`;
            }
            const date = new Date(dateStr);
            const pad = n => n.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        await updateEvent(event.id, {
            ...event,
            status: newStatus ? 1 : 0,
            date_start: formatDateForMySQL(event.date_start),
            date_end: formatDateForMySQL(event.date_end),
        });
        event.status = newStatus;
    } catch (error) {
        alert('Error updating event status.');
        console.error(error);
    }
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const editItem = (event) => {
    const toBangkokTime = (dateStr) => {
        const date = new Date(dateStr);
        const bangkokOffset = 7 * 60 * 60 * 1000;
        return new Date(date.getTime() + bangkokOffset).toISOString().slice(0, 10);
    };

    currentEvent.value = {
        ...event,
        title_en: event.title_en || '',
        description_en: event.description_en || '',
        location_name_en: event.location_name_en || '',
        status: !!event.status,
        description: event.description || "",
        date_start: event.date_start ? toBangkokTime(event.date_start) : '',
        date_end: event.date_end ? toBangkokTime(event.date_end) : '',
        category: event.event_category || 'other',
    };

    showModalEdit.value = true;
    nextTick(() => {
        console.log("Setting Tiptap Content:", currentEvent.value.description);
    });
};

const filteredSortedEvents = computed(() => {
    let filtered = Events.value.filter(event =>
        event.id.toString().includes(searchQuery.value) ||
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.date_start.includes(searchQuery.value) ||
        event.date_end.includes(searchQuery.value)
    );

    if (sortBy.value) {
        filtered.sort((a, b) => {
            let valA = a[sortBy.value];
            let valB = b[sortBy.value];

            if (sortBy.value === 'id') return (valA - valB) * sortDirection.value;
            if (sortBy.value === 'title' || sortBy.value === 'organizer') return valA.localeCompare(valB, 'th') * sortDirection.value;
            if (sortBy.value === 'status') return (valB - valA) * sortDirection.value;
            if (sortBy.value === 'date_start' || sortBy.value === 'date_end') return (new Date(valB) - new Date(valA)) * sortDirection.value;
            return 0;
        });
    }
    return filtered;
});

const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortDirection.value *= -1;
    } else {
        sortBy.value = column;
        sortDirection.value = column === 'status' ? -1 : 1;
    }
};

const openAddEventModal = () => {
    currentEvent.value = {
        id: null,
        title: '',
        title_en: '',
        image: '',
        organizer: '',
        description: '',
        description_en: '',
        category: 'other',
        date_start: '',
        date_end: '',
        status: false,
        location_name: '',
        location_name_en: '',
        location_url: '',
        register_url: '',
    };
    pendingImageFile.value = null;
    showModalAddEvent.value = true;
};

const bulkUpdateStatus = async (publish) => {
    try {
        const selectedEvents = Events.value.filter(event => event.selected);
        if (selectedEvents.length === 0) {
            alert('No events selected.');
            return;
        }

        const updatePromises = selectedEvents.map(event =>
            updateEvent(event.id, { ...event, status: publish ? 1 : 0 })
        );

        await Promise.all(updatePromises);

        selectedEvents.forEach(event => {
            event.status = publish ? 1 : 0;
        });

        alert(`Successfully ${publish ? 'published' : 'unpublished'} selected events.`);
    } catch {
        alert('Failed to update event status.');
    }
};
function formatDateForMySQL(dateStr) {
    if (!dateStr) return null;
    // If input is 'YYYY-MM-DD', just append time
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return `${dateStr} 00:00:00`;
    }
    // Otherwise, parse and format
    const date = new Date(dateStr);
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const submitEvent = async (publish) => {
    if (!currentEvent.value.title.trim() || !currentEvent.value.organizer.trim()) {
        alert('Please fill in all required fields: Title and Organizer.');
        return;
    }

    try {
        const formattedDateStart = formatDateForMySQL(currentEvent.value.date_start);
        const formattedDateEnd = formatDateForMySQL(currentEvent.value.date_end);

        let imagePath = currentEvent.value.image;
        if (pendingImageFile.value) {
            const fileName = `event_${Date.now()}.webp`;
            const resp = await uploadImage(pendingImageFile.value, fileName);
            if (resp?.error) throw new Error(resp.error);
            imagePath = resp.path || `/images/${fileName}`;
        } else if (typeof imagePath === 'string' && imagePath.startsWith('data:image')) {
            const fileName = `event_${Date.now()}`;
            const resp = await uploadImage(imagePath, fileName);
            if (resp?.error) throw new Error(resp.error);
            imagePath = resp.path || `/images/${fileName}`;
        }

        const payload = {
            ...currentEvent.value,
            image: imagePath,
            title_en: currentEvent.value.title_en,
            description_en: currentEvent.value.description_en,
            location_name_en: currentEvent.value.location_name_en,
            date_start: formattedDateStart,
            date_end: formattedDateEnd,
            status: publish ? 1 : 0,
        };

        if (currentEvent.value.id) {
            await updateEvent(currentEvent.value.id, payload);
            alert('Event updated successfully.');
        } else {
            const newEvent = await createEvent(
                payload.image,
                payload.title,
                payload.organizer,
                payload.date_start,
                payload.date_end,
                payload.location_name,
                payload.location_url,
                payload.register_url,
                payload.description,
                payload.category,
                payload.status,
                payload.location_name_en,
                payload.title_en,
                payload.description_en
            );
            currentEvent.value.id = newEvent.id;
            alert('Event added successfully.');
        }

        showModalAddEvent.value = false;
        showModalEdit.value = false;
        pendingImageFile.value = null;
        fetchEvents();
    } catch (error) {
        alert('Error while submitting event.');
        console.error('Submit Event Error:', error);
    }
};

const closeModal = () => {
    showModalAddEvent.value = false;
    showModalEdit.value = false;
};

const removeImage = () => {
    currentEvent.value.image = '';
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
                    scalable: false,
                });
            });
        };
        reader.readAsDataURL(file);
    }
};

const askDelete = (id, title) => {
    deleteId.value = id;
    deleteName.value = title;
    showModal.value = true;
};

const confirmDelete = async () => {
    try {
        await deleteEvent(deleteId.value);
        Events.value = Events.value.filter(event => event.id !== deleteId.value);
        EventsNum.value = Events.value.length;
        showModal.value = false;
        alert('Event deleted successfully.');
    } catch (error) {
        alert(`Error deleting event: ${error.message}`);
        console.error(error);
    } finally {
        deleteId.value = null;
    }
};

const cancelDelete = () => {
    showModal.value = false;
};

onMounted(() => {
    fetchEvents();
});

const toggleSelectAll = () => {
    Events.value.forEach(event => event.selected = selectAll.value);
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
                aspectRatio: 8 / 3,
                viewMode: 2,
                autoCropArea: 1
            });
        });
    };
    reader.readAsDataURL(file);
};

const cropImage = () => {
    if (cropperInstance.value) {
        const canvas = cropperInstance.value.getCroppedCanvas();
        pendingImageFile.value = new File([canvas.toDataURL('image/jpeg')], `event_${Date.now()}.jpg`, { type: 'image/jpeg' });
        currentEvent.value.image = canvas.toDataURL('image/jpeg');
        showCropper.value = false;
        cropperInstance.value.destroy();
    }
};

const cancelCrop = () => {
    showCropper.value = false;
    cropperInstance.value.destroy();
};
</script>

<style scoped>
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