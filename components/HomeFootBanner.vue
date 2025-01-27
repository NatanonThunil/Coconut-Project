<template>
    <NuxtLinkLocale :to="url" class="f-banner" :style="{ backgroundColor: inputColor }">

        <div class="f-banner-text-container">
            <h1 class="f-banner-title">{{ title }}</h1>
            <p class="f-banner-text">{{ text }}</p>
        </div>
        <div class="f-banner-image-container">
            <img :src="picture" alt="banner image" loading="lazy" draggable="false">
        </div>

    </NuxtLinkLocale>
</template>

<script>

export default {
    props: {
        text: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        color: {
            type: String
        },
        title: {
            type: String
        }
    }, computed: {
        inputColor() {
            return this.color || '#A6AB82';
        }
    }
}
</script>

<style>
.f-banner {
    cursor: pointer;
    overflow: hidden;
    border-radius: 20px;
    display: flex;
    justify-self: center;
    justify-content: space-between;
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
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    margin: 2rem;
}

.f-banner .f-banner-text-container p {
    max-width: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    padding-left: 1rem;
    text-overflow: ellipsis;
    font-size: 1.3rem;
    color: #333;

}


.f-banner .f-banner-text-container h1 {
    max-width: 100%;
    overflow: hidden;
    color: black;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;

}

@media screen and (max-width: 1024px) {
    .f-banner .f-banner-image-container {
        width: 60%;
    }

    .f-banner .f-banner-text-container {
        max-width: 40%;
        -webkit-line-clamp: 3;
    }
}

@media screen and (max-width: 768px) {
    .f-banner .f-banner-image-container {
        width: 50%;
    }

    .f-banner .f-banner-text-container {
        max-width: 50%;
        -webkit-line-clamp: 2;

    }
}
</style>
