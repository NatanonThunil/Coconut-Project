<template>
    <div :class="['coconut-card', { 'small-card': isSmall }]">
        <img :src="image" alt="Coconut Image">
        <div class="card-content">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
            <p>{{ date }}</p>
            <p>{{ location }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        image: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        isSmall: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
.coconut-card {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    min-width: 200px;
    animation: fadeIn 0.5s ease-in-out;
}

.coconut-card:hover {
    transform: scale(1.05);
}

.coconut-card img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.coconut-card .card-content {
    padding: 0.5rem;
    text-align: center;
}

.small-card {
    width: 50%;
    min-width: 100px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
