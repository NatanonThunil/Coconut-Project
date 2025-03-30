<template>

    <NuxtLinkLocale class="all-event-EventCard" :to="url">
        <div class="al-event-image-container"><img :src="image" alt="รูป" draggable="false"></div>
        <div class="event-card-details-container">
            <div class="event-card-title">{{ title }}</div>
            <div class="event-date-and-local">
                <div class="event-card-datestart"><img src="/icon/calenda.svg">{{ datestart }}</div>
                <div class="event-card-location"><img src="/icon/location.png">{{ location }}</div>
            </div>
            <div class="event-card-details">{{ description }}</div>
        </div>
    </NuxtLinkLocale>
</template>



<script>

export default {
    props: {
        url: {
            type: String,
        },
        image: {
            type: String,
        },
        title: {
            type: String,
        },
        datestart: {
            type: String,
        },
        location: {
            type: String,
        },
        description: {
            type: String,
        },
    },
};
</script>

<style scoped>
.all-event-EventCard {
    height: 25rem;
    width: 20rem;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.2s ease-out;
}

.all-event-EventCard:hover {
    transform: scale(1.04);
}

.all-event-EventCard .al-event-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15rem;
    width: 100%;
    overflow: hidden;

}

.all-event-EventCard .al-event-image-container img {
    height: 100%;

}

.event-card-details-container {
    padding: 0.8rem;
    width: 100%;
    height: 10rem;
}

.event-card-details-container .event-card-title {
    width: 100%;
    font-size: 1.2rem;
    font-weight: 600;
    color: black;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    line-height: 1.5rem;

}

.event-card-details-container .event-date-and-local {
    margin: 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
    line-height: 1.5rem;
    overflow: hidden;
}

.event-card-details-container .event-date-and-local div {
    display: flex;
    align-items: center;
    width: 48%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
}

.event-card-details-container .event-date-and-local div img {
    height: 1rem;
    width: 1rem;
    margin-right: 0.5rem;
}

.event-card-details {

    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    line-height: 1.2rem;
    color: rgba(0, 0, 0, 0.7);
}
</style>