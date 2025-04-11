<template>
    <footer class="footer">
        <section class="footer-nav">
            <NuxtLinkLocale v-for="(item, index) in links" :key="index" :to="item.to">
                {{ $t(item.label) }}
            </NuxtLinkLocale>
        </section>
        <section style="width: 60%; height: 2px; background-color: white; margin: 1rem;"></section>
        <section class="ft-contract-us">
            <h1>{{ $t("ContactUs") }}</h1>
            <div class="ft-contract">{{$t('Footer')}}</div>
        </section>
        <section class="cpr">
            <div>Copyright © Coconut Knowledge Hub
                สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง</div>
        </section>

    </footer>
</template>

<script>
export default {
    data() {
        return {
            links: [
                { to: "/", label: "Home" },
                { to: "/AboutUs", label: "AboutUs" },
                { to: "/News", label: "News" },
                { to: "/Events", label: "Events" },
                { to: "/coconut-information", label: "CoconutInfo" },
                { to: "/Experts", label: "Experts" },
                { to: "/FAQs", label: "FAQs" }
            ]
        };
    }
};
</script>

<style scoped>
.ft-contract-us {
    display: flex;
    flex-direction: column;
    color: white;
    align-items: center;
}

.ft-contract-us a {
    color: white;
}

.ft-contract-us a:hover {

    color: white;
}

.footer {
    flex-direction: column;
    height: inherit;
    background-image: linear-gradient(#4E6D16,#2f3f10);
    display: flex;
    align-items: center;
    justify-content: center;
   
}

.footer-nav {
    
    padding-top: 1rem;
    display: flex;
    gap: 2rem;

}



.footer-nav a {
    color: white;
    transition: ease-in-out 0.3s ;
}

.footer-nav a:hover {
    font-weight: 800;
    text-decoration-line: underline;
}

.cpr {
    border-radius: 1px;

    width: 100%;
  
    padding: 0.5rem;
    color: white;
}

.cpr div {
    display: flex;
    justify-content: center;
}
</style>