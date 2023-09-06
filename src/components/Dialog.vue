<script setup>
import { ref } from 'vue'
import { destroyDialog } from '../utils/dialog'

import Button from './Button.vue'
import IcoButton from './IcoButton.vue'
import Icon from './Icon.vue'

const props = defineProps({
	id: String,
	title: String,
	type: String,
	message: String,
	image: String,
	closeable: {
		type: Boolean,
		default: true
	},
	width: String,

	// cancel
	onCancel: Function,
	showCancel: {
		type: Boolean,
		default: true
	},
	cancelOutline: {
		type: Boolean,
		default: true
	},
	cancelColor: {
		type: String,
		default: 'heading'
	},
	cancelText: {
		type: String,
		default: 'Cancel'
	},

	// confirm
	onConfirm: Function,
	confirmColor: {
		type: String,
		default: 'primary'
	},
	confirmText: {
		type: String,
		default: 'Ok'
	}
})

const open = ref(true)

function closeModal() {
	open.value = false
}
function afterLeave() {
	destroyDialog(props.id)
}

function confirm() {
	closeModal()
	if (typeof props.onConfirm == 'function') props.onConfirm()
}

function cancel() {
	if (props.showCancel || props.closeable) {
		closeModal()
		if (typeof props.onCancel == 'function') props.onCancel()
	}
}

const modal = ref(null)
const modalWidth = props.width ? props.width : props.image ? 'image-preview' : 'narrow'
let focusedEl = null

function afterEnter() {
	focusedEl = document.activeElement
	modal.value.focus({ preventScroll: true })
}

function beforeLeave() {
	if (focusedEl && document.documentElement.contains(focusedEl)) focusedEl.focus({ preventScroll: true })
}
</script>

<template>
	<teleport to="body">
        <Transition name="modal" appear @after-enter="afterEnter" @before-leave="beforeLeave" @after-leave="afterLeave">
			<div v-if="open" class="modal-backdrop" @click.self="cancel">
				<div ref="modal" class="card modal-card centered" :class="[`card-${modalWidth}`]" tabindex="-1" @keyup.enter="confirm" @keyup.esc="cancel">
					<div v-if="!image" class="card-body">
						<div class="modal-dialog-icon">
							<Icon :name="`${type}-animated`" />
						</div>
						<h3 class="modal-dialog-title">{{ title }}</h3>
						<div v-if="message" class="line modal-dialog-text" v-html="message"></div>
						<div class="modal-dialog-buttons flex" :class="[message ? 'line-bigger' : 'line']">
							<Button class="modal-dialog-button" v-if="showCancel" :color="cancelColor" :outline="cancelOutline" @click.prevent="cancel">{{ cancelText }}</Button>
							<Button class="modal-dialog-button" :color="confirmColor" @click.prevent="confirm">{{ confirmText }}</Button>
						</div>
					</div>
					<template v-else>
						<img class="modal-image-preview-img" :src="image" alt="" />
						<div v-if="title" class="modal-image-preview-info flex ai-c">
							<span class="modal-image-preview-title">{{ title }}</span>
							<IcoButton icon="external-link" title="Open in new tab" target="_blank" :href="image" />
						</div>
					</template>
					<IcoButton v-if="closeable" class="modal-bttn" icon="x" title="Close" @click.prevent="cancel" />
				</div>
			</div>
		</Transition>
	</teleport>
</template>