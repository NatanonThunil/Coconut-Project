<template>
  <div>
    <Navbar selecto="home" />
    <TagLine taglinetext="This is Coconut Knowledge Hub TagLine" :isFixed="true" />

    <ContentHeader :contexto="$t('News')" />

    <news />
    <SeeAllButton :text="$t('SeeAll_News')" link="news" />
    <ContentHeader :contexto="$t('Events')" />
    <HomeEvent />
    <SeeAllButton :text="$t('SeeAll_Events')" link="events" />
    <ContentHeader :contexto="$t('Other')" />
    <div class="homefootbannercontainer">



      <!-- <HomeFootBanner :title="$t('AboutUs')" :text="$t('abs_desc')" picture="/img/AboutUs.png"
        url="/AboutUs" />

      <HomeFootBanner :title="$t('CoconutInfo')" :text="$t('ccnif_desc')"
        picture="/img/CoconutInformation.jpg" url="/coconut-information" />

      <HomeFootBanner :title="$t('Experts')" :text="$t('ep_desc')" picture="/img/Expert.png"
        url="/experts" /> -->
        <IconFooter/>
      <div style="height: 2rem;"></div>
    </div>
    
  </div>
</template>

<script>

import { useHead } from '@vueuse/head';

export default {

  setup() {
    useHead({
      title: 'Coconut - Home',
      meta: [
        {
          name: 'description',
          content: 'Home page for Coconut Knowledge Hub',
        },
      ],
    },


    );
  }
}




</script>
<style scoped>
.homefootbannercontainer{
  display: flex;
  align-items: center;
  flex-direction: column;
 
  width: 100%;
}
footer {
  margin-top: 2rem;
}
</style>
