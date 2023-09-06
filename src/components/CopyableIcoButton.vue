<script setup>
import { ref } from 'vue'

import IcoButton from './IcoButton.vue'

const props = defineProps({
	text: String,
})

const copied = ref(false)
async function copy() {
	await navigator.clipboard.writeText(props.text).then(() => {
		copied.value = true
		setTimeout(() => {
			copied.value = false
		}, 2000);
	})
}
</script>

<template>
	<IcoButton :icon="copied ? 'check' : 'copy'" :title="copied ? 'Copied' : 'Copy to clipboard'" :color="copied ? 'success' : 'heading'" @click.stop="copy" :ignoreClick="copied" :highlighted="copied" />
</template>