<template>
    <div class="Big-card shimmer">
        <div class="big-hot-news-image-container shimmer-bg"></div>
        <div class="big-hot-news-details-container">
            <div class="shimmer-title shimmer-bg"></div>
            <div class="date-n-readmore">
                <div class="shimmer-date shimmer-bg"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Shimmer Animation */
@keyframes shimmer {
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: 200px 0;
    }
}

/* Base Styles */
.Big-card {
    display: flex;
    flex-direction: column;
    height: auto;
    height: 18rem;
    width: 100%;
    background-color: white;
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s ease-in-out;
}

/* Image Placeholder */
.big-hot-news-image-container {
    width: 100%;
    height: 60%;
    overflow: hidden;
    background-color: #ddd;
}

/* Shimmer Effect */
.shimmer-bg {
    background: linear-gradient(90deg, #eeeeee 25%, #dddddd 50%, #eeeeee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
}

/* Title Placeholder */
.shimmer-title {
    height: 1.5rem;
    width: 80%;
    margin-bottom: 0.5rem;
    border-radius: 5px;
}

/* Date Placeholder */
.shimmer-date {
    height: 1rem;
    width: 40%;
    border-radius: 5px;
}

/* Details Container */
.big-hot-news-details-container {
    padding: 1rem;
}
</style>
