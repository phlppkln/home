<script setup lang="ts">
/**
 * Abstract geometric mark that stands in for the name in the hero, and —
 * once the page scrolls — the page's scroll indicator.
 *
 * The geometry is generated from pure functions of the index and of two
 * scroll-derived numbers, so nothing is random and nothing is animated on
 * a timer: every frame is a function of the scroll position alone.
 *
 *   `compact`  0 at the top of the page → 1 once the hero has collapsed.
 *              Interpolates the whole composition from the tall hero mark
 *              into a low ridge that stays pinned under the topbar.
 *   `progress` 0 → 1 across the scrollable length of the document, and
 *              drives the rider along the ridge. Reaching the clay disc on
 *              the right means the end of the page has been reached.
 *
 * Language: a tapering field of hairline reeds, two concentric circles and
 * an open arc, one clay disc as the focal point, all resting on a single
 * baseline — plus one rider, the only figurative thing on the page.
 */

import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const VIEW_W = 640;
const FIELD_X0 = 36;
const REED_COUNT = 72;

/**
 * The two poses the mark interpolates between. `viewH` shrinks with the
 * rest, which is what makes the pinned band shallow: the SVG keeps its
 * width, so the drawing scale never changes and hairlines stay hairlines.
 */
const HERO = { viewH: 212, baseY: 178, fieldX1: 430, amp: 1, discX: 524 };
const RIDGE = { viewH: 96, baseY: 76, fieldX1: 566, amp: 0.3, discX: 600 };

/** Scroll distance over which the hero pose collapses into the ridge. */
const COLLAPSE_PX = 220;

const compact = ref(0);
const progress = ref(0);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** Smoothstep, so the collapse eases in and out of the scroll instead of ramping. */
const smooth = (t: number) => t * t * (3 - 2 * t);

const viewH = computed(() => lerp(HERO.viewH, RIDGE.viewH, compact.value));
const baseY = computed(() => lerp(HERO.baseY, RIDGE.baseY, compact.value));
const fieldX1 = computed(() => lerp(HERO.fieldX1, RIDGE.fieldX1, compact.value));
const amp = computed(() => lerp(HERO.amp, RIDGE.amp, compact.value));
const discX = computed(() => lerp(HERO.discX, RIDGE.discX, compact.value));

/* ── Terrain ───────────────────────────────────────────────────── */

/**
 * Ridge height at `t` (0 → 1 across the field): a bell envelope, so the
 * field tapers to nothing at both ends, modulated by three sine terms at
 * rising frequencies — enough interference to read as organic rather than
 * as a pattern, and gentle enough that a bicycle can be put on top of it.
 */
function ridge(t: number) {
	const envelope = Math.pow(Math.sin(Math.PI * t), 0.75);
	const detail =
		0.5 +
		0.28 * Math.sin(t * 8.2 + 0.7) +
		0.14 * Math.sin(t * 19.7 + 2.1) +
		0.08 * Math.sin(t * 33.1 + 4.2);

	return 10 + envelope * Math.max(detail, 0) * 140;
}

/** Ground height in view units at an absolute x, in the current pose. */
function groundY(x: number) {
	const x1 = fieldX1.value;
	const a = amp.value;

	if (x <= FIELD_X0) return baseY.value - ridge(0) * a;
	if (x <= x1) return baseY.value - ridge((x - FIELD_X0) / (x1 - FIELD_X0)) * a;

	// Past the field the ridge settles onto the baseline for the run-in.
	const tail = Math.min(1, (x - x1) / 44);
	return baseY.value - ridge(1) * a * (1 - tail);
}

interface Reed {
	x: number;
	y: number;
	height: number;
	opacity: number;
	delay: string;
}

const reeds = computed<Reed[]>(() => {
	const x1 = fieldX1.value;
	const a = amp.value;

	return Array.from({ length: REED_COUNT }, (_, i) => {
		const t = i / (REED_COUNT - 1);
		const envelope = Math.pow(Math.sin(Math.PI * t), 0.75);
		const height = ridge(t) * a;

		return {
			x: FIELD_X0 + t * (x1 - FIELD_X0),
			y: baseY.value - height,
			height,
			// Taller reeds sit slightly forward; keeps the field from reading flat
			opacity: 0.28 + envelope * 0.34,
			delay: `${Math.round(160 + t * 420)}ms`,
		};
	});
});

/* ── Rider ─────────────────────────────────────────────────────── */

const WHEEL_R = 4.2;
/** Matches the drawn wheel centres — both wheels are put on the ground. */
const WHEELBASE = 11.2;
/** Roughly the rider's height in view units, from the wheels to the helmet. */
const RIDER_H = 23;

/** Width the SVG is actually rendered at, so the rider can hold a legible size. */
const rendered = ref(0);

/**
 * The mark scales with the column, which on a phone would leave the rider
 * around ten pixels tall — a smudge rather than a cyclist. Below that it
 * grows back to a readable size against the ridge.
 */
const riderScale = computed(() => {
	if (!rendered.value) return 1;
	const px = (RIDER_H * rendered.value) / VIEW_W;
	return clamp(18 / px, 1, 1.8);
});

const rider = computed(() => {
	const scale = riderScale.value;
	const base = WHEELBASE * scale;
	const x = lerp(FIELD_X0, discX.value, progress.value);
	const rear = groundY(x - base / 2);
	const front = groundY(x + base / 2);
	// Resting on two contact points rather than one smooths the ride over
	// the highest-frequency wiggle in the terrain for free.
	const y = (rear + front) / 2;
	const tilt = clamp((Math.atan2(front - rear, base) * 180) / Math.PI, -34, 34);

	return {
		x,
		transform: `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${tilt.toFixed(2)}) scale(${scale.toFixed(3)})`,
		// Wheels turn with distance travelled, not with time
		spin: ((x - FIELD_X0) * 360) / (2 * Math.PI * WHEEL_R * scale),
	};
});

/** The rings belong to the hero pose only — they cannot fit the ridge. */
const ringOpacity = computed(() => Math.max(0, 1 - compact.value * 1.8));
/** Arrival flare on the clay disc over the last stretch of the page. */
const arrival = computed(() => smooth(clamp((progress.value - 0.9) / 0.1, 0, 1)));

/* ── Rings ─────────────────────────────────────────────────────── */

const CIRCLE_X = HERO.discX;
const R_OUTER = 76;
const R_INNER = 46;
/* Derived, not typed in: the outer ring rests exactly on the hero baseline. */
const CIRCLE_Y = HERO.baseY - R_OUTER;

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

/* ── Scroll ────────────────────────────────────────────────────── */

const svg = ref<SVGSVGElement | null>(null);
let frame = 0;
let observer: ResizeObserver | undefined;

function measure() {
	frame = 0;
	const max = document.documentElement.scrollHeight - window.innerHeight;
	const y = window.scrollY;

	progress.value = max > 4 ? clamp(y / max, 0, 1) : 0;
	compact.value = smooth(clamp(y / COLLAPSE_PX, 0, 1));
}

function onScroll() {
	if (!frame) frame = requestAnimationFrame(measure);
}

onMounted(() => {
	measure();
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });

	if (svg.value && typeof ResizeObserver !== "undefined") {
		observer = new ResizeObserver(([entry]) => {
			rendered.value = entry.contentRect.width;
		});
		observer.observe(svg.value);
	}
});

onBeforeUnmount(() => {
	if (frame) cancelAnimationFrame(frame);
	observer?.disconnect();
	window.removeEventListener("scroll", onScroll);
	window.removeEventListener("resize", onScroll);
});
</script>

<template>
	<!--
		The outer box keeps the hero's full height for the whole life of the
		page, so collapsing the mark never reflows the document under the
		reader's thumb. Only the band inside it shrinks; the rest of the box
		is empty overlay, hence `pointer-events: none`.
	-->
	<div class="ridge">
		<div class="ridge-band">
			<svg
				ref="svg"
				class="mark"
				:viewBox="`0 0 ${VIEW_W} ${viewH.toFixed(2)}`"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<!-- Everything behind the rider counts as travelled -->
					<clipPath id="ridge-travelled">
						<rect x="0" y="0" :width="rider.x" :height="viewH" />
					</clipPath>
				</defs>

				<!-- Baseline: everything rests on this one rule -->
				<line
					class="baseline"
					:x1="24"
					:y1="baseY"
					:x2="VIEW_W - 24"
					:y2="baseY"
				/>

				<g class="field">
					<rect
						v-for="(reed, i) in reeds"
						:key="i"
						class="reed"
						:x="reed.x"
						:y="reed.y"
						width="1"
						:height="reed.height"
						:style="{ opacity: reed.opacity, animationDelay: reed.delay }"
					/>
				</g>

				<!--
					The stretch already ridden, drawn once more in the accent and
					clipped to the rider's x. One attribute changes per frame,
					which is what keeps the scroll handler cheap.
				-->
				<g class="travelled" clip-path="url(#ridge-travelled)">
					<line
						class="baseline baseline--travelled"
						:x1="24"
						:y1="baseY"
						:x2="VIEW_W - 24"
						:y2="baseY"
					/>
					<rect
						v-for="(reed, i) in reeds"
						:key="i"
						class="reed reed--travelled"
						:x="reed.x"
						:y="reed.y"
						width="1"
						:height="reed.height"
						:style="{ opacity: reed.opacity, animationDelay: reed.delay }"
					/>
				</g>

				<g class="rings" :style="{ opacity: ringOpacity }">
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

				<!-- The finish: the rider arrives here at the end of the page -->
				<circle
					class="finish"
					:cx="discX"
					:cy="baseY"
					:r="5 + arrival * 7"
					:style="{ opacity: arrival * 0.55 }"
				/>
				<!-- The single warm note in the whole page -->
				<circle class="disc" :cx="discX" :cy="baseY" r="5" />

				<g class="rider" :transform="rider.transform">
					<g class="bike">
						<path
							class="frame"
							d="M -5.6 -4.2 L -0.4 -3.6 L -4 -11 Z
							   M -0.4 -3.6 L 4.6 -10.2 L -4 -11
							   M 4.6 -10.2 L 5.6 -4.2"
						/>
						<g class="wheel" :transform="`translate(-5.6 -4.2) rotate(${rider.spin})`">
							<circle :r="WHEEL_R" />
							<line class="spoke" :x1="-WHEEL_R" y1="0" :x2="WHEEL_R" y2="0" />
							<line class="spoke" x1="0" :y1="-WHEEL_R" x2="0" :y2="WHEEL_R" />
						</g>
						<g class="wheel" :transform="`translate(5.6 -4.2) rotate(${rider.spin})`">
							<circle :r="WHEEL_R" />
							<line class="spoke" :x1="-WHEEL_R" y1="0" :x2="WHEEL_R" y2="0" />
							<line class="spoke" x1="0" :y1="-WHEEL_R" x2="0" :y2="WHEEL_R" />
						</g>
					</g>
					<g class="body">
						<path class="limb" d="M -3.4 -12.6 L 1.2 -9.6 L -0.4 -4.6" />
						<path class="torso" d="M -3.4 -12.6 L 0.4 -18" />
						<path class="limb" d="M 0.4 -18 L 4.6 -10.2" />
						<circle class="head" cx="2" cy="-20.4" r="2.2" />
					</g>
				</g>
			</svg>
		</div>
	</div>
</template>

<style scoped>
/* ── Pinned box ────────────────────────────────────────────────── */

.ridge {
	position: sticky;
	top: var(--topbar-h, 3.5rem);
	z-index: 5;
	/* Reserves the hero pose's height for the whole page — see template */
	width: 100%;
	aspect-ratio: 640 / 212;
	margin-top: 2.5rem;
	pointer-events: none;
}

/*
 * Hugs the drawing, so the paper ground and the fade below it follow the
 * band as it collapses instead of covering the whole reserved box.
 */
.ridge-band {
	position: relative;
	background: var(--paper);
}

.ridge-band::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	top: 100%;
	height: 0.9rem;
	background: linear-gradient(var(--paper), transparent);
}

.mark {
	display: block;
	width: 100%;
	height: auto;
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

/* ── Travelled stretch ─────────────────────────────────────────── */

.reed--travelled {
	fill: var(--accent);
}

.baseline--travelled {
	stroke: var(--accent);
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

.finish {
	fill: none;
	stroke: var(--clay);
	stroke-width: 1;
}

/* ── Rider ─────────────────────────────────────────────────────── */

.rider {
	animation: fade-in 700ms var(--ease) 1100ms both;
}

.bike {
	fill: none;
	stroke: var(--text);
	stroke-width: 1;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.spoke {
	opacity: 0.35;
}

.body {
	fill: none;
	stroke: var(--clay);
	stroke-width: 1.5;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.head {
	fill: var(--clay);
	stroke: none;
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

@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* On paper there is no scroll position to report, so the rider goes */
@media print {
	.ridge {
		position: static;
	}

	.rider,
	.ridge-band::after {
		display: none;
	}
}
</style>
