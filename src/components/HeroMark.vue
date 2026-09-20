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

import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

/**
 * Once pinned the band is also the page's section nav, read like a stage
 * profile: each section owns the stretch of the ridge it is scrolled
 * through, its label centred beneath and the current one underlined by a
 * bar along its stretch. The shell passes the sections and which one is
 * current; the band reports when it is pinned so the shell can fade its
 * own topbar copy out and hand over.
 */
const props = defineProps<{
	sections: { id: string; label: string }[];
	active: string;
}>();
const emit = defineEmits<{ pinned: [value: boolean] }>();

const VIEW_W = 640;
const FIELD_X0 = 36;
const REED_COUNT = 72;

/**
 * The two poses the mark interpolates between. `viewH` shrinks with the
 * rest, which is what makes the pinned band shallow: the SVG keeps its
 * width, so the drawing scale never changes and hairlines stay hairlines.
 *
 * `rider` scales the cyclist with the pose. In the ridge the reeds are a
 * third of their hero height, and a hero-sized rider would tower over
 * them with its helmet against the nav's hairline. The ridge's `baseY`
 * is the tallest reed plus the rider plus a hair — the topbar above is
 * opaque, so that is the least room that keeps the rider whole at the
 * summit; under the baseline sits the current sector's bar (see below).
 */
const HERO = { viewH: 212, baseY: 178, fieldX1: 430, amp: 1, discX: 524, rider: 1 };
const RIDGE = { viewH: 59, baseY: 43, fieldX1: 566, amp: 0.18, discX: 600, rider: 0.64 };

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
 * around ten pixels tall — a smudge rather than a cyclist. So the pose's
 * scale is floored at a legible pixel height (a little lower in the
 * ridge, where the rider is meant to be small) and capped so it never
 * grows past a bicycle on a phone-width hero.
 */
const riderScale = computed(() => {
	const pose = lerp(HERO.rider, RIDGE.rider, compact.value);
	if (!rendered.value) return pose;
	const natural = (RIDER_H * rendered.value) / VIEW_W;
	const floor = lerp(18, 13, compact.value);
	return clamp(Math.max(pose * natural, floor) / natural, RIDGE.rider, 1.8);
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

/** Fully collapsed and resting under the topbar — the "sticky" state proper. */
const pinned = computed(() => compact.value >= 1);
watch(pinned, (value) => emit("pinned", value));

/* ── Sectors ───────────────────────────────────────────────────── */

/** How far the current sector's bar sits below the baseline, in view units. */
const AXIS_DROP = 7;

interface Range {
	id: string;
	label: string;
	/** Scroll progress over which this section holds the viewport's centre. */
	from: number;
	to: number;
}

const ranges = ref<Range[]>([]);
/** Document height the ranges were measured at; re-measured when it moves. */
let measuredAt = 0;

/**
 * A section is "current" while it crosses the middle of the viewport
 * (useActiveSection), so its stretch of the ridge runs from the scroll
 * position where its top reaches the centre line to where its bottom
 * does. Neighbouring sections abut, so the sectors tile the ridge; the
 * intro before the first one is the neutral run-up, unlabelled.
 */
function measureSections() {
	const max = document.documentElement.scrollHeight - window.innerHeight;
	if (max <= 4) {
		ranges.value = [];
		return;
	}
	const centre = window.innerHeight / 2;
	const y = window.scrollY;

	ranges.value = props.sections.flatMap(({ id, label }) => {
		const el = document.getElementById(id);
		if (!el) return [];
		const rect = el.getBoundingClientRect();
		const top = rect.top + y;
		return [
			{
				id,
				label,
				from: clamp((top - centre) / max, 0, 1),
				to: clamp((top + rect.height - centre) / max, 0, 1),
			},
		];
	});
}

const sectors = computed(() =>
	ranges.value.map((range) => ({
		...range,
		x0: lerp(FIELD_X0, discX.value, range.from),
		x1: lerp(FIELD_X0, discX.value, range.to),
	})),
);

/** A label under the pointer or keyboard focus lights its sector too. */
const hovered = ref("");
const lit = computed(() => hovered.value || props.active);
const litSector = computed(() => sectors.value.find((s) => s.id === lit.value));

/** View units → percentage of the band, for the HTML labels under the SVG. */
const pct = (units: number) => `${((units / VIEW_W) * 100).toFixed(3)}%`;
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
	const height = document.documentElement.scrollHeight;
	const max = height - window.innerHeight;
	const y = window.scrollY;

	progress.value = max > 4 ? clamp(y / max, 0, 1) : 0;
	compact.value = smooth(clamp(y / COLLAPSE_PX, 0, 1));

	// Sections move when the page grows (a project card opening, say)
	if (height !== measuredAt) {
		measuredAt = height;
		measureSections();
	}
}

function onScroll() {
	if (!frame) frame = requestAnimationFrame(measure);
}

/** A resize moves the centre line even when the document height holds. */
function onResize() {
	measuredAt = 0;
	onScroll();
}

onMounted(() => {
	measure();
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onResize, { passive: true });

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
	window.removeEventListener("resize", onResize);
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
		<div class="ridge-band" :style="{ '--compact': compact.toFixed(3) }">
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

				<!--
					The current sector, marked under the baseline with one accent
					bar spanning its stretch — the sectors themselves are implied
					by the labels, not drawn. Fades in with the collapse: in the
					hero pose the mark is a picture, not a map.
				-->
				<g class="axis" :style="{ opacity: compact }">
					<line
						v-if="litSector"
						class="axis-bar"
						:x1="litSector.x0"
						:x2="litSector.x1"
						:y1="baseY + AXIS_DROP"
						:y2="baseY + AXIS_DROP"
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

			<!--
				The label row opens under the ridge only while pinned: a 0fr → 1fr
				grid row, so the band grows and the ground and shadow follow it.
				Each label is an HTML link (so it keeps a real hit area and
				text size on a phone, unlike SVG text) spanning its sector's
				width and centred in it. `inert` keeps the parked row out of
				the tab order and the accessibility tree while the topbar's
				copy is the live one.
			-->
			<div class="ridge-nav" :class="{ 'is-open': pinned }" :inert="!pinned">
				<div class="ridge-nav-clip">
					<nav class="labels" :class="{ 'is-in': pinned }" aria-label="Sections">
						<a
							v-for="sector in sectors"
							:key="sector.id"
							:href="`#${sector.id}`"
							:class="{ 'is-active': sector.id === active }"
							:style="{ left: pct(sector.x0), width: pct(sector.x1 - sector.x0) }"
							@mouseenter="hovered = sector.id"
							@mouseleave="hovered = ''"
							@focus="hovered = sector.id"
							@blur="hovered = ''"
							>{{ sector.label }}</a
						>
					</nav>
				</div>
			</div>
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
	/* The topbar loses its nav row on phones once pinned; glide up, don't jump */
	transition: top var(--base) var(--ease);
}

/*
 * Hugs the drawing, so the paper ground follows the band as it collapses
 * instead of covering the whole reserved box.
 */
.ridge-band {
	position: relative;
}

/*
 * The ground and its shadow bleed to the viewport edges, like the topbar
 * above it, so the pinned band reads as the lower half of one header bar
 * rather than a card floating in the column. The shadow is what lifts it
 * off the content scrolling under it: its alpha follows `--compact`, so
 * at rest — where the mark is part of the hero, not a bar — there is
 * none, and it comes in with the collapse. (100vw includes a classic
 * scrollbar's width; the root clips that sliver, see styles.css.)
 */
.ridge-band::before {
	content: "";
	position: absolute;
	top: 0;
	bottom: 0;
	left: 50%;
	z-index: -1;
	width: 100vw;
	transform: translateX(-50%);
	background: var(--paper);
	box-shadow:
		0 1px 0 rgb(34 32 28 / calc(0.05 * var(--compact, 0))),
		0 10px 24px -12px rgb(34 32 28 / calc(0.22 * var(--compact, 0)));
}

.mark {
	display: block;
	width: 100%;
	height: auto;
	overflow: visible;
}

/* ── Nav row ───────────────────────────────────────────────────── */

.ridge-nav {
	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows var(--base) var(--ease);
	/* The pinned box swallows no clicks — except here, where the links live */
	pointer-events: auto;
}

.ridge-nav.is-open {
	grid-template-rows: 1fr;
}

.ridge-nav-clip {
	overflow: hidden;
}

/*
 * Category labels of a chart axis: small caps in the heading face, each
 * centred under its sector. They rise into the row from below once the
 * band pins, a beat after the topbar's copy has faded.
 */
.labels {
	position: relative;
	height: var(--ridge-nav-h);
	opacity: 0;
	transform: translateY(100%);
	transition:
		opacity var(--base) var(--ease),
		transform var(--base) var(--ease);
}

.labels.is-in {
	opacity: 1;
	transform: none;
	transition-delay: 80ms;
}

.labels a {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--font-heading);
	font-size: 0.66rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.11em;
	white-space: nowrap;
	color: var(--muted);
	text-decoration: none;
	transition: color var(--fast) var(--ease);
}

.labels a:hover,
.labels a:focus-visible {
	color: var(--text);
}

.labels a.is-active {
	color: var(--accent);
}

.labels a:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: -2px;
	border-radius: 2px;
}

@media (max-width: 40rem) {
	.labels a {
		font-size: 0.58rem;
		letter-spacing: 0.08em;
	}
}

/* ── Current sector ────────────────────────────────────────────── */

.axis-bar {
	stroke: var(--accent);
	stroke-width: 2;
	stroke-linecap: round;
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

	.ridge-band::before {
		box-shadow: none;
	}

	.rider,
	.ridge-nav {
		display: none;
	}
}
</style>
