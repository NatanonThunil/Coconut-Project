<template>
    <div style="height: 10rem;"></div>
    <h1 class="context-header">{{ $t(head) }}</h1>
    <div style="height: 5rem;"></div>
</template>

<script>
export default {
    props: {
        head: {
            type: String,
            required: true
        }
    }
}
</script>
<style scoped>
h1.context-header {
    display: flex;
    justify-content: center;
}
</style>