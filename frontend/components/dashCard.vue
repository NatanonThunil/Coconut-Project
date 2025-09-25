<template>
    <NuxtLinkLocale class="dash-card" :to="link">
        <img :src="icon" class="dash-img-icon">
        <div class="dash-card-content">
            <h2>{{ count }}</h2>
            <p>{{ title }}</p>
        </div>
    </NuxtLinkLocale>
</template>

<script setup>

defineProps({
    title: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

</script>

<style scoped>
.dash-img-icon {
    width: 30px;
    height: 30px;

}

.dash-card {
    display: flex;
    flex-direction: column;
    height: 10rem;
    min-width: 5rem;
    border-radius: 8px;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    margin-top: 1rem;
    justify-content: space-between;
    transition: all .2s ease-in-out;
}


.dash-card:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
}

.dash-card-content h2 {
    margin: 0;
    font-size: 2rem;
    color: #4e6d16;
    transition: all .2s ease-in-out;
}

.dash-card:hover .dash-card-content h2 {

    transform: scale(1.05);
}
</style>