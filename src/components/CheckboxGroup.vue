<script setup>
import { computed } from 'vue'
import { getUUID } from '../utils/helpers'

import InputWrapper from './InputWrapper.vue'

const props = defineProps({
	label: String,
	name: String,
	options: Array,
	modelValue: Array,
	error: String,
	required: Boolean,
	disabled: Boolean,
	full: Boolean
})

const emit = defineEmits(['update:modelValue'])

const inputName = props.name || getUUID('cbgroup')

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
	<InputWrapper type="cb-group" :label="label" :error="error" :full="full">
		<label v-for="item in options" class="line input-cb-inline flex">
			<input
				class="input-cb"
				type="checkbox"
				:value="item.value"
				:name="inputName"
				v-model="proxyChecked"
				:required="required"
				:disabled="disabled || item.disabled"
			/>
			<span class="input-cb-text">{{ item.title }}</span>
		</label>
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>