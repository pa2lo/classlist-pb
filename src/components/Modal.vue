<script setup>
import { ref } from 'vue'

import IcoButton from './IcoButton.vue'

defineOptions({
	inheritAttrs: false
})

const props = defineProps({
	header: String,
	headerNote: String,
	closeable: Boolean,
	open: Boolean,
	as: String,
	width: {
		type: String,
		default: 'normal'
	}
})

const modal = ref(null)
const emit = defineEmits(['update:open', 'close', 'modalOpen', 'modalClose']);
let focusedEl = null

function afterEnter() {
	if (['INPUT', 'SELECT'].includes(document.activeElement.tagName)) return
	focusedEl = document.activeElement
	let autoFocusEl = modal.value.querySelector('.autofocus input, .autofocus select, .autofocus button, input.autofocus, select.autofocus, a.autofocus, button.autofocus')
	if (autoFocusEl) autoFocusEl.focus()
	else modal.value.focus({ preventScroll: true })
}

function beforeLeave() {
	if (focusedEl && document.documentElement.contains(focusedEl)) focusedEl.focus({ preventScroll: true })
}

function close() {
    if (props.closeable) {
		emit('update:open', false);
		emit('close');
	}
}

function handleEscape(e) {
	if (!['INPUT', 'SELECT'].includes(e.target.tagName)) {
		e.stopPropagation()
		close()
	}
}
</script>

<template>
	<teleport to="body">
        <Transition name="modal" @enter="$emit('modalOpen')" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="$emit('modalClose')">
			<div v-if="open" class="modal-backdrop" @click.self="close">
				<component :is="as || 'div'" ref="modal" class="card modal-card" :class="[`card-${width}`]" @keyup.esc.stop="handleEscape" tabindex="-1" v-bind="$attrs">
					<div v-if="header || $slots.header" class="card-header">
						<slot name="header">
							<h4 class="modal-header-title">{{ header }}</h4>
							<p v-if="headerNote" class="modal-header-note">{{ headerNote }}</p>
						</slot>
					</div>
					<div v-if="$slots.default" class="card-body"><slot></slot></div>
					<div v-if="$slots.footer" class="card-footer"><slot name="footer"></slot></div>
					<IcoButton v-if="closeable" class="modal-bttn" icon="x" title="Close" @click.prevent="close" />
				</component>
			</div>
		</Transition>
	</teleport>
</template>