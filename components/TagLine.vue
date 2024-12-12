<template>
    <div class="image-container">
        <img src="~/assets/img/tl.png" class="img" alt="Coconut Image">
        <h1>{{taglinetext}}</h1>
    </div>
</template>



<script>
import '~/components/styles/tagline.css';
export default {
    props: {
        taglinetext:
        {
            type: String,
            required: true
        }

    }
}
</script>
<style scoped>.image-container {
    position: relative;
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