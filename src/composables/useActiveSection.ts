import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Tracks which section is currently under the middle of the viewport, so
 * the nav can mark it. The root margin collapses the viewport to a thin
 * band across the centre — whichever section crosses that band wins,
 * which avoids the flicker you get when several sections are on screen.
 *
 * Ids that are not in the DOM (the timeline hides itself while empty) are
 * skipped silently.
 */
export function useActiveSection(ids: string[]) {
	const active = ref("");
	let observer: IntersectionObserver | undefined;

	onMounted(() => {
		if (typeof IntersectionObserver === "undefined") return;

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) active.value = entry.target.id;
				}
			},
			{ rootMargin: "-45% 0px -45% 0px", threshold: 0 },
		);

		for (const id of ids) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}
	});

	onBeforeUnmount(() => observer?.disconnect());

	return { active };
}
