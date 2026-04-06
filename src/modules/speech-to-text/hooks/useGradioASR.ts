import { useState, useRef, useCallback } from 'react';
import { Client } from '@gradio/client';

// Model tiếng Việt mặc định (int8 - nhẹ, nhanh)
const VIETNAMESE_MODEL = 'csukuangfj2/sherpa-onnx-zipformer-vi-30M-int8-2026-02-09';

// Danh sách model Vietnamese hợp lệ (lấy từ API k2-fsa với language=Vietnamese)
const VALID_VI_MODELS = [
    'csukuangfj2/sherpa-onnx-zipformer-vi-30M-int8-2026-02-09',
    'csukuangfj2/sherpa-onnx-zipformer-vi-30M-2026-02-09',
    'csukuangfj/sherpa-onnx-zipformer-vi-int8-2025-04-20',
    'csukuangfj/sherpa-onnx-zipformer-vi-2025-04-20',
    'moonshine_base-vi',
];

export const useGradioASR = () => {
    const [isListening, setIsListening] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startListening = useCallback(async (preferredModelId?: string) => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

                    if (preferredModelId === 'hf-audio/whisper-large-v3-turbo') {
                        // ── Whisper V3 Turbo ──────────────────────────────────────
                        const whisperEndpoint = process.env.NEXT_PUBLIC_HF_WHISPER_URL || 'hf-audio/whisper-large-v3-turbo';
                        const client = await Client.connect(whisperEndpoint);
                        const result = await client.predict('/predict_1', [audioBlob, 'transcribe']);
                        const data = result.data as string[];
                        if (data && typeof data[0] === 'string') {
                            setTranscript(prev => prev + (prev ? ' ' : '') + data[0].trim());
                        }
                    } else {
                        // ── k2-fsa/automatic-speech-recognition ───────────────────
                        // QUAN TRỌNG: Gradio validate repo_id theo SESSION STATE của dropdown.
                        // Session mặc định là "English" → phải gọi /update_model_dropdown('Vietnamese')
                        // TRƯỚC để cập nhật session state, rồi mới gọi /process_microphone.
                        const zipformerEndpoint = process.env.NEXT_PUBLIC_HF_ZIPFORMER_URL || 'k2-fsa/automatic-speech-recognition';

                        // Tạo MỘT client dùng chung session (session_hash giống nhau)
                        const client = await Client.connect(zipformerEndpoint);

                        // Bước 1: Cập nhật dropdown state sang "Vietnamese" trong session này
                        // (không cần dùng return value, chỉ cần gọi để update state bên server)
                        await client.predict('/update_model_dropdown', ['Vietnamese']);

                        // Bước 2: Xác định model sẽ dùng
                        const modelToUse =
                            preferredModelId && VALID_VI_MODELS.includes(preferredModelId)
                                ? preferredModelId
                                : VIETNAMESE_MODEL;

                        // Bước 3: Gọi /process_microphone — server đã biết đây là Vietnamese session
                        const result = await client.predict('/process_microphone', [
                            'Vietnamese',    // language
                            modelToUse,      // repo_id — hợp lệ vì dropdown đã ở Vietnamese state
                            'vi',            // cohere_language (mới được thêm vào repo k2-fsa)
                            'greedy_search', // decoding_method
                            4,               // num_active_paths
                            'No',            // add_punct
                            audioBlob,       // in_filename (audio blob)
                        ]);

                        const data = result.data as string[];
                        // data[0] = transcript text, data[1] = HTML info
                        if (data && typeof data[0] === 'string') {
                            setTranscript(prev => prev + (prev ? ' ' : '') + data[0].trim());
                        }
                    }
                } catch (err: any) {
                    console.error('Gradio API Error:', err);
                    setError('Lỗi xử lý API: ' + err.message);
                } finally {
                    setIsTranscribing(false);
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
        resetTranscript,
    };
};
