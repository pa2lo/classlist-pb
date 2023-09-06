<script setup>
import Logo from '../components/Logo.vue'
</script>

<template>
	<div class="full-page cont">
		<div class="full-page-inner">
			<div class="centered">
				<Logo logoOnly />
			</div>
			<section class="section">
				<slot></slot>
			</section>
		</div>
	</div>
</template>