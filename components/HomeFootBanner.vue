<template>
    <nuxt-link :to="url">
        <div class="f-banner">
            <div class="f-banner-text-container">
                <p class="f-banner-text">{{ text }}</p>
            </div>
            <div class="f-banner-image-container">
                <img :src="picture" alt="banner image" loading="lazy">
            </div>
        </div>
    </nuxt-link>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        },
        picture: {
            type: String, // Use String for image URLs or handle Blob separately
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
}
</script>

<style>
.f-banner {
    overflow: hidden;
    border-radius: 20px;
    display: flex;
    justify-self: center;
    min-height: 12rem;
    height: 16rem;
    background-color: #A6AB82;
    width: 80%;
    margin: 1rem;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
    transition: 0.3s ease-in-out;
    flex-direction: row;
}

.f-banner:hover {
    transform: scale(1.02);
    background-color: #888c68;
}

.f-banner .f-banner-image-container {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 70%;
}

.f-banner .f-banner-image-container img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.f-banner .f-banner-text-container {
    max-width: 30%;
    overflow: hidden; /* Fix: Changed from overflow-y: hidden */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
    margin: 2rem;
}

.f-banner .f-banner-text-container p{
    max-width: 100%;
    overflow: hidden; /* Fix: Changed from overflow-y: hidden */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    text-overflow: ellipsis;

}

.f-banner .f-banner-text {
    font-size: 1.5rem;
    color: #333;
}

@media screen and (max-width: 1024px) {
    .f-banner .f-banner-image-container {
        width: 60%;
    }

    .f-banner .f-banner-text-container {
        max-width: 40%;
        -webkit-line-clamp: 3;
        /* Limit to 3 lines for medium screens */
    }
}

@media screen and (max-width: 768px) {
    .f-banner .f-banner-image-container {
        width: 50%;
    }

    .f-banner .f-banner-text-container {
        max-width: 50%;
        -webkit-line-clamp: 2;
        /* Limit to 2 lines for small screens */
    }
}
</style>
