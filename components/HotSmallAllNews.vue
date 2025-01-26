<template>
    <NuxtLinkLocale :to="url" class="Big-card">
        <div class="big-hot-news-image-container"><img :src="image"/></div>
        <div class="big-hot-news-details-container">
            <h2>{{title}}</h2>
            <div class="date-n-readmore">
                <div>{{date}}</div>
                
            </div>
        </div>
    </NuxtLinkLocale>
</template>
<script>
export default{
props:{
    url:{
        type:String
    },
    image:{
        type:String
    }, title:{
        type:String
    }, date:{
        type:String
    },
}
}</script>

<style scoped>

 a{
    color: black;
 }
    .f-btn{
        outline: #4E6D16 solid 2px;
        padding: 0.1rem 0.8rem;
        border-radius: 10px;
        color: #4E6D16;
    }
.date-n-readmore{
    display: flex;
    justify-content: space-between;
   margin-top: 0.5rem;
    padding-right: 1rem;
}
.Big-card{
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 15rem;
    width: 100%;
    background-color: white;
    overflow: hidden;
    border-radius: 10px;
}

.Big-card img{
    height: 100%;
    width: 100%;
    object-fit: cover;
}
.big-hot-news-image-container{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60%;
}

.big-hot-news-details-container{
    padding: 1rem;
}

.big-hot-news-details-container h2{
    font-size: medium;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
}
</style>