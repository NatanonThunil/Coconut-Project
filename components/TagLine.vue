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