<script setup lang="ts">
import { timeline } from "../data/timeline";
import { parseSpan, toFractionalYear, type Span } from "../utils/timespan";

/**
 * Gantt overview of the professional track, shown above the timeline list.
 *
 * Reads timeline.ts directly rather than restating any dates, so editing an
 * entry moves its bar. Only education, work and volunteering are charted;
 * personal entries appear in the list below but not here.
 */
const CHARTED_KINDS = ["Education", "Career", "Volunteer"];

interface Row {
	label: string;
	kind: string;
	span: Span;
}

const rows: Row[] = timeline
	.flatMap((entry) => {
		if (!entry.kind || !CHARTED_KINDS.includes(entry.kind)) return [];
		const span = parseSpan(entry.date);
		if (!span) return [];
		return [{ label: entry.short ?? entry.text, kind: entry.kind, span }];
	})
	.sort((a, b) => a.span.start - b.span.start);

/* ── Layout ─────────────────────────────────────────────────── */

const VIEW_W = 640;
const GUTTER = 196; // label column
const PLOT_X0 = GUTTER + 8;
const PLOT_X1 = 618;
const ROW_H = 26;
const TOP = 18;
const BAR_H = 7;

const axisY = TOP + rows.length * ROW_H + 14;
const VIEW_H = axisY + 26;

const now = toFractionalYear(new Date());
const domainStart = Math.floor(Math.min(...rows.map((r) => r.span.start)));
// A little air on the right so an ongoing bar never touches the frame
const domainEnd = Math.max(now, ...rows.map((r) => r.span.end)) + 0.4;

function x(year: number): number {
	const t = (year - domainStart) / (domainEnd - domainStart);
	return PLOT_X0 + t * (PLOT_X1 - PLOT_X0);
}

function rowY(index: number): number {
	return TOP + index * ROW_H + ROW_H / 2;
}

/** Year gridlines every three years — enough to read spans, few enough to stay quiet */
const ticks: number[] = [];
for (let y = domainStart; y <= domainEnd; y++) {
	if (y % 3 === 0) ticks.push(y);
}

const fills: Record<string, string> = {
	Education: "var(--line-strong)",
	Career: "var(--accent)",
	Volunteer: "var(--muted)",
};

const summary = rows
	.map((r) => `${r.label}, ${r.span.ongoing ? `since ${r.span.start}` : `${r.span.start} to ${r.span.end}`}`)
	.join("; ");
</script>

<template>
	<svg
		class="chart"
		:viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
		preserveAspectRatio="xMidYMid meet"
		role="img"
		:aria-label="`Timeline of education and work: ${summary}`"
	>
		<defs>
			<!--
				objectBoundingBox units (the default) means this one gradient
				resolves per-rect, so every ongoing bar fades over its own width.
			-->
			<linearGradient id="timeline-chart-fade" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stop-color="currentColor" stop-opacity="1" />
				<stop offset="0.7" stop-color="currentColor" stop-opacity="1" />
				<stop offset="1" stop-color="currentColor" stop-opacity="0.08" />
			</linearGradient>
		</defs>

		<!-- Year gridlines, behind everything -->
		<g class="grid">
			<line
				v-for="tick in ticks"
				:key="`grid-${tick}`"
				:x1="x(tick)"
				:y1="TOP - 6"
				:x2="x(tick)"
				:y2="axisY"
			/>
		</g>

		<g v-for="(row, index) in rows" :key="row.label" class="row">
			<text class="row-label" :x="GUTTER" :y="rowY(index) + 3" text-anchor="end">
				{{ row.label }}
			</text>
			<rect
				class="bar"
				:class="{ 'bar--ongoing': row.span.ongoing }"
				:x="x(row.span.start)"
				:y="rowY(index) - BAR_H / 2"
				:width="Math.max(x(row.span.end) - x(row.span.start), BAR_H)"
				:height="BAR_H"
				:rx="BAR_H / 2"
				:style="{
					color: fills[row.kind],
					fill: row.span.ongoing ? 'url(#timeline-chart-fade)' : fills[row.kind],
					animationDelay: `${140 + index * 90}ms`,
				}"
			/>
		</g>

		<!-- Axis -->
		<line class="axis" :x1="PLOT_X0" :y1="axisY" :x2="PLOT_X1" :y2="axisY" />
		<g class="ticks">
			<text
				v-for="tick in ticks"
				:key="`tick-${tick}`"
				:x="x(tick)"
				:y="axisY + 15"
				text-anchor="middle"
			>
				{{ tick }}
			</text>
		</g>
	</svg>
</template>

<style scoped>
.chart {
	display: block;
	width: 100%;
	height: auto;
}

.grid line {
	stroke: var(--line);
	stroke-width: 1;
}

.axis {
	stroke: var(--line-strong);
	stroke-width: 1;
	transform-box: fill-box;
	transform-origin: left center;
	animation: draw-x 800ms var(--ease) both;
}

.row-label {
	font-family: var(--font-heading);
	font-size: 9.5px;
	letter-spacing: 0.01em;
	fill: var(--muted);
	animation: fade-in 600ms var(--ease) both;
	animation-delay: 220ms;
}

.ticks text {
	font-family: var(--font-heading);
	font-size: 8.5px;
	letter-spacing: 0.04em;
	fill: var(--faint);
}

.bar {
	transform-box: fill-box;
	transform-origin: left center;
	animation: grow-x 700ms var(--ease) both;
}

@keyframes grow-x {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}

@keyframes draw-x {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@media (max-width: 40rem) {
	/* Labels get unreadable at phone widths — drop to a compact scale */
	.row-label {
		font-size: 11px;
	}

	.ticks text {
		font-size: 10px;
	}
}
</style>
