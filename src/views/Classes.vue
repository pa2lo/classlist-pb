<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { usePocketBase } from '../composables/usePocketBase'

import { themeOptions, themesMap, blockOptions, typeOptions, visibilityOptions, filterHelper, getCollection, mapErrors, getImageURL } from '../utils/helpers'
import { toast } from '../utils/toaster'
import { dialog } from '../utils/dialog'
import { classesStore } from '../utils/searchState'

import DashboardPage from '../layouts/DashboardPage.vue'
import Button from '../components/Button.vue'
import Modal from '../components/Modal.vue'
import TextInput from '../components/TextInput.vue'
import MultiSelect from '../components/MultiSelect.vue'
import TextEditor from '../components/TextEditor.vue'
import FileInput from '../components/FileInput.vue'
import ListItem from '../components/ListItem.vue'
import ListFilter from '../components/ListFilter.vue'
import RadioButtonGroup from '../components/RadioButtonGroup.vue'

const pb = usePocketBase()

const classes = classesStore
const loading = ref(classes.value ? false : true)
const filter = ref({
	search: '',
	template: '',
	type: '',
	visibility: ''
})

onMounted(async () => {
	await getCollection(pb, 'classes', (list) => {
		loading.value = false
		classes.value = list
	})

	pb.collection('classes').subscribe('*', function (e) {
		let index = classes.value.findIndex(c => c.id == e.record.id)
		if (index == -1 && e.action != 'create') return

		let res = subscribeActions[e.action]?.(e.record, index)
		if (res && !classForm.value.processing && !deletingId.value) toast.info(`List updated.`)
	})
})

const subscribeActions = {
	create: (item, index) => {
		classes.value.unshift(item)
		return true
	},
	delete: (item, index) => {
		if (!deletingId.value && modalOpen.value && classForm.value.data.id == item.id) {
			modalOpen.value = false
			dialog.warning('Item deleted', 'Item, you was editing, was already deleted by another user')
		}
		classes.value.splice(index, 1)
		return true
	},
	update: (item, index) => {
		if (!classForm.value.processing && modalOpen.value && classForm.value.data.id == item.id) {
			dialog.confirm('Update entry', 'Item you are editing was already updated by another user. Do you want to reload data?', {
					onConfirm: () => {
						if (classes.value[index] == item) return false
						classes.value[index] = item
						showEditForm(item)
						toast.success(`Item updated.`)
					}
				}
			)
		} else {
			if (classes.value[index] == item) return false
			classes.value[index] = item
			return true
		}
	}
}

onBeforeUnmount(() => {
	pb.collection('classes').unsubscribe('*')
})

const filteredClasses = computed(() => filterHelper(classes.value, filter.value))

// add / edit modal
const modalOpen = ref(false)
let classForm = ref({})
const deletingId = ref(null)

function openNewForm() {
	classForm.value = {
		type: 'add',
		image: null,
		data: Object.assign({}, {
			name: '',
			description: '',
			template: [],
			type: [],
			block: [],
			text: '',
			image: '',
			visibility: 'public'
		}),
		errors: {}
	}
	modalOpen.value = true
}

function showEditForm(item) {
	if (item.id == deletingId.value) return

	classForm.value = {
		type: 'edit',
		id: item.id,
		originalName: item.name,
		updated: item.updated,
		image: null,
		data: Object.assign({}, item),
		errors: {}
	}
	modalOpen.value = true
}

function submitClassForm() {
	classForm.value.errors = {}

	const form = new FormData()
	form.append('name', classForm.value.data.name)
	form.append('description', classForm.value.data.description)
	form.append('text', classForm.value.data.text)
	form.append('visibility', classForm.value.data.visibility)
	classForm.value.data.template.forEach(t => {
		form.append('template', t)
	})
	classForm.value.data.type.forEach(t => {
		form.append('type', t)
	})
	if (classForm.value.data.type.includes('block')) {
		classForm.value.data.block.forEach(t => {
			form.append('block', t)
		})
	} else {
		form.append('block', '')
	}

	if (classForm.value.imageChanged) form.append('image', classForm.value.image)

	classForm.value.processing = true
	classForm.value.type == 'add' ? submitNewClass(form) : submitEditClass(form)
}

async function submitNewClass(form) {
	try {
		const record = await pb.collection('classes').create(form)

		// classes.value.unshift(record)
		modalOpen.value = false
		toast.success(`Class "${form.get('name')}" created`)
	} catch (error) {
		handleErrors('Failed to create class', error)
	}

	setTimeout(() => {
		classForm.value.processing = false
	}, 100)
}

async function submitEditClass(form) {
	try {
		const record = await pb.collection('classes').update(classForm.value.id, form)

		// const index = classes.value.findIndex(c => c.id == classForm.value.id)
		// if (index > -1) classes.value[index] = record
		modalOpen.value = false
		toast.success(`Class "${classForm.value.originalName}" updated`)
	} catch (error) {
		handleErrors('Failed to update class', error)
	}

	setTimeout(() => {
		classForm.value.processing = false
	}, 100)
}

function handleErrors(text, error) {
	mapErrors(classForm, error)

	toast.error(text, {
		message: error?.message
	})
}

function deleteClass(item, inModal) {
	dialog.delete('Delete class', `Are you sure you want to delete class <strong>${item.name}</strong>?`, {
		onConfirm: async () => {
			deletingId.value = item.id

			try {
				await pb.collection('classes').delete(item.id)

				toast.success('Class deleted successfully')

				// const index = classes.value.findIndex(c => c.id == item.id)
				// if (index > -1) classes.value.splice(index, 1)

				if (inModal) modalOpen.value = false
			} catch (error) {
				toast.error('Delete error', {
					message: error?.message
				})
			}

			setTimeout(() => {
				deletingId.value = null
			}, 100)
		}
	})
}

function setImage(file) {
	if (!classForm.value.imageChanged) classForm.value.imageChanged = true
	classForm.value.image = file
}

function getImage(image) {
	return getImageURL(classForm.value.data?.collectionName, classForm.value.data?.id, image)
}
function getImagePreview(image) {
	return getImageURL(classForm.value.data?.collectionName, classForm.value.data?.id, image, '100x100')
}

let migrating = ref(false)
async function migrate() {
	let classesToUpdate = classes.value.filter(c => c.theme && !c.template.includes(c.theme))
	if (!classesToUpdate.length || migrating.value) return

	migrating.value = true

	let updated = 0

	for (const record of classesToUpdate) {
		deletingId.value = record.id

		try {
			await pb.collection('classes').update(record.id, {
				name: record.name,
				template: [record.theme],
				type: record.type
			})

			updated++
		} catch (error) {
			console.log(error)
		}
	}

	if (updated == classesToUpdate.length) toast.success('Migration finished')
	else toast.warning('Migration finished with errors')

	migrating.value = false
	deletingId.value = null
}
</script>

<template>
	<DashboardPage header="Class list" :loading="loading">
		<div v-if="classes.some(c => c.theme && !c.template.includes(c.theme))" class="line-alert line-warning flex ai-c">
			<span><strong>Migration required</strong> - fill template column from theme column in all records</span>
			<Button class="ml-a" size="lower" :loading="migrating" @click.prevent="migrate">Migrate</Button>
		</div>
		<div v-if="classes?.length" class="classes-outer line-bigger">
			<ListFilter full v-model:search="filter.search" v-model:template="filter.template" v-model:type="filter.type" v-model:visibility="filter.visibility">
				<Button class="ml-a" @click.prevent="openNewForm">Add new class</Button>
			</ListFilter>
			<div class="line-bigger">
				<h4 v-if="!filteredClasses.length">No results</h4>
				<div v-else class="classes-items">
					<ListItem
						v-for="c in filteredClasses"
						:private="c?.visibility == 'private'"
						:name="c.name"
						:description="c.description"
						removable
						:loading="deletingId == c.id"
						@click.prevent="() => showEditForm(c)"
						@delete="() => deleteClass(c)"
					>
						<span v-for="t in c.template" class="bedge" :class="[`bedge-${t}`]">
							{{ themesMap[t] }}
						</span>
					</ListItem>
					<p class="ta-r"><strong>{{ filteredClasses.length }}</strong> records</p>
				</div>
			</div>
		</div>
		<div v-else>
			<h3>You have no classes yet.</h3>
			<p><Button @click.prevent="openNewForm">Add new class</Button></p>
		</div>
		<Modal v-model:open="modalOpen" as="form" :closeable="classForm.processing || deletingId ? false : true" :header="classForm?.type == 'add' ? 'Add new class' : `Edit class ${classForm.originalName}`" :headerNote="classForm?.type == 'edit' ? `Last update - ${new Date(classForm.updated).toLocaleString()}` : ''" @submit.prevent="submitClassForm">
			<div class="inputs-grid">
				<TextInput label="Name" placeholder="newClass" v-model="classForm.data.name" :error="classForm.errors.name" required />
				<MultiSelect required label="Template" :options="themeOptions" v-model="classForm.data.template" :error="classForm.errors.template" />
				<MultiSelect required label="Type" :options="typeOptions" v-model="classForm.data.type" :error="classForm.errors.type" />
				<MultiSelect searchable label="Block" :options="blockOptions" v-model="classForm.data.block" :disabled="!classForm.data.type.includes('block')" :error="classForm.errors.block" />
				<FileInput :maxSize='5242880' label="Image" accept="image/*" :fileName="classForm.data.image" :previewImage="getImagePreview(classForm.data.image)" :fileUrl="getImage(classForm.data.image)" @setFile="setImage" :error="classForm.errors.image" />
				<RadioButtonGroup required label="Visibility" :options="visibilityOptions" v-model="classForm.data.visibility" :error="classForm.errors.visibility" />
				<TextInput full label="Description" placeholder="sets view of..." v-model="classForm.data.description" :error="classForm.errors.description" />
				<TextEditor label="Text" v-model="classForm.data.text" :error="classForm.errors.text" />
			</div>
			<template #footer>
				<Button v-if="classForm?.type == 'edit'" color="secondary" outline :disabled="classForm.processing" :loading="deletingId == classForm.data.id" @click.prevent="() => deleteClass(classForm.data, true)">Delete</Button>
				<Button type="submit" :loading="classForm.processing" :disabled="(classForm?.type == 'edit') && (deletingId == classForm.data.id)">Save class</Button>
			</template>
		</Modal>
	</DashboardPage>
</template>