<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
	outline: Boolean,
	disabled: Boolean,
	loading: Boolean,
	ignoreClick: Boolean,
	href: String,
	full: Boolean,
	color: {
		type: String,
		default: 'primary'
	},
	size: {
		type: String,
		default: 'normal'
	},
	type: {
		type: String,
		default: 'button'
	}
})
</script>

<template>
	<component
		:is="href ? RouterLink : 'button'"
		:type="href ? null : type"
		:to="href || null"
		class="button"
		:class="[
			`button-${color}`,
			`button-${size}`,
			{
				'button-outline': outline,
				'button-disabled': disabled,
				'button-loading': loading,
				'button-full': full
			}
		]"
		:disabled="disabled || loading || ignoreClick"
	>
		<span class="button-text">
			<slot />
		</span>
	</component>
</template>