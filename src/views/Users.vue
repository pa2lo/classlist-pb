<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePocketBase } from '../composables/usePocketBase'

import { mapErrors } from '../utils/helpers'
import { toast } from '../utils/toaster'
import { dialog } from '../utils/dialog'

import DashboardPage from '../layouts/DashboardPage.vue'
import Button from '../components/Button.vue'
import TextInput from '../components/TextInput.vue'
import Modal from '../components/Modal.vue'
import ListItem from '../components/ListItem.vue'
import ListFilter from '../components/ListFilter.vue'

const pb = usePocketBase()
const router = useRouter()

const loading = ref(true)
const users = ref(null)
const search = ref('')

onMounted(async () => {
	const list = await pb.collection('users').getFullList({
    	sort: '-created'
	})

	loading.value = false
	users.value = list
})

const filteredUsers = computed(() => {
	if (!users.value) return []

	return users.value.filter(item => item.name?.toLowerCase().includes(search.value.toLowerCase()) || item.username?.toLowerCase().includes(search.value.toLowerCase()) || item.email?.toLowerCase().includes(search.value.toLowerCase()))
})

// add / edit user
const modalOpen = ref(false)
let userForm = ref({})
const deletingId = ref(null)

function openNewForm() {
	userForm.value = {
		type: 'add',
		data: Object.assign({}, {
			username: '',
			email: '',
			name: '',
			password: '',
			passwordConfirm: ''
		}),
		errors: {}
	}
	modalOpen.value = true
}

function showEditForm(item) {
	if (item.id == deletingId.value) return

	userForm.value = {
		type: 'edit',
		id: item.id,
		originalName: item.username,
		verified: item.verified,
		data: Object.assign({}, item),
		errors: {}
	}
	modalOpen.value = true
}

function submitUserForm() {
	userForm.value.errors = {}
	if (userForm.value.data.email == 'demo@demo.demo') {
		dialog.warning(null, "You can not edit demo account!")
		return
	}

	const form = new FormData()
	form.append('name', userForm.value.data.name)
	form.append('username', userForm.value.data.username)
	form.append('email', userForm.value.data.email)
	form.append('emailVisibility', false)
	if (userForm.value.data.password) {
		form.append('password', userForm.value.data.password)
		form.append('passwordConfirm', userForm.value.data.passwordConfirm)
	}

	userForm.value.processing = true
	userForm.value.type == 'add' ? submitNewUser(form) : submitEditUser(form)
}

async function submitNewUser(form) {
	try {
		const record = await pb.collection('users').create(form)

		users.value.unshift(record)
		modalOpen.value = false
		toast.success(`User "${form.get('username')}" created`)
	} catch (error) {
		handleErrors('Failed to add user', error)
	}

	userForm.value.processing = false
}

async function submitEditUser(form) {
	try {
		const record = await pb.collection('users').update(userForm.value.id, form)

		const index = users.value.findIndex(c => c.id == userForm.value.id)
		if (index > -1) users.value[index] = record
		modalOpen.value = false
		toast.success(`User "${userForm.value.originalName}" updated`)
	} catch (error) {
		handleErrors('Failed to update user', error)
	}

	userForm.value.processing = false
}

function handleErrors(text, error) {
	mapErrors(userForm, error)

	toast.error(text, {
		message: error?.message
	})
}

function deleteUser(item, inModal) {
	if (userForm.value.data.email == 'demo@demo.demo') {
		dialog.warning(null, "You can not delete demo account!")
		return
	}

	dialog.delete('Delete user', `Are you sure you want to delete user <strong>${item.username}</strong>?`, {
		onConfirm: async () => {
			const willlogout = pb.authStore.model.id == item.id
			deletingId.value = item.id

			try {
				await pb.collection('users').delete(item.id)
				toast.success('Class deleted successfully')

				const index = users.value.findIndex(c => c.id == item.id)
				if (index > -1) users.value.splice(index, 1)

				if (inModal) modalOpen.value = false
			} catch (error) {
				toast.error('Delete error', {
					message: error?.message
				})
			}

			deletingId.value = null

			if (willlogout) {
				pb.authStore.clear()
				router.replace('/login')
			}
		}
	})
}
</script>

<template>
	<DashboardPage header="Users" :loading="loading">
		<div v-if="users?.length" class="classes-outer">
			<ListFilter v-model:search="search">
				<Button class="ml-a" @click.prevent="openNewForm">Add new user</Button>
			</ListFilter>
			<div class="line-bigger">
				<h4 v-if="!filteredUsers.length">No results</h4>
				<div v-else class="classes-items">
					<ListItem
						v-for="c in filteredUsers"
						:name="c.username"
						:description="c.email"
						:loading="c.id == deletingId"
						@click.prevent="() => showEditForm(c)"
					>
						<span class="bedge" :class="[c.verified ? 'bedge-success' : 'bedge-warning']">
							{{ c.verified ? 'Verified' : 'Not verified' }}
						</span>
					</ListItem>
				</div>
			</div>
		</div>
		<div v-else>
			<h2>No user accounts.</h2>
			<p><Button @click.prevent="openNewForm">Add new user</Button></p>
		</div>
		<Modal v-model:open="modalOpen" as="form" :closeable="userForm.processing || deletingId ? false : true" :header="userForm?.type == 'add' ? 'Add new user' : `Edit user - ${userForm.originalName}`" :headerNote="userForm?.type == 'edit' ? `${userForm.verified ? 'Verified' : 'Not verified'}` : ''" @submit.prevent="submitUserForm">
			<div class="inputs-grid">
				<TextInput label="Username" placeholder="mynickname" v-model="userForm.data.username" :error="userForm.errors.username" required />
				<TextInput label="Email" type="email" placeholder="your@email" v-model="userForm.data.email" :error="userForm.errors.email" required />
				<TextInput label="Name" placeholder="Your Name" v-model="userForm.data.name" :error="userForm.errors.name" />
				<TextInput class="input-col1" label="Password" type="password" placeholder="yourpassword" v-model="userForm.data.password" :error="userForm.errors.password" :required="userForm.data.password || userForm?.type == 'add' ? true : false">
					<template v-if="userForm?.type == 'edit'">
						Fill only if you want to change current password
					</template>
				</TextInput>
				<TextInput label="Password confirm" type="password" placeholder="yourpassword" v-model="userForm.data.passwordConfirm" :error="userForm.errors.passwordConfirm" :required="userForm.data.password || userForm?.type == 'add' ? true : false" />
			</div>
			<template #footer>
				<Button v-if="userForm?.type == 'edit'" color="secondary" outline :disabled="userForm.processing" :loading="deletingId == userForm.data.id" @click.prevent="() => deleteUser(userForm.data, true)">Delete</Button>
				<Button type="submit" :loading="userForm.processing" :disabled="(userForm?.type == 'edit') && (deletingId == userForm.data.id)">Save user</Button>
			</template>
		</Modal>
	</DashboardPage>
</template>