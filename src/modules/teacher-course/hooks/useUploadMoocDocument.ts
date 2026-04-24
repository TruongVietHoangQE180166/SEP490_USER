'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/toast';
import { API_BASE_URL } from '@/services/apiConfig';
import { DocumentLesson } from '../types';

export interface UploadDocProgress {
    percent: number;
    speedMBps: number;
    loaded: number;
    total: number;
}

export const useUploadMoocDocument = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<UploadDocProgress | null>(null);
    const xhrRef = useRef<XMLHttpRequest | null>(null);

    const getFileType = (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'PDF';
        if (['xls', 'xlsx'].includes(ext || '')) return 'EXCEL';
        if (['doc', 'docx'].includes(ext || '')) return 'WORD';
        return 'DOCUMENT';
    };

    const uploadDocument = useCallback((moocId: string, file: File, title: string): Promise<DocumentLesson> => {
        return new Promise((resolve, reject) => {
            setIsUploading(true);
            setProgress({ percent: 0, speedMBps: 0, loaded: 0, total: file.size });

            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const fileType = getFileType(file);
            const url = `${API_BASE_URL}/api/documents/${moocId}/upload?title=${encodeURIComponent(title)}&fileType=${fileType}`;

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
                        toast.success('Tải lên tài liệu thành công');
                        resolve(res.data as DocumentLesson);
                    } else {
                        const msg = res?.message?.messageDetail || 'Không thể tải tài liệu lên';
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
                toast.error('Lỗi kết nối mạng khi tải tài liệu');
                reject(new Error('Lỗi kết nối mạng'));
            };

            xhr.onabort = () => {
                setIsUploading(false);
                setProgress(null);
                xhrRef.current = null;
                reject(new Error('Đã hủy'));
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

    const updateDocument = useCallback((documentId: string, file: File | null, title: string, oldFileType?: string): Promise<DocumentLesson> => {
        return new Promise((resolve, reject) => {
            setIsUploading(true);
            if (file) {
                setProgress({ percent: 0, speedMBps: 0, loaded: 0, total: file.size });
            } else {
                setProgress({ percent: 100, speedMBps: 0, loaded: 0, total: 0 });
            }

            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const fileType = file ? getFileType(file) : (oldFileType || 'DOCUMENT');
            const url = `${API_BASE_URL}/api/documents/${documentId}?title=${encodeURIComponent(title)}&fileType=${fileType}`;

            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }

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
                        toast.success('Cập nhật tài liệu thành công');
                        resolve(res.data as DocumentLesson);
                    } else {
                        const msg = res?.message?.messageDetail || 'Không thể cập nhật tài liệu';
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
                toast.error('Lỗi kết nối mạng khi cập nhật tài liệu');
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
        uploadDocument,
        updateDocument,
        isUploading,
        progress,
        cancelUpload,
    };
};
