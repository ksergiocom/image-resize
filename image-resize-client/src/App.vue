<template>
	<main>
		<FileInput/>
	</main>
</template>

<script setup>
	import FileInput from './components/FileInput.vue'
</script>

<style scoped>
	main{
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>