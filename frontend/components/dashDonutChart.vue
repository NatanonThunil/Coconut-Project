<template>
  <section class="dash-charts">
    <BarChart
      :data="barData"
      :height="320"
      :categories="barCategories"
      :y-axis="['value']"              
      :x-num-ticks="barData.length"
      :radius="4"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :hide-legend="true"
      :options="{ tooltip: { shared: false, intersect: true } }" 
    />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'


const props = defineProps<{ counts: Record<string, number>, include?: string[] }>()


const labelMap: Record<string, string> = {
  news: 'ข่าว', events: 'กิจกรรม', coconuts: 'มะพร้าว', experts: 'ผู้เชี่ยวชาญ',
  pests: 'ศัตรูพืช', services: 'บริการ', achievements: 'ผลงาน',
  tags: 'แท็ก', members: 'สมาชิก', employees: 'พนักงาน', faqs: 'คำถามที่พบบ่อย',
  chain_values: 'ห่วงโซ่มูลค่า', tag_lines: 'แท็กไลน์',
}


const keys = computed(() =>
  (props.include?.length ? props.include : Object.keys(props.counts || {}))
)


type BarChartData = Record<string, number | string>;
const barData = computed<BarChartData[]>(() =>
  keys.value.map(k => ({
    label: labelMap[k] ?? k,    
    value: Number(props.counts?.[k] ?? 0),  
  }))
)

const barCategories = computed(() => ({
  value: { name: 'จำนวน', color: '#B6E3DB' }  
}))


const xFormatter = (i: number) => (barData.value[i]?.label as string) ?? ''
const yFormatter = (tick: number) => `${tick}`
</script>

<style scoped>
.dash-charts { margin-top: 1rem; }
</style>
