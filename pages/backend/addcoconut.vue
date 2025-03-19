<template></template>

<!-- <template>
  <div class="add-coconut-form">
    <h1>Add Coconut</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name_eng">English Name</label>
        <input type="text" v-model="form.name_eng" id="name_eng" required />
      </div>

      <div>
        <label for="name_th">Thai Name</label>
        <input type="text" v-model="form.name_th" id="name_th" required />
      </div>

      <div>
        <label for="description">Description</label>
        <textarea v-model="form.description" id="description" required></textarea>
      </div>

      <div>
        <label for="origin">Origin</label>
        <input type="text" v-model="form.origin" id="origin" required />
      </div>

      <div>
        <label for="sci_name_f">Scientific Name (F)</label>
        <input type="text" v-model="form.sci_name_f" id="sci_name_f" required />
      </div>

      <div>
        <label for="sci_name_m">Scientific Name (M)</label>
        <input type="text" v-model="form.sci_name_m" id="sci_name_m" required />
      </div>

      <div>
        <label for="sci_name_l">Scientific Name (L)</label>
        <input type="text" v-model="form.sci_name_l" id="sci_name_l" required />
      </div>

      <div>
        <label for="characteristics">Characteristics</label>
        <textarea v-model="form.characteristics" id="characteristics" required></textarea>
      </div>

      <div>
        <label for="youngold">Young/Old</label>
        <select v-model="form.youngold" id="youngold" required>
          <option value="Young">Young</option>
          <option value="Old">Old</option>
        </select>
      </div>

      <div>
        <label for="image">Image</label>
        <input type="file" @change="handleFileChange" id="image" accept="image/png, image/jpeg" required />
      </div>

      <button type="submit">Add Coconut</button>
    </form>

    <div v-if="message" :class="{'error-message': isError, 'success-message': !isError}">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        name_eng: '',
        name_th: '',
        description: '',
        origin: '',
        sci_name_f: '',
        sci_name_m: '',
        sci_name_l: '',
        characteristics: '',
        youngold: 'Young',
        image: null,
      },
      message: '',
      isError: false,
    };
  },
  methods: {

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.convertImageToBase64(file);
      }
    },

    
    convertImageToBase64(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.form.image = reader.result.split(',')[1]; 
      };
    },

    // Handle form submission
    async submitForm() {
      try {
        const response = await axios.post('/api/coconut', this.form); 
        this.message = response.data.message || 'Coconut added successfully!';
        this.isError = false;
      } catch (error) {
        this.message = error.response?.data?.error || 'An error occurred. Please try again.';
        this.isError = true;
      }
    },
  },
};
</script>

<style scoped>
.add-coconut-form {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

form div {
  margin-bottom: 15px;
}

form label {
  font-weight: bold;
}

form input,
form textarea {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  box-sizing: border-box;
}

form button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

form button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style> -->
