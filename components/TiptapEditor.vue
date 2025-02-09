<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const editor = ref(
  new Editor({
    extensions: [StarterKit, Bold, Italic, Underline],
    content: props.modelValue || "",
    onUpdate: ({ editor }) => {
      emit("update:modelValue", editor.getHTML());
    },
  })
);

// Watch for external model changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value.getHTML() !== newValue) {
      editor.value.commands.setContent(newValue, false);
    }
  }
);

// Cleanup when component is destroyed
onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>

<template>
  <div class="tiptap-container">
    <!-- Toolbar -->
    <div class="toolbar">
      <button 
        @click="editor.chain().focus().toggleBold().run()" 
        :class="{ active: editor.isActive('bold') }"
        title="Bold (Ctrl+B)"
      >
        <span class="icon">B</span>
      </button>
      <button 
        @click="editor.chain().focus().toggleItalic().run()" 
        :class="{ active: editor.isActive('italic') }"
        title="Italic (Ctrl+I)"
      >
        <span class="icon">I</span>
      </button>
      <button 
        @click="editor.chain().focus().toggleUnderline().run()" 
        :class="{ active: editor.isActive('underline') }"
        title="Underline (Ctrl+U)"
      >
        <span class="icon">U</span>
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
/* Container */
.tiptap-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  max-width: 100%;
  background: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  background: #ffffff;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
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

button:hover {
  background: #f0f0f0;
}

button.active {
  background: #4caf50;
  color: white;
}

button .icon {
  font-size: 18px;
  font-weight: bold;
}

/* Editor Content */
.editor-content {
  overflow-y: auto;
  min-height: 120px;
  max-height: 200px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.editor-content:focus-visible {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

</style>
