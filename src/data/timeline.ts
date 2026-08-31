/** The four buckets the timeline filter offers. */
export type TimelineCategory = "career" | "education" | "personal" | "other";

export interface TimelineEntry {
	/** Year or range, e.g. "2023" or "2021 – 2023" */
	date: string;
	/** The milestone itself — a label, not a sentence. No descriptions. */
	text: string;
	/** Which filter button shows this entry. */
	category: TimelineCategory;
	/** Optional grouping label shown as a small tag, e.g. "Certificate". */
	kind?: string;
}

/**
 * The filter buttons, in the order they are shown. `career` is the only
 * one active on load; the reader adds the others to build their own view.
 */
export const timelineCategories: { id: TimelineCategory; label: string }[] = [
	{ id: "career", label: "Career" },
	{ id: "education", label: "Education" },
	{ id: "personal", label: "Personal" },
	{ id: "other", label: "Other" },
];

/** Categories shown before the reader touches anything. */
export const defaultTimelineCategories: TimelineCategory[] = ["career"];

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
		category: "other",
		kind: "Volunteer",
		text: "Mentor at CoderDojo",
	},
	{
		date: "Oct 2025",
		category: "personal",
		kind: "Personal",
		text: "Cycled 600 km through Andalusia, 8,750 m ascent",
	},
	{
		date: "Jan – Mar 2024",
		category: "personal",
		kind: "Personal",
		text: "Cycled 3,000 km through Patagonia, 30,000 m ascent",
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
		date: "2015 – 2016",
		category: "education",
		kind: "Certificate",
		text: "Viticulture and wine production",
	},
	{
		date: "2014 – 2015",
		category: "education",
		kind: "Certificate",
		text: "Agriculture",
	},
	{
		date: "2013 – 2019",
		category: "education",
		kind: "Education",
		text: "BSc Media Informatics and Visual Computing, TU Wien",
	},
	{
		date: "2012 – 2024",
		category: "other",
		kind: "Other",
		text: "Agriculture and Farming, Pamhagen",
	},
];
