<template>
	<RouterView v-slot="{ Component }">
		<Transition mode="out-in" name="multi-select">
			<component :is="Component" />
		</Transition>
	</RouterView>
</template>