import { useState, useRef, useCallback } from 'react';
import { Client } from '@gradio/client';

export const useGradioASR = () => {
    const [isListening, setIsListening] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startListening = useCallback(async (modelId: string = "hynt/sherpa-onnx-zipformer-vi-int8-2025-10-16") => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Dùng định dạng âm thanh cơ bản phù hợp với web
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsTranscribing(true);
                try {
                    // Gradio audio thường nhận diện tốt dưới dạng Blob wav hoặc webm
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    
                    // Phân nhánh logic xử lý theo Model
                    let client, result;
                    if (modelId === "hf-audio/whisper-large-v3-turbo") {
                        // Kết nối tới Hệ thống server riêng khủng nhất của Hugging Face Audio Team (Đọc từ File .env)
                        const whisperEndpoint = process.env.NEXT_PUBLIC_HF_WHISPER_URL || "hf-audio/whisper-large-v3-turbo";
                        client = await Client.connect(whisperEndpoint as string);
                        // Gửi File thẳng cho Whisper V3 Turbo (Với tham số Transcribe)
                        result = await client.predict("/predict_1", [
                            audioBlob,     // Audio file
                            "transcribe",  // Task
                        ]);
                    } else {
                        // Kết nối tới HuggingFace Space Model K2 (Server gốc lấy từ File .env)
                        const zipformerEndpoint = process.env.NEXT_PUBLIC_HF_ZIPFORMER_URL || "hynt/k2-automatic-speech-recognition-demo";
                        client = await Client.connect(zipformerEndpoint as string);
                        
                        // Gọi API Endpoint /process_microphone của Model K2
                        result = await client.predict("/process_microphone", [
                            "Vietnamese",          // language
                            modelId,               // Thay đổi Model linh hoạt do user chọn
                            "modified_beam_search", // Decoding method
                            15,                    // Active paths
                            "No",                 // Add punctuation (No/Yes)
                            audioBlob              // Dữ liệu thu âm
                        ]);
                    }

                    const data = result.data as string[];
                    // Index [0] là textbox văn bản trả về, [1] là đoạn HTML info của server
                    if (data && typeof data[0] === 'string') {
                        setTranscript(prev => prev + (prev ? ' ' : '') + data[0].trim());
                    }
                } catch (err: any) {
                    console.error("Gradio API Error:", err);
                    setError("Lỗi xử lý API từ Hệ thống Máy chủ HF: " + err.message);
                } finally {
                    setIsTranscribing(false);
                    // Tắt hẳn quyền truy cập Micro
                    stream.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorderRef.current.start();
            setIsListening(true);
        } catch (err: any) {
            console.error(err);
            setError('Không thể truy cập Microphone: ' + err.message);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        isListening,
        isTranscribing,
        transcript,
        error,
        startListening,
        stopListening,
        resetTranscript
    };
};
