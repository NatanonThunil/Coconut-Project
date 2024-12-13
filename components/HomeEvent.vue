<template>
    <div>
        <ul class="homeeventfiltercontainer">
            <li class="filtli educate" :class="{ selecto: selectedFilter === 'educate' }"
                @click="selectedFilter = 'educate'">
                อบรม
            </li>
            <li class="filtli conference" :class="{ selecto: selectedFilter === 'conference' }"
                @click="selectedFilter = 'conference'">
                ประชุมวิชาการ
            </li>
            <li class="filtli others" :class="{ selecto: selectedFilter === 'others' }"
                @click="selectedFilter = 'others'">
                อื่นๆ
            </li>
        </ul>


        <div class="event-card-section">
            <div v-for="(event, index) in filteredEvents" :key="index" :class="['event-card', `${event.type}-card`]">
                <!-- ใช้ลิ๊งค์หน้าเฉพาะ  -->
                <nuxt-link to="event/detail/:id"> 
                <!--  -->
                    <img :src="event.image" alt="" draggable="false">
                    <div class="event-card-text">
                        <p class="event-title">{{ event.title }}</p>
                        <div class="event-card-date">
                            <img src="@/assets/icon/calenda.svg" alt="" draggable="false">
                            <p class="event-date">{{ event.date }}</p>
                        </div>
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedFilter: 'educate',

            // this is mock data wa
            events: [

                { type: 'educate', title: 'Coconuto', date: '32/13/2099', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'educate', title: 'Event Title', date: '01/01/2023', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'educate', title: 'Another Event', date: '15/05/2023', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'educate', title: 'Last Event', date: '20/10/2024', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'educate', title: 'Last Event', date: '20/10/2024', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'educate', title: 'Last Event', date: '20/10/2024', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'conference', title: '2', date: '32/13/2099', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'conference', title: '2 Title', date: '01/01/2023', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'conference', title: '2 Event', date: '15/05/2023', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'conference', title: '2 Event', date: '20/10/2024', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'others', title: 'Coconuto', date: '32/13/2099', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'others', title: 'Event Title', date: '01/01/2023', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'others', title: 'Another Event', date: '15/05/2023', image: 'https://via.placeholder.com/1920x1080' },
                { type: 'others', title: 'Last Event', date: '20/10/2024', image: 'https://via.placeholder.com/1920x1080' },
            ],
        };
    },
    computed: {

        filteredEvents() {
            return this.events.filter(event => event.type === this.selectedFilter).slice(0, 4);;
        },
    },
};
</script>

<style scoped>
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
    transition: 0.5s ease-in-out;

}

ul.homeeventfiltercontainer li.filtli.selecto {

    font-weight: bolder;
    font-size: larger;
    background-color: #C5D944;

}

.event-card-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    padding: 1rem;

}

.event-card {
    overflow: hidden;
    min-width: 16rem;
    flex: 1 1 calc(25% - 1rem);
    max-width: 22rem;
    height: auto;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    background-color: white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
}

.event-card:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.event-card img {
    width: 100%;
    height: 12rem;
    object-fit: cover;

}

.event-card-text {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.event-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
}

.event-card-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: auto;
}

.event-card-date img {
    width: 1.5rem;
    height: 1.5rem;
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
}

@media screen and (max-width: 768px) {
    .event-card {
        flex: 1 1 calc(50% - 1rem);
    }
}

@media screen and (max-width: 480px) {
    .event-card {
        flex: 1 1 100%;
    }
}
</style>