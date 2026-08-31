<script setup lang="ts">
import SectionMark from "./SectionMark.vue";
import { skills } from "../data/skills";
</script>

<template>
	<section id="skills" class="section">
		<h2><SectionMark variant="reeds" />Skills</h2>

		<div class="groups">
			<section
				v-for="(group, index) in skills"
				:key="group.label"
				class="group"
				v-reveal="index * 60"
			>
				<h3>{{ group.label }}</h3>
				<ul>
					<li v-for="item in group.items" :key="item">{{ item }}</li>
				</ul>
			</section>
		</div>
	</section>
</template>

<style scoped>
/*
 * One block per group, stacked: the group name is a heading in its own
 * right and its items sit underneath it. The previous two-column run
 * packed every group into a single busy line of separated words — here
 * the structure does the work, so the items themselves can stay quiet.
 */
.groups {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

/* A hairline between groups, not around them — no boxes */
.group + .group {
	border-top: 1px solid var(--line);
	padding-top: 2rem;
}

h3 {
	margin-bottom: 0.9rem;
}

/*
 * Items wrap into even columns rather than flowing as one paragraph, so
 * the eye can scan a group top-to-bottom instead of scrubbing a line.
 */
ul {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
	gap: 0.15rem 1.75rem;
	list-style: none;
	padding-left: 0;
	font-size: 0.95rem;
	line-height: 1.7;
	color: var(--muted);
}

/* A short hairline tick instead of a bullet — quieter, still a list */
li {
	position: relative;
	padding-left: 0.85rem;
}

li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.85em;
	width: 0.4rem;
	border-top: 1px solid var(--line-strong);
}

@media (max-width: 40rem) {
	.groups {
		gap: 1.6rem;
	}

	.group + .group {
		padding-top: 1.6rem;
	}
}
</style>
