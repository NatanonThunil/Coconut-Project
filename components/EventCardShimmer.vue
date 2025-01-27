<template>
    <div class="all-event-EventCard shimmer">
      <div class="al-event-image-container shimmer-box"></div>
      <div class="event-card-details-container">
        <div class="event-card-title shimmer-box"></div>
        <div class="event-date-and-local">
          <div class="event-card-datestart shimmer-box"></div>
          <div class="event-card-location shimmer-box"></div>
        </div>
        <div class="event-card-details shimmer-box"></div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .all-event-EventCard {
    height: 25rem;
    width: 20rem;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .all-event-EventCard .al-event-image-container {
    height: 15rem;
    width: 100%;
    background: #e0e0e0;
  }
  
  .event-card-details-container {
    padding: 0.8rem;
    width: 100%;
    height: 10rem;
  }
  
  .event-card-title,
  .event-card-datestart,
  .event-card-location,
  .event-card-details {
    background: #e0e0e0;
    border-radius: 5px;
  }
  
  .event-card-title {
    height: 1.2rem;
    width: 80%;
    margin-bottom: 0.5rem;
  }
  
  .event-date-and-local {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .event-card-datestart,
  .event-card-location {
    height: 1rem;
    width: 45%;
  }
  
  .event-card-details {
    height: 2.5rem;
    width: 100%;
  }
  
  /* Shimmer effect */
  .shimmer-box {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-box::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      left: -150%;
    }
    100% {
      left: 100%;
    }
  }
  </style>
  