<script setup lang="ts">
import { ref } from "vue";
import SectionMark from "./SectionMark.vue";
import {
	defaultTimelineCategory,
	timeline,
	timelineCategories,
	type TimelineCategory,
} from "../data/timeline";

/**
 * Three separate registers behind tabs. One category is shown at a time;
 * the reader switches rather than composes. Career is the landing tab
 * because that is what a first-time visitor came for.
 */
const current = ref<TimelineCategory>(defaultTimelineCategory);

function entriesFor(category: TimelineCategory) {
	return timeline.filter((entry) => entry.category === category);
}

/*
 * Arrow keys move between tabs and the moved-to tab activates on focus,
 * per the WAI-ARIA tabs pattern — the panel is cheap to swap, so no need
 * for a separate "select" step.
 */
const tabs = ref<HTMLButtonElement[]>([]);

function onKeydown(event: KeyboardEvent, index: number) {
	const last = timelineCategories.length - 1;
	let next: number | undefined;
	if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
	else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
	else if (event.key === "Home") next = 0;
	else if (event.key === "End") next = last;
	if (next === undefined) return;
	event.preventDefault();
	current.value = timelineCategories[next].id;
	tabs.value[next]?.focus();
}
</script>

<template>
	<section v-if="timeline.length" id="timeline" class="section">
		<h2><SectionMark variant="track" />Timeline</h2>

		<div class="tabs" role="tablist" aria-label="Timeline registers">
			<button
				v-for="(category, index) in timelineCategories"
				:id="`tab-${category.id}`"
				:key="category.id"
				ref="tabs"
				class="tab"
				:class="{ 'is-active': current === category.id }"
				type="button"
				role="tab"
				:aria-selected="current === category.id"
				:aria-controls="`panel-${category.id}`"
				:tabindex="current === category.id ? 0 : -1"
				@click="current = category.id"
				@keydown="onKeydown($event, index)"
			>
				{{ category.label }}
			</button>
		</div>

		<!--
			Every panel stays in the DOM (v-show, not v-if): on screen only the
			selected one is displayed, on paper all three print in order with
			a register heading each, so the PDF is complete. Rows still get
			their reveal stagger when a tab is first opened, because hidden
			elements never intersect until shown.
		-->
		<div
			v-for="category in timelineCategories"
			v-show="current === category.id"
			:id="`panel-${category.id}`"
			:key="category.id"
			class="panel"
			role="tabpanel"
			:aria-labelledby="`tab-${category.id}`"
			tabindex="0"
		>
			<h3 class="print-only">{{ category.label }}</h3>

			<ol v-if="entriesFor(category.id).length" class="timeline">
				<li
					v-for="(entry, index) in entriesFor(category.id)"
					:key="entry.date + entry.text"
					v-reveal="index * 55"
				>
					<span class="date">{{ entry.date }}</span>
					<span class="text">
						{{ entry.text }}
						<span v-if="entry.kind" class="kind">{{ entry.kind }}</span>
						<span v-if="entry.subtitle" class="subtitle">{{ entry.subtitle }}</span>
					</span>
				</li>
			</ol>

			<p v-else class="empty">Nothing here yet.</p>
		</div>
	</section>
</template>

<style scoped>
/*
 * A tab strip on a single hairline. The selected tab is inked and carries
 * a 2px accent rule that sits on top of the strip's line — same underline
 * language as the site nav, but here it marks a register, not a place.
 */
.tabs {
	display: flex;
	gap: 1.75rem;
	margin-bottom: 1.5rem;
	border-bottom: 1px solid var(--line);
}

.tab {
	position: relative;
	padding: 0.5rem 0 0.7rem;
	margin-bottom: -1px;
	border: 0;
	background: none;
	font-family: var(--font-heading);
	font-size: 0.85rem;
	font-weight: 500;
	letter-spacing: 0.01em;
	color: var(--muted);
	cursor: pointer;
	transition: color var(--fast) var(--ease);
}

.tab::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 2px;
	background: var(--accent);
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform var(--base) var(--ease);
}

.tab:hover,
.tab.is-active {
	color: var(--text);
}

.tab.is-active::after {
	transform: scaleX(1);
}

.tab:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
	border-radius: 2px;
}

.panel:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 4px;
	border-radius: var(--radius);
}

.print-only {
	display: none;
}

.timeline {
	list-style: none;
}

.timeline li {
	display: grid;
	grid-template-columns: 9rem 1fr;
	gap: 1.25rem;
	padding: 0.7rem 0.5rem 0.7rem 0;
	border-radius: var(--radius);
	transition: background-color var(--fast) var(--ease);
}

/* A barely-there wash on hover — enough to track the row, not to decorate */
.timeline li:hover {
	background: var(--surface-sunken);
}

.date {
	font-family: var(--font-heading);
	font-size: 0.8rem;
	letter-spacing: 0.02em;
	color: var(--faint);
	white-space: nowrap;
	padding-top: 0.25rem;
}

.text {
	font-size: 0.95rem;
}

.subtitle {
	display: block;
	margin-top: 0.15rem;
	font-size: 0.85rem;
	color: var(--faint);
}

.kind {
	margin-left: 0.6rem;
	font-family: var(--font-heading);
	font-size: 0.65rem;
	text-transform: uppercase;
	letter-spacing: 0.11em;
	color: var(--faint);
	white-space: nowrap;
}

.empty {
	padding: 0.7rem 0;
	font-size: 0.95rem;
	color: var(--faint);
}

@media (max-width: 40rem) {
	.tabs {
		gap: 1.25rem;
	}

	.timeline li {
		grid-template-columns: 1fr;
		gap: 0.2rem;
	}
}

/* ── Print ─────────────────────────────────────────────────────── */

/*
 * Tabs are inert on paper, so every register prints in sequence with its
 * own heading — the PDF has to be complete without interaction.
 */
@media print {
	.tabs {
		display: none;
	}

	.panel {
		display: block !important;
		break-inside: avoid;
	}

	.panel + .panel {
		margin-top: 1.5rem;
	}

	.print-only {
		display: block;
		margin-bottom: 0.5rem;
	}
}
</style>
