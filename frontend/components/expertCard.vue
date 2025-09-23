<template>
    <!-- เปลี่ยนจาก NuxtLinkLocale ที่ห่อทั้งการ์ด -> div ธรรมดา -->
    <div class="expert-card" role="link" tabindex="0" @click="goDetails" @keydown.enter.prevent="goDetails">
        <div class="not-tag-container">
            <div class="expert-card-image">
                <img :src="image || '/images/expert-placeholder.webp'" alt="Expert Image" draggable="false" />
            </div>

            <div class="expert-card-text">

                <NuxtLinkLocale class="expert-title" :to="`/experts/details/${id}`">
                    <h2>{{ name }}</h2>
                </NuxtLinkLocale>

                <p class="expert-details">{{ description || '—' }}</p>

                <div v-if="email" class="expert-contact">
                    <img src="/icon/email.png" alt="">
                    <p>{{ email }}</p>
                </div>
                <div v-if="phoneNumber" class="expert-contact">
                    <img src="/icon/phonecall.png" alt="">
                    <p>{{ phoneNumber }}</p>
                </div>
            </div>
        </div>
        <!-- Tags -->
        <div v-if="!pending && tags?.length" class="experttags">
            <!-- ปุ่มแท็ก: กัน bubble + กัน default ของลิงก์การ์ด -->
            <button v-for="t in tags" :key="t" type="button" class="tag-chip" @mousedown.stop
                @click.stop.prevent="$emit('tag-click', t)" @keydown.enter.stop.prevent="$emit('tag-click', t)"
                :aria-label="`filter by tag ${t}`">
                {{ t }}
            </button>
        </div>

        <div v-else-if="pending" class="experttags" aria-busy="true">
            <span class="tag-skel" />
            <span class="tag-skel" />
            <span class="tag-skel" />
        </div>
    </div>
</template>

<script setup lang="ts">


type Props = {
    id: number
    image?: string | null
    name: string
    description?: string | null
    email?: string | null
    phoneNumber?: string | null
}

const props = defineProps<Props>()

defineEmits<{ (e: 'tag-click', tag: string): void }>()

const { getTagsByExpert } = useExperts()

const { data: tags, pending, error } = await useAsyncData(
    `expert-tags-${props.id}`,
    () => getTagsByExpert(props.id),
    { server: false }
)

const goDetails = () => {
    navigateTo(`/experts/details/${props.id}`)
}
</script>

<style scoped>
.expert-card:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, .5);
    transform: scale(1.01);
    outline: #4E6D16 2px solid;
}

.expert-card:active {
    background-color: #ccc;
}

.expert-card {
    cursor: pointer;
    display: block;
    width: 100%;
    max-width: 22rem;
    min-width: 16rem;
    height: auto;
    padding: clamp(0.75rem, 2vw, 1rem);
    outline: 1px solid #ccc;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
    transition: 0.3s all;
    justify-content: space-between;
}

.expert-card-image {
    aspect-ratio: 1 / 1;
    margin: 1rem auto;
    height: 10rem;
    width: clamp(7rem, 35vw, 10rem);
    overflow: hidden;
    border-radius: 100%;
}

.expert-card-image img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
}

.expert-card-text h2 {
    text-align: center;
}

.expert-details {
    text-align: center;
    color: #4E6D16;
    margin-bottom: 1rem;
}

.expert-contact {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    justify-content: center;
    opacity: .7;
}

.expert-contact img {
    height: 1rem;
    width: 1rem;
}

.experttags {
    --fade: linear-gradient(to right, rgba(255, 255, 255, 0), #fff 30%);
    position: relative;
    display: flex;
    align-items: center;
    gap: .5rem;
    width: 100%;
    margin-top: .5rem;
    overflow-x: auto;
    /* เลื่อนแนวนอน */
    overflow-y: hidden;
    white-space: nowrap;
    /* บรรทัดเดียว */
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.25rem;
    mask-image: none;
}

.experttags::-webkit-scrollbar {
    height: 6px;
}

.experttags::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 9999px;
}

.experttags::-webkit-scrollbar-track {
    background: transparent;
}

.experttags .tag-chip {
    flex-shrink: 0;
    /* ✅ ปุ่มไม่ถูกบีบจนหาย */
}

.experttags button {
    background-color: unset;
    white-space: nowrap;
    flex-shrink: 0;
    color: #4E6D16;
    border: #4E6D16 1px solid;
    border-radius: 10px;
    padding: .5rem;
    transition: .3s all;
}

.experttags button:hover {
    color: #fff;
    background: #4E6D16;
    outline: #4E6D16 1px solid;
}

.tag-skel {
    display: inline-block;
    height: 2rem;
    width: 4.5rem;
    border-radius: 10px;
    background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
    animation: sh 1.2s infinite;
}

@keyframes sh {
    0% {
        background-position: -100px
    }

    100% {
        background-position: 200px
    }
}
</style>
