import { useState, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/toast';
import { API_BASE_URL } from '@/services/apiConfig';

export interface UploadProgress {
    percent: number;
    speedMBps: number;
    loaded: number;
    total: number;
}

export const useUploadMoocVideo = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const xhrRef = useRef<XMLHttpRequest | null>(null);

    const uploadVideo = useCallback((moocId: string, file: File, title: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            setIsUploading(true);
            setProgress({ percent: 0, speedMBps: 0, loaded: 0, total: file.size });

            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const url = `${API_BASE_URL}/api/video/${moocId}/upload?title=${encodeURIComponent(title)}&duration=1&isPreview=true`;

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhrRef.current = xhr;

            let lastLoaded = 0;
            let lastTime = Date.now();

            xhr.upload.onprogress = (e) => {
                if (!e.lengthComputable) return;

                const now = Date.now();
                const deltaTime = (now - lastTime) / 1000;
                const deltaLoaded = e.loaded - lastLoaded;
                const speedMBps = deltaTime > 0 ? deltaLoaded / 1024 / 1024 / deltaTime : 0;

                lastLoaded = e.loaded;
                lastTime = now;

                setProgress({
                    percent: Math.round((e.loaded / e.total) * 100),
                    speedMBps,
                    loaded: e.loaded,
                    total: e.total,
                });
            };

            xhr.onload = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;

                try {
                    const res = JSON.parse(xhr.responseText);
                    if (res.success && res.data) {
                        toast.success('Tải lên video bài học thành công');
                        resolve(res.data);
                    } else {
                        const msg = res?.message?.messageDetail || 'Không thể tải video lên';
                        toast.error(msg);
                        reject(new Error(msg));
                    }
                } catch {
                    toast.error('Lỗi phản hồi từ máy chủ');
                    reject(new Error('Lỗi phản hồi từ máy chủ'));
                }
            };

            xhr.onerror = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;
                toast.error('Lỗi kết nối mạng khi upload video');
                reject(new Error('Lỗi kết nối mạng khi upload video'));
            };

            xhr.onabort = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;
                reject(new Error('Đã hủy tải lên'));
            };

            xhr.open('POST', url);
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }, []);

    const cancelUpload = useCallback(() => {
        if (xhrRef.current) {
            xhrRef.current.abort();
            xhrRef.current = null;
        }
    }, []);

    const updateVideo = useCallback((videoId: string, title: string, file?: File): Promise<any> => {
        return new Promise((resolve, reject) => {
            setIsUploading(true);
            setProgress({ percent: 0, speedMBps: 0, loaded: 0, total: file?.size || 0 });

            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const url = `${API_BASE_URL}/api/video/${videoId}?title=${encodeURIComponent(title)}&duration=1&isPreview=true`;

            const formData = new FormData();
            if (file) formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhrRef.current = xhr;

            let lastLoaded = 0;
            let lastTime = Date.now();

            xhr.upload.onprogress = (e) => {
                if (!e.lengthComputable) return;
                const now = Date.now();
                const deltaTime = (now - lastTime) / 1000;
                const deltaLoaded = e.loaded - lastLoaded;
                const speedMBps = deltaTime > 0 ? deltaLoaded / 1024 / 1024 / deltaTime : 0;
                lastLoaded = e.loaded;
                lastTime = now;
                setProgress({
                    percent: Math.round((e.loaded / e.total) * 100),
                    speedMBps,
                    loaded: e.loaded,
                    total: e.total,
                });
            };

            xhr.onload = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;
                try {
                    const res = JSON.parse(xhr.responseText);
                    if (res.success && res.data) {
                        toast.success('Cập nhật bài học video thành công');
                        resolve(res.data);
                    } else {
                        const msg = res?.message?.messageDetail || 'Không thể cập nhật bài học video';
                        toast.error(msg);
                        reject(new Error(msg));
                    }
                } catch {
                    toast.error('Lỗi phản hồi từ máy chủ');
                    reject(new Error('Lỗi phản hồi từ máy chủ'));
                }
            };

            xhr.onerror = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;
                toast.error('Lỗi kết nối mạng khi cập nhật video');
                reject(new Error('Lỗi kết nối mạng'));
            };

            xhr.onabort = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;
                reject(new Error('Đã hủy'));
            };

            xhr.open('PUT', url);
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }, []);

    return {
        uploadVideo,
        updateVideo,
        isUploading,
        progress,
        cancelUpload
    };
};
