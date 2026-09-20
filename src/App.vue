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
 * The section nav lives in the topbar, and once the hero ridge has pinned
 * it renders the same list as sector labels under the ridge — so the list
 * is built once here. Timeline is only offered while it has entries,
 * matching the section itself.
 */
const sections = [
	{ id: "about", label: "About" },
	{ id: "skills", label: "Skills" },
	...(timeline.length ? [{ id: "timeline", label: "Timeline" }] : []),
	{ id: "projects", label: "Projects" },
];

/**
 * True once the ridge rests pinned under the topbar. The links then live
 * in the band's row, and the topbar's copy fades out and goes inert so
 * there is only ever one live nav.
 */
const pinned = ref(false);

/**
 * The topbar is flat against the page at rest and only earns its hairline
 * once content has scrolled under it.
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

	<header
		ref="topbar"
		class="topbar"
		:class="{ 'is-scrolled': scrolled, 'is-pinned': pinned }"
	>
		<div class="topbar-inner">
			<a class="brand" href="#intro">{{ profile.name }}</a>
			<nav aria-label="Sections" :inert="pinned">
				<a
					v-for="section in sections"
					:key="section.id"
					:class="{ 'is-active': active === section.id }"
					:href="`#${section.id}`"
					>{{ section.label }}</a
				>
			</nav>
		</div>
	</header>

	<main>
		<HeroMark :sections="sections" :active="active" @pinned="pinned = $event" />
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

/*
 * Solid paper, the same ground as the ridge band pinned under it, so the
 * two read as one opaque header and nothing shows through from behind.
 */
.topbar {
	position: sticky;
	top: 0;
	z-index: 10;
	background: var(--paper);
	border-bottom: 1px solid transparent;
	transition: border-color var(--base) var(--ease);
}

/*
 * The hairline belongs to the nav row: it shows while the links are up
 * here and goes with them once they have moved down under the ridge.
 */
.topbar.is-scrolled:not(.is-pinned) {
	border-bottom-color: var(--line);
}

.topbar-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	width: min(var(--page-width), 100%);
	margin: 0 auto;
	padding: 0.6rem var(--page-padding);
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

/*
 * The hand-off. The topbar's links fade and drift down a touch as the
 * ridge pins, while the band's sector labels rise into their row (see
 * HeroMark). Scrolling back up plays it in reverse.
 */
.topbar nav {
	transition:
		opacity var(--base) var(--ease),
		transform var(--base) var(--ease);
}

.topbar.is-pinned nav {
	opacity: 0;
	transform: translateY(4px);
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

	/*
	 * Here the nav is a row of its own, and an empty row is dead height on
	 * a phone — so once the links have moved down, the row goes too and
	 * the ridge glides up to fill it (see `.ridge` in HeroMark).
	 */
	.topbar.is-pinned nav {
		display: none;
	}
}

@media print {
	.topbar,
	.skip-link {
		display: none;
	}
}
</style>
