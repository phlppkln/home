<script setup lang="ts">
import { ref } from "vue";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard.vue";

const openIds = ref<string[]>([]);

function toggle(id: string) {
	openIds.value = openIds.value.includes(id)
		? openIds.value.filter((openId) => openId !== id)
		: [...openIds.value, id];
}

function toggleAll() {
	openIds.value = openIds.value.length ? [] : projects.map((p) => p.id);
}
</script>

<template>
	<section id="projects" class="section">
		<div class="head">
			<h2>Projects</h2>
			<button class="toggle-all" type="button" @click="toggleAll">
				{{ openIds.length ? "Collapse all" : "Expand all" }}
			</button>
		</div>
		<div class="cards">
			<ProjectCard
				v-for="project in projects"
				:key="project.id"
				:project="project"
				:expanded="openIds.includes(project.id)"
				@toggle="toggle(project.id)"
			/>
		</div>
	</section>
</template>

<style scoped>
.head {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 1rem;
}

.toggle-all {
	background: none;
	border: 0;
	padding: 0;
	font-family: var(--font-heading);
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--primary);
	cursor: pointer;
}

.toggle-all:hover {
	color: var(--accent);
}

.cards {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
