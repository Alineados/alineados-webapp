export function calculateDaysLeft(targetDate: string): number {
	if (!targetDate) return 0;

	// Get today at midnight UTC
	const today = new Date();
	today.setUTCHours(0, 0, 0, 0);

	// Convert target to Date and set to midnight UTC
	const target = new Date(targetDate);
	target.setUTCHours(0, 0, 0, 0);

	// Get difference in milliseconds
	const diffTime = target.getTime() - today.getTime();

	// Convert to days (milliseconds * seconds * minutes * hours)
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
}
