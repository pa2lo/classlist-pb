<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePocketBase } from '../../composables/usePocketBase'

import { themeOptions, typeOptions, blockOptions, slugify, visibilityOptions, mapErrors } from '../../utils/helpers'
import { toast } from '../../utils/toaster'
import { dialog } from '../../utils/dialog'

import DashboardPage from '../../layouts/DashboardPage.vue'
import Button from '../../components/Button.vue'
import TextInput from '../../components/TextInput.vue'
import TextEditor from '../../components/TextEditor.vue'
import MultiSelect from '../../components/MultiSelect.vue'
import RadioButtonGroup from '../../components/RadioButtonGroup.vue'
import Card from '../../components/Card.vue'

const props = defineProps({
	post: Object
})

const backLink = history.state?.backLink || '/dashboard/posts'
const isEditForm = props.post?.id || false

const pb = usePocketBase()
const router = useRouter()

const postForm = ref({
	updated: props.post?.updated || null,
	data: {
		name: props.post?.name ?? '',
		description: props.post?.description ?? '',
		slug: props.post?.slug ?? '',
		text: props.post?.text ?? '',
		template: props.post?.template ?? [],
		type: props.post?.type ?? [],
		block: props.post?.block ?? [],
		visibility: props.post?.visibility ?? 'public'
	},
	errors: {},
	processing: false,
	deleting: false
})

async function submitPost(e, goBack = true) {
	postForm.value.errors = {}
	postForm.value.processing = true

	if (!postForm.value.data.type.includes('block')) postForm.value.data.block = []

	try {
		let response
		if ( isEditForm ) response =  await pb.collection('posts').update(props.post.id, postForm.value.data)
		else response = await pb.collection('posts').create(postForm.value.data)

		toast.success(`Post ${isEditForm ? `"${props.post.name}" edited` : `"${postForm.value.data.name}" created`}`)
		if (goBack) router.push(backLink)
		else if ( !isEditForm && response.id ) router.push({name: 'editpost', params: { id: response.id }})
	} catch (error) {
		mapErrors(postForm, error)

		toast.error(`Failed to ${isEditForm ? 'edit' : 'create'} post`, {
			message: error?.message
		})
	}

	setTimeout(() => {
		postForm.value.processing = false
	}, 100)
}

function deletePost() {
	dialog.delete('Delete post', `Are you sure you want to delete post <strong>${props.post.name}</strong>?`, {
		onConfirm: async () => {
			postForm.value.deleting = true

			try {
				await pb.collection('posts').delete(props.post.id)

				toast.success(`Post "${props.post.name}" deleted`)
				router.push({name: 'posts'})
			} catch (error) {
				toast.error('Failed to delete post', {
					message: error?.message
				})
			}

			setTimeout(() => {
				postForm.value.deleting = false
			}, 100)
		}
	})
}

let slugChanged = isEditForm ? true : false
function setSlug() {
	if (slugChanged || !postForm.value.data.name) return

	postForm.value.data.slug = slugify(postForm.value.data.name)
}
function onSlugBlur() {
	if (postForm.value.data.slug) {
		slugChanged = true
		postForm.value.data.slug = slugify(postForm.value.data.slug)
	} else {
		slugChanged = false
		setSlug()
	}
}

onMounted(() => {
	if (isEditForm && props.post.id) pb.collection('posts').subscribe(props.post.id, function(e) {
		if (postForm.value.processing || postForm.value.deleting) return
		if (e.action == 'delete') dialog.warning('Post deleted', 'Post was deleted by another user', {
			closeable: false,
			onConfirm: () => router.push(backLink)
		})
		if (e.action == 'update') dialog.confirm('Update post', 'Post you are editing was already updated by another user. Do you want to reload data?', {
			onConfirm: () => {
				postForm.value.updated = e.record.updated
				postForm.value.data = {
					name: e.record?.name ?? '',
					description: e.record?.description ?? '',
					slug: e.record?.slug ?? '',
					text: e.record?.text ?? '',
					template: e.record?.template ?? [],
					type: e.record?.type ?? [],
					block: e.record?.block ?? [],
					visibility: e.record?.visibility ?? 'public'
				}
			}
		})
	})
})
onBeforeUnmount(() => {
	if (isEditForm && props.post.id) pb.collection('posts').unsubscribe(props.post.id)
})
</script>

<template>
	<DashboardPage :header="isEditForm ? `Edit post - ${post?.name}` : 'New post'" :headerNote="isEditForm ? `Last update - ${new Date(postForm.updated).toLocaleString()}` : null" :backLink="backLink" :openLink="isEditForm ? `/post/${post?.slug}` : null">
		<Card width="full" as="form" @submit.prevent="submitPost">
			<div class="inputs-grid">
				<TextInput autofocus label="Name" placeholder="Your post" v-model="postForm.data.name" :error="postForm.errors.name" required @blur="setSlug" />
				<TextInput label="Slug" placeholder="post-url" v-model="postForm.data.slug" :error="postForm.errors.slug" required @blur="onSlugBlur" />
				<RadioButtonGroup label="Visibility" :options="visibilityOptions" v-model="postForm.data.visibility" :error="postForm.errors.visibility" required />
				<MultiSelect label="Template" :options="themeOptions" v-model="postForm.data.template" :error="postForm.errors.template" required />
				<MultiSelect label="Type" :options="typeOptions" v-model="postForm.data.type" :error="postForm.errors.type" required />
				<MultiSelect searchable label="Block" :options="blockOptions" v-model="postForm.data.block" :disabled="!postForm.data.type.includes('block')" :error="postForm.errors.block" />
				<TextInput full label="Description" placeholder="sets view of..." v-model="postForm.data.description" :error="postForm.errors.description" required />
				<TextEditor height="55vh" label="Text" v-model="postForm.data.text" :error="postForm.errors.text" required />
			</div>
			<template #footer>
				<Button v-if="isEditForm" color="secondary" outline :loading="postForm.deleting" :disabled="postForm.processing" @click.prevent="deletePost">Delete</Button>
				<Button @click.prevent="() => submitPost(null, false)" :loading="postForm.processing" :disabled="postForm.deleting">Save post</Button>
				<Button type="submit" :loading="postForm.processing" :disabled="postForm.deleting">Save post & return</Button>
			</template>
		</Card>
	</DashboardPage>
</template>