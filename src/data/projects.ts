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
		id: "osa",
		title: "Online Self Assessment (OSA)",
		subtitle: "Study-choice support tool for prospective students",
		org: "TU Wien",
		period: "2020 – 2024",
		summary:
			"An interactive self-assessment that lets prospective students experience topics of an informatics study programme before committing to it. I took it from the first proof of concept to a platform that became a mandatory part of TU Wien's informatics admission process, with over 1,600 registrations in its first official release.",
		tags: [
			"e-learning",
			"design thinking",
			"Vue.js",
			"user study",
			"data visualization",
		],
		details: {
			context:
				"Prospective students often choose study programmes from brochures and open days, then drop out when reality doesn't match expectations. TU Wien was in the process of introducing a more flexible solution but early prototypes with Moodle proved to be too rigid following constructivistic learning theory. To fully utilize the potential of this approach for self-reflection, we built a custom platform using Vue.js and Strapi.",
			contribution: [
				"Built the proof of concept and the production platform: Vue.js frontend, Strapi headless CMS as a REST API connected to a MariaDB database.",
				"Followed the Design Thinking process (literature review, proof of concept, expert interviews, full prototype, user study, iterations) to guide the development.",
				"Designed interactive experiment modules with a contextual feedback system and progressive hints, so participants keep moving without losing the explorative character of the task.",
				"Set up a built-in design experiment contrasting two didactic approaches: learning by doing (Sortieren mit System, pictured below as feedback highlights a doubtful move) versus explanation before application with storytelling (Mit Sicherheit).",
				"Conducted a user study with 28 computer science students and abstracted the feedback into a reusable framework for designing further modules.",
				"Built the results view combining task telemetry (attempts, hint usage, etc.) as well as results from the FiT-I questionnaire, developed with an external psychology institute.",
			],
			outcome:
				"Introduced in 2024 as a mandatory part of the Informatics Bachelor admission process at TU Wien, with 1,600+ participants in the first official release. The study showed that effective modules need both: clear explanatory framing and meaningful interactive self-exploration — pure exploration leaves participants without orientation.",
			researchStack: [
				"Design Thinking process",
				"Expert interviews",
				"User study (n=28) with controlled study design (two didactic modes)",
				"FiT-I questionnaire",
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
		id: "condignum",
		title: "Security Management Platform",
		subtitle:
			"Frontend for a cybersecurity SaaS platform — development, modernization, design consistency",
		org: "condignum GmbH — Frontend developer",
		period: "2024 - current",
		summary:
			"A React frontend for a cybersecurity SaaS platform to manage security data and organize critical information. Here I build customer-facing features, either from high-fidelity product-owner prototypes or implement them from scratch based on customer requirements. Alongside the feature work I modernize libraries and legacy code and maintain consistent design patterns and a better developer experience. Recently, my tasks also revolved around the integration of AI to improve developer experience and by integrating codebase-backed design into prototyping workflows.",
		tags: [
			"React",
			"design patterns",
			"legacy code modernization",
			"UI/UX",
			"DevOps",
			"AI integration",
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
				"Interactive articles (also referred to as explorable explanations) turn passive reading into interactive exploration, but their design vocabulary was built for flat, scrolling pages. The infinite canvas (e.g., Miro and Figma) provides an open, spatial environment that has never been examined as a medium for interactive, data-driven content. These tools often also support collaborative ideation which allow to design truly engaging experiences for ideation. By using ideas based on Gamestorming (https://www.gamestorming.com/) we were able to adapt analog techniques for those canvases.",
			contribution: [
				"Followed a design study methodology (Sedlmair et al.): literature review, canvas exploration, prototype design, user study, refined concept.",
				"Analysed the Miro board as a visual analytics system: board items are data entities, their spatial relationships encode meaning, and panels provide bi-directional data flow to D3 visualizations.",
				"Built Dig Deeper (Miro REST API, Miro Web SDK, React, D3.js): facilitators create input planes, respondents answer by placing sticky notes, and positions are aggregated into an interactive heatmap.",
				"Ran a thinking-aloud study with semi-structured interviews, eight participants split across facilitator and respondent roles.",
				"Designed a refined prototype around Gamestorming: participants annotate shared images, and GloVe word vectors cluster them by semantic similarity directly on the board.",
			],
			outcome:
				"The thesis received the Different Brilliant award at IConCMT 2023. Key findings: shared and individual artifacts need fundamentally different spatial strategies; Gestalt principles give an open canvas structure and make the content universally readable; the infinite canvas provides a unique knowledge database with visual entities as data points. The diagram below shows how the Miro board itself acts as a visual analytics system: board items are the data, modal and panel are the views, and the Miro API and SDK carries data in both directions.",
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
					alt: "Diagram of the Miro board read as a visual analytics system: board items with entities, relationships and metadata exchange data with a modal and a side panel that host D3 visualizations supporting analyze, present, explore, interact and export.",
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
	}
];
