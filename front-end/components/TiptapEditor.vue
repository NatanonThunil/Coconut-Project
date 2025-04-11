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

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const editor = ref(null);

onMounted(async () => {
  editor.value = new Editor({
  extensions: [
    StarterKit.configure({ heading: false }),
    Bold,
    Italic,
    Underline,
    Image.configure({ allowBase64: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Heading.configure({ levels: [1, 2, 3] }),
    Link.configure({ openOnClick: true }),
    TextStyle, // 👉 Required for color
    Color.configure({ types: ["textStyle"] }), // Use with TextStyle
  ],
  content: props.modelValue || "",
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

  await nextTick(); // Ensures UI updates properly before accessing editor
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
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    if (editor.value) {
      editor.value.chain().focus().setImage({ src: reader.result }).run();
      emit("update:modelValue", editor.value.getHTML());
    }
  };
};

const setTextAlign = (alignment) => {
  editor.value?.chain().focus().setTextAlign(alignment).run();
};

const addLink = () => {
  const url = prompt("Enter URL");
  if (url) {
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).setUnderline().setItalic().run();
  }
};

const changeColor = (color) => {
  const isActive = editor.value?.isActive("textStyle", { color });

  editor.value?.chain().focus()
    .setColor(isActive ? null : color)
    .run();
};


</script>

<template>
  <div class="tiptap-container">
    <div class="toolbar" v-if="editor">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor?.isActive('bold') }" title="Bold">
        <span class="icon">B</span>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor?.isActive('italic') }" title="Italic">
        <span class="icon">I</span>
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ active: editor?.isActive('underline') }" title="Underline">
        <span class="icon">U</span>
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" title="H1">H1</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="H2">H2</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="H3">H3</button>
      <button @click="addLink" title="Link">🔗</button>
      <label class="upload-btn" title="Upload Image">
        <input type="file" @change="uploadImage" accept="image/*" hidden />
        <span class="icon">🖼 Upload</span>
      </label>
      <button @click="setTextAlign('left')" :class="{ active: editor?.isActive({ textAlign: 'left' }) }" title="Align Left">
        <span class="icon">⬅</span>
      </button>
      <button @click="setTextAlign('center')" :class="{ active: editor?.isActive({ textAlign: 'center'}) }" title="Align Center">
        <span class="icon">⬆</span>
      </button>
      <button @click="setTextAlign('right')" :class="{ active: editor?.isActive({ textAlign: 'right' }) }" title="Align Right">
        <span class="icon">➡</span>
      </button>
      <input type="color" @input="e => changeColor(e.target.value)" title="Text Color" />


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
</style>
