<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUUID } from '../utils/helpers'

import InputWrapper from './InputWrapper.vue'
import Icon from './Icon.vue'
import IcoButton from './IcoButton.vue'

const props = defineProps({
	id: String,
	label: String,
	name: String,
	placeholder: String,
	error: String,
	autofocus: Boolean,
	required: Boolean,
	readOnly: Boolean,
	disabled: Boolean,
	clearable: Boolean,
	icon: String,
	modelValue: [String, Number],
	type: {
		type: String,
		default: 'text'
	},
	full: Boolean
})

const inputID = props.id || getUUID('input')

const inputEl = ref(null);
const showPassword = ref(false);

const inputType = computed(() => {
	if (props.type != 'password') return props.type
	if (showPassword.value == true) return 'text'
	else return 'password'
})

onMounted(() => {
	if (props.autofocus) inputEl.value.focus()
})
</script>

<template>
	<InputWrapper type="text" :id="inputID" :label="label" :error="error" :full="full">
		<span v-if="icon" class="input-icon"><Icon :name="icon" /></span>
		<input
			:id="inputID"
			class="input input-text"
			:class="{'input-error': error, 'input-w-button': clearable || (type == 'password'), 'input-w-icon': icon}"
			:type="inputType"
			:name="name"
			:placeholder="placeholder"
			:required="required"
			:readonly="readOnly"
			:disabled="disabled"
			ref="inputEl"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
			@blur="$emit('blur', $event.target.value)"
		/>
		<IcoButton v-if="clearable" class="input-bttn" icon="x" title="Clear" :invisible="!modelValue?.length" @click.prevent="$emit('update:modelValue', '')" />
		<IcoButton v-if="type == 'password'" tabindex="-1" class="input-bttn" :icon="!showPassword ? 'eye' : 'eye-off'" :title="showPassword ? 'Skryť heslo' : 'Zobraziť heslo'" :invisible="!modelValue?.length" @click.prevent="showPassword = !showPassword" />
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>