<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePocketBase } from '../composables/usePocketBase'

import Button from '../components/Button.vue'
import Dialogs from '../components/Dialogs.vue'
import Logo from '../components/Logo.vue'

const pb = usePocketBase()
const router = useRouter()

function logout() {
	pb.authStore.clear()
	router.replace('/login')
}

const menuOpen = ref(false)
</script>

<template>
	<div>

		<header class="header flex ai-c">
			<Logo />
			<button class="header-menu-toggle header-link ml-a" @click.prevent="menuOpen = !menuOpen" :class="{'menu-open': menuOpen}">
				<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" >
					<path d="M4 6l16 0"></path>
					<path d="M4 12l16 0"></path>
					<path d="M4 18l16 0"></path>
				</svg>
			</button>
			<div class="header-nav stretch flex ai-c ml-a" :class="{'nav-open': menuOpen}">
				<nav class="header-nav-links stretch">
					<RouterLink to="/">Home</RouterLink>
					<RouterLink to="/dashboard/classes">Classes</RouterLink>
					<RouterLink to="/dashboard/posts">Posts</RouterLink>
					<RouterLink to="/dashboard/users">Users</RouterLink>
				</nav>
				<Button class="header-button" color="heading" size="lower" @click.prevent="logout">Log out</Button>
			</div>
		</header>
		<main class="main">
			<RouterView v-slot="{ Component }">
				<Transition mode="out-in" name="multi-select">
					<component :is="Component" />
				</Transition>
			</RouterView>
		</main>
		<Dialogs />
	</div>
</template>