<template>


    <!-- Event Image -->

    <div class="image-container" v-if="event">

        <div class="blur-background"></div>
        <img :src="event?.image || tlImage" class="img" alt="Coconut Image" draggable="false">
    </div>
    <div v-else class="no-data">
        <p>No event data available. Please try again later.</p>
    </div>
  <div class="faqs-path">
            <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>/
            <NuxtLinkLocale to="/events">{{ $t('Events') }}</NuxtLinkLocale>/
             <NuxtLinkLocale :to="'/events/details/'+ this.$route.params.id">{{ (currentLocale === 'th') ? (event?.title || 'No Thai title name') :
        (event?.title_en
            || 'No English title name') }}</NuxtLinkLocale>
        </div>
    <!-- Event Date & Location -->
    <div class="date-and-local" v-if="event">
        <div class="dnl">
            <img :src="calendarIcon">
            {{ formatDate(event?.date_start) }} - {{ formatDate(event?.date_end) }}
        </div>
        <NuxtLinkLocale class="dnl"
            :to="(currentLocale === 'th') ? (event?.location_url || 'https://www.google.co.th/maps/') : (event?.location_url_en || 'https://www.google.co.th/maps/')">
            <img :src="locationIcon">
            {{ (currentLocale === 'th') ? (event?.location_name || 'Unknown location') : (event?.location_name_en ||
                'Unknown location') }}
        </NuxtLinkLocale>
    </div>

    <div class="divider"></div>

    <!-- Event Title -->
    <h1 style="text-align: center;">{{ (currentLocale === 'th') ? (event?.title || 'No Thai title name') :
        (event?.title_en
            || 'No English title name') }}</h1>

    <!-- Event Details -->
    <div class="brief-details">
        <div class="toline">
            <div class="event-head">{{ $t('Organizer') }}</div>: <div class="event-main-detail">{{ (currentLocale ===
                'th') ?
                (event?.organizer || 'N/A') : (event?.organizer_en || 'N/A') }}
            </div>
        </div>
        <div class="toline">
            <div class="event-head">{{ $t('Event_Date') }}</div>: <div class="event-main-detail">{{
                formatDate(event?.date_start) }} - {{
                    formatDate(event?.date_end) }}</div>
        </div>
        <div class="toline">
            <div class="event-head">{{ $t('Location') }}</div>: <div class="event-main-detail">
                <NuxtLinkLocale :to="event?.location_url || 'https://www.google.co.th/maps/'">{{ (currentLocale ===
                    'th') ? (event?.location_name ||
                        'N/A') : (event?.location_name_en ||
                            'N/A') }}</NuxtLinkLocale>
            </div>
        </div>
        <div class="toline">
            <div class="event-head">{{ $t('Registration') }}</div>: <div class="event-main-detail">
                <NuxtLinkLocale :to="event?.register_url || '/'">{{ event?.register_url ||
                    'N/A' }}</NuxtLinkLocale>
            </div>
        </div>
    </div>

    <div class="divider"></div>
    <h2 style="width: 60%; display: flex; justify-self: center; margin-bottom: 1rem;">{{ $t('Description') }}</h2>
    <p style="width: 60%; display: flex; justify-self: center; margin-bottom: 1rem;" v-html="(currentLocale === 'th') ? (event?.description ||
        'ไม่มีคำอธิบาย') : (event?.description_en ||
            'No English description')"></p>
    <SeeAllButton :text="$t('Back to All Events')" link="/events" />

</template>

<script>
import { useI18n } from 'vue-i18n';
import { useHead } from '@vueuse/head';
import calendarIcon from '/icon/calenda.svg';
import locationIcon from '/icon/location.png';
import tlImage from '/img/tl.png';
import { useEvents } from '~/composables/useEvents'

const { getEventById } = useEvents()

export default {
    setup() {
        const { locale } = useI18n();
        const currentLocale = computed(() => locale.value);
        return { currentLocale };
    },
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
            this.loading = true;
            const data = await getEventById(cid);
            this.event = data.status ? data : null;

            // If you expect an array, use this instead:
            // this.event = data.find((event) => event.id === parseInt(cid) && event.status) || null;

            if (!this.event) {
                this.error = "ไม่พบข้อมูลอีเวนต์ กรุณาตรวจสอบหมายเลขอีกครั้ง";
            } else {
                this.updateHead();
            }
        } catch (error) {
            this.error = "ไม่สามารถโหลดข้อมูลอีเวนต์ได้ กรุณาลองใหม่อีกครั้ง";
        }
        this.loading = false;
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
    flex-direction: column;
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
    margin-bottom: 2rem;
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
