<template>
  <section>
    <div class="old-young-selection-container">
      <div class="dropdown">
        <div class="dropdown-toggle" @click="toggleDropdown">
          {{ coconutType }}
          <span class="dropdown-arrow" :class="{ 'ddusd': dropdownOpen }">▼</span>
        </div>
        <ul v-if="dropdownOpen" class="old-young-selection">
          <li v-for="option in coconutOptions" :key="option.value" @click="selectCoconutType(option.value)">
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
    <div class="coconut-info-selection">
      <div v-for="page in pagesel" :key="page.link" class="coconut-info-selection-items fadeinanim">
        <img :src="page.icon" alt="icon" />
        <p>{{ page.label }}</p>
        <div class="card-desc-container">
          <p>{{ page.desc }}</p>
        </div>
      </div>
    </div>
    <!-- Add the button here -->
    <div class="button-container">
      <NuxtLink :to="'/coconut-information'">
        <button class="navigate-button">Go Back</button>
      </NuxtLink>
    </div>
  </section>
</template>

<script>
import coconutIcon from "@/assets/icon/coconut.png";
import harvestIcon from "@/assets/icon/harvest.png";

export default {
  data() {
    return {
      cocontype: true,
      dropdownOpen: false,
      coconutType: "Young",
      coconutOptions: [
        { label: "Young-coconut", value: "Young" },
        { label: "Old-coconut", value: "Old" },
      ],
      pagesel: [
        { label: "Coconut-varieties", icon: coconutIcon, link: "/coconut-varieties/", desc: "พันธุ์" },
        { label: "Upstream", icon: harvestIcon, link: "/upstream/", desc: "ขั้นตอนการผลิดของ" },
      ],
    };
  },
  methods: {
    togglecoconut() {
      this.cocontype = !this.cocontype;
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectCoconutType(type) {
      this.coconutType = type;
      this.dropdownOpen = false;
    },
  },
};
</script>

<style scoped>
.oyt-y {
  color: #4E6D16;
}

.oyt-o {
  color: #5f3b13;
}

.fadeinanim:hover a .card-desc-container {
  opacity: 1;
  transform: translateY(0px);
  height: 15%;
}

.card-desc-container {
  opacity: 0;
  display: flex;
  transition: 0.3s ease-in-out;
  transform: translateY(10px);
  height: 0px;
}

.card-desc-container p {
  font-size: 1.2rem;
  margin-top: 0px;
}

.card-desc-container .oyt {
  font-weight: 700;
}

.ddusd {
  transform: rotateZ(180deg);
}

.animated-dropdown {
  animation: fadeInSlideDown 0.3s ease-out forwards;
}

@keyframes fadeInSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-10%);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}

.fadeinanim {
  opacity: 0;
  animation: fadeinbelow 1s ease-out forwards;
}

.fadeinanim:nth-child(2) {
  animation-delay: 0.2s;
}

.fadeinanim:nth-child(3) {
  animation-delay: 0.4s;
}

.fadeinanim:nth-child(4) {
  animation-delay: 0.6s;
}

@keyframes fadeinbelow {
  0% {
    opacity: 0;
    transform: translateY(20%) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0%) scale(1);
  }
}

.old-young-selection-container {
  width: 100%;
  display: flex;
  justify-self: center;
  justify-content: center;
}

.dropdown {
  position: relative;
  display: inline-block;
  width: 30%;
}

.dropdown-toggle {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
  height: 4rem;
  padding: 0 1rem;
  border-radius: 20px;
  border: #4e6d16 4px solid;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background-color: #e2e2e2;
  border-color: #5e7d22;
}

.dropdown-arrow {
  transition: translate 0.5 ease-in-out;
  color: #4e6d16;
  font-size: 3rem;
  margin-left: 1rem;
}

.old-young-selection {
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 4.5rem;
  width: 100%;
  background-color: #ffffff;
  outline: 2px solid #4E6D16;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 10;
}

.old-young-selection li {
  padding: 10px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.old-young-selection li:hover {
  background-color: #f1f1f1;
}

.old-young-selection li:active {
  background-color: #e2e2e2;
}

.coconut-info-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-self: center;
  justify-content: center;
  width: 40%;
}

.coconut-info-selection-items {
  all: unset;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 20rem;
  width: 20rem;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  outline: 4px solid #4E6D16;
  font-size: 2rem;
  transition: ease-in-out 0.2s;
}

.coconut-info-selection-items:hover {
  background-color: white;
  outline: 6px solid #4E6D16;
  transform: scale(1.1);
}

.coconut-info-selection-items p {
  margin-top: 1rem;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.navigate-button {
  padding: 1rem 2rem;
  font-size: 1.5rem;
  color: white;
  background-color: #4E6D16;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.navigate-button:hover {
  background-color: #5e7d22;
}

@media (max-width: 1696px) {
  .coconut-info-selection {
    width: 60%;
  }
}

@media (max-width: 1137px) {
  .coconut-info-selection {
    width: 70%;
  }
}

@media (max-width: 978px) {
  .coconut-info-selection {
    width: 80%;
  }
  .card-desc-container p {
    font-size: 0.9rem;
    margin-top: 10px;
  }
}

@media (max-width: 857px) {
  .coconut-info-selection .coconut-info-selection-items {
    height: 16rem;
    width: 16rem;
    font-size: 1.7rem;
  }
}

@media (max-width: 697px) {
  .coconut-info-selection .coconut-info-selection-items {
    height: 14rem;
    width: 14rem;
    font-size: 1.5rem;
  }
}
</style>