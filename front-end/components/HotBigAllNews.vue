<template>
    <NuxtLinkLocale :to="url" class="Big-card">
        <div class="big-hot-news-image-container"><img :src="image"/></div>
        <div class="big-hot-news-details-container">
            <h2>{{title}}</h2>
            <div class="date-n-readmore">
                <div>{{date}}</div>
                <div class="f-btn">อ่านเพิ่มเติม</div>
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

a:hover .big-hot-news-details-container .date-n-readmore .f-btn{
 color: white;
 transform: scale(1.1);
 background:#4E6D16;
}

 a{
    color: black;
 }
    .f-btn{
        outline: #4E6D16 solid 2px;
        padding: 0.1rem 0.8rem;
        border-radius: 10px;
        color: #4E6D16;
        transition: 0.3s ease-in-out;
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
    height: 100%;
    width: 100%;
    background-color: white;
    box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s ease-in-out;
}
.Big-card:hover{
    transform:scale(1.01);
    outline: 3px solid #4E6D16;
    box-shadow: 6px 6px 16px rgba(0,0,0,0.5);
}
.Big-card img{
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: 0.3s ease-in-out;
}
.Big-card:hover img{
    transform:scale(1.08);
}
.big-hot-news-image-container{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80%;
    overflow:hidden;
}

.big-hot-news-details-container{
    padding: 1rem;
}

.big-hot-news-details-container h2{
    font-size: larger;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
}
</style>