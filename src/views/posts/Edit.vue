<script>
import PocketBase from 'pocketbase'
import { pbUrl } from '../../utils/helpers'

import Form from './Form.vue'

// use normal <script> to declare options
export default {
	components: {Form},
	beforeRouteEnter: (to, from, next) => {
		new PocketBase(pbUrl).collection('posts').getOne(to.params.id).then(data => {
			to.params.postdata = data
			next()
		}).catch(err => {
			next('/404')
		})
	}
}
</script>

<template>
	<Form :post="$route.params.postdata" />
</template>