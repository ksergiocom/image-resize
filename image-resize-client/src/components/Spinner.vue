<template>
	<div class="spinner">
	</div>
</template>

<style>
	.spinner{
		width: 1rem;
		height: 1rem;
		border: solid 0.3rem white;
		border-radius: 100%;
		border-left: solid 0.3rem transparent;
		animation: spin 1s infinite linear;
	}

	@keyframes spin{
		0%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(360deg);
		}
	}
</style>