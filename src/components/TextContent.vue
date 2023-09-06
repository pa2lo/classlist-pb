<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import renderComponent from '../composables/renderComponent'

import CopyableIcoButton from './CopyableIcoButton.vue'
import CopyableIconInline from './CopyableIconInline.vue'

defineProps({
	html: String
})

const elementsStack = []
const textContent = ref(null)

onMounted(() => {
	const codeBlocks = textContent.value.querySelectorAll('pre')
	if (codeBlocks.length) {
		codeBlocks.forEach(el => {
			elementsStack.push(
				renderComponent({
					el,
					component: CopyableIcoButton,
					props: {
						class: 'post-copy-code',
						text: el.innerHTML.replaceAll('<br>', '\n').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp; ', '\t')
					}
				})
			)
		})
	}

	const copyableLinks = textContent.value.querySelectorAll('.copyable-text')
	if (copyableLinks.length) {
		copyableLinks.forEach(el => {
			elementsStack.push(
				renderComponent({
					el,
					component: CopyableIconInline,
					props: {
						text: el.getAttribute('href')
					}
				})
			)
			el.removeAttribute('href')
		})
	}
})

onBeforeUnmount(() => {
	if (elementsStack.length) elementsStack.forEach(i => i?.())
})
</script>

<template>
	<div class="line post-text" ref="textContent" v-html="html"></div>
</template>