<template>
    <div class="admin-dashboard">
      <aside class="sidebar">
        <h2 class="logo">COCONUT</h2>
        <ul>
          <li>สถิติ</li>
          <li>จัดการข่าว</li>
          <li>จัดการกิจกรรม</li>
          <li>จัดการข้อมูลพืชสวน</li>
          <li>จัดการสมาชิก</li>
          <li>จัดการFAQs</li>
        </ul>
      </aside>
      <main class="content">
        <div class="header">
          <h1>จัดการกิจกรรม : สมาชิก</h1>
        </div>
        <div class="form-container">
          <form @submit.prevent="submitForm">
            <div class="upload-section">
              <label for="image-upload" class="upload-box">อัพโหลดรูป</label>
              <input id="image-upload" type="file" @change="handleFileUpload" hidden />
            </div>
            <div class="input-group">
              <label>ชื่อ*</label>
              <input type="text" v-model="formData.name" required />
            </div>
            <div class="input-group">
              <label>ชื่ออังกฤษ*</label>
              <input type="text" v-model="formData.engName" required />
            </div>
            <div class="input-group">
              <label>ชื่อวิทยาศาสตร์*</label>
              <input type="text" v-model="formData.scientificName" required />
            </div>
            <div class="input-group">
              <label>ลักษณะประจำพันธุ์*</label>
              <textarea v-model="formData.characteristics"></textarea>
            </div>
            <button type="submit">สร้าง</button>
          </form>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          name: '',
          engName: '',
          scientificName: '',
          characteristics: ''
        }
      };
    },
    methods: {
      submitForm() {
        console.log('Form submitted:', this.formData);
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        console.log('File uploaded:', file);
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    display: flex;
  }
  .sidebar {
    width: 250px;
    background: #d8ebe8;
    padding: 20px;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar li {
    padding: 10px 0;
    cursor: pointer;
  }
  .content {
    flex: 1;
    padding: 20px;
  }
  .upload-box {
    display: block;
    width: 100px;
    height: 100px;
    background: #f3f3f3;
    text-align: center;
    line-height: 100px;
    cursor: pointer;
  }
  .input-group {
    margin-bottom: 15px;
  }
  input, textarea {
    width: 100%;
    padding: 8px;
  }
  button {
    background: #5cb85c;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  </style>
  