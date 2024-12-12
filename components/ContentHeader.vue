<template>
    <div class="context-container">
        <div class="headtext">
            {{ contexto }}
        </div>
        <div class="line"></div>
    </div>

</template>

<style>
.context-container {
    
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem;
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
    font-size: 25px;
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