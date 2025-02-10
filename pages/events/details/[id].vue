<template>
    <Navbar selecto="events" />

    <!-- Event Image -->
    <div class="image-container" v-if="event">
        <div class="blur-background"></div>
        <img :src="event?.image || tlImage" class="img" alt="Coconut Image" draggable="false">
    </div>
    <div v-else class="no-data">
        <p>No event data available. Please try again later.</p>
    </div>

    <!-- Event Date & Location -->
    <div class="date-and-local" v-if="event">
        <div class="dnl">
            <img :src="calendarIcon">
            {{ formatDate(event?.date_start) }} - {{ formatDate(event?.date_end) }}
        </div>
        <NuxtLinkLocale class="dnl" :to="event?.location_url || 'https://www.google.co.th/maps/'">
            <img :src="locationIcon">
            {{ event?.location_name || 'Unknown location' }}
        </NuxtLinkLocale>
    </div>

    <div class="divider"></div>

    <!-- Event Title -->
    <h1 style="text-align: center;">{{ event?.title }}</h1>

    <!-- Event Details -->
    <div class="brief-details">
        <div class="toline">
            <div class="event-head">ผู้จัดกิจกรรม</div>: <div class="event-main-detail">{{ event?.organizer || 'N/A' }}
            </div>
        </div>
        <div class="toline">
            <div class="event-head">วัน</div>: <div class="event-main-detail">{{ formatDate(event?.date_start) }} - {{
                formatDate(event?.date_end) }}</div>
        </div>
        <div class="toline">
            <div class="event-head">สถานที่จัดงาน</div>: <div class="event-main-detail">
                <NuxtLinkLocale :to="event?.location_url || 'https://www.google.co.th/maps/'">{{ event?.location_name ||
                    'N/A' }}</NuxtLinkLocale>
            </div>
        </div>
        <div class="toline">
            <div class="event-head">เข้าร่วมกิจกรรม</div>: <div class="event-main-detail">
                <NuxtLinkLocale :to="event?.register_url || '/'">{{ event?.register_url ||
                    'N/A' }}</NuxtLinkLocale>
            </div>
        </div>
    </div>

    <div class="divider"></div>
    <h2 style="width: 60%; display: flex; justify-self: center; margin-bottom: 1rem;">คำอธิบาย</h2>
    <p style="width: 60%; display: flex; justify-self: center; margin-bottom: 1rem;">{{ event?.description ||
        'ไม่มีคำอธิบาย' }}</p>
    <SeeAllButton text="ดูกิจกรรมอื่นๆ" link="/events" />

</template>

<script>
import { useHead } from '@vueuse/head';
import calendarIcon from '@/assets/icon/calenda.svg';
import locationIcon from '@/assets/icon/location.png';
import tlImage from '@/assets/img/tl.png';

export default {
    data() {
        return {
            event: null,
            error: null,
            calendarIcon,
            locationIcon,
            tlImage
        };
    },
    async mounted() {
        const cid = this.$route.params.id;

        try {
            const response = await fetch(`/api/events_table`);
            if (!response.ok) throw new Error('Failed to fetch event details');
            const data = await response.json();
            this.event = data.find(event => (event.id === parseInt(cid) ) && event.status)|| null;

            if (this.event) {
                this.updateHead();
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
            this.error = 'Failed to load event data. Please try again later.';
        }
    },
    methods: {
        updateHead() {
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
        }
    }
};
</script>

<style scoped>
.brief-details {
    display: flex;
    flex-direction: column;
    justify-self: center;
    width: inherit;

}

.toline {
    display: flex;
    gap: 1rem;
}

.toline .event-head {
    font-weight: 700;
    width: 8rem;
}

.image-container {
    padding-top: 6rem;
    position: relative;
    width: 100%;
    height: 32rem;
    background-color: #4E6D16;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-container .blur-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    z-index: 0;
}

.image-container img {
    z-index: 1;
    height: 100%;
    object-fit: cover;
}

.no-data {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #555;
}

.date-and-local {
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 1rem;
    font-size: 1.2rem;
    color: #333;
    gap: 2rem;
}

.dnl img {
    height: 1rem;
}

.dnl {
    background-color: #DFF169;
    padding: 0.5rem;
    border-radius: 1rem;
    color: black;
}

.divider {
    height: 3px;
    width: 60%;
    background-color: #4E6D16;
    margin: 1rem auto;
    border-radius: 1px;
}
</style>
