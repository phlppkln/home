<script setup lang="ts">
import { computed, ref } from "vue";
import SectionMark from "./SectionMark.vue";
import {
	defaultTimelineCategories,
	timeline,
	timelineCategories,
	type TimelineCategory,
} from "../data/timeline";

/**
 * The reader assembles their own timeline: every category is a toggle and
 * any combination of them is valid, including none. Career is on by
 * default because that is what a first-time visitor came for.
 */
const active = ref<TimelineCategory[]>([...defaultTimelineCategories]);

function isActive(category: TimelineCategory): boolean {
	return active.value.includes(category);
}

function toggle(category: TimelineCategory) {
	active.value = isActive(category)
		? active.value.filter((id) => id !== category)
		: [...active.value, category];
}

const visible = computed(() =>
	timeline.filter((entry) => isActive(entry.category)),
);

/** Entry count per category, shown on its button so an empty toggle is no surprise */
const counts = computed(() => {
	const tally = {} as Record<TimelineCategory, number>;
	for (const { id } of timelineCategories) tally[id] = 0;
	for (const entry of timeline) tally[entry.category] += 1;
	return tally;
});
</script>

<template>
	<section v-if="timeline.length" id="timeline" class="section">
		<h2><SectionMark variant="track" />Timeline</h2>

		<div class="filters" role="group" aria-label="Show timeline categories">
			<button
				v-for="category in timelineCategories"
				:key="category.id"
				class="filter"
				:class="{ 'is-active': isActive(category.id) }"
				type="button"
				:aria-pressed="isActive(category.id)"
				@click="toggle(category.id)"
			>
				{{ category.label }}
				<span class="count" aria-hidden="true">{{ counts[category.id] }}</span>
			</button>
		</div>

		<!--
			aria-live so a screen reader hears the list change when a filter is
			toggled — the buttons are far enough from the list that the change
			would otherwise pass silently.
		-->
		<div aria-live="polite">
			<ol v-if="visible.length" class="timeline">
				<li
					v-for="(entry, index) in visible"
					:key="entry.date + entry.text"
					v-reveal="index * 55"
				>
					<span class="date">{{ entry.date }}</span>
					<span class="text">
						{{ entry.text }}
						<span v-if="entry.kind" class="kind">{{ entry.kind }}</span>
					</span>
				</li>
			</ol>

			<p v-else class="empty">
				Pick a category above to build a timeline.
			</p>
		</div>
	</section>
</template>

<style scoped>
.filters {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 2rem;
}

/*
 * Quiet hairline pills at rest, solid accent once on — the state has to
 * be readable at a glance, since it is what the list below is showing.
 */
.filter {
	display: inline-flex;
	align-items: baseline;
	gap: 0.4rem;
	padding: 0.35rem 0.85rem;
	border: 1px solid var(--line-strong);
	border-radius: 999px;
	background: transparent;
	font-family: var(--font-heading);
	font-size: 0.8rem;
	font-weight: 500;
	letter-spacing: 0.01em;
	color: var(--muted);
	cursor: pointer;
	transition:
		background-color var(--fast) var(--ease),
		border-color var(--fast) var(--ease),
		color var(--fast) var(--ease);
}

.filter:hover {
	border-color: var(--accent);
	color: var(--text);
}

.filter.is-active {
	background: var(--accent);
	border-color: var(--accent);
	color: var(--paper);
}

.filter.is-active:hover {
	background: var(--accent-hover);
	border-color: var(--accent-hover);
	color: var(--paper);
}

.count {
	font-size: 0.72rem;
	opacity: 0.65;
	font-variant-numeric: tabular-nums;
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
	.timeline li {
		grid-template-columns: 1fr;
		gap: 0.2rem;
	}
}

/* On paper the buttons are inert — only the chosen rows print */
@media print {
	.filters {
		display: none;
	}
}
</style>
