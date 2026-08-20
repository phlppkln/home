export interface TimelineEntry {
	/** Year or range, e.g. "2023" or "2021 – 2023" */
	date: string;
	/** One line. Keep it short — this section is meant to be skimmed. */
	text: string;
	/** Optional grouping label shown as a small tag, e.g. "Education" */
	kind?: string;
}

/**
 * Career, education and personal milestones — one line each.
 *
 * The section is hidden while this list is empty, so the page stays
 * shareable until the entries are filled in.
 *
 * Planned entries (from our notes) — fill in the dates and delete this comment:
 *   { date: "20XX", kind: "Education", text: "MSc Media and Human-Centered Computing, TU Wien" },
 *   { date: "20XX", kind: "Education", text: "BSc Media Informatics and Visual Computing, TU Wien" },
 *   { date: "20XX – today", kind: "Career", text: "Frontend developer, cybersecurity SaaS platform" },
 *   { date: "20XX – 20XX", kind: "Career", text: "Developer and designer, Online Self Assessment, TU Wien" },
 *   { date: "20XX", kind: "Personal", text: "Three-month cycling trip across ..." },
 *   { date: "20XX", kind: "Certificate", text: "Certificate of proficiency in agriculture" },
 *   { date: "20XX", kind: "Certificate", text: "Certificate of proficiency in vinification" },
 */
export const timeline: TimelineEntry[] = [];
