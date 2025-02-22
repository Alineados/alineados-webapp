export const getJSONFormsData = (formData: FormData) => {
	const data: { [key: string]: any } = {};
	formData.forEach((value, key) => {
		data[key] = value;
	});

  return data;
};


export function getFileType(type: string): string {
	const typeMap: { [key: string]: string } = {
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
		'application/pdf': 'pdf',
		'application/msword': 'Word',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
		'application/vnd.ms-powerpoint': 'ptt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ptt',
		'image/jpeg': 'jpe',
		'image/png': 'png',
		'application/zip': 'zip'
	};

	return typeMap[type] || 'Unknown';
}