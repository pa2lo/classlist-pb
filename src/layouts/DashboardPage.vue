<script setup>
import IcoButton from '../components/IcoButton.vue'

defineProps({
	header: String,
	headerNote: String,
	loading: Boolean,
	backLink: String,
	openLink: String
})
</script>

<template>
	<div class="cont">
		<div class="page-header flex ai-c">
			<IcoButton v-if="backLink" :href="backLink" outline icon="left" title="Back" />
			<h1 class="page-header-title">{{ header }}</h1>
			<IcoButton v-if="openLink" :href="openLink" outline icon="external-link" title="Open" target="_blank" />
		</div>
		<p v-if="headerNote" class="header-note">{{ headerNote }}</p>
		<section class="section main-content">
			<h2 v-if="loading" class="header-loading"></h2>
			<div v-else>
				<slot></slot>
			</div>
		</section>
	</div>
</template>