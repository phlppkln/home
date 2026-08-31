<script setup lang="ts">
import type { Project } from "../data/projects";

defineProps<{ project: Project; expanded: boolean }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
	<article class="card" :class="{ 'card--open': expanded }">
		<!--
			The whole head is the click target, which would otherwise make the
			button's accessible name the entire card text. A hidden heading
			keeps the document outline, and aria-label keeps the control's own
			name short. (A real <h3> cannot live inside <button> — headings are
			flow content, buttons take phrasing content.)
		-->
		<h3 class="visually-hidden">{{ project.title }}</h3>

		<button
			class="card-head"
			type="button"
			:aria-expanded="expanded"
			:aria-controls="`details-${project.id}`"
			:aria-label="`${project.title} — ${expanded ? 'show less' : 'show more'}`"
			@click="$emit('toggle')"
		>
			<span class="meta">
				<span>{{ project.org }}</span>
				<span v-if="project.period" class="meta-sep" aria-hidden="true">·</span>
				<span v-if="project.period">{{ project.period }}</span>
				<span class="chevron" aria-hidden="true"></span>
			</span>

			<span class="title">{{ project.title }}</span>
			<span class="subtitle">{{ project.subtitle }}</span>
			<span class="summary">{{ project.summary }}</span>

			<span class="tags">
				<span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
			</span>

			<span class="hint">{{ expanded ? "Show less" : "Show more" }}</span>
		</button>

		<!--
			Collapsed with a 0fr → 1fr grid row rather than v-show, so the
			height animates and the content stays in the DOM for print. The
			clip is hidden from assistive tech and tab order while closed.
		-->
		<div
			:id="`details-${project.id}`"
			class="disclosure"
			:class="{ 'is-open': expanded }"
			role="region"
			:aria-label="`${project.title} — details`"
		>
			<div class="disclosure-clip">
				<div class="card-body">
					<h4>Context</h4>
					<p>{{ project.details.context }}</p>

					<h4>What I did</h4>
					<ul class="contribution">
						<li v-for="item in project.details.contribution" :key="item">
							{{ item }}
						</li>
					</ul>

					<h4>Outcome</h4>
					<p>{{ project.details.outcome }}</p>

					<h4>Stack</h4>
					<p class="stack">{{ project.details.stack.join(" · ") }}</p>

					<template v-if="project.details.links.length">
						<h4>Links</h4>
						<ul class="links">
							<li v-for="link in project.details.links" :key="link.href">
								<a :href="link.href" target="_blank" rel="noopener">{{
									link.label
								}}</a>
							</li>
						</ul>
					</template>

					<p v-if="project.details.note" class="note">
						{{ project.details.note }}
					</p>
				</div>
			</div>
		</div>
	</article>
</template>

<style scoped>
.card {
	position: relative;
	background: var(--surface);
	border: 1px solid var(--line);
	border-radius: var(--radius-lg);
	transition:
		border-color var(--base) var(--ease),
		box-shadow var(--base) var(--ease),
		transform var(--base) var(--ease);
}

.card:hover {
	border-color: var(--line-strong);
	box-shadow: 0 1px 2px rgba(34, 32, 28, 0.04), 0 6px 18px rgba(34, 32, 28, 0.045);
	transform: translateY(-1px);
}

.card--open {
	border-color: var(--line-strong);
}

/*
 * An accent rule runs down the edge of an open card — a quiet anchor that
 * marks which one you are reading without adding another box or label.
 */
.card::before {
	content: "";
	position: absolute;
	/*
	 * Inset clear of the rounded corners rather than clipping the card with
	 * overflow:hidden — that would also clip the button's focus outline in
	 * browsers without :has() support, where it is the only focus indicator.
	 */
	top: 0.45rem;
	bottom: 0.45rem;
	left: 0;
	width: 2px;
	border-radius: 0 2px 2px 0;
	background: var(--accent);
	transform: scaleY(0);
	transform-origin: top center;
	transition: transform var(--base) var(--ease);
}

.card--open::before {
	transform: scaleY(1);
}

/*
 * Keyboard focus should ring the whole card rather than the inner button
 * box. Both halves are guarded behind @supports: without :has() the card
 * cannot take the ring, so the button must keep its own — dropping the
 * outline unconditionally would leave those browsers with no focus
 * indicator at all.
 */
@supports selector(:has(*)) {
	.card:has(.card-head:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.card-head:focus-visible {
		outline: none;
	}
}

.card-head {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.55rem;
	width: 100%;
	padding: 1.5rem;
	background: none;
	border: 0;
	font: inherit;
	color: inherit;
	text-align: left;
	cursor: pointer;
}

.meta {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
	font-family: var(--font-heading);
	font-size: 0.7rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.11em;
	color: var(--faint);
}

.meta-sep {
	color: var(--line-strong);
}

.chevron {
	flex: none;
	width: 0.5rem;
	height: 0.5rem;
	margin-left: auto;
	margin-top: -0.2rem;
	border-right: 1px solid var(--muted);
	border-bottom: 1px solid var(--muted);
	transform: rotate(45deg);
	transition:
		transform var(--base) var(--ease),
		border-color var(--fast) var(--ease);
}

.card--open .chevron {
	transform: rotate(-135deg) translate(-0.15rem, -0.15rem);
}

.card:hover .chevron {
	border-color: var(--accent);
}

.title {
	font-family: var(--font-heading);
	font-size: 1.2rem;
	font-weight: 500;
	line-height: 1.3;
	letter-spacing: -0.012em;
	color: var(--text);
	transition: color var(--fast) var(--ease);
}

.card:hover .title {
	color: var(--accent);
}

.subtitle {
	font-size: 0.925rem;
	line-height: 1.5;
	color: var(--muted);
}

.summary {
	max-width: 66ch;
	font-size: 0.95rem;
	margin-top: 0.15rem;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.3rem;
	margin-top: 0.35rem;
}

.tag {
	padding: 0.15rem 0.5rem;
	border-radius: var(--radius);
	background: var(--surface-sunken);
	font-size: 0.72rem;
	letter-spacing: 0.01em;
	line-height: 1.6;
	color: var(--muted);
}

.hint {
	margin-top: 0.35rem;
	font-family: var(--font-heading);
	font-size: 0.7rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.11em;
	color: var(--accent);
	transition: opacity var(--fast) var(--ease);
	opacity: 0.75;
}

.card:hover .hint {
	opacity: 1;
}

/* ── Disclosure ────────────────────────────────────────────────── */

.disclosure {
	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows var(--base) var(--ease);
}

.disclosure.is-open {
	grid-template-rows: 1fr;
}

.disclosure-clip {
	overflow: hidden;
}

/* Hide from AT and tab order, but only after the collapse has finished */
.disclosure:not(.is-open) .disclosure-clip {
	visibility: hidden;
	transition: visibility 0s linear var(--base);
}

.disclosure.is-open .disclosure-clip {
	visibility: visible;
	transition: visibility 0s;
}

.card-body {
	padding: 0.25rem 1.5rem 1.65rem;
	opacity: 0;
	transform: translateY(-4px);
	transition:
		opacity var(--base) var(--ease),
		transform var(--base) var(--ease);
}

.disclosure.is-open .card-body {
	opacity: 1;
	transform: none;
	transition-delay: 90ms;
}

.card-body::before {
	content: "";
	display: block;
	border-top: 1px solid var(--line);
	margin-bottom: 1.35rem;
}

/* Label caps, but inked and spaced enough to read as a heading */
h4 {
	font-size: 0.8rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--text);
	margin-bottom: 0.5rem;
}

h4 + p,
h4 + ul {
	margin-bottom: 1.4rem;
}

.card-body p,
.card-body li {
	max-width: 70ch;
	font-size: 0.925rem;
	line-height: 1.7;
}

.contribution {
	list-style: none;
}

.contribution li {
	position: relative;
	padding-left: 1.1rem;
	margin-bottom: 0.5rem;
}

.contribution li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.75em;
	width: 0.3rem;
	height: 1px;
	background: var(--line-strong);
}

.stack {
	color: var(--muted);
}

.links {
	list-style: none;
}

.links li {
	margin-bottom: 0.3rem;
}

.note {
	margin-top: 0.75rem;
	padding-top: 0.75rem;
	border-top: 1px solid var(--line);
	font-size: 0.85rem;
	color: var(--faint);
}

@media (max-width: 40rem) {
	.card-head {
		padding: 1.25rem;
	}

	.card-body {
		padding: 0.25rem 1.25rem 1.35rem;
	}
}

/* ── Print ─────────────────────────────────────────────────────── */

/*
 * On paper every card is open: force the grid row and undo the
 * collapsed clip, since there is no interaction to expand it.
 */
@media print {
	.card {
		border-color: var(--line-strong);
		box-shadow: none;
		transform: none;
		break-inside: avoid;
	}

	.card::before {
		display: none;
	}

	.disclosure {
		grid-template-rows: 1fr !important;
	}

	.disclosure-clip {
		visibility: visible !important;
		overflow: visible !important;
	}

	.card-body {
		opacity: 1 !important;
		transform: none !important;
	}

	.chevron,
	.hint {
		display: none;
	}
}
</style>
