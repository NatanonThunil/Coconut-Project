<template>
  <NuxtLinkLocale
    :to="url"
    :class="['Big-card', { HotCard: isHotnews }]"
    :aria-label="title ? `Open news: ${title}` : 'Open news'"
  >
    <div class="big-hot-news-image-container">
      <img
        :src="image || '/img/News404.png'"
        :alt="title || 'News image'"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </div>

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
    url: { type: String, required: true },
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    date: { type: String, default: '' },
    isHotnews: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.HotCard { outline: solid #A6AB82 5px; }

/* จำกัดขอบเขตให้การ์ดเท่านั้น ไม่กระทบลิงก์อื่น */
.Big-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  background-color: #fff;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,.15);
  transition: transform .2s ease, box-shadow .2s ease, outline-color .2s ease;
  text-decoration: none;
  color: inherit;
}

/* โฟกัสสำหรับคีย์บอร์ด */
.Big-card:focus-visible {
  outline: 3px solid #4E6D16;
  box-shadow: 0 0 0 4px rgba(78,109,22,.15);
}

/* Hover เฉพาะอุปกรณ์ที่มี hover */
@media (hover:hover) and (pointer:fine) {
  .Big-card:hover {
    transform: translateY(-2px);
    outline: #4E6D16 3px solid;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  }
  .Big-card:hover .big-hot-news-image-container img {
    transform: scale(1.04);
  }
}

/* รูป */
.big-hot-news-image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
}
.Big-card .big-hot-news-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s ease-in-out;
}

/* รายละเอียด */
.big-hot-news-details-container { padding: 1rem; }

.big-hot-news-details-container h2 {
  /* แก้ clamp: ให้ max ใหญ่กว่าขั้นต่ำ */
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.25;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;  /* แสดงได้ 2 บรรทัด */
  text-overflow: ellipsis;
  margin: 0;
}

.date-n-readmore {
  font-size: clamp(.75rem, 2.2vw, .9rem);
  display: flex;
  justify-content: space-between;
  margin-top: .5rem;
  padding-right: 1rem;
  opacity: .8;
}

/* ลด motion */
@media (prefers-reduced-motion: reduce) {
  .Big-card { transition: none; }
  .Big-card .big-hot-news-image-container img { transition: none; }
}
</style>
