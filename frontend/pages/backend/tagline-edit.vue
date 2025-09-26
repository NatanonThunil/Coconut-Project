<template>
  <div class="demo-container" @click="openImageCropper">

    <img :src="headline?.image || 'https://placehold.co/600x400'" alt="tagline image" class="hero-bar-image">
    <div v-html="isThai ? headline.text : headline.text_en" class="hero-bar-text"
      :style="{ top: `${headline.y}%`, left: `${headline.x}%` }"></div>
    <div class="demo-placeholder" :data-visible="!headline?.image || headline.image.includes('placehold.co')">
      คลิกเพื่อเปลี่ยนรูป
    </div>
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
        <div class="hero-lang-switch">
          <div class="editor-switch">
            <!-- <button type="button" @click="toggleEditor" class="switch-button">Switch to {{ isThai ? 'English' : 'Thai'
              }}</button> -->
            <button @click="() => { isThai = true }" :class="{ active: isThai }">ไทย</button>
            <button @click="() => { isThai = false }" :class="{ active: !isThai }">English</button>
          </div>
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
  <Loading :isLoading="loadingstate" :LoadingText="loadingstatetext" />
</template>
<script setup>
import { useHerobars } from '~/composables/useHerobars'
const { getHerobarById, updateHerobarById } = useHerobars()
import { useUpload } from '~/composables/useUpload'
const { uploadImage } = useUpload()
import { ref, onMounted, nextTick, computed } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

// NEW
import imageCompression from 'browser-image-compression';
const loadingstate = ref(false);
const loadingstatetext = ref('Loading');
const apibase = useRuntimeConfig().public.apiBase;
const beurl = useRuntimeConfig().public.urlBase;
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
    const data = await getHerobarById(1);
    headline.value = {
      x: data.x ?? 50,
      y: data.y ?? 50,
      image: data.image || 'https://placehold.co/600x400',
      text_en: data.text_en || 'กำลังโหลด',
      text: data.text || 'กำลังโหลด',
    };
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

// NEW: small helpers
const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });

const base64Bytes = (dataUrl) => {
  const i = dataUrl.indexOf(',');
  const raw = i !== -1 ? dataUrl.slice(i + 1) : dataUrl;
  return Math.floor((raw.length * 3) / 4); // ≈ binary size
};

// NEW: after crop → compress to WebP under ~50MB base64
const cropImage = async () => {
  if (!cropperInstance.value) return;

  // 1) get cropped canvas → blob (use PNG here to keep max quality before compression)
  const canvas = cropperInstance.value.getCroppedCanvas();
  const croppedBlob = await new Promise((res) => canvas.toBlob((b) => res(b), 'image/png', 1));

  // 2) compress to WebP using browser-image-compression
  const fileLike = new File([croppedBlob], 'crop.png', { type: 'image/png' });
  const compressed = await imageCompression(fileLike, {
    maxWidthOrHeight: 2560,   // adjust if you want smaller images by default (e.g., 1920)
    maxSizeMB: 37.5,          // ~<= 50MB base64 after overhead
    useWebWorker: true,
    initialQuality: 0.9,
    fileType: 'image/webp',   // force WebP output
  });

  // 3) preview in UI (DataURL) and keep it for upload
  const dataUrl = await blobToDataURL(compressed);
  // quick guard (optional)
  if (base64Bytes(dataUrl) > 50 * 1024 * 1024) {
    // If somehow still big (rare), you can warn or recompress with smaller maxWidthOrHeight
    alert('Compressed image is still larger than 50MB. Try cropping smaller or we can auto-reduce resolution.');
    // Example auto-retry: uncomment to retry smaller
    // const smaller = await imageCompression(fileLike, {
    //   maxWidthOrHeight: 1920,
    //   maxSizeMB: 30,
    //   useWebWorker: true,
    //   initialQuality: 0.85,
    //   fileType: 'image/webp',
    // });
    // headline.value.image = await blobToDataURL(smaller);
  }

  headline.value.image = dataUrl; // keep as DataURL for preview & upload
  showCropper.value = false;
  cropperInstance.value.destroy();
};

const cancelCrop = () => {
  showCropper.value = false;
  cropperInstance.value?.destroy();
};

const updateHeadline = async () => {
  console.log('Updating headline with:', headline.value);

  if (!headline.value.text || !headline.value.text_en) {
    alert('Text fields cannot be empty');
    return;
  }

  try {
    loadingstatetext.value = 'Updating headline...';
    loadingstate.value = true;
    let imagePath = headline.value.image;

    // If a new (compressed) image is present as data URL → upload it
    if (headline.value.image?.startsWith('data:image')) {
      // send pure base64 (strip prefix)
      const base64Image = headline.value.image.split(',')[1];
      const imageName = `herobar_${Date.now()}.webp`; // WebP after compression
      imagePath = `${beurl}/images/${imageName}`;

      let uploadResponse;
      try {
        uploadResponse = await uploadImage(base64Image, imagePath);
      } catch (err) {
        console.error(err);
        throw new Error('Failed to upload image');
      }
      if (uploadResponse?.error) {
        throw new Error(uploadResponse.error);
      }
    }

    await updateHerobarById(
      1,
      headline.value.text,
      headline.value.text_en,
      headline.value.x,
      headline.value.y,
      imagePath
    );


    loadingstatetext.value = 'Headline updated successfully';
    await fetchHeadline();
  } catch (error) {
    console.error('Error updating headline:', error);
    alert('An error occurred while updating the headline. Please try again.');
  }
  loadingstate.value = false;
};

definePageMeta({
  layout: "admin",
});

onMounted(() => {
  fetchHeadline();
});
</script>

<style scoped>
.demo-placeholder{
  position: absolute;           /* overlay on top of the image */
  inset: 0;                     /* full cover */
  display: flex;                /* center the text */
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;

  background-color: rgba(0,0,0,0.3);
  color: #fff;
  font-weight: 600;
  letter-spacing: .2px;

  z-index: 20;
  opacity: 0;                   /* hidden by default */
  transition: opacity .2s ease;
  pointer-events: none;         /* don't block clicks */
  user-select: none;
}

/* show on hover */
.demo-container:hover .demo-placeholder{
  opacity: 1;
}

/* keep visible if still using a placeholder (or empty) image */
.demo-placeholder[data-visible="true"]{
  opacity: 1;
}


.editor-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  outline: 2px solid #b6e3db;
  overflow: hidden;
  border-radius: 10px;
}

.editor-switch button {
  width: 50%;
  background: #ffffff;
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 15px;

  cursor: pointer;
  transition: background 0.3s;

}


.editor-switch button:hover {

  background: #f0f0f0;


}

.editor-switch button.active {
  background: linear-gradient(90deg, #5edce0, #b6e3db);
}

.slider-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: auto 0;
  gap: 1rem;
  padding: 1rem;
}

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
  font-size: clamp(0.5rem, 0.8vw, 2rem);
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
  background: linear-gradient(90deg, #5e97e0, #b6e3db);
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button:hover {
  background: #b6e3db;
  color: black;
  transform: scale(1.02);
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