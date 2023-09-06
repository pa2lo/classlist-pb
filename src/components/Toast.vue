<script setup>
import { onMounted } from 'vue'
import { destroyToast } from '../utils/toaster'

import Icon from './Icon.vue'

const props = defineProps({
	id: String,
	type: String,
	title: String,
	message: String,
	timeout: {
		type: Number,
		default: 7000
	}
})

let toastTimeout = null
const isCountdown = props.timeout > 0

onMounted(() => {
	if (isCountdown) toastTimeout = setTimeout(() => {
		closeToast()
	}, props.timeout)
})

function closeToast() {
	if (isCountdown && toastTimeout) clearTimeout(toastTimeout)

	destroyToast(props.id)
}
</script>

<template>
	<div class="toast flex ai-c" :class="[`toast-${type}`, {'toast-countdown': isCountdown}]" @click="closeToast" :style="[`--toast-timer: ${timeout}ms`]">
		<Icon class="toast-icon" :name="type" />
		<div class="toast-text">
			<div class="toast-text-title" v-html="title"></div>
			<div v-if="message" class="toast-text-message" v-html="message"></div>
		</div>
		<div class="toast-close">
			<Icon name="x" />
		</div>
	</div>
</template>