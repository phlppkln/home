<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { profile } from "./data/profile";
import { timeline } from "./data/timeline";
import { useActiveSection } from "./composables/useActiveSection";
import HeroMark from "./components/HeroMark.vue";
import IntroSection from "./components/IntroSection.vue";
import AboutSection from "./components/AboutSection.vue";
import SkillsSection from "./components/SkillsSection.vue";
import TimelineSection from "./components/TimelineSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";

const { active } = useActiveSection(["intro", "about", "skills", "timeline", "projects"]);

/**
 * The topbar is flat against the page at rest and only earns its hairline
 * and blur once content has scrolled under it.
 */
const scrolled = ref(false);

function onScroll() {
	scrolled.value = window.scrollY > 12;
}

/**
 * The hero mark pins directly below the topbar, and the topbar grows a row
 * taller on narrow screens — so its measured height is published as a
 * custom property rather than guessed at in two stylesheets.
 */
const topbar = ref<HTMLElement | null>(null);
let observer: ResizeObserver | undefined;

onMounted(() => {
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });

	if (topbar.value && typeof ResizeObserver !== "undefined") {
		observer = new ResizeObserver(([entry]) => {
			document.documentElement.style.setProperty(
				"--topbar-h",
				`${entry.target.getBoundingClientRect().height}px`,
			);
		});
		observer.observe(topbar.value);
	}
});

onBeforeUnmount(() => {
	window.removeEventListener("scroll", onScroll);
	observer?.disconnect();
});

const year = new Date().getFullYear();
</script>

<template>
	<a class="skip-link" href="#about">Skip to content</a>

	<header ref="topbar" class="topbar" :class="{ 'is-scrolled': scrolled }">
		<div class="topbar-inner">
			<a class="brand" href="#intro">{{ profile.name }}</a>
			<nav aria-label="Sections">
				<a :class="{ 'is-active': active === 'about' }" href="#about">About</a>
				<a :class="{ 'is-active': active === 'skills' }" href="#skills">Skills</a>
				<a
					v-if="timeline.length"
					:class="{ 'is-active': active === 'timeline' }"
					href="#timeline"
					>Timeline</a
				>
				<a :class="{ 'is-active': active === 'projects' }" href="#projects"
					>Projects</a
				>
			</nav>
		</div>
	</header>

	<main>
		<HeroMark />
		<IntroSection />
		<AboutSection />
		<SkillsSection />
		<TimelineSection />
		<ProjectsSection />
	</main>

	<footer>
		<div class="footer-inner">
			<span class="footer-name">{{ profile.name }}</span>
			<span>{{ year }}</span>
		</div>
	</footer>
</template>

<style scoped>
/* ── Skip link ─────────────────────────────────────────────────── */

.skip-link {
	position: absolute;
	top: 0;
	left: 0.5rem;
	z-index: 20;
	padding: 0.5rem 0.85rem;
	background: var(--surface);
	border: 1px solid var(--line-strong);
	border-radius: var(--radius);
	font-size: 0.85rem;
	text-decoration: none;
	transform: translateY(-150%);
	transition: transform var(--base) var(--ease);
}

.skip-link:focus-visible {
	transform: translateY(0.5rem);
}

/* ── Topbar ────────────────────────────────────────────────────── */

.topbar {
	position: sticky;
	top: 0;
	z-index: 10;
	background: color-mix(in srgb, var(--paper) 82%, transparent);
	border-bottom: 1px solid transparent;
	transition:
		border-color var(--base) var(--ease),
		backdrop-filter var(--base) var(--ease);
}

.topbar.is-scrolled {
	border-bottom-color: var(--line);
	backdrop-filter: blur(10px) saturate(1.4);
}

.topbar-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	width: min(var(--page-width), 100%);
	margin: 0 auto;
	padding: 0.9rem var(--page-padding);
}

.brand {
	font-family: var(--font-heading);
	font-size: 0.9rem;
	font-weight: 500;
	letter-spacing: 0.01em;
	color: var(--text);
	text-decoration: none;
	white-space: nowrap;
	transition: opacity var(--fast) var(--ease);
}

.brand:hover {
	color: var(--text);
	opacity: 0.6;
}

nav {
	display: flex;
	gap: 1.5rem;
	font-size: 0.85rem;
}

nav a {
	position: relative;
	padding-bottom: 2px;
	color: var(--muted);
	text-decoration: none;
	white-space: nowrap;
}

/*
 * Underline grows from the left on hover and stays put for the section
 * you are actually in — one affordance doing two jobs.
 */
nav a::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 1px;
	background: currentColor;
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform var(--base) var(--ease);
}

nav a:hover {
	color: var(--text);
}

nav a:hover::after,
nav a.is-active::after {
	transform: scaleX(1);
}

nav a.is-active {
	color: var(--accent);
}

/* ── Main + footer ─────────────────────────────────────────────── */

main {
	width: min(var(--page-width), 100%);
	margin: 0 auto;
	padding: 0 var(--page-padding);
}

footer {
	border-top: 1px solid var(--line);
	margin-top: 2rem;
}

.footer-inner {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.5rem 1.5rem;
	width: min(var(--page-width), 100%);
	margin: 0 auto;
	padding: 2rem var(--page-padding) 3rem;
	font-size: 0.85rem;
	color: var(--faint);
}

.footer-name {
	font-family: var(--font-heading);
	color: var(--muted);
}

/*
 * Four nav items plus the name overflow a narrow phone and would push the
 * page into horizontal scroll, so below this width the nav drops onto its
 * own row instead of competing with the brand for space.
 */
@media (max-width: 34rem) {
	.topbar-inner {
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
		padding-top: 0.7rem;
		padding-bottom: 0.7rem;
	}

	nav {
		width: 100%;
		gap: 1.05rem;
		font-size: 0.8rem;
	}
}

@media print {
	.topbar,
	.skip-link {
		display: none;
	}
}
</style>
