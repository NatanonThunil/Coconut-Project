<template>
    <div class="pest-card">
        <img :src="image" alt="Pest Image" class="pest-card-image" />
        <div class="card-content">
            <h3 class="pest-card-title">{{ title }}</h3>
            <p class="pest-card-description">{{ description }}</p>
            <p class="pest-card-date">{{ date }}</p>
            <p class="pest-card-location">{{ location }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
.pest-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    min-width: 300px;
    animation: fadeIn 0.5s ease-in-out;
}

.pest-card:hover {
    transform: scale(1.05);
}

.pest-card-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.card-content {
    padding: 1rem;
    text-align: center;
}

.pest-card-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.pest-card-description {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.pest-card-date,
.pest-card-location {
    font-size: 0.9rem;
    color: gray;
}
</style>
