<script setup lang="ts">
import { profile } from "../data/profile";
import ContactLinks from "./ContactLinks.vue";
</script>

<template>
	<section id="intro" class="section section--intro">
		<div class="identity">
			<div class="headline" v-reveal>
				<h1 class="name">{{ profile.name }}</h1>
				<p class="role">
					{{ profile.role }} <span class="location">{{ profile.location }}</span>
				</p>
			</div>

			<ul class="focus" v-reveal="80">
				<li v-for="item in profile.focus" :key="item">{{ item }}</li>
			</ul>

			<ContactLinks class="contact" v-reveal="160" />

			<!--
				The icons above carry no visible text, so on paper the contact
				details are spelled out instead.
			-->
			<p class="print-only print-contact">
				<span v-for="link in profile.contact" :key="link.href">{{
					link.href.replace(/^(mailto:|https:\/\/(www\.)?)/, "").replace(/\/$/, "")
				}}</span>
			</p>
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

.headline {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

/* The page's display line — it stays a step above the section headings */
.name {
	font-size: clamp(1.9rem, 1.4rem + 2vw, 2.7rem);
	letter-spacing: -0.015em;
	line-height: 1.2;
	color: var(--text);
}

.role {
	font-family: var(--font-heading);
	font-size: clamp(1.15rem, 1rem + 0.6vw, 1.4rem);
	font-weight: 500;
	letter-spacing: -0.01em;
	line-height: 1.35;
	color: var(--accent);
}

/* Body font, like the focus row, so the place reads apart from the title */
.location {
	margin-left: 0.6em;
	font-family: var(--font-body);
	font-size: 0.95rem;
	font-weight: 400;
	letter-spacing: 0.005em;
	color: var(--muted);
}

.print-contact {
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem 0.6rem;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--text);
}

.print-contact span + span::before {
	content: "·";
	margin-right: 0.6rem;
	color: var(--faint);
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

.print-only {
	display: none;
}

@media print {
	.print-only {
		display: flex;
	}

	.contact {
		display: none;
	}
}

@media (max-width: 40rem) {
	.section--intro {
		padding-top: 2rem;
	}
}
</style>
