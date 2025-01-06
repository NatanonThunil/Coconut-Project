<template>
    <Navbar selecto="coconutdata" />
    <div style="height: 10rem;"></div>
    <h1 class="context-header">{{ $t('CoconutInfo') }}</h1>
    <div style="height: 5rem;"></div>
    <div class="old-young-selection-container">
        <select class="old-young-selection" v-model="coconutType">
            <option value="Young" default="true">มะพร้าวอ่อน</option>
            <option value="Old">มะพร้าวแก่</option>
        </select>
    </div>
    <div style="height: 5rem;"></div>

    <div class="coconut-info-selection">
        <NuxtLinkLocale
            :to="`/coconut-information/${coconutType.toLowerCase()}/coconut-varieties/`"
            class="coconut-info-selection-items"
        >
            <img src="@/assets/icon/coconut.png" style="height: calc(100% - 8rem); width: calc(100% - 8rem);">
            <p>Coconut varieties</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale
            :to="`/coconut-information/${coconutType.toLowerCase()}/coconut-varieties/`"
            class="coconut-info-selection-items"
        >
            <img src="@/assets/icon/harvest.png" style="height: calc(100% - 8rem); width: calc(100% - 8rem);">
            <p>Upstream</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale
            :to="`/coconut-information/${coconutType.toLowerCase()}/coconut-varieties/`"
            class="coconut-info-selection-items"
        >
            <img src="@/assets/icon/wash.png" style="height: calc(100% - 8rem); width: calc(100% - 8rem);">
            <p>MidStream</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale
            :to="`/coconut-information/${coconutType.toLowerCase()}/coconut-varieties/`"
            class="coconut-info-selection-items"
        >
            <img src="@/assets/icon/export.png" style="height: calc(100% - 8rem); width: calc(100% - 8rem);">
            <p>DownStream</p>
        </NuxtLinkLocale>
    </div>
    <div style="height: 5rem;"></div>
    <Footer />
</template>

<script>
export default {
    data() {
        return {
            coconutType: "Young", // Default selection
        };
    },
};
</script>

<style>
h1.context-header {
    display: flex;
    justify-content: center;
}

.old-young-selection-container {
    display: flex;
    justify-content: center;
}

.old-young-selection {
    cursor: pointer;
    display: flex;
    text-align: center;
    font-size: 1.5rem;
    height: 4rem;
    width: 30%;
    border-radius: 20px;
    border: #4E6D16 4px solid;
    transition: ease-in-out 0.2s;
}

.old-young-selection option {
    border: #4E6D16 4px solid;
}

.old-young-selection:hover {
    background-color: rgb(223, 223, 223);

}

.old-young-selection:focus-visible {

    border: #4E6D16 6px solid;
}

.coconut-info-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    justify-self: center;
    width: 40%;

}

.coconut-info-selection .coconut-info-selection-items {
    all: unset;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    height: 20rem;
    width: 20rem;
    background-color: white;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    outline: 4px solid #4E6D16;
    font-size: 2rem;
    transition: ease-in-out 0.2s;
}

.coconut-info-selection .coconut-info-selection-items:hover {

    background-color: rgb(223, 223, 223);
    outline: 6px solid #4E6D16;
    transform: scale(1.1);
}

.coconut-info-selection .coconut-info-selection-items p {
    margin-top: 1rem;
}
</style>
