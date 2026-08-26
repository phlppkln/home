export interface SkillGroup {
	/** Short label shown in the left column */
	label: string;
	items: string[];
}

/**
 * Ordered deliberately: the groups a model cannot do for you come first,
 * the ones it can come last. A reader scanning for a stack keyword still
 * finds it in seconds, but the first thing they read is judgement rather
 * than syntax.
 */
export const skills: SkillGroup[] = [
	{
		label: "Research & evaluation",
		items: [
			"Study design",
			"Interviews",
			"Thinking-aloud studies",
			"Observations",
			"Surveys",
			"Quantitative analysis",
		],
	},
	{
		label: "Design",
		items: [
			"UI/UX design",
			"Wireframing",
			"Low- and high-fidelity prototyping",
		],
	},
	{
		label: "Interface engineering",
		items: [
			"TypeScript",
			"JavaScript",
			"HTML",
			"CSS",
			"Vue.js",
			"Nuxt",
			"React",
			"Bootstrap",
			"Material UI",
			"Strapi",
			"REST",
			"Jest",
			"Testing Library",
		],
	},
	{
		label: "Data & visualization",
		items: [
			"D3.js",
			"Chart.js",
			"three.js",
			"Bokeh",
			"Python",
			"SQL",
			"JASP",
		],
	},
];
