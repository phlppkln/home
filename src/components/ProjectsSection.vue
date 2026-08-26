<script setup lang="ts">
import SectionMark from "./SectionMark.vue";
import { ref } from "vue";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard.vue";

const openIds = ref<string[]>([]);

function toggle(id: string) {
	openIds.value = openIds.value.includes(id)
		? openIds.value.filter((openId) => openId !== id)
		: [...openIds.value, id];
}
</script>

<template>
	<section id="projects" class="section">
		<h2><SectionMark variant="stack" />Projects</h2>
		<div class="cards">
			<ProjectCard
				v-for="(project, index) in projects"
				:key="project.id"
				v-reveal="index * 70"
				:project="project"
				:expanded="openIds.includes(project.id)"
				@toggle="toggle(project.id)"
			/>
		</div>
	</section>
</template>

<style scoped>
.cards {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
</style>
