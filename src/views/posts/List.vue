<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { usePocketBase } from '../../composables/usePocketBase'

import { themesMap, filterHelper, getCollection } from '../../utils/helpers'
import { toast } from '../../utils/toaster'
import { dialog } from '../../utils/dialog'
import { postsStore } from '../../utils/searchState'

import DashboardPage from '../../layouts/DashboardPage.vue'
import Button from '../../components/Button.vue'
import ListItem from '../../components/ListItem.vue'
import ListFilter from '../../components/ListFilter.vue'

const pb = usePocketBase()

const posts = postsStore
const loading = ref(posts.value ? false : true)
const filter = ref({
	search: '',
	template: '',
	type: '',
	visibility: ''
})

onMounted(async () => {
	await getCollection(pb, 'posts', (list) => {
		loading.value = false
		posts.value = list
	})

	pb.collection('posts').subscribe('*', function (e) {
		let index = posts.value.findIndex(c => c.id == e.record.id)
		if (index == -1 && e.action != 'create') return

		let res = subscribeActions[e.action]?.(e.record, index)
		if (res && !deletingId.value) toast.info(`List updated.`)
	})
})

const subscribeActions = {
	create: (item, index) => {
		posts.value.unshift(item)
		return true
	},
	delete: (item, index) => {
		posts.value.splice(index, 1)
		return true
	},
	update: (item, index) => {
		if (posts.value[index] == item) return false
		posts.value[index] = item
		return true
	}
}

onBeforeUnmount(() => {
	pb.collection('posts').unsubscribe('*')
})

const filteredPosts = computed(() => filterHelper(posts.value, filter.value))

/* delete post */
const deletingId = ref(null)

function deletePost(item) {
	dialog.delete('Delete post', `Are you sure you want to delete post <strong>${item.name}</strong>?`, {
		onConfirm: async () => {
			deletingId.value = item.id

			try {
				await pb.collection('posts').delete(item.id)
				toast.success('Post deleted successfully')

				const index = posts.value.findIndex(c => c.id == item.id)
				if (index > -1) posts.value.splice(index, 1)
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

let migrating = ref(false)
async function migrate() {
	let classesToUpdate = posts.value.filter(c => c.theme && !c.template.includes(c.theme))
	if (!classesToUpdate.length || migrating.value) return

	migrating.value = true

	let updated = 0

	for (const record of classesToUpdate) {
		deletingId.value = record.id

		try {
			await pb.collection('posts').update(record.id, {
				name: record.name,
				slug: record.slug,
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
	<DashboardPage header="Posts" :loading="loading">
		<div v-if="posts.some(c => c.theme && !c.template.includes(c.theme))" class="line-alert line-warning flex ai-c">
			<span><strong>Migration required</strong> - fill template column from theme column in all records</span>
			<Button class="ml-a" size="lower" :loading="migrating" @click.prevent="migrate">Migrate</Button>
		</div>
		<div v-if="posts?.length" class="classes-outer line-bigger">
			<ListFilter full v-model:search="filter.search" v-model:template="filter.template" v-model:type="filter.type" v-model:visibility="filter.visibility">
				<Button href="/dashboard/posts/create" class="ml-a">Add new post</Button>
			</ListFilter>
			<div class="line-bigger">
				<h4 v-if="!filteredPosts.length">No results</h4>
				<div v-else class="classes-items">
					<ListItem
						v-for="c in filteredPosts"
						removable
						:loading="deletingId == c.id"
						:name="c.name"
						:description="c.description"
						@click.prevent="() => $router.push({name: 'editpost', params: {id: c.id}})"
						@delete="() => deletePost(c)"
						:private="c?.visibility == 'private'"
						:externalLink="`/post/${c?.slug}`"
					>
						<span v-for="t in c.template" class="bedge" :class="[`bedge-${t}`]">
							{{ themesMap[t] }}
						</span>
					</ListItem>
					<p class="ta-r"><strong>{{ filteredPosts.length }}</strong> records</p>
				</div>
			</div>
		</div>
		<div v-else>
			<h3>You have no posts yet.</h3>
			<p><Button href="/dashboard/posts/create">Add new post</Button></p>
		</div>
	</DashboardPage>
</template>