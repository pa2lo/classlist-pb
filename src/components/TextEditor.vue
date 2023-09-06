<script setup>
import { computed } from 'vue'
import { getUUID, getImageURL } from '../utils/helpers'
import { usePocketBase } from '../composables/usePocketBase'

import Editor from '@tinymce/tinymce-vue'
import InputWrapper from './InputWrapper.vue'

const pb = usePocketBase()

const props = defineProps({
	id: String,
	label: String,
	name: String,
	error: String,
	height: String,
	autofocus: Boolean,
	required: Boolean,
	disabled: Boolean,
	modelValue: String
})

const inputID = props.id || getUUID('input')

const emit = defineEmits(['update:modelValue'])

const proxyText = computed({
	get() {
		return props.modelValue;
	},

	set(val) {
		emit('update:modelValue', val);
	},
})

function imageUploadHandler(blobInfo, progress) {
	return new Promise((resolve, reject) => {
		const blob = blobInfo.blob()

		if (blob.size > 5242880) reject('Maximum file size is 5MB')

		const form = new FormData()
		form.append('file', blob)
		pb.collection('text_files').create(form).then(res => {
			resolve(getImageURL(res.collectionName, res.id, res.file))
		}).catch(err => {
			reject(err?.message || 'Upload failed')
		})
	})
}
</script>

<template>
	<InputWrapper type="editor" :label="label" :error="error" :full="true" :style="[height ? `--editor-height: ${height}` : '']">
		<Editor
			:id="inputID"
			:name="name"
			:init="{
				height: height || null,
				menubar: false,
				plugins: 'lists code advlist link image fullscreen media autolink table accordion',
				toolbar: 'undo redo | bold italic underline forecolor | link image media | alignleft aligncenter alignright alignjustify | accordion styles | fontsize | table hr | bullist numlist | fullscreen code',
				toolbar_mode: 'sliding',
				font_size_formats: '0.75em 0.875em 1em 1.125em 1.25em',
				image_caption: true,
				image_title: true,
				entity_encoding: 'raw',
				image_class_list: [
    				{title: 'None', value: ''},
    				{title: 'Plain', value: 'img_plain'},
    				{title: 'Border', value: 'img_border'},
    				{title: 'Shadow', value: 'img_shadow'}
				],
				style_formats: [
					{ title: 'Paragraph', block: 'p' },
					{ title: 'Heading' },
					{ title: 'Heading 2', format: 'h2' },
					{ title: 'Heading 3', format: 'h3' },
					{ title: 'Heading 4', format: 'h4' },
					{ title: 'Heading 5', format: 'h5' },
					{ title: 'Blocks' },
					{ title: 'Blockquote', format: 'blockquote' },
					{ title: 'Code', format: 'pre' },
					{ title: 'Warning', block: 'div', wrapper: true, exact: true, attributes: {'class': 'line line-alert line-warning'} },
					{ title: 'Info', block: 'div', wrapper: true, exact: true, attributes: {'class': 'line line-alert line-info'} },
					{ title: 'Success', block: 'div', wrapper: true, exact: true, attributes: {'class': 'line line-alert line-success'} }
				],
				link_class_list: [
					{title: 'None', value: ''},
					{title: 'Copyable text', value: 'copyable-text'},
					{title: 'Button', menu: [
						{title: 'Button primary', value: 'button button-primary'},
						{title: 'Button primary outline', value: 'button button-primary button-outline'},
						{title: 'Button secondary', value: 'button button-secondary'},
						{title: 'Button secondary outline', value: 'button button-secondary button-outline'},
						{title: 'Button dark', value: 'button button-heading'},
						{title: 'Button dark outline', value: 'button button-heading button-outline'}
					]}
				],
				content_css: '/libs/editor.css',
				end_container_on_empty_block: true,
				link_context_toolbar: true,
				images_upload_handler: imageUploadHandler
			}"
			v-model="proxyText"
			:disabled="disabled"
			tinymce-script-src="/libs/tinymce/tinymce.min.js"
		/>
		<input v-if="required" type="text" required :name="`rq-${name || inputID}`" :value="modelValue.length ? 'y' : ''" class="multi-select-fake-required" />
		<template v-if="$slots.default" #note><slot></slot></template>
	</InputWrapper>
</template>