/**
 * Parses the human-written date strings in timeline.ts into numeric spans
 * the hero chart can lay out, so the chart and the timeline list can never
 * disagree about a date.
 *
 * Years are fractional (2024.5 = mid-2024) so short spans stay visible.
 */
export interface Span {
	start: number;
	end: number;
	/** Open-ended ("since 2024") — the chart fades these out on the right */
	ongoing: boolean;
}

const MONTHS = [
	"jan", "feb", "mar", "apr", "may", "jun",
	"jul", "aug", "sep", "oct", "nov", "dec",
];

/** Fractional year for a Date, e.g. 2026-08-26 → 2026.58 */
export function toFractionalYear(date: Date): number {
	return date.getFullYear() + date.getMonth() / 12;
}

/**
 * Recognises the four shapes used in the data:
 *   "2013 – 2019"          closed range
 *   "since 2024"           open-ended
 *   "Oct 2017 – Feb 2020"  months spanning years
 *   "Jan – Mar 2024"       months within one year
 *   "Oct 2025"             a single month
 *   "2023"                 a single year
 * Anything else returns null and is simply left out of the chart.
 */
export function parseSpan(date: string, now = new Date()): Span | null {
	// Normalise en/em dashes so only one separator has to be matched
	const text = date.trim().toLowerCase().replace(/[–—]/g, "-");

	const since = text.match(/^since\s+(\d{4})$/);
	if (since) {
		return { start: Number(since[1]), end: toFractionalYear(now), ongoing: true };
	}

	// "Oct 2017 - Feb 2020" — months spanning different years
	const monthRange = text.match(
		/^([a-z]{3})[a-z]*\s+(\d{4})\s*-\s*([a-z]{3})[a-z]*\s+(\d{4})$/,
	);
	if (monthRange) {
		const from = MONTHS.indexOf(monthRange[1]);
		const to = MONTHS.indexOf(monthRange[3]);
		if (from !== -1 && to !== -1) {
			return {
				start: Number(monthRange[2]) + from / 12,
				end: Number(monthRange[4]) + (to + 1) / 12,
				ongoing: false,
			};
		}
	}

	const months = text.match(/^([a-z]{3})[a-z]*\s*-\s*([a-z]{3})[a-z]*\s+(\d{4})$/);
	if (months) {
		const from = MONTHS.indexOf(months[1]);
		const to = MONTHS.indexOf(months[2]);
		if (from !== -1 && to !== -1) {
			const year = Number(months[3]);
			// End is exclusive of the closing month, so Mar → 3/12
			return { start: year + from / 12, end: year + (to + 1) / 12, ongoing: false };
		}
	}

	const range = text.match(/^(\d{4})\s*-\s*(\d{4})$/);
	if (range) {
		return { start: Number(range[1]), end: Number(range[2]), ongoing: false };
	}

	// "Oct 2025" — a single month
	const month = text.match(/^([a-z]{3})[a-z]*\s+(\d{4})$/);
	if (month) {
		const index = MONTHS.indexOf(month[1]);
		if (index !== -1) {
			const year = Number(month[2]);
			return { start: year + index / 12, end: year + (index + 1) / 12, ongoing: false };
		}
	}

	const single = text.match(/^(\d{4})$/);
	if (single) {
		return { start: Number(single[1]), end: Number(single[1]) + 1, ongoing: false };
	}

	return null;
}
