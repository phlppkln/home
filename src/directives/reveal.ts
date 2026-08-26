import type { Directive } from "vue";

/**
 * `v-reveal` — fades and lifts an element into place the first time it
 * enters the viewport, then stops observing it.
 *
 * The binding value is an optional stagger delay in milliseconds:
 *   <p v-reveal>…</p>
 *   <p v-reveal="120">…</p>
 *
 * The hidden starting state lives in styles.css under `[data-reveal]`,
 * which the directive stamps on during mount — so if JavaScript never
 * runs, nothing is ever hidden in the first place.
 *
 * The revealed state is carried by the attribute's *value*, not by a
 * class. Vue patches `class` wholesale (`el.className = next`) whenever a
 * bound `:class` on the same element changes, which silently drops any
 * class added from outside the render — an element that had been revealed
 * would snap back to opacity 0 on its next re-render. Vue never touches
 * attributes it does not own, so `data-reveal` survives.
 */
const observers = new WeakMap<HTMLElement, IntersectionObserver>();

export const reveal: Directive<HTMLElement, number | undefined> = {
	mounted(el, binding) {
		el.setAttribute("data-reveal", "");

		if (binding.value) {
			el.style.setProperty("--reveal-delay", `${binding.value}ms`);
		}

		if (typeof IntersectionObserver === "undefined") {
			el.setAttribute("data-reveal", "in");
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					el.setAttribute("data-reveal", "in");
					observer.disconnect();
					observers.delete(el);
				}
			},
			// Trigger a little before the element is fully on screen
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
		);

		observer.observe(el);
		observers.set(el, observer);
	},

	unmounted(el) {
		observers.get(el)?.disconnect();
		observers.delete(el);
	},
};
