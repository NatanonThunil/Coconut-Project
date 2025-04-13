<template>
    <NuxtLinkLocale :to="url" :class="[isHotnews ? 'HotCard' : '', 'Big-card']">
        <div class="big-hot-news-image-container"><img :src="image" /></div>
        <div class="big-hot-news-details-container">
            <h2>{{ title }}</h2>
            <div class="date-n-readmore">
                <div>{{ date }}</div>

            </div>
        </div>
    </NuxtLinkLocale>
</template>
<script>
export default {
    props: {
        url: {
            type: String
        },
        image: {
            type: String
        }, title: {
            type: String
        }, date: {
            type: String
        }, isHotnews: {
            type: Boolean
        }
    }
}</script>

<style scoped>
.HotCard {
    outline: solid #A6AB82 8px ;
}

a {
    color: black;
}

.f-btn {
    outline: #4E6D16 solid 2px;
    padding: 0.1rem 0.8rem;
    border-radius: 10px;
    color: #4E6D16;
}

.date-n-readmore {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding-right: 1rem;
}

.Big-card {
    display: flex;
    flex: 1 1;
    flex-direction: column;
    height: 23rem;
    width: 100%;
    min-width: 17rem;
    max-width:  23rem;
    background-color: white;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
    transition: 0.3s ease-in-out;
}

.Big-card:hover {
    transform: scale(1.05);
    outline: #4E6D16 3px solid;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.8);
}

.Big-card:hover .big-hot-news-image-container img {
    transform: scale(1.05);
}

.Big-card .big-hot-news-image-container img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: 0.3s ease-in-out;
}

.big-hot-news-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70%;
    overflow: hidden;
}

.big-hot-news-details-container {
    padding: 1rem;
}

.big-hot-news-details-container h2 {
    font-size: medium;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
}
</style>