export interface ProjectLink {
	label: string;
	href: string;
}

export interface Project {
	id: string;
	title: string;
	subtitle: string;
	org: string;
	period: string;
	/** Two sentences at most — this is what a recruiter reads before expanding. */
	summary: string;
	tags: string[];
	details: {
		context: string;
		contribution: string[];
		outcome: string;
		stack: string[];
		links: ProjectLink[];
		note?: string;
	};
}

export const projects: Project[] = [
	{
		id: "condignum",
		title: "Security Management Platform",
		subtitle:
			"Frontend for a cybersecurity SaaS platform — visualization, modernization, design consistency",
		org: "condignum GmbH — Frontend developer",
		period: "2024 – current",
		summary:
			"React frontend work on a cybersecurity SaaS platform: customer features that arrive as product-owner prototypes, and the visualization layer that has to make security data readable. Alongside the feature work I modernize libraries and legacy code and push the platform towards consistent design patterns and a better developer experience.",
		tags: [
			"React",
			"information visualization",
			"design patterns",
			"legacy modernization",
			"UI/UX",
		],
		details: {
			context:
				"The platform has grown with the product: many interconnected views over the same underlying security data, built by a small team. Features reach the frontend as prototypes from the product owners, which leaves the question of how they fit the rest of the platform — visually, structurally, and in terms of what they do to the views around them — to be answered during implementation.",
			contribution: [
				"Develop customer-facing features as a React developer in the DevOps team, taking product-owner prototypes to production frontend.",
				"Analysed information visualization libraries against the platform's needs — what each one can express, where it stops, and what it costs to adopt and maintain — as the basis for how security data is presented.",
				"Work on complex, interconnected features: trace how a change propagates through shared state and neighbouring views first, so side effects surface in the design rather than in production.",
				"Modernize the platform by updating libraries and reworking legacy code, keeping the upgrade path incremental so feature delivery continues alongside it.",
				"Watch over design consistency across the platform and integrate new design patterns where the same UI problem was being solved twice.",
				"Analyse the existing platform for UI/UX and developer-experience improvements and turn the findings into concrete changes.",
			],
			outcome:
				"Dependencies and legacy areas are brought up to date step by step without pausing feature delivery, and recurring interactions are increasingly covered by shared patterns instead of one-off solutions — which keeps the interface consistent for customers and the codebase faster to work in for the team.",
			stack: ["React", "TypeScript"],
			links: [],
			note: "The platform is a commercial product — screenshots, customer details and metrics are not public.",
		},
	},
	{
		id: "reimagining-design",
		title: "Reimagining Design",
		subtitle:
			"Infinite canvas interfaces for collaborative interactive articles",
		org: "TU Wien — Master's thesis",
		period: "2021 – 2023",
		summary:
			"A Miro application and user study exploring how the infinite canvas can host collaborative, data-driven interactive articles, with GloVe word embeddings clustering participants' contributions by semantic similarity live on the board. Awarded Different Brilliant at the IConCMT 2023 conference.",
		tags: [
			"HCI research",
			"information visualization",
			"React",
			"D3.js",
			"word embeddings",
		],
		details: {
			context:
				"Interactive articles turn passive reading into active exploration, but their design vocabulary was built for flat, scrolling pages. The infinite canvas — the open, spatial environment of tools like Miro and Figma — had never been examined as a medium for interactive, data-driven content, even as collaborative knowledge work moved onto exactly those canvases.",
			contribution: [
				"Followed a design study methodology (Sedlmair et al.): literature review, canvas exploration, prototype design, user study, refined concept.",
				"Analysed the Miro board as a visual analytics system: board items are data entities, their spatial relationships encode meaning, and SDK panels provide bi-directional data flow to D3 visualizations.",
				"Built Dig Deeper (Miro Web SDK, React, D3.js): facilitators create two-dimensional input planes, respondents answer by placing sticky notes, and positions are aggregated into an interactive heatmap.",
				"Ran a thinking-aloud study with semi-structured interviews, eight participants split across facilitator and respondent roles.",
				"Designed a refined prototype around Gamestorming: participants annotate shared images, and GloVe word vectors cluster them by semantic similarity directly on the board.",
			],
			outcome:
				"The thesis received the Different Brilliant award at IConCMT 2023. Key findings: shared and individual artifacts need fundamentally different spatial strategies; facilitator and participant roles must be supported separately in the interface; Gestalt principles are what make an open canvas readable; and axis labels measurably shape how participants answer.",
			stack: [
				"Miro Web SDK",
				"Miro REST API",
				"React",
				"Next.js",
				"TypeScript",
				"D3.js",
				"GloVe",
			],
			links: [
				{
					label: "Thesis (TU Wien repository)",
					href: "https://repositum.tuwien.at/handle/20.500.12708/188311",
				},
				{
					label: "GitHub — dig-deeper-v1",
					href: "https://github.com/phlppkln/dig-deeper-v1",
				},
				{
					label: "IConCMT 2023",
					href: "https://www.fhstp.ac.at/de/newsroom/news/internationale-fachtagung-zur-medientechnik",
				},
			],
		},
	},
	{
		id: "osa",
		title: "Online Self Assessment (OSA)",
		subtitle: "Study-choice support tool for prospective students",
		org: "TU Wien",
		period: "2020 – 2024",
		summary:
			"An interactive self-assessment that lets prospective students experience an informatics programme before committing to it. I took it from the first proof of concept to a platform that became a mandatory part of TU Wien's 2024 admission process, with over 1,600 registrations in its first official release.",
		tags: [
			"e-learning",
			"design thinking",
			"Vue.js",
			"user study",
			"data visualization",
		],
		details: {
			context:
				"Prospective students choose study programmes from brochures and open days, then drop out when reality doesn't match expectations. Moodle proved too rigid for the interactive, self-directed experiments needed to close that gap, so we built a custom platform.",
			contribution: [
				"Built the proof of concept and the production platform: Vue.js frontend, Strapi headless CMS with a REST API.",
				"Ran the project along the Design Thinking process — literature review, proof of concept, expert interviews, full prototype, user study, iterations.",
				"Designed interactive experiment modules with a contextual feedback system and progressive hints, so participants keep moving without losing the explorative character of the task.",
				"Set up a built-in design experiment contrasting two didactic approaches: learning by doing (Sortieren mit System) versus explanation before application with storytelling (Mit Sicherheit).",
				"Conducted a user study with 28 computer science students and abstracted the feedback into a reusable framework for designing further modules.",
				"Built the results view combining task telemetry (attempts, hint usage) with scores from the validated FiT-I questionnaire, developed with an external psychology institute.",
			],
			outcome:
				"Introduced in 2024 as a mandatory part of the Informatics Bachelor admission process at TU Wien, with 1,600+ participants in the first official release. The study showed that effective modules need both: clear explanatory framing and meaningful interactive self-exploration — pure exploration leaves participants without orientation.",
			stack: ["Vue.js", "Strapi", "JavaScript", "D3.js", "Chart.js", "Figma"],
			links: [
				{
					label: "TU Wien admission procedure",
					href: "https://www.tuwien.at/en/studies/studies/bachelor-programmes/computer-science-and-business-informatics/admission-procedure",
				},
			],
			note: "The OSA itself is only available to prospective TU Wien students during the admission process and is not publicly accessible.",
		},
	},
	{
		id: "see-more",
		title: "SeeMore",
		subtitle: "Awareness about urban paths, green space and everyday habits",
		org: "TU Wien — student project",
		period: "2019 – 2020",
		summary:
			"A functional prototype motivating residents of the Seestadt district to spend more time in urban nature. Expert interviews, cultural probes, a design game and technology probes fed directly into the design.",
		tags: ["user research", "design game", "urban design", "prototyping"],
		details: {
			context:
				"Urban mobility shapes well-being: research shows green spaces reduce stress and promote physical activity, yet many city dwellers spend little time outdoors. SeeMore asks how everyday paths can be nudged through green space.",
			contribution: [
				"Ran five cultural probes — participants photographed natural elements and modelled them in plasticine — showing that perception of nature depends strongly on the living situation.",
				"Designed a design game in which players visit destinations and reduce stress at fictional green spaces; only a minority deliberately integrated stress reduction into their routes.",
				"Translated the findings into wireframes, mockup tests and a fully functional prototype.",
			],
			outcome:
				"A working prototype plus a set of research insights on how green space can be integrated into everyday urban mobility rather than treated as a separate destination.",
			stack: [
				"Figma",
				"Adobe XD",
				"HTML/CSS/JavaScript",
				"3D printing (SketchUp)",
				"LaTeX",
			],
			links: [],
		},
	},
	{
		id: "typing-stars",
		title: "Typing Stars",
		subtitle: "Fault tolerance and typing behaviour in a serious game",
		org: "TU Wien - Bachelor's thesis",
		period: "2018 – 2019",
		summary:
			"An Android game built to measure how different fault tolerance levels change typing behaviour in a gamified learning environment. A study across 92 games and more than 51,000 keystrokes showed players type faster but less accurately when more errors are forgiven. However, game enjoyment and satisfaction were higher in the stricter mode, where players had to be more accurate.",
		tags: ["serious game", "Android", "user study", "quantitative analysis"],
		details: {
			context:
				"Typing interfaces differ in how much error they absorb. Typing Stars turns that variable into gameplay: players type words to destroy incoming asteroids, with the tolerance for mistakes set per mode.",
			contribution: [
				"Built the game for Android in Java, with score sync over a REST/JSON backend.",
				"Designed the study around two fault-tolerance modes and instrumented the game to log every keystroke.",
				"Analysed 92 games and 51,000+ keystrokes in JASP for speed, accuracy and self-reported satisfaction.",
			],
			outcome:
				"Higher fault tolerance produced faster but more error-prone typing; the stricter mode produced slower, more accurate typing. Players enjoyed the challenge of the hard mode but felt more satisfied with their performance in the easy one.",
			stack: [
				"Java",
				"Android Studio",
				"Google Play Services",
				"REST + JSON",
				"JASP",
			],
			links: [],
		},
	},
];
