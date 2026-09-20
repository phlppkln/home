<script setup lang="ts">
import type { ProjectImage } from "../data/projects";

defineProps<{ image: ProjectImage }>();

/*
 * Image paths in the data are relative to public/. The site is served
 * from a sub-path on GitHub Pages (see vite.config.ts), and Vite does not
 * rewrite bound src attributes, so the base has to be prepended here.
 */
const base = import.meta.env.BASE_URL;
</script>

<template>
	<!--
		Lazy because every card's body is in the DOM from the start; the
		width/height attributes reserve the box so the disclosure animates
		to the right height before the file arrives.
	-->
	<figure class="figure">
		<img
			:src="base + image.src"
			:alt="image.alt"
			:width="image.width"
			:height="image.height"
			loading="lazy"
			decoding="async"
		/>
		<figcaption v-if="image.caption">{{ image.caption }}</figcaption>
	</figure>
</template>

<style scoped>
/*
 * A figure sits on the sunken surface with a hairline, like a tag or a
 * hovered row — part of the same vocabulary, not a dropped-in photo.
 */
.figure {
	margin-bottom: 1.5rem;
}

.figure img {
	display: block;
	width: 100%;
	height: auto;
	border: 1px solid var(--line);
	border-radius: var(--radius);
	background: var(--surface-sunken);
}

.figure figcaption {
	max-width: 70ch;
	margin-top: 0.5rem;
	font-size: 0.85rem;
	line-height: 1.6;
	color: var(--faint);
}

@media print {
	.figure {
		break-inside: avoid;
	}
}
</style>
