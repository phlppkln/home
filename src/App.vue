<script setup lang="ts">
import { profile } from "./data/profile";
import { timeline } from "./data/timeline";
import IntroSection from "./components/IntroSection.vue";
import AboutSection from "./components/AboutSection.vue";
import TimelineSection from "./components/TimelineSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
</script>

<template>
	<header class="topbar">
		<a class="brand" href="#intro">{{ profile.name }}</a>
		<nav>
			<a href="#about">About</a>
			<a v-if="timeline.length" href="#timeline">Timeline</a>
			<a href="#projects">Projects</a>
		</nav>
	</header>

	<main>
		<IntroSection />
		<AboutSection />
		<TimelineSection />
		<ProjectsSection />
	</main>

	<footer>
		<a :href="profile.contact[0].href">{{ profile.contact[0].kind }}</a>
	</footer>
</template>

<style scoped>
.topbar {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.75rem var(--page-padding);
	background: color-mix(in srgb, var(--bg) 88%, transparent);
	backdrop-filter: blur(6px);
	border-bottom: 1px solid var(--border);
}

.brand {
	font-family: var(--font-heading);
	font-weight: 600;
	color: var(--text);
	text-decoration: none;
}

nav {
	display: flex;
	gap: 1rem;
	font-size: 0.9rem;
}

nav a {
	color: var(--muted);
	text-decoration: none;
}

nav a:hover {
	color: var(--primary);
}

main {
	max-width: var(--page-width);
	margin: 0 auto;
	padding: 0 var(--page-padding);
}

footer {
	max-width: var(--page-width);
	margin: 0 auto;
	padding: 2rem var(--page-padding) 3rem;
	font-size: 0.85rem;
	color: var(--muted);
	border-top: 1px solid var(--border);
}

@media print {
	.topbar {
		display: none;
	}
}
</style>
