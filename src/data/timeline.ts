export interface TimelineEntry {
	/** Year or range, e.g. "2023" or "2021 – 2023" */
	date: string;
	/** The milestone itself — a label, not a sentence. No descriptions. */
	text: string;
	/**
	 * Optional grouping label shown as a small tag, e.g. "Education".
	 * Also selects which entries the hero timeline chart plots.
	 */
	kind?: string;
	/**
	 * Shorter form for the hero chart's row labels, where the gutter is
	 * narrow. Omitted when `text` already fits — it falls back to `text`.
	 */
	short?: string;
}

/**
 * Career, education and personal milestones — one short label each.
 *
 * Ordered with ongoing entries first, then closed ones newest-first by
 * start date. The section hides itself while empty.
 */
export const timeline: TimelineEntry[] = [
	{
		date: "since 2024",
		kind: "Career",
		short: "condignum GmbH",
		text: "Frontend developer, condignum GmbH",
	},
	{
		date: "since 2024",
		kind: "Volunteer",
		text: "Mentor at CoderDojo",
	},
	{
		date: "Oct 2025",
		kind: "Personal",
		text: "Cycled 600 km through Andalusia, 8,750 m ascent",
	},
	{
		date: "Jan – Mar 2024",
		kind: "Personal",
		text: "Cycled 3,000 km through Patagonia, 30,000 m ascent",
	},
	{
		date: "2020 – 2024",
		kind: "Career",
		text: "Online Self Assessment, TU Wien",
	},
	{
		date: "2019 – 2020",
		kind: "Career",
		short: "Wiener Linien",
		text: "Scientific employee for digitization, Wiener Linien",
	},
	{
		date: "2019 – 2023",
		kind: "Education",
		short: "MSc Human-Centered Computing",
		text: "MSc Media and Human-Centered Computing, TU Wien",
	},
	{
		date: "2017 – 2020",
		kind: "Career",
		short: "Tutor, Interaction Design",
		text: "Tutor, Interface and Interaction Design, TU Wien",
	},
	{
		date: "2015 – 2016",
		kind: "Certificate",
		text: "Viticulture and wine production",
	},
	{
		date: "2014 – 2015",
		kind: "Certificate",
		text: "Agriculture",
	},
	{
		date: "2013 – 2019",
		kind: "Education",
		short: "BSc Media Informatics",
		text: "BSc Media Informatics and Visual Computing, TU Wien",
	},
	{
		date: "since 2012",
		kind: "Personal",
		text: "Family farm, Pamhagen",
	},
];
