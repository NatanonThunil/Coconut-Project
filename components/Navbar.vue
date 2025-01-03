<template>
    <nav class="navbar" id="nav-header">
        <a class="logo" href="/">
            <img class="btn-icons" src="~/assets/logo/CKH.png" alt="Logo" loading="lazy" draggable="false" />
        </a>
        <ul class="main-menu">
            <li :class="{ Selected: selecto === 'aboutus' }">
                <nuxt-link to="/AboutUs">
                    <img class="btn-icons"
                        :src="selecto === 'aboutus' ? '/_nuxt/assets/icon/w/people.svg' : '/_nuxt/assets/icon/people.svg'"
                        alt="เกี่ยวกับเรา" />เกี่ยวกับเรา
                </nuxt-link>
            </li>
            <li :class="{ Selected: selecto === 'news' }">
                <nuxt-link to="/news">
                    <img class="btn-icons"
                        :src="selecto === 'news' ? '/_nuxt/assets/icon/w/people.svg' : '/_nuxt/assets/icon/people.svg'"
                        alt="เกี่ยวกับเรา" />ข่าวสาร
                </nuxt-link>
            </li>
            <li :class="{ Selected: selecto === 'events' }">
                <nuxt-link to="/events">
                    <img class="btn-icons"
                        :src="selecto === 'events' ? '/_nuxt/assets/icon/w/people.svg' : '/_nuxt/assets/icon/people.svg'"
                        alt="เกี่ยวกับเรา" />กิจกรรม
                </nuxt-link>
            </li>
            <li :class="{ Selected: selecto === 'coconutdata' }">
                <nuxt-link to="/coconut-information">
                    <img class="btn-icons"
                        :src="selecto === 'coconutdata' ? '/_nuxt/assets/icon/w/database.svg' : '/_nuxt/assets/icon/database.svg'"
                        alt="ข้อมูลมะพร้าว" />ข้อมูลมะพร้าว
                </nuxt-link>
            </li>
            <li :class="{ Selected: selecto === 'expert' }">
                <nuxt-link to="/Expert">
                    <img class="btn-icons"
                        :src="selecto === 'expert' ? '/_nuxt/assets/icon/w/expert.svg' : '/_nuxt/assets/icon/expert.svg'"
                        alt="ผู้เชี่ยวชาญ" />ผู้เชี่ยวชาญ
                </nuxt-link>
            </li>
            <li :class="{ Selected: selecto === 'faqs' }">
                <nuxt-link to="/faqs">
                    <img class="btn-icons"
                        :src="selecto === 'faqs' ? '/_nuxt/assets/icon/w/questions.svg' : '/_nuxt/assets/icon/questions.svg'"
                        alt="FAQs" />FAQs
                </nuxt-link>
            </li>
        </ul>

        <a href="/th" class="lang-toggle">TH / EN</a>
        <div class="hamburger-container" @click="toggleMenu">
            <div :class="{ 'hamburger-icon': true, open: isMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <ul class="mobile-main-menu" v-show="isMenuOpen">
            <li :class="{ mobileSelected: selecto === 'home' }">
                <nuxt-link to="/">
                    หน้าหลัก
                </nuxt-link>
            </li>
            <li :class="{ mobileSelected: selecto === 'aboutus' }">
                <nuxt-link to="/AboutUs">
                    เกี่ยวกับเรา
                </nuxt-link>
            </li>
            <li :class="{ mobileSelected: selecto === 'coconutdata' }">
                <nuxt-link to="/coconut-informations">ข้อมูลมะพร้าว</nuxt-link>
            </li>
            <li :class="{ mobileSelected: selecto === 'expert' }">
                <nuxt-link to="/Expert">
                    ผู้เชี่ยวชาญ
                </nuxt-link>
            </li>
            <li :class="{ mobileSelected: selecto === 'faqs' }">
                <nuxt-link to="/faqs">
                    FAQs
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        selecto: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            isMenuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        handleScroll() {
            const navbar = document.getElementById('nav-header');
            if (window.scrollY > 0) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    },
    mounted() {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    }
};
</script>

<style scoped>
a,
nuxt-link {
    color: inherit;
    text-decoration: none;
    background-color: transparent;
}

a:hover,
nuxt-link:hover {
    text-decoration: underline;
    transition: color 0.3s ease, text-decoration 0.3s ease;
}

.navbar {

    width: 100%;
    background-color: #dbdbdb;
    color: rgb(0, 0, 0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 60px;
    position: absolute;

    top: 0;

    z-index: 1000;
    box-shadow: rgba(0, 0, 0, 0.6) 0rem 1rem 2rem;

    transition: 0.3s ease-in-out;
}

.navbar.scrolled {
    background-color: #dbdbdb;
    position: fixed;
    margin-left: 2.5%;
    margin-right: 2.5%;
    margin-top: 1.5%;
    width: 95%;
    border-radius: 15px;


}





.logo {
    margin-right: 2rem;
}

.logo img {
    height: 40px;
    vertical-align: middle;
    cursor: pointer;
    animation: ease-in-out fadeIn backwards 1s;
}

.main-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;


}

.main-menu>li {
    position: relative;
    padding: 10px 15px;
    cursor: pointer;
    color: rgb(0, 0, 0);
    border-radius: 20px;
    font-size: 16px;
    background-color: white;
    box-shadow: #0000003c 4px 4px 4px;
    transition: background-color 0.3s, color 0.3s;
    opacity: 0;
    animation: fadeIn 1s ease-in-out forwards;
}


.main-menu li:nth-child(2) {
    animation-delay: 0.2s;
}

.main-menu li:nth-child(3) {
    animation-delay: 0.4s;
}

.main-menu li:nth-child(4) {
    animation-delay: 0.6s;
}

.main-menu li:nth-child(5) {
    animation-delay: 0.8s;
}

.main-menu li:nth-child(6) {
    animation-delay: 1s;
}

.main-menu>li.Selected {
    background-color: #4E6D16;
    color: white;
}

.main-menu>li.Selected:hover {
    background-color: #2a3b0b;
    color: white;
}

.main-menu>li.Selected .btn-icons {
    color: white;
}

.main-menu>li:hover {
    background-color: #E6E6E6;
    outline: solid black 3px;
    border-radius: 20px;
}

.btn-icons {
    height: 1rem;
    margin-right: 0.5rem;
}

.mobile-main-menu>li {
    cursor: pointer;
    width: 100%;
    background-color: #ffffff;
    text-align: center;
    padding: 0.5rem;
    border-bottom: 3px #4E6D16 solid;
}

.mobile-main-menu {
    overflow: hidden;
    outline: 3px solid #4E6D16;
    border-radius: 10px;
    left: 0;
    position: absolute;
    top: 4.5rem;
    width: 100%;
    list-style: none;
    animation: fadeInY 0.5s ease-in-out;
}

.lang-toggle {
    color: #000;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 20px;
    animation: fadeIn 1s ease-in-out;
}

.lang-toggle:hover {
    background-color: #E6E6E6;
}

.hamburger-container {
    display: none;
    cursor: pointer;
}

.hamburger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 25px;
    width: 35px;
}

.hamburger-icon span {
    display: block;
    width: 100%;
    height: 4px;
    background-color: #4E6D16;
    border-radius: 5px;
    transition: transform 0.3s, background-color 0.3s;
}

.hamburger-icon.open span:nth-child(1) {
    transform: translateY(10px) rotate(45deg);
}

.hamburger-icon.open span:nth-child(2) {
    opacity: 0;
}

.hamburger-icon.open span:nth-child(3) {
    transform: translateY(-10px) rotate(-45deg);
}

.mobile-main-menu .mobileSelected {
    background-color: #4E6D16;
    color: white;
}

@media (max-width: 1239px) {
    .main-menu {
        gap: 10px;
    }
}


@media (max-width: 1185px) {
    li a img.btn-icons {
        display: none;
    }
}


@media (max-width: 1014px) {
    .main-menu {

        display: none;
    }

    .lang-toggle {
        display: none;
    }

    .hamburger-container {
        display: block;
    }

}

@media (min-width: 1015px) {
    .mobile-main-menu {
        display: none;
    }

}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateX(20%);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInY {
    0% {
        opacity: 0;
        transform: translateY(5%);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIntopY {
    0% {
        opacity: 0;
        transform: translateY(5%);
    }

    100% {
        opacity: 1;
        transform: translateY(-10%);
    }
}

@keyframes disappear {
    100% {
        opacity: 1;

    }

    0% {
        opacity: 0;
        display: none;
    }
}
</style>
