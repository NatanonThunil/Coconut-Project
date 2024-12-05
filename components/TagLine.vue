<template>
    <div class="image-container">
        <img src="~/assets/img/tl.png" class="img" alt="Coconut Image">
        <h1>This is Coconut Knowledge Hub</h1>
    </div>
</template>

<style>
.image-container {
    position: relative; /* Allows positioning of h1 relative to this container */
    width: 100%;
    height: auto;
}

h1 {
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);
    color: white;
    position: absolute;
    top: 50%;  
    left: 50%; 
    transform: translate(-50%, -50%); 
    font-size: 2em; 
    margin: 0; 
}

.img {
    width: 100%;
    height: auto;
}
</style>
