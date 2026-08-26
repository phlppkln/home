<script setup lang="ts">
import SectionMark from "./SectionMark.vue";
import { timeline } from "../data/timeline";
import TimelineChart from "./TimelineChart.vue";
</script>

<template>
	<section v-if="timeline.length" id="timeline" class="section">
		<h2><SectionMark variant="track" />Timeline</h2>

		<TimelineChart class="chart" />

		<ol class="timeline">
			<li
				v-for="(entry, index) in timeline"
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
	</section>
</template>

<style scoped>
/*
 * The chart is the overview and the list is the detail, so the chart gets
 * clear air beneath it rather than sitting flush against the first row.
 */
.chart {
	margin-bottom: 2.25rem;
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

@media (max-width: 40rem) {
	.timeline li {
		grid-template-columns: 1fr;
		gap: 0.2rem;
	}
}
</style>
