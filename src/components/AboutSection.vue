<script setup lang="ts">
import SectionMark from "./SectionMark.vue";
import { profile } from "../data/profile";
</script>

<template>
	<section id="about" class="section">
		<h2><SectionMark variant="ring" />About</h2>
		<div class="prose">
			<p
				v-for="(paragraph, index) in profile.about"
				:key="index"
				v-reveal="index * 90"
			>
				{{ paragraph }}
			</p>
		</div>
	</section>
</template>

<style scoped>
.prose {
	max-width: 64ch;
}

p {
	margin-bottom: 1.35rem;
	/* Slightly larger than the cards — this is the reading passage */
	font-size: 1.0125rem;
	line-height: 1.8;
	color: var(--text);
}

p:last-child {
	margin-bottom: 0;
}
</style>
