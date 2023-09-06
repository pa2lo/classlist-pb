<script setup>
import { ref, computed } from 'vue'
import { getUUID } from '../utils/helpers'

import InputWrapper from './InputWrapper.vue'
import IcoButton from './IcoButton.vue'

const props = defineProps({
	label: String,
	name: String,
	options: Array,
	modelValue: [Array, String, Boolean],
	error: String,
	required: Boolean,
	disabled: Boolean,
	placeholder: {
		type: String,
		default: 'Select...'
	},
	allowEmpty: Boolean,
	searchable: Boolean,
	full: Boolean,
	hideSelectedChips: Boolean
})

const emit = defineEmits(['update:modelValue'])

const inputName = props.name || getUUID('cbgroup')

const isMulti = typeof props.modelValue == 'object'

const proxyChecked = computed({
	get() {
		return props.modelValue;
	},

	set(val) {
		emit('update:modelValue', val);
	},
})

function deselect(option) {
	if (props.disabled) return

	emit('update:modelValue', props.modelValue.filter(o => o != option.value));
}

const filter = ref('')
const filteredOptions = computed(() => props.options.filter(o => o.title.toLowerCase().includes(filter.value.toLocaleLowerCase())))

const checkedOptions = computed(() => {
	if (!isMulti) return []

	return props.modelValue.reduce((arr, value) => {
		let option = props.options.find(o => o.value == value)
		if (option) arr.push(option)
		return arr
	}, [])
})

const checkedOption = computed(() => {
	if (isMulti) return {}

	return props.options.find(o => o.value == props.modelValue) || {title: props.placeholder}
})

function changeOption() {
	if (!isMulti && isOpen.value) isOpen.value = false
}

const isOpen = ref(false)
let clickListener = false
function toggleOptions(e) {
	if (props.disabled || (e.target.classList.contains('multi-select-checked-option'))) return

	isOpen.value = !isOpen.value
}

const inputEl = ref(null)
const optionsEl = ref(null)
const filterSearchEl = ref(null)
const isBottom = ref(true)

function onEnter(el) {
	const { y: inputY, height: inputHeight } = inputEl.value.getBoundingClientRect()
	isBottom.value = inputY + inputHeight + el.clientHeight + 8 > window.innerHeight

	if (clickListener) return

	requestAnimationFrame(() => {
		document.body.addEventListener('pointerdown', handleClick, true)
		clickListener = true
	})

	if (props.searchable && filterSearchEl.value) filterSearchEl.value.focus({preventScroll: true})
}
function onLeave() {
	if (clickListener) {
		document.body.removeEventListener('pointerdown', handleClick, true)
		clickListener = false
	}
}
function handleClick(e) {
	if (!optionsEl.value || inputEl.value.contains(e.target)) return

	if (!(optionsEl.value == e.target || optionsEl.value.contains(e.target))) isOpen.value = false
}

const proxySelectValue = computed({
	get() {
		return isMulti ? props.modelValue?.[0] : props.modelValue
	}
})
</script>

<template>
	<InputWrapper type="multi-select" :label="label" :error="error" :full="full">
		<div class="input input-multi-select" :class="{'multi-select-open': isOpen, 'input-disabled': disabled, 'input-error': error}" ref="inputEl" @click.prevent="toggleOptions">
			<Transition name="multi-select" mode="out-in">
				<span v-if="!modelValue.length && !allowEmpty" class="multi-select-placeholder">{{ placeholder }}</span>
				<template v-else>
					<span v-if="isMulti && hideSelectedChips">{{ checkedOptions.length }} selected</span>
					<span v-else-if="(isMulti)" class="multi-select-checked-options">
						<TransitionGroup name="checked-options">
							<span v-for="option in checkedOptions" :key="option.value" class="multi-select-checked-option" @click.prevent="deselect(option)">
								<span class="multi-select-checked-option-title">{{ option.title }}</span>
								<span class="multi-select-checked-option-x">✕</span>
							</span>
						</TransitionGroup>
					</span>
					<span v-else>{{ checkedOption.title }}</span>
				</template>
			</Transition>
			<!-- <input v-if="required" type="text" required :name="inputName" :value="modelValue" class="multi-select-fake-required" /> -->
			<select class="multi-select-fake-select" :value="proxySelectValue" :required="required" :id="`fake-${inputName}`">
				<option v-if="allowEmpty" value="">{{ placeholder }}</option>
				<option v-for="o in options" :value="o.value">{{ o.title }}</option>
			</select>
		</div>
		<Transition name="multi-select" @enter="onEnter" @leave="onLeave">
			<div v-if="isOpen" class="multi-select-options" :class="[`multi-select-options-${isBottom ? 'bottom' : 'top'}`]" ref="optionsEl">
				<div v-if="searchable" class="multi-select-options-search-label">
					<input ref="filterSearchEl" class="multi-select-options-search" placeholder="Search option" v-model="filter" />
					<IcoButton class="input-multi-select-bttn" icon="x" title="Clear" :invisible="!filter?.length" @click.prevent="filter = ''" />
				</div>
				<label v-if="allowEmpty && !isMulti" class="multi-select-option flex" :class="{'option-selected': !isMulti && modelValue == ''}">
					<input class="input-radio-invisible" :name="inputName" type="radio" value="" v-model="proxyChecked" @change="changeOption" />
					<span class="input-cb-text multi-select-option-title">{{ placeholder }}</span>
				</label>
				<label v-for="option in filteredOptions" class="multi-select-option flex" :class="{'option-disabled': disabled || option.disabled, 'option-selected': (option.value == modelValue) && !isMulti}">
					<input :class="[isMulti ? 'input-cb' : 'input-radio-invisible']" :name="inputName" :type="isMulti ? 'checkbox' : 'radio'" :value="option.value" v-model="proxyChecked" :required="required" :disabled="disabled || option.disabled" @change="changeOption" />
					<span class="input-cb-text multi-select-option-title">{{ option.title }}</span>
				</label>
				<div v-if="!filteredOptions.length && filter.length" class="multi-select-no-options">No results for "{{ filter }}"</div>
			</div>
		</Transition>
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>