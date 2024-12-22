<template>
    <nav class="navbar">
        <a class="logo" href="/">
            <img class="btn-icons" src="~/assets/logo/CKH.png" alt="Logo" loading="lazy" />
        </a>
        <ul class="main-menu">
            <li :class="{ Selected: selecto === 'aboutus' }">
                <nuxt-link to="/AboutUs">
                    <img class="btn-icons" :src="selecto === 'aboutus' ? '/_nuxt/assets/icon/w/people.svg':'/_nuxt/assets/icon/people.svg'" alt="เกี่ยวกับเรา" />เกี่ยวกับเรา
                </nuxt-link>
            </li>

            <li :class="{ Selected: selecto === 'coconutdata' }">
                <nuxt-link to="/coconut-information">
                    <img class="btn-icons" :src="selecto === 'coconutdata' ? '/_nuxt/assets/icon/w/database.svg':'/_nuxt/assets/icon/database.svg'" alt="ข้อมูลมะพร้าว" />ข้อมูลมะพร้าว
                </nuxt-link>
            </li>
            <!-- <li class="first-has-submenu">
                <img class="btn-icons" src="~/assets/icon/database.svg" alt="เกี่ยวกับเรา" />ข้อมูลมะพร้าว
                <ul class="first-submenu">
                    
                    <li class="has-submenu">มะพร้าวอ่อน
                        <ul class="submenu">
                            <li class="has-submenu">ต้นน้ำ
                                <ul class="submenu">
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/upstream/PlantingAreaAndProduction">พื้นที่ปลูกและผลผลิต</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/upstream/CoconutVarieties">พันธุ์มะพร้าว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/upstream/Propagation">การขยายพันธุ์</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/upstream/CoconutPlantationManagement">การจัดการสวนมะพร้าว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/upstream/ManagingPestsDiseasesAndWeeds">การจัดการแมลงศัตรู
                                            โรค และวัชพืช</nuxt-link></li>
                                </ul>
                            </li>
                            <li class="has-submenu">กลางน้ำ
                                <ul class="submenu">
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/midstream/ProcessingAndAddingValue">การแปรรูปและเพิ่มมูลค่า</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/midstream/PostHarvestManagement">การจัดการหลังการเก็บเกี่ยว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/midstream/HarvestingAndExportingFromTheGarden">การเก็บเกี่ยวและส่งออกจากสวน</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/midstream/FoodProductionStandards">มาตรฐานการผลิตอาหาร</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/midstream/WasteManagementInFactoriesAndReducingGreenhouseGasEmissions">การจัดการของเสียในโรงงานและการลดการปลดปล่อยก๊าซเรือนกระจก</nuxt-link>
                                    </li>
                                </ul>
                            </li>
                            <li class="has-submenu">ปลายน้ำ
                                <ul class="submenu">
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/downstream/CoconutMarket">ตลาดมะพร้าว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/downstream/Export">การส่งออก</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/downstream/CarbonEmissionInTransportation">Carbon
                                            Emission ในการขนส่ง</nuxt-link></li>
                                    <li><nuxt-link
                                            to="/coconut-data/young-coconut/downstream/RelatedRegulations">กฎระเบียบที่เกี่ยวข้อง</nuxt-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    
                    <li class="has-submenu">มะพร้าวแก่
                        <ul class="submenu">
                            <li class="has-submenu">ต้นน้ำ
                                <ul class="submenu">
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/upstream/PlantingAreaAndProduction">พื้นที่ปลูกและผลผลิต</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/upstream/CoconutVarieties">พันธุ์มะพร้าว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/upstream/Propagation">การขยายพันธุ์</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/upstream/CoconutPlantationManagement">การจัดการสวนมะพร้าว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/upstream/ManagingPestsDiseasesAndWeeds">การจัดการแมลงศัตรู
                                            โรค และวัชพืช</nuxt-link></li>
                                </ul>
                            </li>
                            <li class="has-submenu">กลางน้ำ
                                <ul class="submenu">
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/midstream/ProcessingAndAddingValue">การแปรรูปและเพิ่มมูลค่า</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/midstream/PostHarvestManagement">การจัดการหลังการเก็บเกี่ยว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/midstream/HarvestingAndExportingFromTheGarden">การเก็บเกี่ยวและส่งออกจากสวน</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/midstream/FoodProductionStandards">มาตรฐานการผลิตอาหาร</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/midstream/WasteManagementInFactoriesAndReducingGreenhouseGasEmissions">การจัดการของเสียในโรงงานและการลดการปลดปล่อยก๊าซเรือนกระจก</nuxt-link>
                                    </li>
                                </ul>
                            </li>
                            <li class="has-submenu">ปลายน้ำ
                                <ul class="submenu">
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/downstream/CoconutMarket">ตลาดมะพร้าว</nuxt-link>
                                    </li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/downstream/Export">การส่งออก</nuxt-link></li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/downstream/CarbonEmissionInTransportation">Carbon
                                            Emission ในการขนส่ง</nuxt-link></li>
                                    <li><nuxt-link
                                            to="/coconut-data/old-coconut/downstream/RelatedRegulations">กฎระเบียบที่เกี่ยวข้อง</nuxt-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li> -->
            <li :class="{ Selected: selecto === 'expert' }">
                <nuxt-link to="/Expert">
                    <img class="btn-icons" :src="selecto === 'expert' ? '/_nuxt/assets/icon/w/expert.svg':'/_nuxt/assets/icon/expert.svg'" alt="ผู้เชี่ยวชาญ" />ผู้เชี่ยวชาญ
                </nuxt-link>
            </li>
            <li :class="{ Selected: selecto === 'faqs' }">
                <nuxt-link to="/faqs">
                    <img class="btn-icons" :src="selecto === 'faqs' ? '/_nuxt/assets/icon/w/questions.svg':'/_nuxt/assets/icon/questions.svg'" alt="FAQs" />FAQs
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
            <li class="mobile-Selected">
                <nuxt-link to="/">
                    หน้าหลัก
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/AboutUs">
                    เกี่ยวกับเรา
                </nuxt-link>
            </li>
            <li class="mobile-first-has-submenu" @click="ToggleMobileFirstSubMenu">ข้อมูลมะพร้าว</li>
            <ul class="mobile-first-submenu" v-show="MobileFirstDropdownVisible">
                <li class="mobile-has-submenu-top" @click="YT">มะพร้าวอ่อน</li>
                <ul class="mobile-submenu" v-show="MobileYoung">
                    <li class="mobile-has-submenu" @click="YTU">ต้นน้ำ
                        <ul class="mobile-submenu" v-show="MobileYoungUpsteam">
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/upstream/PlantingAreaAndProduction">พื้นที่ปลูกและผลผลิต</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/upstream/CoconutVarieties">พันธุ์มะพร้าว</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/upstream/Propagation">การขยายพันธุ์</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/upstream/CoconutPlantationManagement">การจัดการสวนมะพร้าว</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/upstream/ManagingPestsDiseasesAndWeeds">การจัดการแมลงศัตรู
                                    โรค และวัชพืช</nuxt-link></li>
                        </ul>
                    </li>
                    <li class="mobile-has-submenu" @click="YTM">กลางน้ำ
                        <ul class="mobile-submenu" v-show="MobileYoungMidsteam">
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/midstream/ProcessingAndAddingValue">การแปรรูปและเพิ่มมูลค่า</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/midstream/PostHarvestManagement">การจัดการหลังการเก็บเกี่ยว</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/midstream/HarvestingAndExportingFromTheGarden">การเก็บเกี่ยวและส่งออกจากสวน</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/midstream/FoodProductionStandards">มาตรฐานการผลิตอาหาร</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/midstream/WasteManagementInFactoriesAndReducingGreenhouseGasEmissions">การจัดการของเสียในโรงงานและการลดการปลดปล่อยก๊าซเรือนกระจก</nuxt-link>
                            </li>
                        </ul>
                    </li>
                    <li class="mobile-has-submenu" @click="YTD">ปลายน้ำ
                        <ul class="mobile-submenu" v-show="MobileYoungDownsteam">
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/downstream/CoconutMarket">ตลาดมะพร้าว</nuxt-link>
                            </li>
                            <li><nuxt-link to="/coconut-data/young-coconut/downstream/Export">การส่งออก</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/downstream/CarbonEmissionInTransportation">Carbon
                                    Emission ในการขนส่ง</nuxt-link></li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/downstream/RelatedRegulations">กฎระเบียบที่เกี่ยวข้อง</nuxt-link>
                            </li>
                        </ul>
                    </li>
                </ul>


                <!-- Old Coconut -->
                <li class="mobile-has-submenu-top" @click="OT">มะพร้าวแก่</li>
                <ul class="mobile-submenu" v-show="MobileOld">
                    <li class="mobile-has-submenu" @click="OTU">ต้นน้ำ
                        <ul class="mobile-submenu" v-show="MobileOldUpsteam">
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/upstream/PlantingAreaAndProduction">พื้นที่ปลูกและผลผลิต</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/upstream/CoconutVarieties">พันธุ์มะพร้าว</nuxt-link>
                            </li>
                            <li><nuxt-link to="/coconut-data/old-coconut/upstream/Propagation">การขยายพันธุ์</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/upstream/CoconutPlantationManagement">การจัดการสวนมะพร้าว</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/upstream/ManagingPestsDiseasesAndWeeds">การจัดการแมลงศัตรู
                                    โรค และวัชพืช</nuxt-link></li>
                        </ul>
                    </li>
                    <li class="mobile-has-submenu" @click="OTM">กลางน้ำ
                        <ul class="mobile-submenu" v-show="MobileOldMidsteam">
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/midstream/ProcessingAndAddingValue">การแปรรูปและเพิ่มมูลค่า</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/midstream/PostHarvestManagement">การจัดการหลังการเก็บเกี่ยว</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/midstream/HarvestingAndExportingFromTheGarden">การเก็บเกี่ยวและส่งออกจากสวน</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/midstream/FoodProductionStandards">มาตรฐานการผลิตอาหาร</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/old-coconut/midstream/WasteManagementInFactoriesAndReducingGreenhouseGasEmissions">การจัดการของเสียในโรงงานและการลดการปลดปล่อยก๊าซเรือนกระจก</nuxt-link>
                            </li>
                        </ul>
                    </li>
                    <li class="mobile-has-submenu" @click="OTD">ปลายน้ำ
                        <ul class="mobile-submenu" v-show="MobileOldDownsteam">
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/downstream/CoconutMarket">ตลาดมะพร้าว</nuxt-link>
                            </li>
                            <li><nuxt-link to="/coconut-data/young-coconut/downstream/Export">การส่งออก</nuxt-link>
                            </li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/downstream/CarbonEmissionInTransportation">Carbon
                                    Emission ในการขนส่ง</nuxt-link></li>
                            <li><nuxt-link
                                    to="/coconut-data/young-coconut/downstream/RelatedRegulations">กฎระเบียบที่เกี่ยวข้อง</nuxt-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </ul>
            <li>
                <nuxt-link to="/Expert">
                    ผู้เชี่ยวชาญ
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/faqs">
                    FAQs
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>
<script>
import '~/components/styles/navbar.css';

export default {
    data() {
        return {
            isMenuOpen: false,
            MobileFirstDropdownVisible: false,
            MobileYoung: false,
            MobileOld: false,
            MobileYoungUpsteam: false,
            MobileYoungMidsteam: false,
            MobileYoungDownsteam: false,
            MobileOldUpsteam: false,
            MobileOldMidsteam: false,
            MobileOldDownsteam: false,
        };

    }, props: {
        selecto: {
            type: String,
            required: true,
        }
    },
    methods: {
        YT() {
            this.MobileYoung = !this.MobileYoung

        },
        OT() {
            this.MobileYoung = !this.MobileYoung
        },
        YTU() { this.MobileYoungUpsteam = !this.MobileYoungUpsteam },
        YTM() { this.MobileYoungMidsteam = !this.MobileYoungMidsteam },
        YTD() { this.MobileYoungDownsteam = !this.MobileYoungDownsteam },
        OTU() { this.MobileOldUpsteam = !this.MobileOldUpsteam },
        OTM() { this.MobileOldMidsteam = !this.MobileOldMidsteam },
        OTD() { this.MobileOldDownsteam = !this.MobileOldDownsteam },
        ToggleMobileFirstSubMenu() {
            this.MobileFirstDropdownVisible = !this.MobileFirstDropdownVisible
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },

    },
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
    margin: 1rem 1rem; 
    width: 95%;
    background-color: #dbdbdb;
    color: rgb(0, 0, 0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 60px;
    position: fixed ;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 15px;

    box-shadow: rgba(0, 0, 0, 0.6) 0rem 1rem 2rem;
}
.navbar.scrolled {
    margin: 0;
    background-color: #bfbfbf;
}

.logo {
    margin-right: 2rem;
}

.logo img {
    height: 40px;
    vertical-align: middle;
    cursor: pointer;
}

.first-has-submenu {
    position: relative;
}


.first-submenu {
    display: none;
    position: absolute;
    list-style: none;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    z-index: 1000;
    padding: 0;
    min-width: 200px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    animation: fadeInY 0.5s ease-in-out forwards;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.first-has-submenu:hover>.first-submenu {
    display: block;
    opacity: 1;
    visibility: visible;
}

.first-submenu li {
    padding: 10px 15px;
    white-space: nowrap;
    color: #333;
    font-size: 14px;
    transition: background-color 0.3s;
}

.first-submenu li:hover {
    background-color: #f0f0f0;
}

.main-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: 5px;
    flex: 1;
    opacity: 0;
    transform: translateX(100%);
    animation: fadeIn 1s ease-out forwards;
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
}

.main-menu>li.Selected {
    position: relative;
    padding: 10px 15px;
    cursor: pointer;
    color: rgb(255, 255, 255);
    border-radius: 20px;
    font-size: 16px;
    background-color: #4E6D16;
    box-shadow: #0000003c 4px 4px 4px;
    transition: background-color 0.3s, color 0.3s;
}

.mobile-main-menu>li.mobile-Selected {
    color: white;
    background-color: #4E6D16;
}

.main-menu>li.Selected .btn-icons {
    color: white;
}

.main-menu>li.Selected:hover {
    cursor: pointer;
    color: rgb(255, 255, 255);
    border-radius: 20px;
    font-size: 16px;
    background-color: #658f18;
    box-shadow: #0000003c 4px 4px 4px;
    transition: background-color 0.3s, color 0.3s;
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


.submenu {
    display: none;
    position: absolute;
    list-style: none;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    z-index: 1000;
    padding: 0;
    min-width: 200px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    animation: fadeIn 0.5s ease-in-out forwards;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.submenu li {
    padding: 10px 15px;
    white-space: nowrap;
    color: #333;
    font-size: 14px;
    transition: background-color 0.3s;
}

.submenu li:hover {
    background-color: #f0f0f0;
}

.has-submenu:hover>.submenu {
    display: block;
    opacity: 1;
    visibility: visible;
}


.has-submenu .submenu {
    top: 0;
    left: 100%;

}


.lang-toggle {
    color: #000;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 20px;
    transition: background-color 0.3s, color 0.3s;
}

.lang-toggle:hover {
    background-color: #E6E6E6;
}

.hamburger-container {
    display: none;
    cursor: pointer;
    z-index: 1001;
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

.mobile-main-menu>li {
    cursor: pointer;
    width: 100%;
    background-color: #ffffff;
    text-align: center;
    padding: 0.5rem;
    border-bottom: 3px #4E6D16 solid;

}
.mobile-first-submenu .mobile-has-submenu{
    background-color: #797979;
}

.mobile-submenu>li {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
    background-color: #575757;

    cursor: pointer;
}
.mobile-main-menu {
    overflow: hidden;
    outline: 3px solid#4E6D16;
    border-radius: 10px;
    left: 0;
    position: absolute;
    top: 4.5rem;
    width: 100%;
    list-style: none;
    animation: fadeInY 0.5s;
}

.mobile-first-submenu {

    list-style: none;

}

.mobile-first-submenu>li {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
    background-color: #cccccc;
}


@media (max-width: 950px) {
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



@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateX(5%)
    }

    100% {
        opacity: 1;
        transform: translateX(0)
    }
}

@keyframes fadeInY {
    0% {
        opacity: 0;
        transform: translateY(5%)
    }

    100% {
        opacity: 1;
        transform: translateY(0)
    }
}</style>
