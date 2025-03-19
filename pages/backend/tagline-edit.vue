<template>
  <div class="demo-container" @click="openImageCropper">
    <img :src="headline?.image || 'https://placehold.co/600x400'" alt="tagline image" class="hero-bar-image">
    <div v-html="isThai ? headline.text : headline.text_en" class="hero-bar-text"
      :style="{ top: `${headline.y}%`, left: `${headline.x}%` }"></div>
  </div>
  <form class="form-container" @submit.prevent>
    <div class="form-container-input">
      <div class="slider-input">
        <div class="input-group">
          <div class="labeltop"><label>X Position: {{ headline.x }}</label>
            <input type="number" v-model.lazy="headline.x" min="0" max="100">
          </div>
          <input type="range" class="labslider" v-model.lazy="headline.x" min="0" max="100">
        </div>
        <div class="input-group">
          <div class="labeltop"><label>Y Position: {{ headline.y }}</label>
            <input type="number" v-model.lazy="headline.y" min="0" max="100">
          </div>
          <input type="range" class="labslider" v-model.lazy="headline.y" min="0" max="100">
        </div>
      </div>
      <div class="editor-text-container">
        <div class="editor-switch">
          <button type="button" @click="toggleEditor" class="switch-button">Switch to {{ isThai ? 'English' : 'Thai'
          }}</button>
        </div>
        <div class="editor-container">
          <label v-if="isThai">Text (Thai)</label>
          <label v-else>Text (English)</label>
          <TiptapEditor v-model.lazy="editableText" />


        </div>
      </div>
    </div>
    <button class="save-button" @click.prevent="updateHeadline">Save Changes</button>
  </form>

  <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" hidden>
  <div v-if="showCropper" class="cropper-container">
    <img ref="cropperImage" :src="croppingImage" class="cropper-preview">
    <button @click="cropImage">Crop & Upload</button>
    <button @click="cancelCrop">Cancel</button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const apiEndpoint = 'headline';
const headline = ref({ x: 50, y: 50, image: '', text: 'กำลังโหลด...', text_en: '-' });
const fileInput = ref(null);
const showCropper = ref(false);
const croppingImage = ref(null);
const cropperInstance = ref(null);
const cropperImage = ref(null);
const isThai = ref(true);

const toggleEditor = () => {
  isThai.value = !isThai.value;
};
const fetchHeadline = async () => {
  try {
    const response = await $fetch(`/api/${apiEndpoint}`, {
      headers: {
        "CKH": '541986Cocon',

      },
    });
    if (response.headline) {
      headline.value = {
        x: response.headline.x ?? 50,
        y: response.headline.y ?? 50,
        image: response.headline.image || 'https://placehold.co/600x400',
        text_en: response.headline.text_en || 'กำลังโหลด',
        text: response.headline.text || 'กำลังโหลด',
      };
    }
  } catch (error) {
    console.error('Error fetching headline:', error);
  }
};

const openImageCropper = () => {
  fileInput.value.click();
};
const editableText = computed({
  get: () => (isThai.value ? headline.value.text : headline.value.text_en),
  set: (value) => {
    if (isThai.value) {
      headline.value.text = value;
    } else {
      headline.value.text_en = value;
    }
  }
});
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
    headline.value.image = canvas.toDataURL('image/jpeg');
    showCropper.value = false;
    cropperInstance.value.destroy();
  }
};

const cancelCrop = () => {
  showCropper.value = false;
  cropperInstance.value.destroy();
};

const updateHeadline = async () => {
  // Log the headline data to ensure the text fields are populated
  console.log('Updating headline with:', headline.value);

  // Ensure text and text_en are not null or empty
  if (!headline.value.text || !headline.value.text_en) {
    alert('Text fields cannot be empty');
    return;
  }

  try {
    await fetch(`/api/${apiEndpoint}/1`, {
      method: 'PUT',
      headers: { 'CKH': '541986Cocon', 'Content-Type': 'application/json' },
      body: JSON.stringify(headline.value)
    });
    alert('Headline updated successfully!');
  } catch (error) {
    console.error('Error updating headline:', error);
  }
};


definePageMeta({
  layout: "admin",
});

onMounted(() => {
  fetchHeadline();
});
</script>
<style scoped>
.labslider {
  width: 100%;
}

.labeltop {
  display: flex;
  gap: 1rem;
}

.form-container-input {
  display: flex;
  justify-content: center;
  gap: 2rem;

}

.editor-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.switch-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.switch-button:hover {
  background: #218838;
}

.cropper-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.cropper-preview {
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 10px;
}

.demo-container {
  display: flex;
  position: relative;
  width: 80%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 1.5rem;
  margin: 2rem auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
}

.hero-bar-image {
  aspect-ratio: 8/3;
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  filter: brightness(0.6);
}

.hero-bar-text {
  position: absolute;
  color: white;
  text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.7);
  transform: translate(-50%, -50%);

}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: clamp(100px, 60%, 80%);
  margin: 2rem auto;
}

.save-button {
  background: #007bff;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background: #0056b3;
}

@media (max-width: 1550px) {
  .form-container {
    width: 80%;
  }

  .form-container-input {
    flex-direction: column;
  }
}
</style>
