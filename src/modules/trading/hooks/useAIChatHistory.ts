import { useState, useCallback, useEffect } from 'react';
import { fetchChatHistory, sendChatMessage } from '../services';
import { toast } from '@/components/ui/toast';

export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: React.ReactNode;
};

const WELCOME_MESSAGE: ChatMessage[] = [
  { id: '1', role: 'ai', content: 'Xin chào! Bạn có câu hỏi nào về thị trường cần giải đáp không? Tôi có thể phân tích xu hướng hoặc chỉ ra mức hỗ trợ/kháng cự.' }
];

export function useAIChatHistory(user: any) {
  const [messages, setMessages] = useState<ChatMessage[]>(WELCOME_MESSAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const history = await fetchChatHistory(1, 1000);
      if (history && history.length > 0) {
        const formattedHistory: ChatMessage[] = [];
        [...history].reverse().forEach((item, index) => {
          formattedHistory.push({
            id: `user_${index}_${item.userId}`,
            role: 'user',
            content: item.userMessage,
          });
          formattedHistory.push({
            id: `ai_${index}_${item.userId}`,
            role: 'ai',
            content: item.aiResponse,
          });
        });
        setMessages(formattedHistory);
      } else {
        setMessages(WELCOME_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const sendMessage = useCallback(async (userMessageText: string) => {
    const userMsgId = `user_${Date.now()}`;
    addMessage({ id: userMsgId, role: 'user', content: userMessageText });
    
    setIsAiThinking(true);
    try {
      const response = await sendChatMessage(userMessageText);
      if (response && response.success && response.data) {
        addMessage({ id: `ai_${Date.now()}`, role: 'ai', content: response.data });
      } else {
        toast.error(response?.message?.messageDetail || 'AI không phản hồi. Vui lòng thử lại.');
      }
    } catch (err: any) {
      toast.error('Lỗi khi gửi tin nhắn: ' + (err.message || ''));
    } finally {
      setIsAiThinking(false);
    }
  }, [addMessage]);

  return { messages, setMessages, addMessage, isLoading, refreshHistory: loadHistory, isAiThinking, sendMessage };
}
