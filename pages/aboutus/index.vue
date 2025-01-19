<template>
  <div class="navcontainer">
    <Navbar selecto="aboutus" />
  </div>
  <h3 class="header-content">{{ $t("Address") }}</h3>
  <div class="header-container">
    <h1>{{ $t("AboutUs") }}</h1>
  </div>

  <div class="a">
    <section>
      <div class="achivement-container">
        <HomeFootBanner
          v-for="achievement in achievements"
          :key="achievement.id"
          :text="achievement.description || 'No description'"
          :title="achievement.title || 'No Title'"
          color="#C5D944"
          :picture="achievement.image || 'No image'"
          :url="'achievements/details/' + achievement.id || '404'"
        />
      </div>

      <SeeAllButton text="ผลงานทั้งหมด" link="/achivement" />
    </section>
  </div>

  <ContentHeader contexto="คณะทำงาน" />
  <div class="cards-container">
    <Card
      v-for="employee in employees"
      :key="employee.id"
      :title="employee.name || 'ชื่อ'"
      :image="employee.image || 'รูป'"
      :description="employee.description || 'ไม่มีข้อความ'"
      :url="'/aboutus/employees/details/' + employee.id"
    ></Card>
  </div>

  <ContentHeader contexto="สิทธิประโยชน์และการบริการ" />
  <div class="cards-container">
    <Card
      v-for="achievements in achievements"
      :key="achievements.id"
      :title="achievements.name || 'ชื่อ'"
      :image="achievements.image || 'รูป'"
      :description="achievements.description || 'ไม่มีข้อความ'"
      :url="'/aboutus/employees/details/' + achievements.id"
    ></Card>
  </div>

  <ContentHeader contexto="สมาชิก" />
  <div class="cards-container">
    <Card
      v-for="member in members"
      :key="member.id"
      :title="member.name || 'ชื่อ'"
      :image="member.image || 'รูป'"
      :description="member.description || 'ไม่มีข้อความ'"
      :url="'/aboutus/employees/details/' + members.id"
    ></Card>
  </div>
  <div style="height: 5rem"></div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      members: [], // Stores the fetched member data
      employees: [], // Stores the fetched employee data
      achievements: [], // Stores the fetched achievement data
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [membersResponse, employeesResponse, achievementsResponse] =
          await Promise.all([
            axios.get("/api/members_table"), // Assuming no changes needed for members table
            axios.get("/api/employees_table"), // Updated to the correct table name
            axios.get("/api/achievements_table"), // Assuming no changes needed for achievements table
          ]);

        this.members = membersResponse.data.slice(0, 3);
        this.employees = employeesResponse.data.slice(0, 3); // Only show top 3 employees
        this.achievements = achievementsResponse.data.slice(0, 2); // Only show top 2 achievements
      } catch (error) {
        console.error("Error fetching data:", error.message || error);
      }
    },
  },
};
</script>

<style scoped>
/* Updated and cleaned styles */
.navcontainer {
  width: 100vw;
  height: 100px;
}

.a {
  padding-top: 20px;
}

.headers h1 {
  text-align: center;
}

.box1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.greenbox1,
.greenbox2 {
  margin-bottom: 53px;
  display: flex;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
  margin: 1rem;
  justify-content: center;
  background-color: #c5d944;
  width: 100%;
  max-width: 1450px;
  height: 347px;
}

.textcontent {
  flex: 0 0 40%;
}

.image {
  flex: 0 0 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image img {
  height: 347px;
  object-fit: cover;
  width: 100%;
}

.header-container {
  text-align: center;
  margin-top: 0;
  padding-top: 20px;
  font-size: 2rem;
}

.header-content {
  color: #aca8a8;
  margin-left: 2%;
  font-weight: 300;
}

.content1 {
  color: #000;
  margin-left: 10%;
  margin-top: 10px;
  font-weight: 700;
  font-size: 40px;
}

.text {
  margin-left: 15%;
  margin-top: 7px;
  font-size: 36px;
  font-weight: 400;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 18px;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #d4d3d3;
}

/* Achievement Section Styles */
.achievement-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  padding: 0 16px;
}

.achievement-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #c5d944;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.achievement-text {
  flex: 1;
  padding-right: 20px;
}

.achievement-text h2 {
  font-size: 25px;
  margin-bottom: 10px;
  color: #333;
}

.achievement-text p {
  font-size: 19px;
  color: #ffffff;
}

.achievement-image {
  flex: 0 0 200px;
  text-align: center;
}

.achievement-image img {
  max-width: 100%;
  height: 150px;
  /* Ensures uniform height */
  object-fit: cover;
  /* Maintains aspect ratio */
  border-radius: 8px;
}
</style>
