import { getEndpointByVenv } from '../endpoints';

export class PhotosService {
    private static instance: PhotosService;
    private token: string;
    private baseUrl: string;

    private constructor(token: string) {
        this.token = token;
        this.baseUrl = `${getEndpointByVenv().pillars}/api/v1/photos`;
    }

    public static getInstance(token: string): PhotosService {
        if (!PhotosService.instance) {
            PhotosService.instance = new PhotosService(token);
        }
        return PhotosService.instance;
    }

    async upload(uid: string, file: File, folder: 'gatherings' | 'profiles') {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('uid', uid);
        formData.append('folder', folder);

        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.token}` },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Upload failed');
        return data?.data?.photo_url as string;
    }

    async delete(uid: string, photoUrl: string) {
        const response = await fetch(`${this.baseUrl}/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            body: JSON.stringify({ uid, photo_url: photoUrl })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Delete failed');
        return true;
    }

    async getSignedUrl(photoUrl: string): Promise<string> {
        const response = await fetch(`${this.baseUrl}/signed-url?photo_url=${encodeURIComponent(photoUrl)}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Failed to get signed URL');
        return data?.data?.signed_url as string;
    }
}


