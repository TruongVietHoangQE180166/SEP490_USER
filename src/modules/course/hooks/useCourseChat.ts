import { useEffect, useState, useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import { courseState$, courseActions } from '../store';
import { courseChatService } from '../courseChatService';
import { authState$ } from '@/modules/auth/store';

export const useCourseChat = (courseId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const messages = useSelector(() => courseState$.discussionMessages.get());
  const user = useSelector(() => authState$.user.get());
  const course = useSelector(() => courseState$.currentCourse.get());

  const fetchHistory = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const history = await courseChatService.getMessages(courseId);
      courseActions.setDiscussionMessages(history);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchHistory();

    const channel = courseChatService.subscribeToMessages(
      courseId, 
      (newMessage) => {
        courseActions.addDiscussionMessage(newMessage);
      },
      (updatedMessage) => {
        courseActions.updateDiscussionMessage(updatedMessage);
      },
      (deletedMessageId) => {
        courseActions.removeDiscussionMessage(deletedMessageId);
      }
    );

    return () => {
      courseChatService.unsubscribe(channel);
    };
  }, [courseId, fetchHistory]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !courseId || !course) return;

    // Check if the current user is the creator/author of this specific course
    // Combining common author identification fields
    const isAuthor = 
      course.authorId === user.userId || 
      course.createdBy === user.userId ||
      course.createdBy === user.username;
    
    // Get role and level from the auth store (exactly as in localStorage)
    const currentRole = (user as any).role || 'STUDENT';
    const currentLevel = (user as any).level || 'N/A';

    const messageData = {
      course_id: courseId,
      user_id: user.userId,
      content,
      user_name: (user as any).username || (user as any).fullName || 'Anonymous',
      user_avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`,
      user_role: currentRole,
      user_level: currentLevel,
      is_author: isAuthor,
      is_read: false,
    };

    const result = await courseChatService.sendMessage(messageData);
    if (result) {
      courseActions.addDiscussionMessage(result);
    }
    return result;
  };

  return {
    messages,
    isLoading,
    sendMessage,
    user,
    course,
    fetchHistory
  };
};
