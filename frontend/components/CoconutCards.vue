<template>
    <div class="coconut-v-card" loading="lazy">
        <div class="coconut-v-img-frame">
            <img :src="img" alt="" class="coconut-v-image" draggable="false">
        </div>
        <div class="coconut-v-card-text-container">
            <h4 class="coconut-v-name">{{ name }}</h4>
            <div class="coconut-v-card-sciname-container">
                <i class="coconut-v-sci-name-front">{{ sci_front }}</i>
                <i class="coconut-v-sci-name-middle">{{ sci_middle }}</i>
                <i class="coconut-v-sci-name-back">{{ sci_back }}</i>
            </div>
        </div>
    </div>
</template>

<style scoped>
.coconut-v-card {
    cursor: pointer;
    height: 18rem;
    width: 15rem;
    overflow: hidden;
    border-radius: 20px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
    transition: ease-in-out 0.2s;
}

.coconut-v-card:hover {
    background-color: #e3e3e3;
    transform: scale(1.01);
    outline: 2px solid #4E6D16;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.4);
}

.coconut-v-card:hover .coconut-v-img-frame img {

    transform: scale(1.05);
}

.coconut-v-card:active {
    background-color: #D9D9D9;
}

.coconut-v-card .coconut-v-img-frame {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 13rem;
    width: 100%;
    background-color: #212e08;
    overflow: hidden;
}

.coconut-v-card .coconut-v-img-frame img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: ease-in-out 0.2s;
}

.coconut-v-card .coconut-v-card-text-container {
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.coconut-v-card .coconut-v-card-text-container .coconut-v-name {
    padding-top: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    max-width: 85%;
}

.coconut-v-card .coconut-v-card-text-container .coconut-v-card-sciname-container {
    display: flex;
    gap: 5px;
    max-width: 85%;
     display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    overflow: hidden;
}

.coconut-v-card .coconut-v-card-text-container .coconut-v-card-sciname-container .coconut-v-sci-name-front,
.coconut-v-card .coconut-v-card-text-container .coconut-v-card-sciname-container .coconut-v-sci-name-middle,
.coconut-v-card .coconut-v-card-text-container .coconut-v-card-sciname-container .coconut-v-sci-name-back {
    font-weight: 200;
}

@media (max-width: 590px) {
    .coconut-v-card .coconut-v-card-text-container .coconut-v-card-sciname-container {
        display: none;


    }

    .coconut-v-card-text-container {
        height: 5rem
    }

    .coconut-v-card-text-container .coconut-v-name {
        padding-bottom: 0.8rem;
    }

    .coconut-v-card {
        width: 14.5rem;
    }
}
</style>

<script>
export default {
    props: {
        img: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        sci_front: {
            type: String,
            required: true,
        },
        sci_middle: {
            type: String,
            required: true,
        },
        sci_back: {
            type: String,
            required: true,
        },

    },
};
</script>
