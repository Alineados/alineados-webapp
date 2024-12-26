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

export const formatDate = (date: string) => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();
	return `${day}/${month}/${year}`;
};

export const calculateDaysBetween = (date1: string, date2: string) => {
	const d1 = new Date(date1);
	const d2 = new Date(date2);

	const diffTime = d2.getTime() - d1.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
};
