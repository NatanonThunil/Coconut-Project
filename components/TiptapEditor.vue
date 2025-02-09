<script setup>
import { ref, watch } from "vue";
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

watch(() => props.modelValue, (newValue) => {
  if (editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false);
  }
});
</script>

<template>
  <div class="tiptap-container">
    <!-- Toolbar -->
    <div class="toolbar">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor.isActive('bold') }">
        B
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor.isActive('italic') }">
        I
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ active: editor.isActive('underline') }">
        U
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.tiptap-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
  max-width: 100%;
}

.toolbar {
  display: flex;
  gap: 5px;
  margin-bottom: 8px;
}

button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

button.active {
  background: #ddd;
  font-weight: bold;
}

.editor-content {
  min-height: 150px;
  border-top: 1px solid #ccc;
  padding: 8px;
}
</style>
