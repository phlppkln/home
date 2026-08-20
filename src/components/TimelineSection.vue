<script setup lang="ts">
import { timeline } from "../data/timeline";
</script>

<template>
	<section v-if="timeline.length" id="timeline" class="section">
		<h2>Timeline</h2>
		<ol class="timeline">
			<li v-for="entry in timeline" :key="entry.date + entry.text">
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
.timeline {
	list-style: none;
	border-top: 1px solid var(--border);
}

.timeline li {
	display: grid;
	grid-template-columns: 8.5rem 1fr;
	gap: 1rem;
	padding: 0.6rem 0;
	border-bottom: 1px solid var(--border);
}

.date {
	font-family: var(--font-heading);
	font-size: 0.85rem;
	color: var(--muted);
	white-space: nowrap;
	padding-top: 0.1rem;
}

.kind {
	margin-left: 0.5rem;
	font-family: var(--font-heading);
	font-size: 0.7rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--accent);
	white-space: nowrap;
}

@media (max-width: 600px) {
	.timeline li {
		grid-template-columns: 1fr;
		gap: 0.15rem;
	}
}
</style>
