<script setup lang="ts">
/**
 * Small decorative glyph shown beside a section heading.
 *
 * All four are drawn from the hero mark's vocabulary — hairline strokes, a
 * baseline, one note in the accent — so the page reads as one system. They
 * are sized for 18px, which is why each is only three or four elements:
 * anything busier turns to mush at that scale.
 *
 * Purely decorative, so aria-hidden — the heading text carries the meaning.
 */
defineProps<{ variant: "ring" | "reeds" | "track" | "stack" }>();
</script>

<template>
	<svg
		class="mark"
		viewBox="0 0 18 18"
		aria-hidden="true"
		focusable="false"
	>
		<!-- About — a single ring, the hero's core motif -->
		<template v-if="variant === 'ring'">
			<circle cx="8.2" cy="9.8" r="5.4" />
			<circle class="accent" cx="13.9" cy="4.4" r="1.2" />
		</template>

		<!-- Skills — the reed field, one reed picked out -->
		<template v-else-if="variant === 'reeds'">
			<line x1="2" y1="14.5" x2="16" y2="14.5" />
			<line x1="4.5" y1="14.5" x2="4.5" y2="9.5" />
			<line x1="7.5" y1="14.5" x2="7.5" y2="5.5" />
			<line class="accent-stroke" x1="10.5" y1="14.5" x2="10.5" y2="3.5" />
			<line x1="13.5" y1="14.5" x2="13.5" y2="8" />
		</template>

		<!-- Timeline — a track with milestones -->
		<template v-else-if="variant === 'track'">
			<line x1="1.8" y1="9" x2="16.2" y2="9" />
			<circle class="dot" cx="4.2" cy="9" r="1.3" />
			<circle class="accent" cx="9" cy="9" r="1.3" />
			<circle class="dot" cx="13.8" cy="9" r="1.3" />
		</template>

		<!-- Projects — a stack of cards -->
		<template v-else>
			<line x1="3" y1="5" x2="15" y2="5" />
			<line class="accent-stroke" x1="3" y1="9" x2="12" y2="9" />
			<line x1="3" y1="13" x2="14" y2="13" />
		</template>
	</svg>
</template>

<style scoped>
.mark {
	flex: none;
	width: 1.125rem;
	height: 1.125rem;
	overflow: visible;
}

/* Strokes inherit the heading colour; only the accent note breaks out */
.mark :is(circle, line) {
	fill: none;
	stroke: currentColor;
	stroke-width: 1;
}

.dot,
.accent {
	stroke: none;
}

.dot {
	fill: currentColor;
}

.accent {
	fill: var(--accent);
}

.accent-stroke {
	stroke: var(--accent);
}
</style>
