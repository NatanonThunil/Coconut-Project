<template>
    <nav class="navbar">
        <a class="logo" href="/">
            <img class="btn-icons" src="~/assets/logo/CKH.png" alt="Logo" loading="lazy" />
        </a>
        <ul class="main-menu">
            <li class="Selected">
                <nuxt-link to="/AboutUs">
                    <img class="btn-icons" src="~/assets/icon/people.svg" alt="เกี่ยวกับเรา" />เกี่ยวกับเรา
                </nuxt-link>
            </li>
            <li class="first-has-submenu">
                <img class="btn-icons" src="~/assets/icon/database.svg" alt="เกี่ยวกับเรา" />ข้อมูลมะพร้าว
                <ul class="first-submenu">
                    <!-- Young Coconut -->
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
                    <!-- Old Coconut -->
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
            </li>
            <li>
                <nuxt-link to="/Expert">
                    <img class="btn-icons" src="~/assets/icon/expert.svg" alt="ผู้เชี่ยวชาญ" />ผู้เชี่ยวชาญ
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/faqs">
                    <img class="btn-icons" src="~/assets/icon/questions.svg" alt="FAQs" />FAQs
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

    },
    methods: {
        YT() {
            this.MobileYoung = !this.MobileYoung

        },
        OT() { this.MobileYoung = !this.MobileYoung
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
        setAllFalsebutNot(whatisthat) {
            const properties = [
                "MobileYoung",
                "MobileOld",
                "MobileYoungUpsteam",
                "MobileYoungMidsteam",
                "MobileYoungDownsteam",
                "MobileOldUpsteam",
                "MobileOldMidsteam",
                "MobileOldDownsteam"
            ]; properties.forEach(property => {
                this[property] = property === whatisthat ? true : false;
            });
        }
    },
};
</script>
