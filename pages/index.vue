<template>
  <div>
    <Navbar selecto="home" />
    <TagLine taglinetext="This is Coconut KnowledgeHub TagLine" />
    
    <ContentHeader :contexto="$t('News')" />
   
    <news />
    <SeeAllButton :text="$t('SeeAll_News')" link="news" />
    <ContentHeader :contexto="$t('Events')" />
    <HomeEvent />
    <SeeAllButton :text="$t('SeeAll_Events')" link="events" />
    <ContentHeader :contexto="$t('Other')" />
    <HomeFootBanner :title="$t('AboutUs')"
      :text="$t('abs_desc')"
      picture="_nuxt/assets/img/AboutUs.png" url="/AboutUs" />

    <HomeFootBanner :title="$t('CoconutInfo')"
      :text="$t('ccnif_desc')"
      picture="_nuxt/assets/img/CoconutInformation.jpg" url="/coconut-information" />

    <HomeFootBanner :title="$t('Experts')"
     :text="$t('ep_desc')"
      picture="_nuxt/assets/img/Expert.png" url="/experts" />
      <div style="height: 2rem;"></div>


  </div>
</template>

<script>
import { useHead } from '@vueuse/head';

export default {

  setup() {
    useHead({
      title: '🥥Coconut - Home',
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
footer {
  margin-top: 2rem;
}
</style>
