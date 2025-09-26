<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

const props = defineProps({
  modelValue: { type: String, default: "" },
  /**
   * รายชื่อฟีเจอร์ที่ "ไม่ต้องการ"
   * ตัวเลือกที่รองรับ: 'bold','italic','underline','image','align','heading','link','color'
   */
  disable: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);
const editor = ref(null);

// helper: ใช้เช็คว่าเปิดใช้ฟีเจอร์ไหม (ไม่ได้อยู่ใน disable)
const has = (feature) => !props.disable.includes(feature);

onMounted(async () => {
  const alignTypes = ["paragraph"].concat(has("heading") ? ["heading"] : []);

  editor.value = new Editor({
    extensions: [
      // ปิด heading ของ StarterKit เสมอ แล้วคุมด้วย Heading เอง
      StarterKit.configure({ heading: false }),

      ...(has("bold") ? [Bold] : []),
      ...(has("italic") ? [Italic] : []),
      ...(has("underline") ? [Underline] : []),

      ...(has("image") ? [Image.configure({ allowBase64: true })] : []),

      ...(has("align") ? [TextAlign.configure({ types: alignTypes })] : []),

      ...(has("heading") ? [Heading.configure({ levels: [1, 2, 3] })] : []),

      ...(has("link") ? [Link.configure({ openOnClick: true })] : []),

      ...(has("color") ? [TextStyle, Color.configure({ types: ["textStyle"] })] : []),
    ],
    content: props.modelValue || "",
    onUpdate: ({ editor }) => {
      emit("update:modelValue", editor.getHTML());
    },
  });

  await nextTick();
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && editor.value.getHTML() !== newValue) {
      editor.value.commands.setContent(newValue, false);
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const uploadImage = async (event) => {
  if (!has("image")) return; // ป้องกันถูกเรียกตอนปิดฟีเจอร์
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    editor.value?.chain().focus().setImage({ src: reader.result }).run();
    emit("update:modelValue", editor.value.getHTML());
  };
};

const setTextAlign = (alignment) => {
  if (!has("align")) return;
  editor.value?.chain().focus().setTextAlign(alignment).run();
};

const addLink = () => {
  if (!has("link")) return;
  const url = prompt("Enter URL");
  if (url) {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .setUnderline()
      .setItalic()
      .run();
  }
};

const changeColor = (color) => {
  if (!has("color")) return;
  const isActive = editor.value?.isActive("textStyle", { color });
  editor.value?.chain().focus().setColor(isActive ? null : color).run();
};

const changeHeading = (level) => {
  if (!has("heading") || !editor.value) return;
  const isActive = editor.value.isActive("heading", { level });
  if (isActive) editor.value.chain().focus().setParagraph().run();
  else editor.value.chain().focus().setNode("heading", { level }).run();
};
</script>

<template>
  <div class="tiptap-container">
    <div class="toolbar" v-if="editor">
      <!-- inline styles -->
      <button v-if="!disable.includes('bold')" @click="editor.chain().focus().toggleBold().run()"
        :class="{ active: editor?.isActive('bold') }" title="Bold">
        <span class="icon">B</span>
      </button>

      <button v-if="!disable.includes('italic')" @click="editor.chain().focus().toggleItalic().run()"
        :class="{ active: editor?.isActive('italic') }" title="Italic">
        <span class="icon">I</span>
      </button>

      <button v-if="!disable.includes('underline')" @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ active: editor?.isActive('underline') }" title="Underline">
        <span class="icon">U</span>
      </button>

      <!-- Heading -->
      <template v-if="!disable.includes('heading')">
        <button @click="changeHeading(1)" title="H1"
          :class="{ active: editor?.isActive('heading', { level: 1 }) }">H1</button>
        <button @click="changeHeading(2)" title="H2"
          :class="{ active: editor?.isActive('heading', { level: 2 }) }">H2</button>
        <button @click="changeHeading(3)" title="H3"
          :class="{ active: editor?.isActive('heading', { level: 3 }) }">H3</button>
      </template>

      <!-- Link -->
      <button v-if="!disable.includes('link')" @click="addLink" title="Link">🔗</button>

      <!-- Image -->
      <label v-if="!disable.includes('image')" class="upload-btn" title="Upload Image">
        <input type="file" @change="uploadImage" accept="image/*" hidden />
        <span class="icon">Upload</span>
      </label>

      <!-- Align -->
      <template v-if="!disable.includes('align')">
        <button @click="setTextAlign('left')" :class="{ active: editor?.isActive({ textAlign: 'left' }) }"
          title="Align Left">
          <span class="icon">⬅</span>
        </button>
        <button @click="setTextAlign('center')" :class="{ active: editor?.isActive({ textAlign: 'center' }) }"
          title="Align Center">
          <span class="icon">⬆</span>
        </button>
        <button @click="setTextAlign('right')" :class="{ active: editor?.isActive({ textAlign: 'right' }) }"
          title="Align Right">
          <span class="icon">➡</span>
        </button>
      </template>

      <!-- Color -->
      <input v-if="!disable.includes('color')" type="color" @input="e => changeColor(e.target.value)"
        title="Text Color" />
    </div>

    <EditorContent v-if="editor" :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.tiptap-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  max-width: 100%;
  background: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  background: #ffffff;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

button,
.upload-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

button:hover,
.upload-btn:hover {
  background: #f0f0f0;
}

button.active {
  background: #4caf50;
  color: white;
}

.editor-content:focus h1 {
  font-size: 3rem !important;
  font-weight: bold;
  margin: 0;
}

.editor-content:focus h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.editor-content:focus h3 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.editor-content {
  overflow-y: auto;
  min-height: 150px;
  max-height: 250px;

  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.editor-content img {
  display: block;
  margin: 0 auto;
}

.editor-content a {
  text-decoration: underline;
  font-style: italic;
}

.editor-content:focus-visible {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}


@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  button,
  .upload-btn {
    width: 100%;
    text-align: left;
  }
}

/* บังคับให้ตัวอักษรที่ตั้งเป็น "สีขาว" ดูเป็น "สีดำ" ระหว่างกำลังแก้ไข */
.editor-content:focus-within :deep([style*="color:#fff"]),
.editor-content:focus-within :deep([style*="color: #fff"]),
.editor-content:focus-within :deep([style*="color:#ffffff"]),
.editor-content:focus-within :deep([style*="color: #ffffff"]),
.editor-content:focus-within :deep([style*="color:white"]),
.editor-content:focus-within :deep([style*="color: white"]),
.editor-content:focus-within :deep([style*="color:rgb(255, 255, 255)"]),
.editor-content:focus-within :deep([style*="color: rgb(255, 255, 255)"]) {
  color: #000 !important;
}

/* ถ้าลิงก์เป็นสีขาว ก็ให้แสดงดำตอนแก้ไขเหมือนกัน */
.editor-content:focus-within :deep(a[style*="color:#fff"]),
.editor-content:focus-within :deep(a[style*="color: #fff"]),
.editor-content:focus-within :deep(a[style*="color:#ffffff"]),
.editor-content:focus-within :deep(a[style*="color: #ffffff"]),
.editor-content:focus-within :deep(a[style*="color:white"]),
.editor-content:focus-within :deep(a[style*="color: white"]),
.editor-content:focus-within :deep(a[style*="color:rgb(255, 255, 255)"]),
.editor-content:focus-within :deep(a[style*="color: rgb(255, 255, 255)"]) {
  color: #000 !important;
  text-decoration: underline;
}
</style>
