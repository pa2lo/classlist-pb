<script setup>
import { RouterLink } from 'vue-router'

import Icon from './Icon.vue'

const props = defineProps({
	icon: String,
	title: String,
	outline: Boolean,
	disabled: Boolean,
	loading: Boolean,
	ignoreClick: Boolean,
	highlighted: Boolean,
	href: [String, Object],
	invisible: Boolean,
	color: {
		type: String,
		default: 'heading'
	},
})

const isBasicLink = typeof props.href == "string" && props.href?.startsWith('https://')
const contidionalBind = isBasicLink ? 'href' : 'to'
</script>

<template>
	<component
		:is="href ? isBasicLink ? 'a' : RouterLink : 'button'"
		:type="href ? null : 'button'"
		:[contidionalBind]="href || null"
		class="ico-button"
		:class="[
			`ico-button-${color}`,
			{
				'button-outline': outline,
				'button-disabled': disabled,
				'button-loading': loading,
				'button-invisible': invisible,
				'button-highlighted': highlighted
			}
		]"
		:title="title"
		:disabled="disabled || loading || ignoreClick"
	>
		<Icon :name="icon" />
	</component>
</template>