<template>
    <ul class="homeeventfiltercontainer">
        <li :class="{ filtli: true, selecto: selecto === 'educate' }">อบรม</li>
        <li :class="{ filtli: true, selecto: selecto === 'conference' }">ประชุมวิชาการ</li>
        <li :class="{ filtli: true, selecto: selecto === 'others' }">อื่นๆ</li>
    </ul>

    
</template>

<style>
ul.homeeventfiltercontainer {
    margin: 2rem;
    list-style: none;
    display: flex;
    justify-self: center;
    justify-content: space-evenly;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
    outline: solid rgba(0, 0, 0, 0.2) 4px;
    background-color: transparent;
    height: 3.5rem;
    width: 50%;
    overflow: hidden;
    border-radius: 20px;
}

ul.homeeventfiltercontainer li.filtli{
    display: flex; 
    justify-content: center; 
    align-items: center; 
    text-align: center;
    cursor: pointer;
    height: 100%;
    width: 33.33%;
    transition: 0.5s ease-in-out;
    
}
ul.homeeventfiltercontainer li.filtli.selecto{

    font-weight: bolder;
    font-size: larger;
    background-color: #C5D944;
    
}
</style>
<script>
export default {
    props: {
        selecto: {
            type: String,
            required: true
        }
    }
}</script>