<script setup lang="ts">
import { profile } from "../data/profile";
</script>

<template>
	<section id="about" class="section">
		<p v-for="(paragraph, index) in profile.about" :key="index">
			{{ paragraph }}
		</p>
	</section>
</template>

<style scoped>
p {
	max-width: 68ch;
	margin-bottom: 0.9rem;
}

p:last-child {
	margin-bottom: 0;
}
</style>
