<template>
    <div class="image-container">
        <img src="~/assets/img/tl.png" class="img" alt="Coconut Image" draggable="false">
        <h1>{{ taglinetext }}</h1>
    </div>
    <div style="height: 32rem;"></div>
</template>

<script>
export default {
    props: {
        taglinetext: {
            type: String,
            
        }
    }
}
</script>

<style scoped>
.image-container {
    top: 0%;
    position: absolute;
    width: 100%;
    height: 32rem;
    overflow: hidden;
}

.image-container img {
    width: 100%;
    object-fit: cover;
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
    opacity: 0;
    animation: fadeInText 1s ease-out 0.5s forwards;
}


@keyframes fadeInText {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

img {
    display: flex;
    justify-self: center;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    height: 32rem;
    opacity: 0;
    animation: fadeInImage 1s ease-out forwards;

}

@keyframes fadeInImage {
    0% {
        filter: brightness(0) blur(10px);
        opacity: 0;
        transform: scale(1.1);
    }

    100% {

        filter: brightness(0.6) blur(0px);
        ;
        opacity: 1;
        transform: scale(1);
    }
}
</style>
