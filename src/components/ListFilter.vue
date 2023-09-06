<script setup>
import { getCurrentInstance, toRef } from 'vue'
import { themeOptions, themesMap, blockOptions, blocksMap, typeOptions, typesMap, visibilityOptions } from '../utils/helpers'
import { useProxyModel } from '../composables/useProxyModel'

import TextInput from './TextInput.vue'
import MultiSelect from './MultiSelect.vue'

const props = defineProps({
	search: String,
	theme: String,
	type: String,
	block: String,
	visibility: String,
	full: Boolean
})

const vm = getCurrentInstance()
const emit = defineEmits(['update:search', 'update:theme', 'update:type', 'update:block', 'update:visibility'])

const proxySearch = useProxyModel(toRef(() => props.search), vm, 'update:search')
const proxyTheme = useProxyModel(toRef(() => props.theme), vm, 'update:theme')
const proxyType = useProxyModel(toRef(() => props.type), vm, 'update:type', setBlockFilter)
const proxyBlock = useProxyModel(toRef(() => props.block), vm, 'update:block')
const proxyVisibility = useProxyModel(toRef(() => props.visibility), vm, 'update:visibility')

let blocksCache = null
let blocksCacheSkip = false

function setBlockFilter(val) {
	if (props.block == null) return

	if (['', 'block'].includes(val)) {
		if (blocksCache && blocksCacheSkip) {
			blocksCacheSkip = false
			emit('update:block', blocksCache)
		}
	} else {
		if (!blocksCacheSkip) {
			blocksCache = props.block
			blocksCacheSkip = true
			emit('update:block', '')
		}
	}
}
</script>

<template>
	<header class="classes-header flex" :class="{'classes-header-full': full}">
		<div class="classes-header-filter classes-header-home-filter flex" :class="{'classes-header-full-filter': full}">
			<TextInput v-if="search != null" placeholder="Search text ..." icon="search" v-model="proxySearch" clearable />
			<MultiSelect v-if="theme != null" placeholder="All themes" allowEmpty :options="themeOptions" v-model="proxyTheme" />
			<MultiSelect v-if="type != null" placeholder="All types" allowEmpty :options="typeOptions" v-model="proxyType" />
			<MultiSelect v-if="block != null" placeholder="All blocks" allowEmpty :options="blockOptions" v-model="proxyBlock" :disabled="!['', 'block'].includes(type)" />
			<MultiSelect v-if="visibility != null" placeholder="All" allowEmpty :options="visibilityOptions" v-model="proxyVisibility" />
		</div>
		<slot></slot>
	</header>
	<Transition name="filtered-options">
		<p v-if="search || type || theme || block || visibility" class="filtered-options">
			<span class="filtered-options-home">
				<TransitionGroup name="checked-options">
					<span v-if="search" class="multi-select-checked-option" @click.prevent="$emit('update:search', '')">
						<span class="multi-select-checked-option-title">search - {{ search }}</span>
						<span class="multi-select-checked-option-x">✕</span>
					</span>
					<span v-if="theme" class="multi-select-checked-option" @click.prevent="$emit('update:theme', '')">
						<span class="multi-select-checked-option-title">theme - {{ themesMap[theme] }}</span>
						<span class="multi-select-checked-option-x">✕</span>
					</span>
					<span v-if="type" class="multi-select-checked-option" @click.prevent="$emit('update:type', '')">
						<span class="multi-select-checked-option-title">type - {{ typesMap[type] }}</span>
						<span class="multi-select-checked-option-x">✕</span>
					</span>
					<span v-if="block" class="multi-select-checked-option" @click.prevent="$emit('update:block', '')">
						<span class="multi-select-checked-option-title">block - {{ blocksMap[block] }}</span>
						<span class="multi-select-checked-option-x">✕</span>
					</span>
					<span v-if="visibility" class="multi-select-checked-option" @click.prevent="$emit('update:visibility', '')">
						<span class="multi-select-checked-option-title">{{ visibility }}</span>
						<span class="multi-select-checked-option-x">✕</span>
					</span>
				</TransitionGroup>
			</span>
		</p>
	</Transition>
</template>