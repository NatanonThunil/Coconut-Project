<template>
  <aside :class="['sidebar', { 'closed': !sidebaropen }]">
    <div class="sidebar-content">
      <div class="logo-container">
        <img :src="icon" alt="Coconut Logo" class="logo" />
      </div>
      <nav class="menu">
        <ul>
          <li v-for="(item, index) in menuItems" :key="index" :class="{ 'active': activeItem === item.path }"
            @click="navigateTo(item.path)">
            <span class="menu-title-text">{{ item.label }}</span>
          </li>
        </ul>
      </nav>
    </div>
    <div :class="['sidebar-menu', { 'closed': !sidebaropen }]" @click="toggleSidebar">
      <img class="sidebar-icon-button" draggable="false" :src="coconutslogo" alt="Toggle Sidebar">
    </div>
  </aside>
</template>

<script setup>
import icon from '/logo/CKH.png';
import coconutslogo from 'public/CoconutIcon.ico';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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

const sidebaropen = ref(false);
const toggleSidebar = () => {
  sidebaropen.value = !sidebaropen.value;
};

const navigateTo = (path) => {
  activeItem.value = path;
  router.push(path);
};
</script>

<style scoped>
.menu-title-text {
  font-size: clamp(0.8rem, 1vw, 1rem);
  font-weight: 500;

}

.sidebar-icon-button {
  transition: transform 0.3s ease;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: row;
  background-color: #778d8a;

  box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
}

.sidebar.closed {
  left: -230px;
}

.sidebar-content {
  background-color: #B6E3DB;
  width: 250px;
  transition: width 0.3s ease 0.1s;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
}

.sidebar.closed .sidebar-content {
  width: 220px;

  overflow: hidden;
}



.sidebar-menu {
  cursor: pointer;
  position: fixed;
  top: 50px;
  left: 250px;
  background-color: #99beb9;
  padding: 10px;
  display: flex;
  border-radius: 0% 50% 50% 0%;
  box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease;
}

.sidebar.closed+.sidebar-menu {
  left: 60px;
}

.sidebar-menu.closed {
  left: 0px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  width: auto;
  height: 50px;
}

.menu ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  gap: 0.5rem;
}

.menu li {
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  transition: 0.3s;
  font-weight: 500;
  text-align: center;
  background-color: #ceeee8;
}

.menu li:hover {
  background-color: #4e867a;
   color: white;
  transform: scale(1.05);
}
.menu li.active {
  background-color: #7eb9af;
  color: white;
  transform: scale(1.05);
}

.sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #ceeee8;
  border-radius: 10px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #7eb9af, #5a8f87);
  border-radius: 10px;
  border: 2px solid #ceeee8;
  transition: background 0.3s ease;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #5a8f87, #3d6e63);
}


.sidebar.closed+.sidebar-menu .sidebar-icon-button {
  transform: rotate(180deg);
}
</style>
