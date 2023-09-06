<script setup>
import { themesMap, blocksMap, typesMap } from '../utils/helpers'
import { useRouter } from 'vue-router'

const props = defineProps({
	post: Object,
	redirect: Boolean
})

const router = useRouter()
const emit = defineEmits(['filter'])

function bedgeClick(type, value) {
	if (props.redirect) router.push({path: '/', state: { setFilter: { [type]: value } }})
	else emit('filter', { [type]: value })
}

</script>

<template>
	<div class="post-info line-bigger">
		<p class="post-info-line flex ai-c">
			<span class="post-info-line-title">Theme</span>
			<span class="filtered-options-home">
				<span class="multi-select-checked-option" @click.prevent="() => bedgeClick('theme', post.theme)">
					<span class="multi-select-checked-option-title">{{ themesMap[post.theme] }}</span>
				</span>
			</span>
		</p>
		<p v-if="post?.type.length" class="post-info-line flex ai-c">
			<span class="post-info-line-title">Type</span>
			<span class="filtered-options-home">
				<span v-for="t in post.type" class="multi-select-checked-option" @click.prevent="() => bedgeClick('type', t)">
					<span class="multi-select-checked-option-title">{{ typesMap[t] }}</span>
				</span>
			</span>
		</p>
		<p v-if="post?.block.length" class="post-info-line flex ai-c">
			<span class="post-info-line-title">Block</span>
			<span class="filtered-options-home">
				<span v-for="t in post.block" class="multi-select-checked-option" @click.prevent="() => bedgeClick('block', t)">
					<span class="multi-select-checked-option-title">{{ blocksMap[t] }}</span>
				</span>
			</span>
		</p>
	</div>
</template>