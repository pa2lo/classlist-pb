import { ref } from "vue"

export const classesStore = ref(null)
export const postsStore = ref(null)

export const searchState = ref({
	search: '',
	type: '',
	theme: '',
	block: '',
	visibility: null
})