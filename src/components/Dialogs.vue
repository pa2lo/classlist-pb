<script setup>
import { dialogStore } from '../utils/dialog'

import Dialog from './Dialog.vue';
</script>

<template>
	<Dialog v-for="dialog in dialogStore" :key="dialog.id" v-bind="dialog" />
</template>