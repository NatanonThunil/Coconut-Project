<template>
  <form id="newsForm" @submit.prevent="handleFormSubmit" enctype="multipart/form-data">
    <!-- Event ID Input -->
    <label for="event_id">Event ID:</label>
    <input type="text" id="event_id" name="event_id" placeholder="Enter Event ID" required>

    <!-- Title Input -->
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" placeholder="Enter Title" required>

    <!-- Image Input -->
    <label for="image">Image:</label>
    <input type="file" id="image" name="image" accept="image/*" required>

    <!-- Organizer Input -->
    <label for="organizer">Organizer:</label>
    <input type="text" id="organizer" name="organizer" placeholder="Enter Organizer Name" required>

    <!-- Start Date -->
    <label for="date_start">Date Start:</label>
    <input type="date" id="date_start" name="date_start" required>

    <!-- End Date -->
    <label for="date_end">Date End:</label>
    <input type="date" id="date_end" name="date_end" required>

    <!-- Description -->
    <label for="description">Description:</label>
    <input type="text" id="description" name="description" placeholder="Enter Description" required>
    

    <!-- Location Name -->
    <label for="location_name">Location Name:</label>
    <input type="text" id="location_name" name="location_name" placeholder="Enter Location Name">


    <!-- Location URL -->
    <label for="location_url">Location URL:</label>
    <input type="text" id="location_url" name="location_url" placeholder="Enter Location URL">

    <!-- Register URL -->
    <label for="register_url">Register URL:</label>
    <input type="text" id="register_url" name="register_url" placeholder="Enter Register URL">

    <!-- Event Category -->
    <label for="event_category">Event Category:</label>
    <select id="event_category" name="event_category">
      <option value="1">Train</option>
      <option value="2">Academic Conference</option>
      <option value="3">Other</option>
    </select>

    <!-- Submit Button -->
    <button type="submit">Add Event</button>
  </form>
</template>

<script>
export default {
  methods: {
    async handleFormSubmit(event) {
      const form = event.target;
      const formData = new FormData(form);

      // Log the formData to check if all the fields are being added correctly
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        const response = await fetch('/api/post_events', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json(); // Parse the JSON response

        if (response.ok) {
          alert('Event added successfully!');
          form.reset(); // Reset the form after successful submission
        } else {
          alert(`Error: ${result.error || 'Unable to add event'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    },
  },
};
</script>

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
