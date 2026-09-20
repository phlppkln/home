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
	/** Optional second line under the text — employer, institution, certificates. */
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
		text: "Frontend Developer",
		subtitle: "condignum GmbH",
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
		text: "Cycled 600 km through Andalusian deserts, 8,750 m ascent",
	},
	{
		date: "Jan – Mar 2024",
		category: "personal",
		text: "Cycled 3,000 km through Patagonia's landscapes, 30,000 m ascent",
	},
	{
		date: "Apr – Jun 2024",
		category: "career",
		text: "Project Assistant, Online Self Assessment",
		subtitle: "TU Wien",
	},
	{
		date: "2020 – 2023",
		category: "career",
		text: "Student Assistant for Research and Administration, Online Self Assessment",
		subtitle: "TU Wien",
	},
	{
		date: "2019 – 2020",
		category: "career",
		text: "Scientific Employee for Digitization",
		subtitle: "Wiener Linien",
	},
	{
		date: "2019 – 2023",
		category: "education",
		text: "MSc Media and Human-Centered Computing",
		subtitle: "TU Wien · passed with distinction",
	},
	{
		date: "2017 – 2020",
		category: "career",
		text: "Tutor, Interface and Interaction Design",
		subtitle: "TU Wien",
	},
	{
		date: "2013 – 2019",
		category: "education",
		text: "BSc Media Informatics and Visual Computing",
		subtitle: "TU Wien",
	},
	{
		date: "2012 – 2024",
		category: "personal",
		text: "Agriculture and Farming, Pamhagen",
		subtitle: "Certificates: Agriculture · Viticulture and wine production",
	},
];
