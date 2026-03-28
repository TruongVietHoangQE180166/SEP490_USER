'use client';

import React from 'react';
import { useGradioASR } from '@/modules/speech-to-text/hooks/useGradioASR';
import { Button } from '@/components/ui/button';
import { Mic, Square, RefreshCcw, AlertTriangle, CloudRain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SpeechToTextPage() {
  const {
    isListening,
    isTranscribing,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useGradioASR();

  const [modelId, setModelId] = React.useState("hf-audio/whisper-large-v3-turbo");

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
           Cloud AI Speech to Text (Zipformer)
        </h1>
        <p className="text-muted-foreground font-medium">
          Dùng sức mạnh trọn vẹn của Máy chủ HuggingFace đằng sau API K2 Automatic Speech Recognition. Độ chính xác từ điển tiếng Việt đạt đỉnh cao!
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-4 text-sm">
        <label htmlFor="model-select" className="font-semibold text-blue-900 whitespace-nowrap">
          Chọn Mô Hình Dịch:
        </label>
        <select
          id="model-select"
          className="flex-1 bg-white border border-blue-200 rounded-lg p-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={isListening || isTranscribing}
        >
          <option value="hf-audio/whisper-large-v3-turbo">
            Whisper Large V3 Turbo (Server Độc Quyền HF) - Tốc độ đỉnh, độ sai sót ~0%
          </option>
          <option value="hynt/sherpa-onnx-zipformer-vi-int8-2025-10-16">
            Zipformer Tiếng Việt (Bản INT8 Tối ưu tốc độ)
          </option>
          <option value="hynt/sherpa-onnx-zipformer-vi-2025-10-16">
            Zipformer Tiếng Việt (Bản chuẩn FP32) - Độ chính xác cao
          </option>
          <option value="hynt/sherpa-onnx-zipformer-vi-streaming-chunk32-fp16-2025-02-01">
            Zipformer Tiếng Việt (Bản Streaming FP16) - Mới 2025
          </option>
        </select>
      </div>

      <Card className="relative overflow-hidden border shadow-lg border-blue-100">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isListening ? (
            <Badge variant="destructive" className="animate-pulse bg-red-500">
              Đang Thu Âm...
            </Badge>
          ) : isTranscribing ? (
            <Badge variant="default" className="bg-blue-500 animate-pulse">
              Đang phân tích trên Cloud...
            </Badge>
          ) : (
            <Badge variant="secondary">Đã dừng</Badge>
          )}
        </div>
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="text-blue-500 size-5" /> Cloud Audio Input
          </CardTitle>
          <CardDescription>
            Bấm thu âm và nói, sau khi nhấn dừng, toàn bộ file sóng âm sẽ được máy chủ Server tải về xử lý, trả về kết quả mượt mà không sai chính tả.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => startListening(modelId)}
              disabled={isListening || isTranscribing}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Mic className="size-4" /> Bắt đầu ghi âm
            </Button>
            
            <Button
              onClick={stopListening}
              disabled={!isListening}
              variant="destructive"
              className="gap-2 bg-red-600"
            >
              <Square className="size-4" /> Dừng và Phân tích ngay
            </Button>

            <Button
              onClick={resetTranscript}
              variant="outline"
              className="gap-2 ml-auto hover:bg-slate-50"
              disabled={isTranscribing}
            >
              <RefreshCcw className="size-4" /> DỌN DẸP
            </Button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 font-medium border border-red-200 flex items-start flex-col gap-1">
               <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0" />
                  <strong>Lỗi Giao tiếp HuggingFace API:</strong>
               </div>
               <p className="ml-6">{error}</p>
            </div>
          )}

          <div className="min-h-[300px] w-full rounded-2xl border-2 border-blue-50 bg-slate-50/50 p-6 text-xl leading-relaxed shadow-inner text-slate-800 relative">
             {/* Lớp overlay che mờ màn hình lúc đang chờ server gọi API */}
            {isTranscribing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                       <Loader2 className="animate-spin size-8 text-blue-600" />
                       <span className="text-sm font-bold text-blue-600 animate-pulse uppercase tracking-wider">Đang chờ máy chủ HuggingFace dịch thuật...</span>
                    </div>
                </div>
            )}

            {transcript ? (
              // Kết quả trả về rất chính xác
              <span className="font-semibold text-blue-950">{transcript}</span>
            ) : (
                <span className="text-muted-foreground/60 italic font-normal text-lg">
                   Bấm ghi âm xong bấm dừng, kết quả chuẩn xác tuyệt đối sẽ xuất hiện ở đây.
                </span>
            )}
            
            {/* Tín hiệu ghi âm */}
            {isListening && (
                <span className="inline-block w-2 h-6 ml-2 -mb-1 bg-red-500 animate-bounce opacity-80 rounded-[1px]" />
            )}
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-muted-foreground/60 uppercase font-semibold">Powers by Sherpa-ONNX Zipformer Vi (K2 Automatic Speech Recognition)</p>
    </div>
  );
}
