export interface ProjectLink {
	label: string;
	href: string;
}

export interface ProjectImage {
	/** Path under public/, without the deployment base — e.g. "img/projects/osa/x.png". */
	src: string;
	/** What is in the picture, for readers who cannot see it. */
	alt: string;
	/** One line shown under the image — what it demonstrates, not what it is. */
	caption?: string;
	/** Intrinsic pixel size, so the layout reserves the space before the file loads. */
	width: number;
	height: number;
	/**
	 * Which section's text the figure follows. Unset puts it at the top of
	 * the expanded view, before any text.
	 */
	after?: "context" | "contribution" | "outcome";
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
		/**
		 * What you'd do differently now — a reflective critique, not a list
		 * of regrets. Signals seniority. Leave unset until you've actually
		 * written it in your own voice; the card hides the heading when
		 * empty.
		 */
		reflection?: string;
		/** Methodologies and research tools — study design, interviews, instruments. */
		researchStack?: string[];
		/** Design tools and process artifacts — prototyping, ideation frameworks. */
		designStack?: string[];
		techStack: string[];
		links: ProjectLink[];
		/** Figures in the expanded view — see ProjectImage.after for placement. */
		images?: ProjectImage[];
		note?: string;
	};
}

export const projects: Project[] = [
	{
		id: "condignum",
		title: "Security Management Platform",
		subtitle:
			"Frontend for a cybersecurity SaaS platform — development, modernization, design consistency",
		org: "condignum GmbH — Frontend developer",
		period: "2024 – current",
		summary:
			"A React frontend for a cybersecurity SaaS platform that allows users to manage their security data and organize critical information. Here I build customer-facing features, that either arrive as high-fidelity product-owner prototypes or are implemented from scratch based on customer requirements. Alongside the feature work I modernize libraries and legacy code and push the platform towards consistent design patterns and a better developer experience.  Recently, my team also integrated AI to improve time-to-market, as well as the overall development workflow.",
		tags: [
			"React",
			"information visualization",
			"design patterns",
			"legacy modernization",
			"UI/UX",
		],
		details: {
			context:
				"The platform has grown rapidly over the years. It consists of many interconnected views, built by a small team. Feature requests reach the development team from the product owners, which leaves the question of how they fit the rest of the platform — visually, structurally, and in terms of how they interact with existing components.",
			contribution: [
				"Develop customer-facing features as a React developer in the DevOps team.",
				"Analysed information visualization libraries against the platform's needs to support the presentation of security data in dashboards.",
				"Work on complex, interconnected features: trace how a change propagates through other views, so side effects surface in the design rather than in production.",
				"Modernize the platform by updating libraries and reworking legacy code, as well as enhancing the DevOps workflow",
				"Integrating AI into the prototyping and development workflow",
				"Watch over design consistency across the platform and integrate new design patterns where similar UI/UX problems were being solved multiple times.",
				"Analyse the existing platform for UI/UX and developer-experience improvements and turn the findings into concrete changes.",
			],
			outcome: "Modernization of the platform tech stack, integration of AI in the development workflow, and improved deployment workflows.",
			techStack: ["React", "JavaScript", "TypeScript", "D3.js", "REST API", "GitHub Actions", "Docker", "Vite", "Vitest"],
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
			"A Miro application and user study exploring how the infinite canvas can host collaborative, data-driven interactive articles, with GloVe word embeddings clustering participants' contributions by semantic similarity. This project was my Master's thesis and has been awarded the Different Brilliant at the IConCMT 2023 conference.",
		tags: [
			"HCI research",
			"Information visualization",
			"React",
			"D3.js",
			"Semantic similarity",
		],
		details: {
			context:
				"Interactive articles (sometimes also referred to as explorable explanations) turn passive reading into interactive exploration, but their design vocabulary was built for flat, scrolling pages. The infinite canvas (e.g., Miro and Figma) provides an open, spatial environment that has never been examined as a medium for interactive, data-driven content. These tools often also support collaborative ideation which allows to design truly engaging experiences for ideation. By using ideas based on Gamestorming (https://www.gamestorming.com/) we were able to adapt analog techniques for those canvases.",
			contribution: [
				"Followed a design study methodology (Sedlmair et al.): literature review, canvas exploration, prototype design, user study, refined concept.",
				"Analysed the Miro board as a visual analytics system: board items are data entities, their spatial relationships encode meaning, and SDK panels provide bi-directional data flow to D3 visualizations.",
				"Built Dig Deeper (Miro Web SDK, React, D3.js): facilitators create two-dimensional input planes, respondents answer by placing sticky notes, and positions are aggregated into an interactive heatmap.",
				"Ran a thinking-aloud study with semi-structured interviews, eight participants split across facilitator and respondent roles.",
				"Designed a refined prototype around Gamestorming: participants annotate shared images, and GloVe word vectors cluster them by semantic similarity directly on the board.",
			],
			outcome:
				"The thesis received the Different Brilliant award at IConCMT 2023. Key findings: shared and individual artifacts need fundamentally different spatial strategies; Gestalt principles give an open canvas structure and make the content universally readable; the infinite canvas provides a unique knowledge database with visual entities as data points. All of this rests on the diagram below, which frames the Miro board itself as a visual analytics system: board items are the data, modal and panel are the views, and the SDK carries data in both directions.",
			researchStack: [
				"Design study methodology (Sedlmair et al.)",
				"Thinking-aloud study",
				"Semi-structured interviews",
				"Semantic similarity analysis (GloVe word embeddings)",
			],
			designStack: ["Gamestorming", "Canvas prototyping (Miro)", "Figma", "Information visualization design (D3.js)"],
			techStack: [
				"Miro Web SDK",
				"Miro REST API",
				"React",
				"Next.js",
				"TypeScript",
				"D3.js",
				"GloVe",
			],
			images: [
				{
					src: "img/projects/reimagining-design/miro_va_system_updated.jpg",
					alt: "Diagram of the Miro board read as a visual analytics system: board items with entities, relationships and metadata exchange data with a modal and a side panel that host D3 visualizations — a clustered heatmap, a network graph and a scatter plot — supporting analyze, present, explore, interact and export.",
					width: 1174,
					height: 851,
					after: "outcome",
				},
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
				"Set up a built-in design experiment contrasting two didactic approaches: learning by doing (Sortieren mit System, pictured below as its feedback steps in after a doubtful move) versus explanation before application with storytelling (Mit Sicherheit).",
				"Conducted a user study with 28 computer science students and abstracted the feedback into a reusable framework for designing further modules.",
				"Built the results view combining task telemetry (attempts, hint usage) with scores from the validated FiT-I questionnaire, developed with an external psychology institute.",
			],
			outcome:
				"Introduced in 2024 as a mandatory part of the Informatics Bachelor admission process at TU Wien, with 1,600+ participants in the first official release. The study showed that effective modules need both: clear explanatory framing and meaningful interactive self-exploration — pure exploration leaves participants without orientation.",
			researchStack: [
				"Design Thinking process",
				"Expert interviews",
				"Controlled study design (two didactic modes)",
				"FiT-I questionnaire",
				"User study (n=28)",
			],
			designStack: ["Figma", "Contextual feedback design", "Progressive hints"],
			techStack: ["Vue.js", "Strapi", "JavaScript", "D3.js", "Chart.js"],
			images: [
				{
					src: "img/projects/osa/sortieren_mit_system.png",
					alt: "Screenshot of the Sortieren mit System module: five face-down cards in a row, each with a reveal and a pin button; two cards are turned over showing 5 and 1, arrows point at the pin on the first card and at both buttons on the fourth, and a feedback box below reads: consider again whether it makes sense to place the marker on the card you chose.",
					width: 1927,
					height: 1032,
					after: "contribution",
				},
			],
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
			researchStack: [
				"Expert interviews",
				"Cultural probes",
				"Design game",
				"Technology probes",
			],
			designStack: ["Figma", "Adobe XD", "Wireframing", "Mockup testing"],
			techStack: ["HTML/CSS/JavaScript", "3D printing (SketchUp)", "LaTeX"],
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
			researchStack: [
				"Quantitative study design",
				"Keystroke instrumentation",
				"JASP (statistical analysis)",
			],
			techStack: ["Java", "Android Studio", "Google Play Services", "REST + JSON"],
			links: [],
		},
	},
];
