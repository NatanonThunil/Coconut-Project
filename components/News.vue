<template>
    <div class="news-container">
        <nuxt-link :to="'/news/' + hotnewsid" class="hot-news-section">
            <div class="hot-news-image">
                <img :src="formatImageSource(hotnewsimage)" alt="Hot News Image" />
            </div>
            <div class="hot-news-text">
                <p>{{ hotnewstitle }}</p>
            </div>
        </nuxt-link>

        <div class="news-rows">
            <div class="news-item" @click="$router.push('/news/' + newsid1)">
                <img :src="formatImageSource(newsimage1)" alt="News Image 1" />
                <p>{{ newstitle1 }}</p>
            </div>
            <div class="news-item" @click="$router.push('/news/' + newsid2)">
                <img :src="formatImageSource(newsimage2)" alt="News Image 2" />
                <p>{{ newstitle2 }}</p>
            </div>
        </div>
    </div>

    
</template>


<script>
export default {
    props: {
        hotnewstitle: {
            type: String,
            Required: true,
        },
        hotnewsimage: {
            type: [String, File, Blob],
            required: true,
        },
        hotnewsid: {
            type: String,
            required: true
        },
        newstitle1: {
            type: String,
            required: true,
        },
        newsimage1: {
            type: [String, File, Blob],
            required: true,
        },
        newsid1: {
            type: String,
            required: true
        },
        newstitle2: {
            type: String,
            required: true,
        },
        newsimage2: {
            type: [String, File, Blob],
            required: true,
        },
        newsid2: {
            type: String,
            required: true
        },
    },
    methods: {
        formatImageSource(image) {
            if (typeof image === 'string') {
                return image;
            } else if (image instanceof File || image instanceof Blob) {
                return URL.createObjectURL(image);
            }
            return '';
        },
    },
};
</script>

<style scoped>


.news-container {
    margin-left: 4%;
    margin-right: 4%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.hot-news-section {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    background-color: #4e6d16;
    border-radius: 10px;
    overflow: hidden;
    transition: ease-in-out 0.2s;
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0s;
}

.hot-news-section:hover {
    transform: scale(1.01);
    background-color: #2c440f;
    box-shadow: rgba(0, 0, 0, 0.6) 4px 4px 4px;
}

.hot-news-image {
    max-height: 300px;
    max-width: 100%;
    overflow: hidden;
}

.hot-news-image img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.hot-news-text {
    flex: 1;
    padding: 1rem;
    border-radius: 10px;
    color: white;
    text-align: justify;
    line-height: 1.4;
    max-width: 50%;
}

.news-rows {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
}

.news-item {
    cursor: pointer;
    flex: 1;
    background-color: #4e6d16;
    border-radius: 10px;
    color: white;
    display: flex;
    min-height: 180px;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    transition: ease-in-out 0.2s;
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 0.8s ease-out forwards;
}

.news-item:hover {
    transform: scale(1.01);
    background-color: #2c440f;
    box-shadow: rgba(0, 0, 0, 0.6) 4px 4px 4px;
}

.news-item img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
}

.news-item p {
    margin: 1rem;
    text-align: center;
    font-size: 0.9rem;
    line-height: 1.4;
    color: white;
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(50px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.news-item:nth-child(1) {
    animation-delay: 0.2s;
}

.news-item:nth-child(2) {
    animation-delay: 0.4s;
}

.news-item:nth-child(3) {
    animation-delay: 0.6s;
}

.news-item:nth-child(4) {
    animation-delay: 0.8s;
}

@media screen and (max-width: 1250px) {
    .hot-news-image {
        width: 70%;
    }

    .news-item {
        flex-direction: column;
    }
}

@media screen and (max-width: 1024px) {
    .hot-news-section {
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        overflow: hidden;
    }

    .hot-news-image {
        width: 100%;
    }

    .hot-news-image img {
        width: 100%;
    }

    .hot-news-text {
        max-width: 100%;
        text-align: center;
    }

    .news-rows {
        flex-direction: row;
    }

    .news-item {
        margin-bottom: 1rem;
        max-width: 100%;
        display: none;
    }

    .news-item img {
        max-height: 120px;
    }
}

@media screen and (max-width: 480px) {
    .hot-news-image img {
        max-width: 90%;
    }

    .news-item img {
        max-height: 100px;
    }

    .news-item {
        display: none;
    }
}
</style>
