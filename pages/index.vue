<template>
  <Navbar selecto="home" />
  <TagLine taglinetext="bruh, dis is Coconut Knowledge Hub " />
  <ContentHeader contexto="ข่าวสาร" />
  <News hotnewsimage="https://static.bangkokpost.com/media/content/dcx/2022/06/06/4326870_790.jpg "
    hotnewstitle=" Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit eaque sint molestias qui non sunt facere, earum nesciunt doloremque ipsa nemo molestiae iusto libero est facilis, quia perferendis delectus enim?"
    hotnewsid="w" newsimage1="https://static.bangkokpost.com/media/content/dcx/2022/06/06/4326870_790.jpg "
    newstitle1="  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit eaque sint molestias qui non sunt facere, earum nesciunt doloremque ipsa nemo molestiae iusto libero est facilis, quia perferendis delectus enim?"
    newsid1="w" newsimage2="https://static.bangkokpost.com/media/content/dcx/2022/06/06/4326870_790.jpg "
    newstitle2="  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit eaque sint molestias qui non sunt facere, earum nesciunt doloremque ipsa nemo molestiae iusto libero est facilis, quia perferendis delectus enim?"
    newsid2="w" />
  <SeeAllButton text="ข่าวสารทั้งหมด" link="/news"></SeeAllButton>
  <ContentHeader contexto="กิจกรรม" />
  <HomeEventFilter selecto="educate" />
  <Footer />
</template>
<!--ตรงนี้ใช้ลอง footerอย่าลืมเอาออก -->
<style scoped>
Footer {
  margin-top: 100%;
}
</style>
