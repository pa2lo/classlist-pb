<script>
import PocketBase from 'pocketbase'
import { pbUrl } from '../utils/helpers'

import Card from '../components/Card.vue'
import IcoButton from '../components/IcoButton.vue'
import PostInfo from '../components/PostInfo.vue'
import TextContent from '../components/TextContent.vue'

// use normal <script> to declare options
export default {
	components: { Card, IcoButton, PostInfo, TextContent },
	props: {
		isLoggedIn: Boolean
	},
	data() {
		return {
			slug: this.$route.params?.slug,
			post: this.$route.params?.postdata,
			prevRoute: null,
			destroyComp: []
		}
	},
	methods: {
		goBack: function() {
			if (this.prevRoute?.name == 'home') this.$router.back()
			else this.$router.push('/')
		}
	},
	beforeRouteEnter: (to, from, next) => {
		const pb = new PocketBase(pbUrl)
		pb.collection('posts').getFirstListItem(`slug = '${to.params.slug}'`).then(data => {
			if (data?.id) {
				to.params.postdata = data
				next(vm => { vm.prevRoute = from })
			} else next('/404')
		}).catch(err => {
			pb.collection('posts_collection').getFirstListItem(`slug='${to.params.slug}'`).then(d => {
				if (d?.id) {
					history.state.returnTo = to.path
					next('/login')
				} else next('/404')
			}).catch(err => {
				next('/404')
			})
		})
	}
}
</script>

<template>
	<div class="post">
		<div class="page-header flex ai-c">
			<IcoButton outline icon="left" title="Back to home" @click.prevent="goBack" />
			<h1 class="page-header-title">{{ post.name }} <span v-if="post?.visibility == 'private'" class="bedge bedge-secondary">Private</span></h1>
			<IcoButton v-if="isLoggedIn" title="Edit" outline icon="edit" :href="{name: 'editpost', params: { id: post.id }, state: { backLink: this.$route.path }}" />
		</div>
		<p class="header-note">Last update - {{ new Date(post.updated).toLocaleString() }}</p>
		<div class="section">
			<Card width="full">
				<p v-if="post.description">{{ post.description }}</p>
				<TextContent v-if="post.text" :html="post.text" />
				<PostInfo redirect :post="post" />
			</Card>
		</div>
	</div>
</template>