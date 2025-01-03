<template>
    <Navbar selecto="events" />
    <div class="image-container" v-if="event" >
        <div class="blur-background"></div>
        <img :src="event.image || '~/assets/img/tl.png'" class="img" alt="Coconut Image" draggable="false">
    </div>
    <div v-else class="no-data">
        <p>No event data available. Please try again later.</p>
    </div>
    <div style="height: 32rem;" v-if="event"></div>
</template>

<script>
import { useHead } from '@vueuse/head';

export default {
    data() {
        return {
            event: null,
            error: null,
        };
    },
    async mounted() {
        const cid = this.$route.params.id;

        try {
            const response = await fetch(`/api/events_table`);
            if (!response.ok) throw new Error('Failed to fetch event details');
            const data = await response.json();
            this.event = data.find(event => event.id === parseInt(cid)) || null;

            if (this.event) {
                useHead({
                    title: `🥥 Coconut - ${this.event.title}`,
                    meta: [
                        {
                            name: 'description',
                            content: `Detailed information about ${this.event.title || 'coconut'} varieties.`,
                        },
                    ],
                });
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
            this.error = 'Failed to load event data. Please try again later.';
        }
    },
};
</script>

<style scoped>
.image-container {
    top: 0%;
    position: absolute;
    width: 100%;
    height: 32rem;
    overflow: hidden;
    background-color: #4E6D16; /* Default background color if no image */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.image-container .blur-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    filter: blur(10px); /* Apply blur only to background */
    z-index: 0;
}

.image-container img {
    z-index: 1; /* Ensure the image stays on top */
    height: 100%;
    object-fit: cover;
}

.no-data {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #555;
}

h1 {
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    margin: 0;
    opacity: 0;
    animation: fadeInText 1s ease-out 0.5s forwards;
}

@keyframes fadeInText {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

img {
    display: flex;
    justify-self: center;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    height: 32rem;
    opacity: 0;
    animation: fadeInImage 1s ease-out forwards;
}

@keyframes fadeInImage {
    0% {
        filter: brightness(0) blur(10px);
        opacity: 0;
        transform: scale(1.1);
    }
    100% {
        filter: brightness(1) blur(0px);
        opacity: 1;
        transform: scale(1);
    }
}
</style>
