<template>
  <Navbar selecto="coconutdata" />
  <page-header head="CoconutInfo" />
    <label class="coconut-v-input">
        <img src="@/assets/icon/search.svg">
        <input type="text" placeholder="ค้นหาด้วยชื่อ..." v-model="searchQuery" @input="filterCoconuts" />
    </label>

    <!-- Loading State -->
    <div v-if="loading" class="coconut-v-cards-container">
        <CardShimmer v-for="index in 30" :key="index" />
    </div>

    <!-- Loaded Content -->
    <div v-else class="coconut-v-cards-container">
        <CoconutCards v-for="coconut in paginatedCoconuts" :key="coconut.id"
            :img="coconut.image || 'https://via.placeholder.com/1280x720'"
            :url="`/coconut-varieties/details/${coconut.id}`" :name="coconut.name_th || 'ชื่อไทย'"
            :sci_front="coconut.sci_name_f || 'วิทย์ 1'" :sci_middle="coconut.sci_name_m || 'วิทย์ 2'"
            :sci_back="coconut.sci_name_l || 'วิทย์ 3'" @click="goToDetails(coconut.id)" />
    </div>

    <div class="pagination">
        <div class="pagination-line"></div>
        <div class="pagination-controller">
            <button @click="changePage('prev')" :disabled="currentPage === 1">กลับ</button>
            <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
                class="page-input" />
            <span style="display: flex; align-self: center;">จาก {{ totalPages }}</span>
            <button @click="changePage('next')" :disabled="currentPage === totalPages">ถัดไป</button>
        </div>
        <div class="pagination-line"></div>
    </div>

   
</template>

<script>
import { useHead } from '@vueuse/head';
export default {
    data() {
        return {
            coconuts: [],
            filteredCoconuts: [],
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 30,
            pageInput: 1,
            loading: true, 
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredCoconuts.length / this.itemsPerPage);
        },
        paginatedCoconuts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCoconuts.slice(start, end).filter(coconut => coconut.youngold === 'Old');
        },
    },
    watch: {
        currentPage(newPage) {
            this.pageInput = newPage;
        },
    },
    async mounted() {
        window.scrollTo(0, 0);
        try {
         
            setTimeout(async () => {
                const response = await fetch('/api/coconut');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                this.coconuts = data
                this.filteredCoconuts = data;
                this.loading = false; state
            }, 200); 
        } catch (error) {
            console.error('Error fetching coconuts:', error);
        }
    },
    methods: {
        filterCoconuts() {
            const query = this.searchQuery.toLowerCase();
            this.filteredCoconuts = this.coconuts.filter(
                coconut =>
                    coconut.name_th.toLowerCase().includes(query) ||
                    coconut.name_eng.toLowerCase().includes(query)
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
        goToDetails(id) {
            this.$router.push(`/coconut-information/old/coconut-varieties/details/${id}`);
        },
    },
    setup() {
        useHead(
            {
                title: '🥥Coconut - Varieties',
                meta: [
                    {
                        name: 'description',
                        content: 'Home page for Coconut Knowledge Hub',
                    },
                ],
            },
        );
    },
};
</script>

<style scoped>

.context-header{
    display: flex;
    justify-self: center;
}
label.coconut-v-input {
    transition: ease-in-out 0.5s;
    display: flex;
    justify-self: center;
    width: 60%;
    height: 3rem;
    outline: 3px solid #4e6d16;
    border-radius: 10px;
    overflow: hidden;
    cursor: text;
    animation: btnexpand 0.5s ease-in-out forwards;
}

label.coconut-v-input:hover {
    outline: 4px solid #4e6d16;
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


@keyframes shimmer-effect {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.coconut-v-cards-container {
    height: auto;
    width: 80%;
    display: flex;
    justify-self: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    margin: 2rem;
}

.CardShimmer {
    height: 18rem;
    width: 15rem;
    border-radius: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer-effect 1.5s infinite;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    background-color: #4e6d16;
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

.pagination .pagination-line {
    width: fit-content;
    min-width: 20%;
    height: 4px;
    background-color: #4e6d16;
}

.pagination-controller {
    justify-content: center;
    display: flex;
    justify-content: space-around;
    width: 20rem;
}

@media (max-width: 662px) {
    .coconut-v-cards-container {
        width: 90%;
    }
}

@keyframes btnexpand {
    0%{
        opacity: 0;
        width: 20%;
    }
    100%{
        opacity: 1;
        width: 60%;
    }
    
}
</style>
