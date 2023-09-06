<script setup>
defineProps({
	error: String,
	type: String,
	id: String,
	label: String,
	full: Boolean
})
</script>

<template>
	<div class="line input-wrapper" :class="[`input-${type}-wrapper`, {'input-full': full}]">
		<component :is="id ? 'label' : 'div'" v-if="label" class="input-label" :for="id || null">{{ label }}</component>
		<div class="input-outer flex" :class="`input-${type}-outer`">
			<div class="input-inner" :class="`input-${type}-inner`">
				<slot></slot>
			</div>
		</div>
		<div v-if="error" class="input-note color-error">{{ error }}</div>
		<div v-if="$slots.note" class="input-note"><slot name="note"></slot></div>
	</div>
</template>