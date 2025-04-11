<template>
    <div class="context-container">
        <div ref="headTextRef" class="headtext">
            {{ contexto }}
        </div>
        <div class="line" :style="{ width: `calc(80% - ${textWidth}px)` }"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    contexto: {
        type: String,
        required: true
    }
});

const headTextRef = ref(null);
const textWidth = ref(0);

const updateTextWidth = () => {
    if (headTextRef.value) {
        textWidth.value = headTextRef.value.getBoundingClientRect().width;
    }
};


onMounted(updateTextWidth);
watch(() => props.contexto, updateTextWidth);
</script>

<style scoped>
.context-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem;
    animation: fadeinbelow 1s;
}

.line {
    display: block;
    height: 5px;
    min-width: 30%;
    transition: ease-in-out 0.3s;
    background-color: #4E6D16;
}

.headtext {
    color: #4E6D16;
    font-weight: bolder;
    font-size: clamp(30px,3vw ,40px);
    margin: 0rem 2rem;
}

@keyframes fadeinbelow {
    0% {
        opacity: 0;
        transform: translateY(50%);
    }
    100% {
        opacity: 1;
        transform: translateY(0%);
    }
}
</style>
