<script setup>
import { ref } from 'vue'

import Icon from './Icon.vue'

const props = defineProps({
	text: String,
})

const copied = ref(false)
async function copy() {
	if (copied.value) return

	await navigator.clipboard.writeText(props.text).then(() => {
		copied.value = true
		setTimeout(() => {
			copied.value = false
		}, 2000);
	})
}
</script>

<template>
	<span class="copyable-text-icon" :class="{'color-success': copied, 'copyable-text-icon-copied': copied}" :title="copied ? 'Copied' : 'Copy to clipboard'" @click.stop="copy">
		<Icon :name="copied ? 'check' : 'copy'" />
	</span>
</template>