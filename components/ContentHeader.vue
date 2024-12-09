<template>
    <div class="context-container">
        <div class="headtext">
            {{ contexto }}
        </div>
        <div class="line"></div>
    </div>
    
</template>


<script>

import '~/components/styles/contextheader.css';
export default {
    props: {
        contexto: {
            type: String,
            required: true
        }

    }
}
</script>