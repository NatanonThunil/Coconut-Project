<template>
  <form id="newsForm" @submit.prevent="handleFormSubmit">
    <!-- News ID Input -->
    <label for="newsId">News ID:</label>
    <input type="text" id="newsId" name="newsId" placeholder="Enter News ID" required>

    <!-- Title Input -->
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" placeholder="Enter Title" required>

    <!-- Image Input -->
    <label for="image">Image:</label>
    <input type="file" id="image" name="image" accept="image/*" required>

    <!-- Author Input -->
    <label for="author">Author:</label>
    <input type="text" id="author" name="author" placeholder="Enter Author Name" required>

    <!-- Upload Date Input (Readonly) -->
    <label for="uploadDate">Upload Date:</label>
    <input type="text" id="uploadDate" name="uploadDate" readonly>

    <!-- Description Input -->
    <label for="description">Description:</label>
    <input type="text" id="description" name="description" placeholder="Enter Description" required>

    <!-- Summarize Input -->
    <label for="summerize">Summarize:</label>
    <input type="text" id="summerize" name="summerize" placeholder="Enter Summary">

    <!-- Hot News Checkbox -->
    <label for="hotNew">Hot News:</label>
    <input type="checkbox" id="hotNew" name="hotNew">

    <!-- Submit Button -->
    <button type="submit">Add News</button>
  </form>
</template>

<style scoped>
form {
  display: grid;
  grid-gap: 15px;
  max-width: 400px;
  margin: auto;
}
label {
  font-weight: bold;
}
</style>

<script>
export default {
  methods: {
    async handleFormSubmit(event) {
      const form = event.target;
      const formData = new FormData(form);

      // Set today's date for the uploadDate field
      const uploadDateField = form.querySelector('#uploadDate');
      uploadDateField.value = new Date().toISOString().slice(0, 10);
      formData.set('uploadDate', uploadDateField.value);

      try {
        // Make the POST request with formData
        const response = await fetch('/api/post_news', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json(); // Parse the JSON response

        if (response.ok) {
          alert('News added successfully!');
          form.reset(); // Reset the form after successful submission
        } else {
          alert(`Error: ${result.error || 'Unable to add news'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    },
  },
};
</script>
