<template>
    <div class="pest-card-shimmer">
        <div class="pest-image-shimmer"></div>
        <div class="pest-details-shimmer">
            <div class="pest-title-shimmer"></div>
            <div class="pest-date-location-shimmer">
                <div class="pest-date-shimmer"></div>
                <div class="pest-location-shimmer"></div>
            </div>
            <div class="pest-description-shimmer"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PestCardShimmer', // Renamed the component
};
</script>

<style scoped>
.pest-card-shimmer {
    height: 25rem;
    width: 20rem;
    background-color: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pest-image-shimmer {
    height: 15rem;
    width: 100%;
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
}

.pest-details-shimmer {
    padding: 0.8rem;
    width: 100%;
    height: 10rem;
}

.pest-title-shimmer {
    width: 80%;
    height: 1.2rem;
    background-color: #e0e0e0;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
}

.pest-date-location-shimmer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.pest-date-shimmer,
.pest-location-shimmer {
    width: 45%;
    height: 1rem;
    background-color: #e0e0e0;
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
}

.pest-description-shimmer {
    width: 90%;
    height: 1.2rem;
    background-color: #e0e0e0;
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
</style>