<script setup>
defineProps({
	logoOnly: Boolean
})
</script>

<template>
	<a href="/" class="logo ai-c">
		<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-drag-drop" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
			<path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
			<path d="M11 3l0 .01"></path>
			<path d="M15 3l0 .01"></path>
			<path d="M3 11l0 .01"></path>
			<path d="M3 15l0 .01"></path>
			<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
			<path d="M20.2 20.2l1.8 1.8"></path>
		</svg>
		<h1 v-if="!logoOnly" class="logo-h1">ClassList</h1>
	</a>
</template>