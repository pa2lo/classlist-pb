import { ref } from "vue"
import { getUUID } from "./helpers"

export const dialogStore = ref([])

function showDialog(type, title, options = {}) {
	dialogStore.value.push({
		id: getUUID('dialog'),
		title,
		type,
		...options
	})
}

export const dialog = {
	// confirms
	confirm: (title, message, options) => showDialog('question', title || 'Confirm', { message, closeable: false, confirmText: 'Yes', ...options }),
	delete: (title, message, options) => showDialog('question', title || 'Confirm', { message, closeable: false, confirmColor: 'secondary', confirmText: 'Delete', ...options }),

	// info
	info: (title, message, options) => showDialog('info', title || 'Info', { message, showCancel: false, ...options }),
	success: (title, message, options) => showDialog('success', title || 'Success', { message, showCancel: false, ...options }),
	warning: (title, message, options) => showDialog('warning', title || 'Warning', { message, showCancel: false, ...options }),
	error: (title, message, options) => showDialog('error', title || 'Error', { message, showCancel: false, ...options }),

	// image
	image: (image, title) => showDialog('image', title, { image })
}

export function destroyDialog(id) {
	let index = dialogStore.value.findIndex(item => item.id == id)
	if (index > -1) dialogStore.value.splice(index, 1)
}