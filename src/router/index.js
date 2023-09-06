import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layouts/BaseLayout.vue'
import Home from '../views/Home.vue'
import { usePocketBase } from '../composables/usePocketBase'

const pb = usePocketBase()

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: BaseLayout,
			children: [
				{
					path: '',
					name: 'home',
					component: Home
				}, {
					path: 'post',
					redirect: '/',
					children: [{
						path: ':slug',
						name: 'post',
						component: () => import('../views/Post.vue')
					}]
				}
			]
		},
		{
			path: '/login',
			name: 'login',
			meta: {
				requiresGuest: true,
				title: 'Login'
			},
			component: () => import('../views/Login.vue')
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			redirect: '/dashboard/classes',
			meta: {
				requiresAuth: true,
				title: 'Dashboard'
			},
			component: () => import('../layouts/DashboardLayout.vue'),
			children: [
				{
					path: 'classes',
					name: 'classes',
					meta: {
						title: 'Classes'
					},
					component: () => import('../views/Classes.vue')
				}, {
					path: 'users',
					name: 'users',
					meta: {
						title: 'Users'
					},
					component: () => import('../views/Users.vue')
				}, {
					path: 'posts',
					children: [{
						path: '',
						name: 'posts',
						meta: {
							title: 'Posts'
						},
						component: () => import('../views/posts/List.vue')
					}, {
						path: 'create',
						name: 'createpost',
						meta: {
							title: 'New post'
						},
						component: () => import('../views/posts/Form.vue')
					}, {
						path: ':id',
						name: 'editpost',
						meta: {
							title: 'Edit post'
						},
						component: () => import('../views/posts/Edit.vue')
					}]
				}
			]
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('../views/NotFound.vue')
		}
	],
	async scrollBehavior(to, from, savedPosition) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(savedPosition ? savedPosition : { top: 0 })
			}, 175)
		})
	}
})

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth && !pb.authStore.isValid) {
		if (to.name && (to.name != 'login') && to.path) history.state.returnTo = to.path
		router.replace('/login')
	} else if (to.meta.requiresGuest && pb.authStore.isValid) {
		router.replace('/dashboard')
	} else {
		document.title = `${to.meta?.title ? `${to.meta.title} - ` : ''} ClassList`
		next()
	}
})

export default router