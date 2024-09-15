import { ref } from "vue"

export const classesStore = ref(null)
export const postsStore = ref(null)

export const searchState = ref({
	search: '',
	type: '',
	template: '',
	block: '',
	visibility: null
})