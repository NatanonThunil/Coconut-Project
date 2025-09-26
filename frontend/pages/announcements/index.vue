<template>
  <div class="announce-wrap">
    <div class="spacer-xxl"></div>

    <!-- Breadcrumb -->
    <nav class="faqs-path" >
      <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>
      <span>/</span>
      <NuxtLinkLocale to="/announcements">{{ $t('News & Events') }}</NuxtLinkLocale>
    </nav>

    <h1 class="context-header">{{ $t('News & Events') }}</h1>
    <div class="spacer-xl"></div>

    <!-- Cards -->
    <section class="coconut-info-selection">
      <article
        v-for="(item, index) in pagesel"
        :key="index"
        class="fadeinanim"
      >
        <NuxtLinkLocale
          :to="'/announcements' + item.link"
          class="coconut-info-selection-items"
          :aria-label="$t(item.label)"
        >
          <div class="card-icon">
            <img :src="item.icon" alt="" loading="lazy" />
          </div>

          <h2 class="card-title">{{ $t(item.label) }}</h2>

          <div class="card-desc-container">
            <p class="card-desc">{{ $t(item.desc) }}</p>
          </div>
        </NuxtLinkLocale>
      </article>
    </section>

    <div class="spacer-xl"></div>
  </div>
</template>

<script>
import coconutIcon from "/icon/newsnevents.svg";
import harvestIcon from "/icon/event.png";

export default {
  data() {
    return {
      pagesel: [
        { label: "News",   icon: coconutIcon, link: "/news",   desc: "ดูพันธุ์มะพร้าว" },
        { label: "Events", icon: harvestIcon, link: "/events", desc: "ดูศัตรูพืชของมะพร้าว" },
      ],
    };
  },
};
</script>

<style scoped>
/* ===== Layout base ===== */
.announce-wrap {
  min-height: 100dvh;

  padding-inline: clamp(1rem, 4vw, 3rem);
}

.spacer-xl  { height: 5rem; }
.spacer-xxl { height: 8rem; }



/* ===== Cards grid ===== */
.coconut-info-selection {
  margin-inline: auto;
  width: min(1100px, 95%);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
  gap: clamp(1rem, 2.5vw, 2rem);
}

/* Card */
.coconut-info-selection-items {
  all: unset;
  display: grid;
  text-align: center;
  grid-template-rows: auto auto 1fr;
  align-items: start;
  gap: .25rem;

  padding: clamp(1rem, 3.5vw, 1.5rem);
  border-radius: 20px;
  background: rgba(255,255,255, .7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  outline: 3px solid #4E6D16;
  box-shadow:
    0 10px 30px rgba(0,0,0,.08),
    inset 0 0 0 1px rgba(255,255,255,.4);

  cursor: pointer;
  transition: transform .25s ease, outline-width .25s ease, box-shadow .25s ease, background .25s ease;
}

.coconut-info-selection-items:hover,
.coconut-info-selection-items:focus-visible {
  transform: translateY(-2px) scale(1.02);
  outline-width: 5px;
  background: rgba(255,255,255, .85);
  box-shadow:
    0 16px 40px rgba(0,0,0,.12),
    inset 0 0 0 1px rgba(255,255,255,.6);
}

.card-icon {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 14px;
  
  overflow: hidden;
}
.card-icon img {
  width: clamp(56px, 50%, 200px);
  height: auto;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

.card-title {
    
  margin: .35rem 0 0 0;
  font-size: clamp(1.15rem, 1.7vw, 1.5rem);
  font-weight: 700;
  color: #2c4b4b;
  letter-spacing: .2px;
}

/* Desc reveal */
.card-desc-container {
  display: grid;
  align-content: start;
  margin-top: .25rem;
  max-height: 0;
  opacity: 0;
  transform: translateY(6px);
  transition: max-height .3s ease, opacity .3s ease, transform .3s ease;
}
.coconut-info-selection-items:hover .card-desc-container,
.coconut-info-selection-items:focus-visible .card-desc-container {
  max-height: 80px; /* พอให้ข้อความ 2–3 บรรทัด */
  opacity: 1;
  transform: translateY(0);
}
.card-desc {
  color: #3b5959;
  font-size: clamp(.9rem, 1.5vw, 1rem);
  line-height: 1.45;
  margin: 0;
}

/* ===== Fade-in on mount ===== */
.fadeinanim {
  opacity: 0;
  animation: fadeinbelow .7s ease-out forwards;
}
.fadeinanim:nth-child(2) { animation-delay: .1s; }
.fadeinanim:nth-child(3) { animation-delay: .2s; }
.fadeinanim:nth-child(4) { animation-delay: .3s; }

@keyframes fadeinbelow {
  0%   { opacity: 0; transform: translateY(14px) scale(.98); }
  100% { opacity: 1; transform: translateY(0)   scale(1);   }
}

/* ===== Accessibility / Motion ===== */
.coconut-info-selection-items:focus-visible {
  outline-color: #6AA84F;
  box-shadow:
    0 0 0 3px rgba(106,168,79,.25),
    0 16px 40px rgba(0,0,0,.12);
}
@media (prefers-reduced-motion: reduce) {
  .coconut-info-selection-items,
  .card-desc-container,
  .fadeinanim {
    transition: none !important;
    animation: none !important;
  }
}

/* ===== Responsive tweaks ===== */
@media (max-width: 780px) {
  .spacer-xl  { height: 3.5rem; }
  .spacer-xxl { height: 5.5rem; }
}
</style>
