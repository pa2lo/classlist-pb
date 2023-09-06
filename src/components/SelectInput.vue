<script setup>
import { onMounted, ref } from 'vue'
import { getUUID } from '../utils/helpers'

import InputWrapper from './InputWrapper.vue'

let props = defineProps({
	id: String,
	label: String,
	name: String,
	options: Array,
	error: String,
	autofocus: Boolean,
	required: Boolean,
	disabled: Boolean,
	hideEmpty: Boolean,
	allowEmpty: Boolean,
	emptyText: {
		type: String,
		default: 'Select...'
	},
	modelValue: [String, Number],
	full: Boolean
});

let inputID = props.id || getUUID('select')

const inputEl = ref(null);

onMounted(() => {
	if (props.autofocus) inputEl.focus()
});
</script>

<template>
	<InputWrapper type="select" :id="inputID" :label="label" :error="error" :full="full">
		<select
			:id="inputID"
			class="input input-select"
			:class="{'input-error': error}"
			:name="name"
			:required="required"
			:disabled="disabled"
			ref="inputEl"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
		>
			<option v-if="!hideEmpty" value='' :disabled="!allowEmpty" selected>{{ emptyText }}</option>
			<option v-for="option in options" :value="option.value ?? option">{{ option.title ?? option }}</option>
		</select>
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>
