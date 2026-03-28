import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechToTextOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const { lang = 'vi-VN', continuous = true, interimResults = true } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Web Speech API
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Trình duyệt của bạn không hỗ trợ Web Speech API.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    // maxAlternatives có thể dùng để lấy nhiều kết quả gợi ý và tự động chọn
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let currentInterimTranscript = '';
      let finalTranscriptChunk = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptChunk += event.results[i][0].transcript + ' ';
        } else {
          currentInterimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscriptChunk) {
        setTranscript((prev) => prev + finalTranscriptChunk);
      }
      setInterimTranscript(currentInterimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Lỗi nhận diện: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      // tự động restart nếu continuous = true mà vô tình bị tắt do silence
      // nhưng cần cẩn thận để tránh infinite loop. 
      // Ở đây ta cứ để tắt, user bật lại là tốt nhất, hoặc xử lý tuỳ logic.
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, continuous, interimResults]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        setInterimTranscript('');
        recognitionRef.current.start();
      } catch (e: any) {
        console.error(e);
        setError(`Không thể bắt đầu: ${e.message}`);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
};
