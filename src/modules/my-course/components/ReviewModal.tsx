'use client';

import React, { useState } from 'react';
import { observer } from '@legendapp/state/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { courseService } from '@/modules/course/services';
import { useMyCourse } from '../hooks/useMyCourse';
import { toast } from '@/components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewModalProps {
  courseId: string;
  courseTitle: string;
  children: React.ReactNode;
}

export const ReviewModal = observer(({ courseId, courseTitle, children }: ReviewModalProps) => {
  const { userRatings, fetchCourseRating } = useMyCourse();
  const existingRating = userRatings?.[courseId];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form with existing rating when it changes or when modal opens
  React.useEffect(() => {
    if (isOpen && !isInitialized) {
      const init = async () => {
        const data = await fetchCourseRating(courseId);
        if (data) {
          setRating(data.rating);
          setComment(data.comment);
        }
        setIsInitialized(true);
      };
      init();
    }
  }, [isOpen, courseId, isInitialized, fetchCourseRating]);

  // Reset initialized state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      if (existingRating) {
        await courseService.updateRating(existingRating.id, rating, comment);
        toast.success('Đã cập nhật đánh giá của bạn!');
      } else {
        await courseService.createRating(courseId, rating, comment);
        toast.success('Cảm ơn bạn đã đánh giá khóa học!');
      }
      
      // Refresh rating in store
      await fetchCourseRating(courseId);
      
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const trigger = React.isValidElement(children) 
    ? React.cloneElement(children as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
          const childrenProps = (children as React.ReactElement<any>).props;
          if (childrenProps && childrenProps.onClick) {
            childrenProps.onClick(e);
          }
        },
      })
    : children;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger}
      <AlertDialogContent 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="rounded-[40px] border border-white/10 bg-background/80 backdrop-blur-3xl px-10 py-7 max-w-2xl"
      >
        <AlertDialogHeader className="space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
            <Star className="w-8 h-8 fill-primary" />
          </div>
          <AlertDialogTitle className="text-3xl font-black text-center tracking-tight">
            {existingRating ? 'Cập nhật đánh giá' : 'Đánh giá khóa học'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base font-medium text-muted-foreground">
            Bạn thấy khóa học <span className="text-foreground font-bold">"{courseTitle}"</span> như thế nào? Chia sẻ trải nghiệm của bạn nhé!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-5 space-y-6">
          {/* Star Selection */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
              >
                <Star
                  className={`w-10 h-10 transition-all duration-300 ${
                    star <= rating 
                      ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                      : 'text-muted-foreground/30'
                  }`}
                />
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">
              Nhận xét của bạn
            </label>
            <Textarea
              placeholder="Khóa học này rất bổ ích, tôi đã học được nhiều kiến thức mới..."
              className="min-h-[120px] rounded-3xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 text-base font-medium p-6"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <AlertDialogFooter className="gap-3 sm:gap-0 mt-2">
          <AlertDialogCancel className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-base font-black border-none">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={isSubmitting}
            className="h-14 rounded-2xl bg-primary text-primary-foreground text-base font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Đang gửi...
              </div>
            ) : (
              existingRating ? 'Cập nhật' : 'Gửi đánh giá'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
