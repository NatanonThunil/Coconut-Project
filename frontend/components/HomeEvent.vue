<template>
  <div>
    <div class="homeevent-container-container"><ul class="homeeventfiltercontainer">
      <li class="filtli train" :class="{ selecto: selectedFilter === 'educate' }" @click="selectedFilter = 'educate'">
        {{ $t('Educate') }}
      </li>
      <li class="filtli conference" :class="{ selecto: selectedFilter === 'conference' }"
        @click="selectedFilter = 'conference'">
        {{ $t('Conference') }}
      </li>
      <li class="filtli other" :class="{ selecto: selectedFilter === 'other' }" @click="selectedFilter = 'other'">
        {{ $t('Other') }}
      </li>
    </ul>
</div>
    <div class="event-slider-container"><button @click="goPrev" class="btn-4-swiper"><</button>
          <!-- Loading State -->
          <div class="event-card-section" v-if="isLoading" loading="lazy">
            <div style="display: flex; gap: 2rem; flex-direction: row;">
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
            </div>
          </div>

          <div v-if="!isLoading && filteredEvents.length > 0" class="swiper-container">
            <Swiper :slides-per-view="4" :space-between="10" ref="mySwiper" :slides-per-group="4" :pagination="true"
              :breakpoints="{

                480: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 1 },
                768: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
                1024: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
                1524: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 },
              }">
              <SwiperSlide v-for="(event, index) in filteredEvents" :key="index">
                <NuxtLinkLocale :to="`/announcements/events/details/${event.id}`" class="event-card">
                  <div class="event-card-image">
                    <img :src="event.image || 'https://placehold.co/600x400'" alt="Event Image" draggable="false" />
                  </div>
                  <div class="event-card-text">
                    <p class="event-title">{{ event.title }}</p>
                    <div class="event-card-date">
                      <img src="/icon/calenda.svg" alt="Calendar Icon" draggable="false" />
                      <p class="event-date">{{ formatDate(event.date_start) }}</p>
                    </div>
                    <div :class="['event-card-status', getStatusClass(event)]">
                      <span v-if="getStatusText(event) === 'กำลังดำเนินการ'">{{ $t("Ongoing") }}</span>
                      <span v-else-if="getStatusText(event) === 'กำลังจะเริ่ม'">{{ $t("Upcoming") }}</span>
                      <span v-else-if="getStatusText(event) === 'จบแล้ว'">{{ $t("Finished") }}</span>
                      <span v-else>{{ $t("Error") }}</span>
                    </div>
                  </div>
                </NuxtLinkLocale>
              </SwiperSlide>
            </Swiper>
          </div>


          <div v-if="!isLoading && filteredEvents.length === 0" class="no-events">
            ไม่มีกิจกรรมในขณะนี้
          </div>
          <button @click="goNext" class="btn-4-swiper">></button>
    </div>
  </div>
</template>

<script>

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEvents } from '~/composables/useEvents'
const { getEvents } = useEvents()

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      selectedFilter: "educate",
      events: [],
      currentDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
      isLoading: true,
    };
  },
  computed: {
    filteredEvents() {
      if (!this.events || this.events.length === 0) return [];
      return this.events
        .filter((event) => event.event_category === (this.selectedFilter))
        .slice(0, 8);
    },
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    goPrev() {
      this.$refs.mySwiper.$el.swiper.slidePrev();
    },
    goNext() {
      this.$refs.mySwiper.$el.swiper.slideNext();
    },
    async fetchEvents() {
      try {
        const data = await getEvents();

        // ไม่ต้องตรวจว่ามันเป็น json 
        // if (!response.ok) throw new Error("Failed to fetch events");
        // const data = await response.json();
        this.events = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching events:", error);
        this.events = [];
      } finally {
        this.isLoading = false;
      }
    },
    convertToTimeZone(date, timeZone = "Asia/Bangkok") {
      return new Date(date).toLocaleString("en-US", { timeZone });
    },
    getStatusText(event) {
      const currentDate = new Date(this.convertToTimeZone(this.currentDate));
      const dateStart = new Date(this.convertToTimeZone(event.date_start));
      const dateEnd = new Date(this.convertToTimeZone(event.date_end));

      if (dateStart <= currentDate && dateEnd >= currentDate) return "กำลังดำเนินการ";
      if (dateStart > currentDate) return "กำลังจะเริ่ม";
      if (dateEnd < currentDate) return "จบแล้ว";
      return "Error";
    },
    getStatusClass(event) {
      const currentDate = new Date(this.convertToTimeZone(this.currentDate));
      const dateStart = new Date(this.convertToTimeZone(event.date_start));
      const dateEnd = new Date(this.convertToTimeZone(event.date_end));

      if (dateStart <= currentDate && dateEnd >= currentDate) return "ongoing";
      if (dateStart > currentDate) return "upcoming";
      if (dateEnd < currentDate) return "finished";
      return "error";
    },
  },
};
</script>


<style scoped>
.homeevent-container-container{
  display: flex;
  justify-content: center;
  width: 100%;
}
.swiper {

  width:100%;
  
}
.swiper-wrapper{
  justify-content: center !important;
}
.btn-4-swiper {
  all: unset;
  cursor: pointer;
  color: #4E6D16;
  text-align: center;
  width: 4rem;
  font-size: 3rem;
  text-shadow: white 0px 0px 8px;
  transition: 0.3s ease-in-out;
}

.btn-4-swiper:hover {
  border-radius: 10px;
  background-color: #e0e0e0;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);

}

.event-slider-container {

  display: flex;
  flex-direction: row;
  justify-content: center;
}



.swiper-container {
  display: flex;
  justify-self: center;
  padding: 1rem;
  background-color: #f5f5f5;

  width: 80%;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.swiper-slide:hover {
  transform: scale(1.02);

  transition: all 0.3s ease;
}

.no-events {
  display: flex;
  justify-content: center;
  margin: 10rem;
}

ul.homeeventfiltercontainer {
  margin: 2rem;
  list-style: none;
  display: flex;
  justify-self: center;
  justify-content: space-evenly;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
  outline: solid rgba(0, 0, 0, 0.2) 4px;
  background-color: transparent;
  height: 3.5rem;
  width: 50%;
  overflow: hidden;
  border-radius: 20px;
}

ul.homeeventfiltercontainer li.filtli {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  height: 100%;
  width: 33.33%;
  transition: all 0.3s ease;
  font-size: 25px;
}

ul.homeeventfiltercontainer li.filtli.selecto {
  font-weight: bolder;
  font-size: 28px;
  background-color: #c5d944;
  transform: scale(1.1);
}

.event-card-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  padding: 1rem;

  animation: fadeinbelow 1s;
}

.event-card-status {
  color: black;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid black;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.ongoing {
  color: white;
  background-color: #4E6D16;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid #4E6D16;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.upcoming {
  color: #6F5D55;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid #6F5D55;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.finished {
  color: black;
  background-color: #cccccc;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid black;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.error {
  color: red;

  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid red;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card {
  all: unset;
  cursor: pointer;
  overflow: hidden;
  min-width: 16rem;
  flex: 1 1 calc(25% - 1rem);
  max-width: 22rem;
  height: 22rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background-color: white;
  transition: ease-in-out 0.4s;
  display: flex;
  flex-direction: column;
}

.event-card:hover {

  outline: #4E6D16 solid 3px;
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.event-card .event-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: ease-in-out 0.2s;


}

.event-card:hover .event-card-image {
  transform: scale(1.1);

}

.event-card-image {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.5);
}

.event-card-text {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 40%;
}

.event-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.event-card-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-card-date img {
  width: 1.2rem;
  height: 1.2rem;
  object-fit: cover;
}

.event-date {
  font-size: 0.875rem;
  color: #777;
}

@media screen and (max-width: 1024px) {
  .event-card {
    flex: 1 1 calc(50% - 1rem);
  }

  .event-card-text {
    height: 50%;
  }

  ul.homeeventfiltercontainer li.filtli {
    font-size: 20px;
  }

  ul.homeeventfiltercontainer li.filtli.selecto {
    font-size: 25px;
  }
}

@media screen and (max-width: 1123px) {
  .event-card-section {
    justify-self: center;
    width: 75%;
  }

  ul.homeeventfiltercontainer li.filtli {
    font-size: 15px;
  }

  ul.homeeventfiltercontainer li.filtli.selecto {
    font-size: 18px;
  }
}

@media screen and (max-width: 768px) {
  .event-card {
    flex: 1 1 calc(50% - 1rem);
  }

  .event-card-text {
    height: 50%;
  }
}

@media screen and (max-width: 480px) {
  .event-card {
    flex: 1 1 100%;
  }

  .event-card-text {
    height: 10%;
  }
}

@keyframes fadeinbelow {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
