<template>
    <div style="height: 5rem;"></div>
    <NewFooter />
    <div style="height: 2rem;"></div>
    <div class="footer-form">
      <label class="footer-label">Footer Text (Default)</label>
      <input
        type="text"
        v-model="footer.text"
        placeholder="Enter footer text"
        class="footer-input"
        required
      />
  
      <label class="footer-label">Footer Text (English)</label>
      <input
        type="text"
        v-model="footer.text_en"
        placeholder="Enter footer text in English"
        class="footer-input"
        required
      />
  
      <label class="footer-label">Footer Credit</label>
      <input
        type="text"
        v-model="footer.credit"
        placeholder="Enter footer credit"
        class="footer-input"
        required
      />
  
      <label class="footer-label">Footer Credit (English)</label>
      <input
        type="text"
        v-model="footer.credit_en"
        placeholder="Enter footer credit in English"
        class="footer-input"
        required
      />
  
      <button @click="saveFooter" class="footer-button">Save change</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useFooters } from '~/composables/useFooters'
  const { getFooterById, updateFooterById } = useFooters()
  definePageMeta({
    layout: 'admin',
  });
  
  const footer = ref({
    text: '',
    text_en: '',
    credit: 'Copyright © Coconut Knowledge Hub สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง',
    credit_en: 'Copyright © Coconut Knowledge Hub Faculty of Information Technology, Mae Fah Luang University',
  });
  
  const fetchFooter = async () => {
    try {
      const data = await getFooterById(1);
  
      // Map data safely
      footer.value.text = data.text || '';
      footer.value.text_en = data.text_en || '';
      footer.value.credit = data.credit || footer.value.credit;
      footer.value.credit_en = data.credit_en || footer.value.credit_en;
    } catch (error) {
      console.error('Error fetching footer:', error);
    }
  };
  
  const saveFooter = async () => {
    try {
      await updateFooterById(
        1,
        footer.value.text,
        footer.value.text_en,
        footer.value.credit,
        footer.value.credit_en
      );
      alert('Footer updated successfully!');
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error updating footer:', error);
      alert('Failed to update footer.');
    }
  };
  
  onMounted(() => {
    fetchFooter();
  });
  </script>
  
  <style scoped>
  .footer-form {
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .footer-label {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    margin-top: 16px;
  }
  
  .footer-input {
    width: 100%;
    padding: 10px 15px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    margin-bottom: 10px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .footer-input:focus {
    border-color: #4E6D16;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 59, 20, 0.3);
  }
  
  .footer-button {
    margin-top: 20px;
    width: 100%;
    padding: 10px 15px;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    background-color: #4E6D16;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .footer-button:hover {
    background-color: #3c550e;
  }
  </style>

