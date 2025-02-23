<template>
  <nav class="navbar" id="nav-header">
    <a class="logo" href="/">
      <img class="btn-icons" src="~/assets/logo/CKH.png" alt="Logo" loading="lazy" draggable="false" />
    </a>
    <ul class="main-menu">
      <li :class="{ Selected: selecto === 'aboutus' }">
        <NuxtLinkLocale to='/aboutus'>
          <img class="btn-icons"
            :src="selecto === 'aboutus' ? '/_nuxt/assets/icon/w/people.svg' : '/_nuxt/assets/icon/people.svg'"
            alt="เกี่ยวกับเรา" />{{ $t('AboutUs') }}
        </NuxtLinkLocale>
      </li>
      <!-- <li :class="{ Selected: selecto === 'news' }">
        <NuxtLinkLocale to="/news">
          <img class="btn-icons"
            :src="selecto === 'news' ? '/_nuxt/assets/icon/w/people.svg' : '/_nuxt/assets/icon/people.svg'"
            alt="เกี่ยวกับเรา" />{{ $t('News') }}
        </NuxtLinkLocale>
      </li>
      <li :class="{ Selected: selecto === 'events' }">
        <NuxtLinkLocale to="/events">
          <img class="btn-icons"
            :src="selecto === 'events' ? '/_nuxt/assets/icon/w/people.svg' : '/_nuxt/assets/icon/people.svg'"
            alt="เกี่ยวกับเรา" />{{ $t('Events') }}
        </NuxtLinkLocale>
      </li> -->

      <li :class="[{ Selected: ((selecto === 'news') || (selecto === 'events')) }, 'nnedd']">
        <p class="img-dd-adjust">
          <img class="btn-icons"
            :src="selecto === 'news' || selecto === 'events' ? '/_nuxt/assets/icon/w/newsnevents.svg' : '/_nuxt/assets/icon/newsnevents.svg'"
            alt="ข้อมูลมะพร้าว" />
          {{ $t("News & Events") }} <span> ▼</span>
        </p>
        <ul class="dropdown">
          <li>
            <NuxtLinkLocale to="/news">{{ $t('News') }}</NuxtLinkLocale>
          </li>
          <li>
            <NuxtLinkLocale to="/events">{{ $t('Events') }}</NuxtLinkLocale>
          </li>
        </ul>
      </li>

      <!-- <li :class="{ Selected: selecto === 'coconutdata' }">
        <NuxtLinkLocale to="/coconut-information">
          <img class="btn-icons"
            :src="selecto === 'coconutdata' ? '/_nuxt/assets/icon/w/database.svg' : '/_nuxt/assets/icon/database.svg'"
            alt="ข้อมูลมะพร้าว" />{{ $t('CoconutInfo') }}
        </NuxtLinkLocale>
      </li> -->

      <li :class="[{ Selected: ((selecto === 'coconutdata') ) }, 'nnedd']">
        <NuxtLinkLocale style="padding: 0px;" to="/coconut-information"><p class="img-dd-adjust">
          <img class="btn-icons"
            :src="selecto === 'coconutdata' || selecto === 'pest' ? '/_nuxt/assets/icon/w/newsnevents.svg' : '/_nuxt/assets/icon/newsnevents.svg'"
            alt="ข้อมูลมะพร้าว" />
            {{ $t('CoconutInfo') }} <span> ▼</span>
        </p></NuxtLinkLocale>
        <ul class="dropdown">
          <li>
            <NuxtLinkLocale to="/coconut-information/coconut-varieties">{{ $t('Coconut-varieties') }}</NuxtLinkLocale>
          </li>
          <li>
            <NuxtLinkLocale to="/coconut-information/pest">{{ $t('Events') }}</NuxtLinkLocale>
          </li>
          <li>
            <NuxtLinkLocale to="/coconut-information/coconut-varieties">{{ $t('Events') }}</NuxtLinkLocale>
          </li>
        </ul>
      </li>
      <li :class="{ Selected: selecto === 'expert' }">
        <NuxtLinkLocale to="/experts">
          <img class="btn-icons"
            :src="selecto === 'expert' ? '/_nuxt/assets/icon/w/expert.svg' : '/_nuxt/assets/icon/expert.svg'"
            alt="ผู้เชี่ยวชาญ" />{{ $t('Experts') }}
        </NuxtLinkLocale>
      </li>
      <li :class="{ Selected: selecto === 'faqs' }">
        <NuxtLinkLocale to="/faqs">
          <img class="btn-icons"
            :src="selecto === 'faqs' ? '/_nuxt/assets/icon/w/questions.svg' : '/_nuxt/assets/icon/questions.svg'"
            alt="FAQs" />FAQs
        </NuxtLinkLocale>
      </li>
    </ul>

    <Langswitch class="Ls-repon" :Ismobile="false" />

    <div class="hamburger-container" @click="toggleMenu">
      <div :class="{ 'hamburger-icon': true, open: isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <ul class="mobile-main-menu" v-show="isMenuOpen">
      <li :class="{ mobileSelected: selecto === 'home' }">
        <NuxtLinkLocale to="/">
          {{ $t('Home') }}
        </NuxtLinkLocale>
      </li>
      <li :class="{ mobileSelected: selecto === 'aboutus' }">
        <NuxtLinkLocale to="/aboutus">
          {{ $t('AboutUs') }}
        </NuxtLinkLocale>
      </li>
      <li :class="{ mobileSelected: selecto === 'coconutdata' }">
        <NuxtLinkLocale to="/coconut-information">{{ $t('CoconutInfo') }}</NuxtLinkLocale>
      </li>
      <li :class="{ mobileSelected: selecto === 'expert' }">
        <NuxtLinkLocale to="/expert">
          {{ $t('Experts') }}
        </NuxtLinkLocale>
      </li>
      <li :class="{ mobileSelected: selecto === 'faqs' }">
        <NuxtLinkLocale to="/faqs">{{ $t('FAQs') }}</NuxtLinkLocale>
      </li>
      <li>
        <Langswitch class="Ls-repon" :Ismobile="true" />
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
    },

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
.img-dd-adjust {
  display: flex;
  align-items: center;
}

.Selected.nnedd .dropdown {
  color: black;
}

.Selected.nnedd p span {
  color: white;
  margin-left: 0.5rem;
}

.nnedd p span {
  color: #4E6D16;
  display: inline-block;
  transition: transform 0.3s ease-out;
  margin-left: 0.5rem;
}

.nnedd:hover p span {
  transform: rotate(150deg);
}

.nnedd {

  position: relative;
  display: inline-block;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 0px;
  transition: background 0.3s height 0.3s;
}

.main-menu .nnedd:hover {
  border-radius: 10px 10px 0px 0px;
  height: inherit;
  background: #e6e6e6;
}

.nnedd:hover p span {
  rotate: 30deg;
  
}

.nnedd:hover .dropdown {
  outline: #000 3px solid;
  transform: translateY(100%);
  left: 0;
  height: auto;
  max-height: 200px;
  width: 100%;
  border-radius: 0px 0px 5px 5px;
  overflow: visible;
}

.nnedd .dropdown {
  list-style: none;
  position: absolute;
  left: 50%;
  bottom: 0%;
  background: white;
  width: 0%;
  max-height: 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  overflow: hidden;
  transform: translateY(90%);
  transition: 0.4s ease-out;


}

.nnedd:hover .dropdown li {

  text-align: left;
  transition: ease-out 0.2s;
}

.dropdown li {

  text-align: left;
  transition: ease-out 0.2s;
  width: inherit;
  overflow: hidden;
}


.dropdown li:hover {
  background: #4E6D16;
  color: white;
  border-radius: 10px;
  transform: scale(1.1);
  outline: #000 3px solid;
  
 
}

.dropdown li:hover:active {
  background: #27350e;
  outline: black 3px solid;
  box-shadow: inset 0px 0px 0px 3px white;
}



a,
nuxt-link {
  color: inherit;
  text-decoration: none;
  background-color: transparent;
}

a:hover,
nuxt-link:hover {

  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.main-menu li a {
  display: flex;
  padding: 10px 15px;
  ;
  text-wrap: nowrap;
  width: 100%;
  align-items: center;
}

.navbar {

  width: 100%;
  background-color: #dbdbdb;
  color: rgb(0, 0, 0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 80px;
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
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  color: rgb(0, 0, 0);
  border-radius: 20px;
  font-size: 16px;
  background-color: white;
  box-shadow: #0000003c 4px 4px 4px;
  transition: ease-in-out 0.2s;

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
  display: inline-flex;

  height: 1.2rem;
  margin-right: 0.5rem;
}

.mobile-main-menu>li {
  cursor: pointer;
  width: 100%;
  background-color: #ffffff;
  text-align: center;
  transition: ease-in-out 0.4s;
  border-bottom: 3px #4E6D16 solid;
}

.mobile-main-menu li a {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;

}

.mobile-main-menu li:nth-child(6) {
  border-bottom: none;

}

.mobile-main-menu li:hover {
  background-color: #dbdbdb;

}

.mobile-main-menu li.mobileSelected:hover {
  background-color: #2a3b0b;

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

@media (max-width: 1258px) {
  .main-menu {
    gap: 10px;
  }
}


@media (max-width: 1205px) {
  li a img.btn-icons, .img-dd-adjust .btn-icons{
    display: none;
  }
  
}


@media (max-width: 1039px) {
  .main-menu {

    display: none;
  }

  .lang-toggle {
    display: none;
  }

  .Ls-repon {
    display: none;
  }

  .hamburger-container {
    display: block;
  }




}

@media (min-width: 1039px) {
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
