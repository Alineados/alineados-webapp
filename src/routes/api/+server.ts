import type { RequestEvent } from '@sveltejs/kit';

export const _load = async (event: RequestEvent) => {
	const { fetch, url } = event;

	const UID = url.searchParams.get('uid') || '';
	const healthID = url.searchParams.get('health_id') || '';
	const relationalID = url.searchParams.get('relational_id') || '';
	const vocationalID = url.searchParams.get('vocational_id') || '';
	const spiritualID = url.searchParams.get('spiritual_id') || '';

	const params = new URLSearchParams({
		uid: UID,
		health_id: healthID,
		relational_id: relationalID,
		vocational_id: vocationalID,
		spiritual_id: spiritualID
	});

	const response = await fetch(`/api/v1/problems/get-all?${params.toString()}`);
	const data = await response.json();

	return {
		problems: data
	};
};
