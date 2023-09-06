<script setup>
defineProps({
	name: String
})
</script>

<template>
	<svg v-if="name == 'x'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M18 6l-12 12"></path>
		<path d="M6 6l12 12"></path>
	</svg>
	<svg v-else-if="name == 'eye'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
		<path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
	</svg>
	<svg v-else-if="name == 'eye-off'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
		<path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
		<path d="M3 3l18 18"></path>
	</svg>
	<svg v-else-if="name == 'search'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
		<path d="M21 21l-6 -6"></path>
	</svg>
	<svg v-else-if="name == 'trash'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   		<path d="M4 7h16"></path>
		<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
		<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
		<path d="M10 12l4 4m0 -4l-4 4"></path>
	</svg>
	<svg v-else-if="name == 'success'" class="icon icon-success" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		<circle cx="12" cy="12" r="11"></circle>
		<path d="M8 12L11 15L16 10"></path>
	</svg>
	<svg v-else-if="name == 'success-animated'" class="icon icon-success-animated" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		<g transform="rotate(-90 12 12)">
			<circle stroke-dasharray="69.5" stroke-dashoffset="69.5" cx="12" cy="12" r="11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.5s" values="70;0"/></circle>
		</g>
		<path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.25s" values="14;0"/></path>
	</svg>
	<svg v-else-if="name == 'info'" class="icon icon-info" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<circle cx="12" cy="12" r="11"></circle>
			<g transform="rotate(-180 12 12)">
				<path d="M12 7V13"></path>
			</g>
		</g>
		<circle cx="12" cy="7" r="1" fill="currentColor"></circle>
	</svg>
	<svg v-else-if="name == 'info-animated'" class="icon icon-info-animated" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<g transform="rotate(-90 12 12)">
				<circle stroke-dasharray="69.5" stroke-dashoffset="69.5" cx="12" cy="12" r="11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.5s" values="70;0"/></circle>
			</g>
			<g transform="rotate(-180 12 12)">
				<path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7V13"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.25s" values="8;0"/></path>
			</g>
		</g>
		<circle cx="12" cy="7" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.1s" values="0;1"/></circle>
	</svg>
	<svg v-else-if="name == 'error'" class="icon icon-error" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<circle cx="12" cy="12" r="11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.5s" values="70;0"/></circle>
			<path d="M12 7V13"></path>
		</g>
		<circle cx="12" cy="17" r="1" fill="currentColor"></circle>
	</svg>
	<svg v-else-if="name == 'error-animated'" class="icon icon-error-animated" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<g transform="rotate(-90 12 12)">
				<circle stroke-dasharray="69.5" stroke-dashoffset="69.5" cx="12" cy="12" r="11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.5s" values="70;0"/></circle>
			</g>
			<path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7V13"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.25s" values="8;0"/></path>
		</g>
		<circle cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.1s" values="0;1"/></circle>
	</svg>
	<svg v-else-if="name == 'warning'" class="icon icon-warning" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
			<path d="M12 2L22 22H2L12 2Z"></path>
			<path d="M12 10V14"></path>
		</g>
		<circle cx="12" cy="18" r="1" fill="currentColor"></circle>
	</svg>
	<svg v-else-if="name == 'warning-animated'" class="icon icon-warning-animated" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
			<path stroke-dasharray="65" stroke-dashoffset="65" d="M12 2L22 22H2L12 2Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.5s" values="65;0"/></path>
			<path stroke-dasharray="6" stroke-dashoffset="6" d="M12 10V14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.2s" values="6;0"/></path>
		</g>
		<circle cx="12" cy="18" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="0.95s" dur="0.1s" values="0;1"/></circle>
	</svg>
	<svg v-else-if="name == 'question'" class="icon icon-question" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<circle cx="12" cy="12" r="11"></circle>
			<path d="M8.99999 10C8.99999 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 10.9814 14.5288 11.8527 13.8003 12.4C13.0718 12.9473 12.5 13 12 14"></path>
		</g>
		<circle cx="12" cy="17" r="1" fill="currentColor"><animate fill="freeze" attributeName="fill-opacity" begin="1.05s" dur="0.2s" values="0;1"/></circle>
	</svg>
	<svg v-else-if="name == 'question-animated'" class="icon icon-question-animated" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
			<g transform="rotate(-90 12 12)">
				<circle stroke-dasharray="69.5" stroke-dashoffset="69.5" cx="12" cy="12" r="11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.5s" values="70;0"/></circle>
			</g>
			<path stroke-dasharray="20" stroke-dashoffset="20" d="M8.99999 10C8.99999 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 10.9814 14.5288 11.8527 13.8003 12.4C13.0718 12.9473 12.5 13 12 14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.4s" values="20;0"/></path>
		</g>
		<circle cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1.15s" dur="0.1s" values="0;1"/></circle>
	</svg>
	<svg v-else-if="name == 'copy'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-copy" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
		<path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
	</svg>
	<svg v-else-if="name == 'check'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M5 12l5 5l10 -10"></path>
	</svg>
	<svg v-else-if="name == 'left'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M15 6l-6 6l6 6"></path>
	</svg>
	<svg v-else-if="name == 'external-link'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-external-link" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
		<path d="M11 13l9 -9"></path>
		<path d="M15 4h5v5"></path>
	</svg>
	<svg v-else-if="name == 'edit'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
		<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
		<path d="M16 5l3 3"></path>
	</svg>
	<svg v-else-if="name == 'down'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-down" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M6 9l6 6l6 -6"></path>
	</svg>
	<svg v-else-if="name == 'up'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-up" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path d="M6 15l6 -6l6 6"></path>
	</svg>
</template>