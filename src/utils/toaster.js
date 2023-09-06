import { ref, h, render } from "vue"
import { getUUID } from "./helpers"
import Toaster from "../components/Toaster.vue"

export const toastStore = ref([])

let toasterMounted = false

function mountToaster() {
	render(h(Toaster, {toastStore: toastStore.value}), document.body)
	toasterMounted = true
}

function showToast(title, type, options = {}) {
	if (!toasterMounted) mountToaster()

	toastStore.value.push({
		id: getUUID('toast'),
		type,
		title,
		...options
	})
}

export const toast = {
	success: (text, options) => showToast(text, 'success', options),
	info: (text, options) => showToast(text, 'info', options),
	error: (text, options) => showToast(text, 'error', options),
	warning: (text, options) => showToast(text, 'warning', options)
}

export function destroyToast(id) {
	let index = toastStore.value.findIndex(item => item.id == id)
	if (index > -1) toastStore.value.splice(index, 1)
}