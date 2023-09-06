<script setup>
import IcoButton from './IcoButton.vue'
import CopyableIcoButton from './CopyableIcoButton.vue';

const props = defineProps({
	name: String,
	description: String,
	removable: Boolean,
	loading: Boolean,
	copyable: Boolean,
	private: Boolean,
	externalLink: String
})
</script>

<template>
	<div class="classes-item flex ai-c" :class="{'classes-item-disabled': loading, 'classes-item-private': private}" tabindex="-1">
		<div class="classes-item-text flex ai-c">
			<h3 class="classes-item-text-title">{{ name }}</h3>
			<div v-if="description" class="classes-item-text-description">{{ description }}</div>
		</div>
		<svg v-if="private" title="Private" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-lock bedge-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
			<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
			<path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
			<path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
		</svg>
		<div v-if="$slots.default" class="classes-item-bedges flex">
			<slot></slot>
		</div>
		<div v-if="removable || copyable || externalLink" class="classes-item-buttons flex">
			<CopyableIcoButton v-if="copyable" :text="name" />
			<IcoButton v-if="externalLink" :href="externalLink" title="Open in new tab" target="_blank" icon="external-link" @click.stop />
			<IcoButton v-if="removable" icon="trash" title="Delete" color="secondary" @click.stop="$emit('delete')" :loading="loading" />
		</div>
	</div>
</template>