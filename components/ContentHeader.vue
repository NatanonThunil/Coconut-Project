<template>
    <div class="context-container">
        <div class="headtext">
            {{ contexto }}
        </div>
        <div class="line"></div>
    </div>

</template>

<style scoped>
.context-container {
    
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem;
    animation:  fadeinbelow 1s;
}

.line {
    display: block;
    height: 5px;
    width: 70%;
    max-width: 70%;
    background-color: #4E6D16;
}

.headtext {


    color: #4E6D16;
    font-weight: bolder;
    font-size: 40px;
}

@keyframes fadeinbelow{
    0%{
        opacity: 0;
        transform: translateY(50%);
    }

    100%{
        opacity: 1;
        transform: translateY(0%);
}
}
</style>
<script>


export default {
    props: {
        contexto: {
            type: String,
            required: true
        }

    }
}
</script>