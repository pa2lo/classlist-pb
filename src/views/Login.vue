<script setup>
import { ref } from 'vue'
import { usePocketBase } from '../composables/usePocketBase'
import { useRouter } from 'vue-router'

import FullPage from '../layouts/FullPage.vue'
import Card from '../components/Card.vue'
import TextInput from '../components/TextInput.vue'
import Button from '../components/Button.vue'

const pb = usePocketBase()
const router = useRouter()

const isDemo = window.location.host == 'classlist.pa2lo.net'

const username = ref(isDemo ? 'demo@demo.demo' : '')
const password = ref(isDemo ? 'demo1234' : '')

const processing = ref(false)
const loginError = ref(null)

async function login() {
	if (processing.value) return

	processing.value = true
	loginError.value = null

	try {
		await pb.collection('users').authWithPassword(username.value, password.value)

		if (pb.authStore.isValid) router.replace(history.state?.returnTo || '/dashboard/classes')
	} catch (error) {
		loginError.value = error?.message || error
	}

	processing.value = false
}
</script>

<template>
	<FullPage>
		<Card width="narrow">
			<h3>Login</h3>
			<form class="line" @submit.prevent="login">
				<TextInput name="username" label="Email" required placeholder="your@email" v-model="username" :error="loginError" />
				<TextInput name="password" label="Password" type="password" required placeholder="yourpassword" v-model="password" />
				<p class="line-bigger">
					<Button type="submit" full :loading="processing">Login</Button>
				</p>
			</form>
		</Card>
	</FullPage>
</template>