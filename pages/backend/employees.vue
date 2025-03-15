<template>
  <div style="height: 5rem"></div>
  <div class="table-head-text-container">
    <h1>จัดการพนักงาน</h1>
    <p>มีพนักงานทั้งหมด {{ employeesNum }}</p>
  </div>
  <div class="add-btn-container">
    <SearchInput
      v-model:search="searchQuery"
      placeholder="ค้นหาด้วย id, ชื่อ, ที่อยู่ หรือ เบอร์โทร"
    />
    <div class="employee-check-publish">
      <button class="published-news-btn" @click="bulkUpdateStatus(true)">
        All Checked Publish
      </button>
      <button class="unpublished-news-btn" @click="bulkUpdateStatus(false)">
        All Checked Unpublish
      </button>
      <button class="add-news-btn" @click="openAddEmployeeModal">
        ADD Employee
      </button>
    </div>
  </div>

  <div class="table-container">
    <table class="item-list-table">
      <thead>
        <tr>
          <th>
            <div class="checkbox-id-container">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="checkbox-decorate"
              />
              <span>ID</span>
              <button @click="toggleSort('id')">
                <div
                  :class="{ rotate: sortBy === 'id' && sortDirection === -1 }"
                >
                  ▲
                </div>
              </button>
            </div>
          </th>
          <th>
            <div class="checkbox-id-container">
              <div>
                Name<button @click="toggleSort('name')">
                  <div
                    :class="{
                      rotate: sortBy === 'name' && sortDirection === -1,
                    }"
                  >
                    ▲
                  </div>
                </button>
              </div>
            </div>
          </th>
          <th>
            <div class="checkbox-id-container">
              <div>
                Email<button @click="toggleSort('email')">
                  <div
                    :class="{
                      rotate: sortBy === 'email' && sortDirection === -1,
                    }"
                  >
                    ▲
                  </div>
                </button>
              </div>
            </div>
          </th>
          <th>
            <div class="checkbox-id-container">
              <div>
                Address<button @click="toggleSort('address')">
                  <div
                    :class="{
                      rotate: sortBy === 'address' && sortDirection === -1,
                    }"
                  >
                    ▲
                  </div>
                </button>
              </div>
            </div>
          </th>
          <th>
            <div class="checkbox-id-container">
              <div>
                Phone Number<button @click="toggleSort('phoneNumber')">
                  <div
                    :class="{
                      rotate: sortBy === 'phoneNumber' && sortDirection === -1,
                    }"
                  >
                    ▲
                  </div>
                </button>
              </div>
            </div>
          </th>

          <th>
            <div class="checkbox-id-container">
              <div>
                Tags<button @click="toggleSort('tags')">
                  <div
                    :class="{
                      rotate: sortBy === 'tags' && sortDirection === -1,
                    }"
                  >
                    ▲
                  </div>
                </button>
              </div>
            </div>
          </th>
          <th>
            <div class="checkbox-id-container">
              <div>
                Status<button @click="toggleSort('status')">
                  <div
                    :class="{
                      rotate: sortBy === 'status' && sortDirection === -1,
                    }"
                  >
                    ▲
                  </div>
                </button>
              </div>
            </div>
          </th>
          <th></th>
        </tr>
      </thead>

      <tbody v-if="filteredSortedEmployees.length">
        <tr v-for="employee in filteredSortedEmployees" :key="employee.id">
          <td>
            <div class="checkbox-id-container">
              <input type="checkbox" v-model="employee.selected" />
              <p>{{ employee.id }}</p>
            </div>
          </td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.address }}</td>
          <td>{{ employee.phoneNumber }}</td>

          <td>{{ employee.tags.join(", ") }}</td>
          <td>
            <label class="status-toggle">
              <input
                type="checkbox"
                :checked="employee.status"
                @change="toggleStatus(employee)"
              />
              <img
                class="eyesicon"
                :src="employee.status ? eye : eyeBlink"
                alt="Visibility Icon"
              />
            </label>
          </td>
          <td class="action-buttons">
            <div class="action-btn-container">
              <button @click="editItem(employee)" class="edit-btn">
                <img src="@/assets/icon/pen.png" alt="" />
              </button>
              <button
                @click="askDelete(employee.id, employee.name)"
                class="delete-btn"
              >
                <img src="@/assets/icon/trash.png" alt="" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <div class="text-alert-container">
        <span
          >ต้องการที่จะ
          <span style="color: red; font-size: larger; font-weight: bolder"
            >ลบ</span
          ></span
        >
        <p>" {{ deleteName }} "</p>
      </div>
      <div class="modal-actions">
        <button @click="confirmDelete" class="confirm-btn">Yes</button>
        <button @click="cancelDelete" class="cancel-btn">No</button>
      </div>
    </div>
  </div>

  <div v-if="showModalAddEmployee || showModalEdit" class="modal-overlay">
    <form class="modal-add" @submit.prevent>
      <h2>{{ showModalEdit ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน" }}</h2>
      <div class="divider"></div>
      <div class="modal-content">
        <section>
          <label>ชื่อ</label>
          <input
            class="add-text-input"
            v-model="currentEmployee.name"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter name"
            required
          />
          <label>ชื่อ (อังกฤษ)</label>
          <input
            class="add-text-input"
            v-model="currentEmployee.name_en"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter name in English"
            required
          />
          <label>ที่อยู่</label>
          <input
            class="add-text-input"
            v-model="currentEmployee.address"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter address"
            required
          />
          <label>ที่อยู่ (อังกฤษ)</label>
          <input
            class="add-text-input"
            v-model="currentEmployee.address_en"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter address in English"
            required
          />
          <label>เบอร์โทร</label>
          <input
            class="add-text-input"
            v-model="currentEmployee.phoneNumber"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter phone number"
            required
          />
          <label>Email</label>
          <input
            class="add-text-input"
            v-model="currentEmployee.email"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter email"
            required
          />
          <label>คำอธิบาย</label>
          <textarea
            class="add-text-input"
            v-model="currentEmployee.description"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter description"
          ></textarea>
          <label>คำอธิบาย (อังกฤษ)</label>
          <textarea
            class="add-text-input"
            v-model="currentEmployee.description_en"
            @input="handleInputChange"
            @keydown.enter.prevent="preventFormSubmit"
            placeholder="Enter description in English"
          ></textarea>
          <label>Tags</label>
          <div class="tags-input-container">
            <input
              class="add-text-input"
              v-model="newTag"
              @input="
                filterTags;
                handleInputChange;
              "
              @keydown.enter.prevent="preventFormSubmit"
              @keyup.enter.prevent="addTag"
              placeholder="Add a tag"
            />
            <div
              class="tag"
              v-for="(tag, index) in currentEmployee.tags"
              :key="index"
            >
              {{ tag }}
              <button type="button" @click="removeTag(index)">x</button>
            </div>

            <div v-if="filteredTags.length" class="tags-suggestions">
              <div
                v-for="(tag, index) in filteredTags"
                :key="index"
                @click="selectTag(tag)"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          <label>Image</label>
          <div class="image-upload-container">
            <div
              class="image-input-drag-n-drop-container"
              :class="{ dragover: isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleFileUpload"
            >
              <img
                v-if="!currentEmployee.image"
                src="@/assets/icon/upload.svg"
                draggable="false"
              />
              <h2 v-if="!currentEmployee.image">
                Drag & Drop or Click to Upload
              </h2>
              <div v-if="currentEmployee.image" class="image-preview">
                <img
                  :src="currentEmployee.image"
                  alt="Uploaded Image"
                  class="preview-image"
                />
                <button class="remove-btn" @click="removeImage">X</button>
              </div>
              <input
                type="file"
                accept="image/jpeg, image/png"
                @change="handleFileUpload"
                class="file-uploader"
                ref="fileInput"
              />
              <button
                type="button"
                class="browse-btn"
                @click="triggerFileInput"
              >
                Browse File
              </button>
            </div>
          </div>
        </section>
      </div>
      <div class="modal-actions">
        <button
          type="button"
          class="confirme-btn"
          @click.prevent="submitEmployee(false)"
        >
          {{ showModalEdit ? "Update without publish" : "Add without publish" }}
        </button>
        <button
          type="button"
          class="confirm-btn"
          @click.prevent="submitEmployee(true)"
        >
          {{ showModalEdit ? "Update & Publish" : "Add & Publish" }}
        </button>
        <button type="button" @click="closeModal" class="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  </div>

  <input
    type="file"
    ref="fileInput"
    @change="handleFileUpload"
    accept="image/jpeg, image/png"
    hidden
  />
  <div v-if="showCropper" class="cropper-container">
    <div class="cropper-wrapper">
      <img ref="cropperImage" :src="croppingImage" class="cropper-preview" />
    </div>
    <div class="cropper-actions">
      <button @click="cropImage" class="crop-btn">Crop & Upload</button>
      <button @click="cancelCrop" class="cancel-btn">Cancel</button>
    </div>
  </div>

  <div style="height: 5rem"></div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
});
import { ref, onMounted, computed, nextTick } from "vue";
import eye from "@/assets/icon/eye-alt-svgrepo-com.svg";
import eyeBlink from "@/assets/icon/eye-slash-alt-svgrepo-com.svg";
import "@/assets/styles/backend_style.css";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const apiEndpoint = "employees";
const searchQuery = ref("");
const employees = ref([]);
const employeesNum = ref(0);
const selectAll = ref(false);
const deleteId = ref(null);
const deleteName = ref(null);
const showModal = ref(false);
const showModalAddEmployee = ref(false);
const showModalEdit = ref(false);
const sortBy = ref(null);
const sortDirection = ref(1);
const currentEmployee = ref({
  id: null,
  name: "",
  name_en: "", // Add name_en property
  address: "",
  address_en: "", // Add address_en property
  phoneNumber: "",
  email: "", // Add email property
  description: "", // Add description property
  description_en: "", // Add description_en property
  status: 1,
  tags: [], // Add tags property
  image: "", // Add image property
});
const newTag = ref("");
const isDragging = ref(false);
const fileInput = ref(null);
const filteredTags = ref([]);
const cropperInstance = ref(null);
const croppingImage = ref(null);
const showCropper = ref(false);
const cropperImage = ref(null);
const allTags = ref(["tag1", "tag2", "tag3"]); // Example tags, replace with actual tags
const originalImage = ref(""); // Store the original image before cropping

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleDragDrop = (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload({ target: { files } });
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
    const reader = new FileReader();
    reader.onload = () => {
      originalImage.value = currentEmployee.value.image; // Save the original image
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
  } else {
    alert("Only JPEG and PNG files are allowed.");
  }
};

const cropImage = () => {
  if (cropperInstance.value) {
    const canvas = cropperInstance.value.getCroppedCanvas();
    currentEmployee.value.image = canvas.toDataURL("image/jpeg");
    showCropper.value = false;
    cropperInstance.value.destroy();
  }
};

const cancelCrop = () => {
  currentEmployee.value.image = originalImage.value; // Restore the original image
  showCropper.value = false;
  cropperInstance.value.destroy();
};

const removeImage = () => {
  currentEmployee.value.image = "";
};

const toggleStatus = async (employee) => {
  try {
    const newStatus = !employee.status;
    const response = await fetch(`/api/${apiEndpoint}/${employee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...employee, status: newStatus ? 1 : 0 }),
    });

    if (!response.ok) {
      throw new Error("Failed to update employee status.");
    }

    employee.status = newStatus;
  } catch (error) {
    alert("Error updating employee status.");
    console.error(error);
  }
};

const fetchEmployees = async () => {
  try {
    const response = await $fetch(`/api/${apiEndpoint}`);
    const employeesWithTags = await Promise.all(
      response.map(async (employee) => {
        const tagsResponse = await fetchAllTagsForEmployee(employee.id);
        return {
          ...employee,
          selected: false,
          tags: tagsResponse.map((tag) => tag.text),
        };
      })
    );
    employees.value = employeesWithTags;
    employeesNum.value = employees.value.length;
  } catch (error) {
    alert("Error fetching employees.");
    console.error("Error fetching employees:", error.message, error.stack);
  }
};

const fetchAllTagsForEmployee = async (employeeId) => {
  try {
    const response = await $fetch(
      `/api/tags_employee?employee_id=${employeeId}`
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching tags:", error.message, error.stack);
    alert("Error fetching tags.");
    return [];
  }
};

const editItem = (employee) => {
  currentEmployee.value = {
    ...employee,
    status: !!employee.status,
    tags: [...employee.tags],
    image: employee.image || "",
  };
  showModalEdit.value = true;
};

const filteredSortedEmployees = computed(() => {
  let filtered = employees.value.filter(
    (employee) =>
      employee.id.toString().includes(searchQuery.value) ||
      employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.address
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      employee.phoneNumber.includes(searchQuery.value) ||
      employee.email.toLowerCase().includes(searchQuery.value.toLowerCase()) || // Search by email
      employee.tags.some((tag) =>
        tag.toLowerCase().startsWith(searchQuery.value.toLowerCase())
      ) // Search by prefix
  );

  if (sortBy.value) {
    filtered.sort((a, b) => {
      let valA = a[sortBy.value];
      let valB = b[sortBy.value];

      if (sortBy.value === "id") return (valA - valB) * sortDirection.value;
      if (
        sortBy.value === "name" ||
        sortBy.value === "address" ||
        sortBy.value === "email"
      )
        return valA.localeCompare(valB, "th") * sortDirection.value;
      if (sortBy.value === "status") return (valB - valA) * sortDirection.value;
      if (sortBy.value === "phoneNumber")
        return (valA - valB) * sortDirection.value;
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
    sortDirection.value = column === "status" ? -1 : 1;
  }
};

const openAddEmployeeModal = () => {
  currentEmployee.value = {
    id: null,
    name: "",
    name_en: "",
    address: "",
    address_en: "",
    phoneNumber: "",
    email: "", // Add email property
    description: "",
    description_en: "",
    status: 1,
    tags: [],
    image: "",
  };
  showModalAddEmployee.value = true;
};

const bulkUpdateStatus = async (publish) => {
  try {
    const selectedEmployees = employees.value.filter(
      (employee) => employee.selected
    );
    if (selectedEmployees.length === 0) {
      alert("No employees selected.");
      return;
    }

    const updatePromises = selectedEmployees.map((employee) =>
      fetch(`/api/${apiEndpoint}/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...employee, status: publish ? 1 : 0 }),
      })
    );

    await Promise.all(updatePromises);

    selectedEmployees.forEach((employee) => {
      employee.status = publish ? 1 : 0;
    });

    alert(
      `Successfully ${
        publish ? "published" : "unpublished"
      } selected employees.`
    );
  } catch {
    alert("Failed to update employee status.");
  }
};

const submitEmployee = async (publish) => {
  if (
    !currentEmployee.value.name.trim() ||
    !currentEmployee.value.name_en.trim() ||
    !currentEmployee.value.address.trim() ||
    !currentEmployee.value.address_en.trim() ||
    !currentEmployee.value.phoneNumber.trim() ||
    !currentEmployee.value.email.trim()
  ) {
    alert(
      "Please fill in all required fields: Name, Name (English), Address, Address (English), Phone Number, and Email."
    );
    return;
  }

  try {
    const isUpdate = !!currentEmployee.value.id;
    const method = isUpdate ? "PUT" : "POST";
    const url = isUpdate
      ? `/api/${apiEndpoint}/${currentEmployee.value.id}`
      : `/api/${apiEndpoint}`;

    const payload = {
      id: currentEmployee.value.id,
      name: currentEmployee.value.name,
      name_en: currentEmployee.value.name_en, // Include name_en in payload
      address: currentEmployee.value.address,
      address_en: currentEmployee.value.address_en, // Include address_en in payload
      phoneNumber: currentEmployee.value.phoneNumber,
      email: currentEmployee.value.email, // Include email in payload
      description: currentEmployee.value.description, // Include description in payload
      description_en: currentEmployee.value.description_en, // Include description_en in payload
      status: publish ? 1 : 0,
      tags: currentEmployee.value.tags, // Include tags in payload
      image: currentEmployee.value.image || "", // Include image in payload
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Error saving the employee.");
    }

    const result = await response.json();
    if (!isUpdate) {
      currentEmployee.value.id = result.id;
      alert("Employee added successfully.");
    } else {
      alert("Employee updated successfully.");
    }

    showModalAddEmployee.value = false;
    showModalEdit.value = false;
    fetchEmployees();
  } catch (error) {
    alert("Error while submitting employee.");
    console.error("Submit Employee Error:", error);
  }
};

const closeModal = () => {
  showModalAddEmployee.value = false;
  showModalEdit.value = false;
};

const askDelete = (id, name) => {
  deleteId.value = id;
  deleteName.value = name;
  showModal.value = true;
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`/api/${apiEndpoint}/${deleteId.value}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId.value }),
    });

    const result = await response.json();
    console.log("Delete API Response:", result);

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete employee.");
    }

    employees.value = employees.value.filter(
      (employee) => employee.id !== deleteId.value
    );
    employeesNum.value = employees.value.length;

    showModal.value = false;
    alert("Employee deleted successfully.");
  } catch (error) {
    alert(`Error deleting employee: ${error.message}`);
    console.error(error);
  } finally {
    deleteId.value = null;
  }
};

const cancelDelete = () => {
  showModal.value = false;
};

const addTag = () => {
  if (
    newTag.value.trim() !== "" &&
    !currentEmployee.value.tags.includes(newTag.value.trim())
  ) {
    currentEmployee.value.tags.push(newTag.value.trim());
  }
  newTag.value = "";
  filteredTags.value = [];
  currentEmployee.value = { ...currentEmployee.value }; // Ensure the image is preserved
};

const removeTag = (index) => {
  currentEmployee.value.tags.splice(index, 1);
};

const filterTags = () => {
  const prefix = newTag.value.toLowerCase();
  filteredTags.value = allTags.value.filter(
    (tag) =>
      tag.toLowerCase().startsWith(prefix) &&
      !currentEmployee.value.tags.includes(tag)
  );
};

const selectTag = (tag) => {
  currentEmployee.value.tags.push(tag);
  newTag.value = "";
  filteredTags.value = [];
};

const handleInputChange = () => {
  currentEmployee.value.image = currentEmployee.value.image; // Explicitly set the image property to preserve it
};

const preventFormSubmit = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
};

onMounted(() => {
  fetchEmployees();
});

const toggleSelectAll = () => {
  employees.value.forEach((employee) => (employee.selected = selectAll.value));
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
  background-color: #4e6d16;
  color: white;
}

.crop-btn:hover {
  background-color: #6f8c28;
}

.cancel-btn {
  background-color: #d84e5e;
  color: white;
}

.cancel-btn:hover {
  background-color: #f86f70;
}

.checkbox-id-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}

.browse-btn:hover {
  background-color: #6f8c28;
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
  border: 2px solid #4e6d16;
  padding: 0.5rem;
}

.date-input {
  border-radius: 10px;
  border: 2px solid #4e6d16;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.category-select {
  border-radius: 10px;
  border: 2px solid #4e6d16;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  color: #4e6d16;
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
  outline: 3px dashed #4e6d16;
  color: #4e6d16;
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
  background-color: #4e6d16;
  color: white;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  background-color: #6f8c28;
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
  border: #4e6d16 solid 3px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  transition: ease-out 0.2s;
  color: white;
  background-color: #4e6d16;
  font-weight: 600;
}

.add-news-btn:hover {
  color: white;
  background-color: #4e6d16;
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
  background-color: #dadada;
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
  outline: #4e6d16 3px solid;
  color: #4e6d16;
}

.confirme-btn:active {
  background-color: rgba(0, 0, 0, 0.2);
  outline: #4e6d16 3px solid;
  color: #4e6d16;
}

.confirm-btn {
  background-color: #4e6d16;
  color: white;
}

.cancel-btn {
  background-color: #d84e5e;
  color: white;
}

.confirm-btn:hover {
  background-color: #6f8c28;
}

.cancel-btn:hover {
  background-color: #f86f70;
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
input:checked + .hotnews-slider {
  background-color: #4e6d16;
}

input:checked + .hotnews-slider:before {
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
  background-color: #4e6d16;
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
  color: #d84e5e;
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
  outline: 3px dashed #4e6d16;
  color: #4e6d16;
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
  background-color: #4e6d16;
  color: white;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  background-color: #6f8c28;
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
  border: 2px solid #4e6d16;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.add-text-input:focus {
  border-color: #6f8c28;
  box-shadow: 0 0 5px rgba(111, 140, 40, 0.5);
  outline: none;
}
</style>