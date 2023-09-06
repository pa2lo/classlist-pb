<script setup>
import { computed } from 'vue'
import { getUUID } from '../utils/helpers'

import InputWrapper from './InputWrapper.vue'

const props = defineProps({
	label: String,
	name: String,
	options: Array,
	modelValue: String,
	error: String,
	required: Boolean,
	disabled: Boolean,
	full: Boolean
})

const emit = defineEmits(['update:modelValue'])

const inputName = props.name || getUUID('rbtngroup')

const proxyChecked = computed({
	get() {
		return props.modelValue;
	},

	set(val) {
		emit('update:modelValue', val);
	},
})
</script>

<template>
	<InputWrapper type="radio-button-group" :label="label" :error="error" :full="full">
		<div class="input-radio-button-group flex">
			<label v-for="item in options" class="input-radio-button-group-label" :class="{'input-radio-button-group-active': modelValue == item.value}">
				<input
					class="input-radio-invisible"
					type="radio"
					:name="inputName"
					:value="item.value"
					v-model="proxyChecked"
					:required="required"
					:disabled="disabled || item.disabled"
				/>
				<span class="input-radio-button-group-text">{{ item.title }}</span>
			</label>
		</div>
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>