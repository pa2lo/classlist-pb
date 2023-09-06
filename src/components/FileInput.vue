<script setup>
import { ref } from 'vue'
import { getUUID } from '../utils/helpers'
import { toast } from '../utils/toaster'
import { dialog } from '../utils/dialog'

import InputWrapper from './InputWrapper.vue'

const props = defineProps({
	id: String,
	label: String,
	name: String,
	error: String,
	disabled: Boolean,
	required: Boolean,
	clearable: Boolean,
	fileName: String,
	fileUrl: String,
	previewImage: String,
	full: Boolean,
	maxSize: Number,
	placeholder: {
		type: String,
		default: 'Choose file'
	},
	accept: {
		type: String,
		default: ''
	}
})

const isImage = props.accept == 'image/*'
const previewFileName = ref(props.fileName)
const previewFileUrl = ref(props.fileUrl)
const previewFileImage = ref(props.previewImage)

const inputID = props.id || getUUID('input')

const inputEl = ref(null)

const emit = defineEmits(['setFile'])

function onFileChange(e) {
	const [file] = e.target.files

	if (props.maxSize && (file.size > props.maxSize)) {
		e.preventDefault()
		toast.warning(`File not uploaded`, {
			message: `Maximum file size is ${Math.round(props.maxSize / 1000000)}MB`
		})
		return
	}

	if (file) {
		previewFileUrl.value = URL.createObjectURL(file)
		if (isImage) previewFileImage.value = URL.createObjectURL(file)
		previewFileName.value = file.name
		emit('setFile', file)
	}
}

function handlePlaceholderClick() {
	if (inputEl.value) inputEl.value.click()
}

function showImagePreview() {
	dialog.image(previewFileUrl, previewFileName)
}
</script>

<template>
	<InputWrapper type="file" :label="label" :error="error" :full="full">
		<input ref="inputEl" class="input-file-invisible" :id="inputID" :name="name" type="file" :disabled="disabled" @change="onFileChange" :accept="accept" />
		<div class="input input-file" :class="{'input-disabled': disabled}">
			<a v-if="previewFileName" :href="previewFileUrl" target="_blank" class="file-preview flex ai-c">
				<img v-if="isImage && previewFileImage" :src="previewFileImage" class="file-preview-img" title="Preview" alt="" @click.prevent="showImagePreview" />
				<span class="file-preview-name">{{ previewFileName }}</span>
			</a>
			<button type="button" class="button button-heading button-lower file-placeholder-button" @click.prevent="handlePlaceholderClick">
				<span class="file-placeholder-text">{{ placeholder }}</span>
			</button>
		</div>
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>