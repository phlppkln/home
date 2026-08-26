<script setup lang="ts">
/**
 * Abstract geometric mark that stands in for the name in the hero.
 *
 * The geometry is generated from pure functions of the index — no
 * randomness — so the composition is identical on every render and the
 * SVG can be treated as a static asset. It encodes no data; it is a
 * composition, not a chart.
 *
 * Language: a tapering field of hairline reeds, two concentric circles
 * and an open arc, one clay disc as the focal point, all resting on a
 * single baseline. Strokes only, one accent, plenty of air.
 */

const VIEW_W = 640;
const VIEW_H = 212;
const BASE_Y = 178;

const FIELD_X0 = 36;
const FIELD_X1 = 430;
const REED_COUNT = 72;

interface Reed {
	x: number;
	height: number;
	opacity: number;
	delay: string;
}

/**
 * Reed heights are a bell envelope (so the field tapers to nothing at
 * both ends) modulated by three sine terms at rising frequencies — enough
 * interference to read as organic rather than as a pattern.
 */
const reeds: Reed[] = Array.from({ length: REED_COUNT }, (_, i) => {
	const t = i / (REED_COUNT - 1);
	const envelope = Math.pow(Math.sin(Math.PI * t), 0.75);
	const detail =
		0.5 +
		0.28 * Math.sin(t * 8.2 + 0.7) +
		0.14 * Math.sin(t * 19.7 + 2.1) +
		0.08 * Math.sin(t * 33.1 + 4.2);

	return {
		x: FIELD_X0 + t * (FIELD_X1 - FIELD_X0),
		height: 10 + envelope * Math.max(detail, 0) * 140,
		// Taller reeds sit slightly forward; keeps the field from reading flat
		opacity: 0.28 + envelope * 0.34,
		delay: `${Math.round(160 + t * 420)}ms`,
	};
});

const CIRCLE_X = 524;
const R_OUTER = 76;
const R_INNER = 46;
/* Derived, not typed in: the outer ring rests exactly on the baseline. */
const CIRCLE_Y = BASE_Y - R_OUTER;

function polar(cx: number, cy: number, r: number, deg: number) {
	const rad = (deg * Math.PI) / 180;
	return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

/** Open arc as a path, so it can be stroke-drawn like the circles. */
function arcPath(r: number, from: number, to: number) {
	const [x0, y0] = polar(CIRCLE_X, CIRCLE_Y, r, from);
	const [x1, y1] = polar(CIRCLE_X, CIRCLE_Y, r, to);
	// Sweep must be normalised — `to` may wrap past 360 (e.g. 298° → 46°),
	// where a raw difference would wrongly select the long way round.
	const sweep = (((to - from) % 360) + 360) % 360;
	const largeArc = sweep > 180 ? 1 : 0;
	return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const outerArc = arcPath(90, 298, 46);
</script>

<template>
	<svg
		class="mark"
		:viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
		preserveAspectRatio="xMidYMid meet"
		aria-hidden="true"
		focusable="false"
	>
		<!-- Baseline: everything rests on this one rule -->
		<line
			class="baseline"
			:x1="24"
			:y1="BASE_Y"
			:x2="VIEW_W - 24"
			:y2="BASE_Y"
		/>

		<g class="field">
			<rect
				v-for="(reed, i) in reeds"
				:key="i"
				class="reed"
				:x="reed.x"
				:y="BASE_Y - reed.height"
				width="1"
				:height="reed.height"
				:style="{ opacity: reed.opacity, animationDelay: reed.delay }"
			/>
		</g>

		<g class="rings">
			<path class="ring ring--arc" :d="outerArc" pathLength="1" />
			<circle
				class="ring ring--outer"
				:cx="CIRCLE_X"
				:cy="CIRCLE_Y"
				:r="R_OUTER"
				pathLength="1"
			/>
			<circle
				class="ring ring--inner"
				:cx="CIRCLE_X"
				:cy="CIRCLE_Y"
				:r="R_INNER"
				pathLength="1"
			/>
		</g>

		<!-- The single warm note in the whole page, set on the tangent point -->
		<circle class="disc" :cx="CIRCLE_X" :cy="BASE_Y" r="5" />
	</svg>
</template>

<style scoped>
.mark {
	display: block;
	width: 100%;
	height: auto;
	max-height: 15rem;
	overflow: visible;
}

/* ── Baseline ──────────────────────────────────────────────────── */

.baseline {
	stroke: var(--line-strong);
	stroke-width: 1;
	transform-box: fill-box;
	transform-origin: left center;
	animation: draw-x 900ms var(--ease) both;
}

/* ── Reed field ────────────────────────────────────────────────── */

.reed {
	fill: var(--muted);
	transform-box: fill-box;
	transform-origin: bottom;
	animation: grow-y 620ms var(--ease) both;
}

/* ── Rings ─────────────────────────────────────────────────────── */

.ring {
	fill: none;
	stroke-width: 1;
	stroke-dasharray: 1;
	animation: draw-stroke 1500ms var(--ease) both;
}

.ring--arc {
	stroke: var(--accent);
	stroke-width: 1.25;
	stroke-linecap: round;
	opacity: 0.8;
	animation-delay: 520ms;
}

.ring--outer {
	stroke: var(--accent);
	opacity: 0.5;
	animation-delay: 300ms;
}

.ring--inner {
	stroke: var(--line-strong);
	animation-delay: 420ms;
}

/* ── Focal disc ────────────────────────────────────────────────── */

.disc {
	fill: var(--clay);
	transform-box: fill-box;
	transform-origin: center;
	animation: pop 640ms var(--ease) 900ms both;
}

@keyframes draw-x {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}

@keyframes grow-y {
	from {
		transform: scaleY(0);
	}
	to {
		transform: scaleY(1);
	}
}

@keyframes draw-stroke {
	from {
		stroke-dashoffset: 1;
	}
	to {
		stroke-dashoffset: 0;
	}
}

@keyframes pop {
	from {
		transform: scale(0);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
