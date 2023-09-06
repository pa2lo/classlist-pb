<script setup>
defineProps({
	as: {
		type: String,
		default: 'div'
	},
	width: {
		type: String,
		default: 'normal'
	}
})
</script>

<template>
	<component :is="as" class="card" :class="[`card-${width}`]">
		<div v-if="$slots.header" class="card-header"><slot name="header"></slot></div>
		<div v-if="$slots.default" class="card-body"><slot></slot></div>
		<div v-if="$slots.footer" class="card-footer"><slot name="footer"></slot></div>
	</component>
</template>