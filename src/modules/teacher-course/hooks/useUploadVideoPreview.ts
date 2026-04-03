'use client';

import { useCallback, useRef, useState } from 'react';
import { API_BASE_URL } from '@/services/apiConfig';
import { teacherCourseActions } from '../store';

export interface UploadProgress {
  /** Phần trăm đã upload (0-100) */
  percent: number;
  /** Tốc độ upload tính bằng MB/s */
  speedMBps: number;
  /** Bytes đã upload */
  loaded: number;
  /** Tổng bytes */
  total: number;
}

interface UseUploadVideoPreviewResult {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  uploadVideoPreview: (courseId: string, file: File) => Promise<boolean>;
  cancelUpload: () => void;
  resetError: () => void;
}

/**
 * Hook upload video preview với progress tracking (XHR).
 *
 * @example
 * const { isUploading, progress, uploadVideoPreview, cancelUpload } = useUploadVideoPreview();
 *
 * const ok = await uploadVideoPreview(courseId, file);
 * // progress.percent → 0-100
 * // progress.speedMBps → tốc độ MB/s
 */
export const useUploadVideoPreview = (): UseUploadVideoPreviewResult => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const uploadVideoPreview = useCallback(
    (courseId: string, file: File): Promise<boolean> => {
      return new Promise((resolve) => {
        setIsUploading(true);
        setProgress({ percent: 0, speedMBps: 0, loaded: 0, total: file.size });
        setError(null);
        teacherCourseActions.setUploadingVideo(true);

        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const url = `${API_BASE_URL}/api/course/upload?courseId=${courseId}`;

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        let startTime = Date.now();
        let lastLoaded = 0;
        let lastTime = startTime;

        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return;

          const now = Date.now();
          const deltaTime = (now - lastTime) / 1000; // giây
          const deltaLoaded = e.loaded - lastLoaded;

          // Tốc độ tức thời (MB/s)
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
          teacherCourseActions.setUploadingVideo(false);
          xhrRef.current = null;

          try {
            const res = JSON.parse(xhr.responseText);
            if (res.success) {
              teacherCourseActions.updateCourseVideoPreview(courseId, '__uploaded__');
              resolve(true);
            } else {
              const msg = res?.message?.messageDetail || 'Upload thất bại';
              setError(msg);
              resolve(false);
            }
          } catch {
            setError('Server trả về phản hồi không hợp lệ');
            resolve(false);
          }
        };

        xhr.onerror = () => {
          setIsUploading(false);
          setProgress(null);
          teacherCourseActions.setUploadingVideo(false);
          xhrRef.current = null;
          setError('Lỗi kết nối mạng khi upload video');
          resolve(false);
        };

        xhr.onabort = () => {
          setIsUploading(false);
          setProgress(null);
          teacherCourseActions.setUploadingVideo(false);
          xhrRef.current = null;
          resolve(false);
        };

        xhr.open('POST', url);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    []
  );

  const cancelUpload = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return { isUploading, progress, error, uploadVideoPreview, cancelUpload, resetError };
};
