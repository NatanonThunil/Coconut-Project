import { ref } from 'vue';

export function useTags() {
    const tags = ref([]);
    const error = ref(null);

    const fetchTags = async (employeeId) => {
        try {
            const response = await $fetch(`/api/tags_employee?employee_id=${employeeId}`);
            tags.value = Array.isArray(response) ? response : [];
        } catch (err) {
            error.value = 'Failed to fetch tags';
            console.error('Error fetching tags:', err);
        }
    };

    return {
        tags,
        error,
        fetchTags
    };
}
