<template>
    <section :class="['one-question', { expanded: isOpen }]" @click="toggleMenu">
        <div class="question">
            <div class="question-label">Q</div>
            <p>{{ question }}</p>
        </div>
        <div class="answer">
            <div class="answer-label">A</div>
            <p>{{ answer }}</p>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isOpen = !this.isOpen;
        },
    },
    props: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.one-question {
    
    cursor: pointer;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
    width: 80%;
    justify-self: center;
    transition: 0.5s ease-in-out;
    overflow: hidden;
    animation: fadeinbelow 1s ease-in-out;
}

.one-question.expanded .answer {
    max-height: 500px;

    transition: max-height 0.5s ease-in-out;
}

.answer {
    max-height: 0;
    
    overflow: hidden;
    transition: max-height 0.5s ease-in-out;
    padding: 0 1rem;
    border-left: 10px solid #828282;
    display: flex;
    align-items: center;
    justify-content: start;
    background-color: white;
}

.question {
    
    border-left: 10px solid #4E6D16;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: start;
    background-color: #D9D9D9;
    transition: ease-in-out 0.2s;
}

.one-question:hover .question {
    background-color: #b9b9b9;

}

.one-question:hover {
    transform: scale(1.02);

}

.question p {
    color: #4E6D16;
    margin: 0;
}

.answer p {
    color: #828282;
    margin: 0;
}

.question-label,
.answer-label {
    color: #4E6D16;
    font-size: 2rem;
    text-align: center;
    margin: 2rem;
}

.answer-label {
    color: #828282;
}

@keyframes fadeinbelow {
    0% {
        opacity: 0;
        transform: translateY(20%);
    }

    100% {
        opacity: 1;
        transform: translateY(0%);
    }
}
</style>
