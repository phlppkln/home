<script setup lang="ts">
import type { Project } from "../data/projects";

defineProps<{ project: Project; expanded: boolean }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
	<article class="card" :class="{ 'card--open': expanded }">
		<button
			class="card-head"
			type="button"
			:aria-expanded="expanded"
			:aria-controls="`details-${project.id}`"
			@click="$emit('toggle')"
		>
			<span class="meta">
				<span>{{ project.org }}</span>
				<span v-if="project.period">{{ project.period }}</span>
			</span>
			<span class="title-row">
				<h3>{{ project.title }}</h3>
				<span class="chevron" aria-hidden="true"></span>
			</span>
			<span class="subtitle">{{ project.subtitle }}</span>
			<span class="summary">{{ project.summary }}</span>
			<span class="tags">
				<span v-for="tag in project.tags" :key="tag" class="tag">{{
					tag
				}}</span>
			</span>
			<span class="hint">{{ expanded ? "Show less" : "Show more" }}</span>
		</button>

		<div v-show="expanded" :id="`details-${project.id}`" class="card-body">
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
	</article>
</template>

<style scoped>
.card {
	border: 1px solid var(--border);
	border-radius: var(--radius);
	background: var(--surface);
	overflow: hidden;
}

.card--open {
	border-color: var(--border-strong);
}

.card-head {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 100%;
	padding: 1.25rem;
	background: none;
	border: 0;
	font: inherit;
	color: inherit;
	text-align: left;
	cursor: pointer;
}

.card-head:hover h3 {
	color: var(--accent);
}

.meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem 0.75rem;
	font-family: var(--font-heading);
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--muted);
}

.title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

h3 {
	font-size: 1.3rem;
	color: var(--primary);
	transition: color 0.15s ease;
}

.chevron {
	flex: none;
	width: 0.6rem;
	height: 0.6rem;
	border-right: 2px solid var(--muted);
	border-bottom: 2px solid var(--muted);
	transform: rotate(45deg);
	transform-origin: center;
	margin-top: -0.3rem;
}

.card--open .chevron {
	transform: rotate(-135deg);
	margin-top: 0.2rem;
}

.subtitle {
	color: var(--muted);
	font-size: 0.95rem;
}

.summary {
	max-width: 68ch;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
}

.tag {
	padding: 0.15rem 0.55rem;
	border: 1px solid var(--border);
	border-radius: 0.25rem;
	font-size: 0.75rem;
	color: var(--muted);
}

.hint {
	font-family: var(--font-heading);
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--primary);
}

.card-body {
	padding: 0 1.25rem 1.5rem;
	border-top: 1px solid var(--border);
	margin-top: 0.25rem;
	padding-top: 1rem;
}

h4 {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--accent);
	margin-bottom: 0.35rem;
}

h4 + p,
h4 + ul {
	margin-bottom: 1.1rem;
}

.card-body p,
.card-body li {
	max-width: 72ch;
	font-size: 0.95rem;
}

.contribution {
	list-style: none;
}

.contribution li {
	position: relative;
	padding-left: 1rem;
	margin-bottom: 0.4rem;
}

.contribution li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.6em;
	width: 0.35rem;
	height: 0.35rem;
	border-radius: 50%;
	background: var(--primary);
}

.stack {
	color: var(--muted);
}

.links {
	list-style: none;
}

.links li {
	margin-bottom: 0.25rem;
}

.note {
	font-size: 0.85rem;
	color: var(--muted);
	font-style: italic;
	margin-top: 0.5rem;
}
</style>
