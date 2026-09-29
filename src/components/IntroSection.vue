<script setup lang="ts">
import { profile } from "../data/profile";
import ContactLinks from "./ContactLinks.vue";
</script>

<template>
	<section id="intro" class="section section--intro">
		<!--
			The mark replaces the name visually, so the document heading is
			kept for screen readers, search engines and the print stylesheet.
		-->
		<h1 class="visually-hidden">{{ profile.name }} — {{ profile.role }}</h1>

		<div class="identity">
			<p class="role" v-reveal>{{ profile.role }}</p>

			<ul class="focus" v-reveal="80">
				<li v-for="item in profile.focus" :key="item">{{ item }}</li>
			</ul>

			<ContactLinks class="contact" v-reveal="160" />
		</div>
	</section>
</template>

<style scoped>
/*
 * The hero mark sits above this section in the page shell (it has to be a
 * child of <main> to stay pinned for the whole page), so the air that used
 * to be its bottom margin lives here now.
 */
.section--intro {
	padding-top: 2.75rem;
	padding-bottom: 3.5rem;
}


.identity {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

/* The page's display line — it stays a step above the section headings */
.role {
	font-family: var(--font-heading);
	font-size: clamp(1.9rem, 1.4rem + 2vw, 2.7rem);
	font-weight: 500;
	letter-spacing: -0.015em;
	line-height: 1.25;
	color: var(--text);
}

/*
 * Focus areas read as one quiet line divided by hairlines rather than as
 * chips — fewer boxes, more air.
 */
.focus {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem 1.1rem;
	list-style: none;
	padding-left: 0;
	font-size: 0.875rem;
	line-height: 1.5;
	color: var(--muted);
}

.focus li {
	position: relative;
}

.focus li + li {
	padding-left: 1.1rem;
}

.focus li + li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.25em;
	bottom: 0.25em;
	border-left: 1px solid var(--line-strong);
}

/* Optically aligns the first icon glyph with the text above */
.contact {
	margin-left: -0.5rem;
}

@media (max-width: 40rem) {
	.section--intro {
		padding-top: 2rem;
	}
}
</style>
