<script setup lang="ts">
import SectionMark from "./SectionMark.vue";
import { skills } from "../data/skills";
</script>

<template>
	<section id="skills" class="section">
		<h2><SectionMark variant="reeds" />Skills</h2>
		<dl class="groups">
			<template v-for="(group, index) in skills" :key="group.label">
				<dt v-reveal="index * 60">{{ group.label }}</dt>
				<dd v-reveal="index * 60">
					<ul>
						<li v-for="item in group.items" :key="item">{{ item }}</li>
					</ul>
				</dd>
			</template>
		</dl>
	</section>
</template>

<style scoped>
/*
 * Same two-column rhythm as the timeline, so the two sections read as one
 * system rather than as two separate lists.
 */
.groups {
	display: grid;
	grid-template-columns: 9rem 1fr;
	gap: 0.35rem 1.25rem;
}

dt {
	padding: 0.55rem 0;
	font-family: var(--font-heading);
	font-size: 0.8rem;
	letter-spacing: 0.02em;
	color: var(--faint);
}

dd {
	padding: 0.55rem 0;
}

ul {
	display: flex;
	flex-wrap: wrap;
	gap: 0.3rem 0.9rem;
	list-style: none;
	padding-left: 0;
	font-size: 0.925rem;
	line-height: 1.6;
}

/* Hairline separators instead of chips — fewer boxes, same scannability */
li {
	position: relative;
}

li + li {
	padding-left: 0.9rem;
}

li + li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.3em;
	bottom: 0.3em;
	border-left: 1px solid var(--line-strong);
}

@media (max-width: 40rem) {
	.groups {
		grid-template-columns: 1fr;
		gap: 0;
	}

	dt {
		padding-bottom: 0;
	}

	dd {
		padding-top: 0.35rem;
	}
}
</style>
