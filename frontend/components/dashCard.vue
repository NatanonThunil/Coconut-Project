<template>
    <NuxtLinkLocale class="dash-card" :to="props.link" @click="emit('clicked')">
        <img :src="props.icon" class="dash-img-icon" draggable="false">
        <div class="dash-card-content">
            <h2>{{ props.count }}</h2>
            <p>{{ props.title }}</p>
        </div>
    </NuxtLinkLocale>
</template>

<script setup lang="ts">
const props = defineProps<{
  link: string
  title: string
  count?: number
  icon?: string
}>()
const emit = defineEmits<{ (e: 'clicked'): void }>()
</script>

<style scoped>
.dash-img-icon {

    width: 30px;
    height: 30px;

}

.dash-card {
    display: flex;
    flex-direction: column;
    background-color: white;
    height: 10rem;
    min-width: 5rem;
    border-radius: 8px;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.3);
    padding: 1.5rem;

    justify-content: space-between;
    transition: all .2s ease-in-out;
}


.dash-card:hover {
    background-color: rgb(247, 247, 247);
    box-shadow: 0 0px 12px rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

.dash-card-content h2 {
    margin: 0;
    font-size: 2rem;
    color: #4e6d16;
    transition: all .2s ease-in-out;
}
.dash-card-content p {
    margin: 0;
    font-size: 1rem;
    color: #8a8a8a;
    transition: all .2s ease-in-out;
}

.dash-card:hover .dash-card-content h2 {
    color: #76a818;
}

</style>