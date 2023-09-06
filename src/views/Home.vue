<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePocketBase } from '../composables/usePocketBase'

import { themesMap, filterHelper, getImageURL } from '../utils/helpers'
import { searchState, classesStore, postsStore } from '../utils/searchState'

import Modal from '../components/Modal.vue'
import ListItem from '../components/ListItem.vue'
import ListFilter from '../components/ListFilter.vue'
import CopyableIcoButton from '../components/CopyableIcoButton.vue'
import Button from '../components/Button.vue'
import PostInfo from '../components/PostInfo.vue'
import IcoButton from '../components/IcoButton.vue'
import TextContent from '../components/TextContent.vue'

const props = defineProps({
	isLoggedIn: Boolean
})

const pb = usePocketBase()

const classList = classesStore
const postsList = postsStore
const loading = ref(classList.value && postsList.value ? false : true)
const modalOpen = ref(false)
const modalData = ref(null)

if (props.isLoggedIn) searchState.value.visibility = ''

onMounted(async () => {
	try {
		if (history.state.setFilter) {
			setFilter(history.state.setFilter)
			history.state.setFilter = null
		}

		const [ classes, posts ] = await Promise.all([
			pb.collection('classes').getFullList({
				sort: '-created'
			}),
			pb.collection('posts').getFullList({
				sort: '-created'
			})
		])

		classList.value = classes
		postsList.value = posts

		loading.value = false
	} catch (error) {
		console.log(error)
	}
})

function setFilter(filter) {
	searchState.value = {
		search: '',
		block: filter.block || '',
		type: filter.type || '',
		theme: filter.theme || '',
		visibility: props.isLoggedIn ? filter.visibility || '' : null
	}
	if (modalOpen.value) modalOpen.value = false
}

const filteredClasses = computed(() => filterHelper(classList.value, searchState.value))
const filteredPosts = computed(() => filterHelper(postsList.value, searchState.value))

function showClass(data) {
	modalData.value = data
	modalOpen.value = true
}

const classesCollapsed = ref(false)
const postsCollapsed = ref(false)
</script>

<template>
	<h2 v-if="loading" class="header-loading"></h2>
	<div v-else>
		<ListFilter full v-model:search="searchState.search" v-model:theme="searchState.theme" v-model:type="searchState.type" v-model:block="searchState.block" v-model:visibility="searchState.visibility" />
		<div class="line-bigger">
			<h4 v-if="!filteredClasses.length && !filteredPosts.length">No results</h4>
			<div v-else>
				<div v-if="filteredClasses.length" class="line-bigger section-items" :class="{'section-items-collapsed': classesCollapsed}">
					<div class="section-title-line flex ai-c">
						<h2 class="likeH4 section-title">Classes</h2>
						<span class="bedge">{{ filteredClasses.length }}</span>
						<IcoButton icon="up" @click.prevent="classesCollapsed = !classesCollapsed" />
					</div>
					<div class="classes-items line">
						<ListItem
							v-for="c in filteredClasses"
							copyable
							:name="c.name"
							:description="c.description"
							@click.prevent="() => showClass(c)"
							:private="c?.visibility == 'private'"
						>
							<span v-if="c.theme" class="bedge" :class="[`bedge-${c.theme}`]">
								{{ themesMap[c.theme] }}
							</span>
						</ListItem>
					</div>
				</div>
				<div v-if="filteredPosts.length" class="line-bigger section-items" :class="{'section-items-collapsed': postsCollapsed}">
					<div class="section-title-line flex ai-c">
						<h2 class="likeH4 section-title">Posts</h2>
						<span class="bedge">{{ filteredPosts.length }}</span>
						<IcoButton icon="up" @click.prevent="postsCollapsed = !postsCollapsed" />
					</div>
					<div class="classes-items line">
						<ListItem
							v-for="c in filteredPosts"
							:name="c.name"
							:description="c.description"
							@click.prevent="() => $router.push({name: 'post', params: { slug: c.slug }})"
							:private="c?.visibility == 'private'"
						>
							<span v-if="c.theme" class="bedge" :class="[`bedge-${c.theme}`]">
								{{ themesMap[c.theme] }}
							</span>
						</ListItem>
					</div>
				</div>
			</div>
		</div>
		<Modal v-model:open="modalOpen" closeable>
			<template #header>
				<div class="class-info-header flex ai-c">
					<CopyableIcoButton class="class-info-copy" :text="modalData?.name" />
					<h4 class="modal-header-title">{{ modalData?.name }}</h4>
				</div>
			</template>
			<p v-if="modalData?.description">{{ modalData?.description }}</p>
			<p v-if="modalData?.image">
				<img :src="getImageURL(modalData.collectionName, modalData.id, modalData.image)" class="img_shadow" />
			</p>
			<TextContent v-if="modalData?.text" :html="modalData.text" />
			<PostInfo :post="modalData" @filter="setFilter" />
			<template #footer>
				<Button @click.prevent="modalOpen = false">Close</Button>
			</template>
		</Modal>
	</div>
</template>