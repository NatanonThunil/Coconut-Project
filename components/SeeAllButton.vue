<template >
    <nuxt-link :to="link" >
        <button class="news-button" >{{ text }}</button>
    </nuxt-link>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
.news-button {
    overflow: hidden;
    display: flex;
    justify-self: center;
    justify-content: center;
    margin: 2rem;
    width: 80%;
    align-self: center;
    height: 4rem;
    background-color: transparent;
    color: #4e6d16;
    padding: 10px 20px;
    font-size: 26px;
    font-weight: bold;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    border: #4e6d16 solid 3px;
    animation: btnexpand 1s;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.news-button:hover {
    background-color: #4e6d16;
    color: white;
    transform: scale(1.01);
}

.news-button:focus {
    outline: none;
}

.news-button:active {
    background-color: #2c440f;
}

@keyframes btnexpand {
    0%{
        opacity: 0;
        width: 20%;
    }
    100%{
        opacity: 1;
        width: 80%;
    }
    
}
</style>
