<template>
  <aside class="sidebar">
    <div class="logo-container">
      <img :src="icon" alt="Coconut Logo" class="logo" />
    </div>
    <nav class="menu">
      <ul>
        <li v-for="(item, index) in menuItems" :key="index" :class="{ 'active': activeItem === item.path }"
          @click="navigateTo(item.path)">
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import icon from '/logo/CKH.png'
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeItem = ref(router.currentRoute.value.path);

const menuItems = [
  { label: "จัดการ เฮดไลน์", path: "/backend/tagline-edit" },
  { label: "จัดการข่าว", path: "/backend/news" },
  { label: "จัดการกิจกรรม", path: "/backend/events" },
  { label: "จัดการผลงาน", path: "/backend/achievements" },
  { label: "จัดการคณะทำงาน", path: "/backend/employees" },
  { label: "จัดการสมาชิก", path: "/backend/members" },
  { label: "จัดการผู้เชี่ยวชาญ", path: "/backend/experts" },
  { label: "จัดการสิทธิประโยชน์และการบริการ", path: "/backend/services" },
  { label: "จัดการข้อมูลมะพร้าว", path: "/backend/coconuts" },

  { label: "จัดการคำถามที่พบบ่อย", path: "/backend/faqs" },
  { label: "จัดการฟุตเตอร์", path: "/backend/footer" },
];

const navigateTo = (path) => {
  activeItem.value = path;
  router.push(path);
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #B6E3DB;
  position: fixed;
  /* Keeps it fixed on the left */
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Add this line to make the sidebar scrollable */
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  justify-content: center;
}

.logo {
  width: auto;
  height: 50px;
}

.menu {
  flex-grow: 1;
  overflow-y: auto; /* Add this line to make the menu scrollable */
  overflow-x: visible;
}

.menu ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.menu li {
  padding: 12px;
  cursor: pointer;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  transition: 0.3s;
  font-weight: 500;
  text-align: center;
  background-color: #ceeee8;
}

.menu li:hover,
.menu li.active {
  background-color: #7eb9af;
  color: white;
}

/* Add custom scrollbar styles */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #7eb9af;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #5a8f87;
}

.menu::-webkit-scrollbar {
  width: 8px;
}

.menu::-webkit-scrollbar-thumb {
  background-color: #7eb9af;
  border-radius: 10px;
}

.menu::-webkit-scrollbar-thumb:hover {
  background-color: #5a8f87;
}
</style>
