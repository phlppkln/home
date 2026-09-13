/** The three registers the timeline offers as tabs. */
export type TimelineCategory = "career" | "education" | "personal";

export interface TimelineEntry {
	/** Year or range, e.g. "2023" or "2021 – 2023" */
	date: string;
	/** The milestone itself — a label, not a sentence. No descriptions. */
	text: string;
	/** Which tab shows this entry. */
	category: TimelineCategory;
	/** Optional grouping label shown as a small tag, e.g. "Certificate". */
	kind?: string;
	/** Optional second line under the text — e.g. related certificates. */
	subtitle?: string;
}

/** The tabs, in the order they are shown. */
export const timelineCategories: { id: TimelineCategory; label: string }[] = [
	{ id: "career", label: "Career" },
	{ id: "education", label: "Education" },
	{ id: "personal", label: "Personal" },
];

/** The tab open before the reader touches anything. */
export const defaultTimelineCategory: TimelineCategory = "career";

/**
 * Career, education and personal milestones — one short label each.
 *
 * Ordered with ongoing entries first, then closed ones newest-first by
 * start date. The section hides itself while empty.
 */
export const timeline: TimelineEntry[] = [
	{
		date: "since 2024",
		category: "career",
		kind: "Career",
		text: "Frontend developer, condignum GmbH",
	},
	{
		date: "since 2024",
		category: "personal",
		kind: "Volunteer",
		text: "Mentor at CoderDojo",
	},
	{
		date: "Oct 2025",
		category: "personal",
		kind: "Personal",
		text: "Cycled 600 km through Andalusian deserts, 8,750 m ascent",
	},
	{
		date: "Jan – Mar 2024",
		category: "personal",
		kind: "Personal",
		text: "Cycled 3,000 km through Patagonia's landscapes, 30,000 m ascent",
	},
	{
		date: "2020 – 2024",
		category: "career",
		kind: "Career",
		text: "Online Self Assessment, TU Wien",
	},
	{
		date: "2019 – 2020",
		category: "career",
		kind: "Career",
		text: "Scientific employee for digitization, Wiener Linien",
	},
	{
		date: "2019 – 2023",
		category: "education",
		kind: "Education",
		text: "MSc Media and Human-Centered Computing, TU Wien",
	},
	{
		date: "2017 – 2020",
		category: "career",
		kind: "Career",
		text: "Tutor, Interface and Interaction Design, TU Wien",
	},
	{
		date: "2013 – 2019",
		category: "education",
		kind: "Education",
		text: "BSc Media Informatics and Visual Computing, TU Wien",
	},
	{
		date: "2012 – 2024",
		category: "personal",
		kind: "Personal",
		text: "Agriculture and Farming, Pamhagen",
		subtitle: "Certificates: Agriculture · Viticulture and wine production",
	},
];
