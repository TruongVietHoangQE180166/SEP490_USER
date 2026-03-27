'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { teacherCourseService } from '../services';
import { BasicInfo, COURSE_LEVELS } from '../components/create/types';
import { CreateCourseRequest } from '../types';
import { toast } from '@/components/ui/toast';

export const useTeacherCourseForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Logic: Upload Image -> Get URL -> Create Course
   */
  const handleCreateCourse = async (basicInfo: BasicInfo) => {
    setIsSubmitting(true);
    try {
      let finalThumbnailUrl = basicInfo.thumbnailUrl || '';
      if (basicInfo.thumbnail) {
        toast.info('Đang tải ảnh lên máy chủ...');
        finalThumbnailUrl = await teacherCourseService.uploadThumbnail(basicInfo.thumbnail);
      }
      if (!finalThumbnailUrl) throw new Error('Vui lòng cung cấp ảnh thu nhỏ cho khóa học');

      const levelLabel = COURSE_LEVELS.find(l => l.value === basicInfo.level)?.label || 'Nhập môn';
      const requestData: CreateCourseRequest = {
        title: basicInfo.title,
        description: basicInfo.description || '',
        thumbnailUrl: finalThumbnailUrl,
        price: isNaN(Number(basicInfo.price)) ? 0 : Number(basicInfo.price),
        discountPercent: isNaN(Number(basicInfo.discountPercent)) ? 0 : Number(basicInfo.discountPercent),
        courseStatus: 'DRAFT',
        assets: basicInfo.assets || [],
        courseLevel: levelLabel
      };

      const createdCourse = await teacherCourseService.createCourse(requestData);
      toast.success('Tạo khóa học thành công!');
      router.push(`/teacher/courses/${createdCourse.id}`);
      return createdCourse;
    } catch (error: any) {
      toast.error(error.message || 'Lỗi xử lý yêu cầu');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Logic: Upload Image -> Get URL -> Update Course
   */
  const handleUpdateCourse = async (courseId: string, basicInfo: BasicInfo) => {
    setIsSubmitting(true);
    try {
      let finalThumbnailUrl = basicInfo.thumbnailUrl || '';
      if (basicInfo.thumbnail) {
        toast.info('Đang tải ảnh lên máy chủ...');
        finalThumbnailUrl = await teacherCourseService.uploadThumbnail(basicInfo.thumbnail);
      }

      const levelLabel = COURSE_LEVELS.find(l => l.value === basicInfo.level)?.label || 'Nhập môn';
      const requestData: CreateCourseRequest = {
        title: basicInfo.title,
        description: basicInfo.description || '',
        thumbnailUrl: finalThumbnailUrl,
        price: isNaN(Number(basicInfo.price)) ? 0 : Number(basicInfo.price),
        discountPercent: isNaN(Number(basicInfo.discountPercent)) ? 0 : Number(basicInfo.discountPercent),
        courseStatus: 'DRAFT',
        assets: basicInfo.assets || [],
        courseLevel: levelLabel
      };

      const updatedCourse = await teacherCourseService.updateCourse(courseId, requestData);
      toast.success('Cập nhật khóa học thành công!');
      return updatedCourse;
    } catch (error: any) {
      toast.error(error.message || 'Lỗi xử lý yêu cầu');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleCreateCourse,
    handleUpdateCourse,
    isSubmitting
  };
};
