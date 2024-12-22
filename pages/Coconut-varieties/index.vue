<template>
    <Navbar selecto="coconutdata" />
    <div style="height: 10rem;"></div>
    <h1 class="context-header">พันธุ์มะพร้าว</h1>
    <div style="height: 5rem;"></div>
    <label class="coconut-v-input">
        <img src="@/assets/icon/search.svg">
        <input type="text" placeholder="ค้นหาด้วยชื่อ..." v-model="searchQuery" @input="filterCoconuts">
    </label>

    <div class="coconut-v-cards-container" loading="lazy"> 
        <CoconutCards
            v-for="coconut in paginatedCoconuts"
            :key="coconut.id"
            :img="coconut.image || 'https://via.placeholder.com/1280x720'"
            :url="`/coconut-varieties/details/${coconut.id}`"
            :name="coconut.name_th || 'ชื่อไทย'"
            :sci_front="coconut.sci_name_f || 'วิทย์ 1'"
            :sci_middle="coconut.sci_name_m || 'วิทย์ 2'"
            :sci_back="coconut.sci_name_l || 'วิทย์ 3'"
        />
    </div>

    <div class="pagination">
        <button @click="changePage('prev')" :disabled="currentPage === 1">Previous</button>
        
        <input 
            type="number" 
            v-model.number="pageInput" 
            @change="goToPage" 
            :min="1" 
            :max="totalPages" 
            class="page-input"
        />
        
        <span>of {{ totalPages }}</span>
        
        <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
    </div>

    <Footer />
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CoconutCards from '@/components/CoconutCards.vue';

export default {
    components: { Navbar, Footer, CoconutCards },
    data() {
        return {
            coconuts: [], 
            filteredCoconuts: [], 
            searchQuery: '', 
            currentPage: 1,
            itemsPerPage: 30,
            pageInput: 1,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredCoconuts.length / this.itemsPerPage);
        },
        paginatedCoconuts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCoconuts.slice(start, end);
        },
    },
    watch: {
        currentPage(newPage) {
            this.pageInput = newPage; 
        },
    },
    async mounted() {
        try {
            const response = await fetch('/api/coconut'); 
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            this.coconuts = data;
            this.filteredCoconuts = data; 
        } catch (error) {
            console.error('Error fetching coconuts:', error);
        }
    },
    methods: {
        filterCoconuts() {
            const query = this.searchQuery.toLowerCase();
            this.filteredCoconuts = this.coconuts.filter(coconut =>
                coconut.name_th.toLowerCase().includes(query) || coconut.name_eng.toLowerCase().includes(query)
            );
            
            this.currentPage = 1;
        },
        changePage(direction) {
            if (direction === 'next' && this.currentPage < this.totalPages) {
                this.currentPage++;
            } else if (direction === 'prev' && this.currentPage > 1) {
                this.currentPage--;
            }
        },
        goToPage() {
            if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
                this.currentPage = this.pageInput;
            } else {
              
                this.pageInput = this.currentPage;
            }
        },
    },
};
</script>

<style scoped>
h1.context-header {
    text-align: center;
}

label.coconut-v-input {
    transition: ease-in-out 0.5s;
    display: flex;
    justify-self: center;
    width: 60%;
    height: 3rem;
    outline: 3px solid #4E6D16;
    border-radius: 10px;
    overflow: hidden;
}

label.coconut-v-input:hover {
    outline: 4px solid #4E6D16;
}

label.coconut-v-input img {
    display: flex;
    align-self: center;
    padding-left: 0.5rem;
    width: 10%;
    height: 2rem;
}

label.coconut-v-input input {
    all: unset;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow: hidden;
    width: 90%;
}

.coconut-v-cards-container {
    height: auto;
    width: 80%;
    display: flex;
    justify-self: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 2rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    background-color: #4E6D16;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination .page-input {
    width: 3rem;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0.3rem;
}
</style>
