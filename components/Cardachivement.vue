<template>
  <NuxtLinkLocale :to="url" class="achivement-card">
    <div class="achivement-main-detail">{{title}}</div>
    <div class="ab">
        <div class="achivement-detail">{{ details }}</div>
        <div class="achivement-image"><img :src="image" /></div>
    </div>
  </NuxtLinkLocale>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
    },
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    details:{
      type: String,
    }
    
  },
};
</script>

<style scoped>
.achivement-card {
  display: flex;
  flex-direction: column; /* Stack children vertically */
  gap: 10px;
  /* border: 1px solid black; */
  padding: 16px; /* Added padding for overall spacing */
  /* border-radius: 8px; */
  height: 10%;
  width: 75%;
  margin-left:12%;
  margin-top: 3%;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
  transition: ease-in-out 0.3s;

}
.achivement-card:hover {
  transform: scale(1.01);

}


.achivement-main-detail {
  overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word; 
    word-break: break-word; 
  font-size: 24px;
  font-weight: bold;
  color: #333;
  padding: 8px 16px;
  max-height: 7rem;
  border-bottom: 1px solid #f0f0f0;
  margin-left: 1.5%;
}

.achivement-main-detail h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
  color: #333;
}

.achivement-main-detail p {
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

.ab {
  display: flex;
  flex-direction: row; /* Ensure horizontal layout */
  width: 100%; /* Full width of the card */
   /* Add spacing between image and text */
}

.achivement-image {
  overflow: hidden;
  height: 20rem;
  order: 0; /* Ensure this stays first in the layout */
  flex: 1; /* Occupy 50% of the width */
}

.achivement-image img{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.achivement-detail {
  order: 1; /* Ensure this stays second in the layout */
  flex: 1; /* Occupy 50% of the width */
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  padding: 2rem; /* Add padding for text spacing */
  margin-left: 2%;
  overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
}

.achivement-image img {
  width: 100%; /* Stretch image to container width */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover; /* Ensure proper cropping */
  margin-left: 7.5%;
}

.achivement-image img {
  width: 100%; /* Make the image fully stretch to the container */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px; /* Optional: Rounded corners */
  object-fit: cover; /* Ensure proper cropping if needed */
}
</style>

