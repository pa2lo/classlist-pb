<script setup>
import { computed } from 'vue'

const props = defineProps({
	name: String,
	label: String,
	required: Boolean,
	modelValue: {
		type: [Array, Boolean],
		required: true,
	},
	value: {
		default: null,
	}
})

const emit = defineEmits(['update:modelValue'])

const proxyChecked = computed({
	get() {
		return props.modelValue
	},

	set(val) {
		emit('update:modelValue', val)
	},
})
</script>

<template>
	<label class="line input-cb-inline flex">
		<input
			class="input-cb"
			type="checkbox"
			:value="value"
			:name="name"
			v-model="proxyChecked"
			:required="required"
		/>
		<span v-if="$slots.default" class="input-cb-slot"><slot /></span>
		<span v-else class="input-cb-text">{{ label }}</span>
	</label>
</template>