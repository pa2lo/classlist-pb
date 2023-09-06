<script setup>
import { ref } from 'vue'
import { usePocketBase } from '../composables/usePocketBase'

import Button from '../components/Button.vue'

const pb = usePocketBase()
const isLoggedIn = pb.authStore.isValid

function redirectHome() {
	window.location.pathname = '/'
}

function logout() {
	pb.authStore.clear()
	redirectHome()
}

const menuOpen = ref(false)
</script>

<template>
	<div>
		<header class="header flex ai-c">
			<a href="/" class="logo flex ai-c" @click.prevent="() => $route.name == 'home' ? redirectHome() : $router.push('/')">
				<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-drag-drop" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
					<path d="M11 3l0 .01"></path>
					<path d="M15 3l0 .01"></path>
					<path d="M3 11l0 .01"></path>
					<path d="M3 15l0 .01"></path>
					<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
					<path d="M20.2 20.2l1.8 1.8"></path>
				</svg>
				<h1 class="logo-h1">ClassList</h1>
			</a>
			<template v-if="isLoggedIn">
				<button class="header-menu-toggle header-link ml-a" @click.prevent="menuOpen = !menuOpen" :class="{'menu-open': menuOpen}">
					<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" >
						<path d="M4 6l16 0"></path>
						<path d="M4 12l16 0"></path>
						<path d="M4 18l16 0"></path>
					</svg>
				</button>
				<div class="header-nav stretch flex ai-c ml-a" :class="{'nav-open': menuOpen}">
					<div class="header-nav-links stretch">
						<RouterLink to="/dashboard/classes">Dashboard</RouterLink>
					</div>
					<Button class="header-button" color="heading" size="lower" @click.prevent="logout">Log out</Button>
				</div>
			</template>
			<RouterLink v-else to="/login" class="header-link ml-a">
				<svg title="Private" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-lock" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
					<path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
					<path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
				</svg>
			</RouterLink>
		</header>
		<main class="main">
			<RouterView v-slot="{ Component }">
				<Transition mode="out-in" name="multi-select">
					<component :is="Component" :isLoggedIn="isLoggedIn" />
				</Transition>
			</RouterView>
		</main>
	</div>
</template>