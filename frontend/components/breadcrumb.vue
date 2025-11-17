<template>
    <nav class="breadcrumb">
        <ul>
            <li v-for="(item, index) in crumbs" :key="index">
     
                <NuxtLinkLocale v-if="index !== crumbs.length - 1" :to="item.to">
                    {{ $t(item.label) }}
                </NuxtLinkLocale>

              
                <span v-else>
              
                    <template v-if="item.raw">
                        {{ item.label }}
                    </template>
                  
                    <template v-else>
                        {{ $t(item.label) }}
                    </template>
                </span>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
    lastLabel: {
        type: String,
        default: null
    }
})

const route = useRoute()

const nameMap = {
    'announcements': 'News & Events',
    'news': 'News',
    'events': 'Events',
    'aboutus': 'AboutUs',
    'achievements': 'Achievements',
    'employees': 'employee',
    'benefitandservice': 'Benefit and service',
    'members': 'member',
    'coconut-information': 'CoconutInfo',
    'coconut-varieties': 'Coconut-varieties',
    'pest': 'Pest',
    'value-chain': 'Value Chain',
    'experts': 'Experts',
    'faqs': 'FAQs',
    'questions': 'Questions',
    'answers': 'Answers',
    'advice': 'Advice'
    
    
    
    
}

const exclude = ['details']

const paths = computed(() =>
    route.path
        .split('/')
        .filter(p => p && !exclude.includes(p))
)

const crumbs = computed(() => {
    const temp = paths.value.map((p, i) => ({
        label: nameMap[p] || p,
        to: '/' + paths.value.slice(0, i + 1).join('/'),
        raw: false              
    }))

  
    temp.unshift({ label: 'Home', to: '/', raw: false })

   
    if (props.lastLabel && temp.length > 0) {
        temp[temp.length - 1].label = props.lastLabel
        temp[temp.length - 1].raw = true
    }

    return temp
})
</script>

<style scoped>
.breadcrumb{
    font-size: clamp(0.8rem, 2vw, 1.2rem);
    margin: 1rem auto;
    width: 90%;
  

}
.breadcrumb ul {
    display: flex;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
}
.breadcrumb li a , .breadcrumb li  {
    color: gray;
    max-width: 25rem;
     white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
        transition: all 0.2s ease-in-out;
   
}
.breadcrumb li::after {
    content: '/';
    margin-left: 8px;
}

.breadcrumb li:last-child {
    font-weight: bold;
    color: #4E6D16;
}

.breadcrumb li:last-child::after {
    content: '';
    
}
.breadcrumb li a:hover {

   font-size: clamp(0.9rem, 2vw, 1.3rem);

}


</style>
