'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { observer } from '@legendapp/state/react';
import { tradingState$, tradingActions } from '../store';
import { TradingChart } from './TradingChart';
import { OrderPanel } from './OrderPanel';
import { OrderBook } from './OrderBook';
import { TradeDashboard } from './TradeDashboard';
import { MarketHeader } from './MarketHeader';
import { TradingTutorial } from './TradingTutorial';
import { useRealtimeFeed } from '../hooks/useRealtimeFeed';
import { useAIChatHistory, ChatMessage } from '../hooks/useAIChatHistory';
import { getChartHistory } from '../services';
import { MessageFormatter } from './MessageFormatter';
import { WalletService } from '../../wallet/services';
import { CandleType, Timeframe } from '../types';
import { Bot, Send, Sparkles, Mic, Square, Loader2, Trash2, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import * as googleTTS from 'google-tts-api';
import { Client } from '@gradio/client';
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
} from '@/components/ui/bottom-sheet';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { authState$ } from '@/modules/auth/store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ZIPFORMER_MODEL = 'csukuangfj2/sherpa-onnx-zipformer-vi-30M-int8-2026-02-09';

const SYMBOL = 'XAU-USDT-SWAP';

// Type removed, imported instead

export const TradingView = observer(function TradingView() {

  const positions    = tradingState$.openPositions.get();
  const currentPrice = tradingState$.currentPrice.get();
  const timeframe    = tradingState$.timeframe.get();
  const balance      = tradingState$.balance.get();
  const pendingCount = tradingState$.pendingOrders.get().length;

  const user = authState$.user.get();
  const router = useRouter();

  // --- AI Chat State ---
  const { messages, setMessages, isLoading, refreshHistory, isAiThinking, sendMessage } = useAIChatHistory(user);
  const [chatInput, setChatInput] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiThinking]);

  // --- Voice Recording State ---
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioBlobRef.current = blob;
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Không thể truy cập Microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    audioBlobRef.current = null;
  };

  // Gửi voice: transcribe → thêm thẳng vào chat bubble
  const handleSendVoice = async () => {
    const blob = audioBlobRef.current;
    if (!blob || isAiThinking || isTranscribing) return;

    // Dọn audio player
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    audioBlobRef.current = null;

    setIsTranscribing(true);
    try {
      const endpoint = process.env.NEXT_PUBLIC_HF_ZIPFORMER_URL || 'k2-fsa/automatic-speech-recognition';
      const client = await Client.connect(endpoint);
      // Cập nhật session dropdown → Vietnamese
      await client.predict('/update_model_dropdown', ['Vietnamese']);
      // Gọi transcription
      const result = await client.predict('/process_microphone', [
        'Vietnamese',
        ZIPFORMER_MODEL,
        'vi', // cohere_language (mới được thêm vào API k2-fsa)
        'greedy_search',
        4,
        'No',
        blob,
      ]);
      const data = result.data as string[];
      const transcribed = (data && typeof data[0] === 'string' ? data[0].trim() : '') || '[Không nhận dạng được]';

      // Call API chat after transcription
      sendMessage(transcribed);
    } catch (err: any) {
      console.error('[ASR] Error:', err);
      toast.error('Nhận dạng giọng nói thất bại: ' + (err?.message ?? ''));
    } finally {
      setIsTranscribing(false);
    }
  };



  const googleAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const activeSpeechTokenRef = React.useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (googleAudioRef.current) {
        googleAudioRef.current.pause();
        googleAudioRef.current.src = '';
      }
      activeSpeechTokenRef.current = null;
    };
  }, []);

  const toggleSpeak = (id: string, text: React.ReactNode) => {
    if (typeof window === 'undefined' || typeof text !== 'string') return;
    
    if (speakingId === id) {
      if (googleAudioRef.current) {
        googleAudioRef.current.pause();
      }
      setSpeakingId(null);
      activeSpeechTokenRef.current = null;
      return;
    }

    if (googleAudioRef.current) {
      googleAudioRef.current.pause();
    }
    
    setSpeakingId(id);
    const token = Date.now().toString();
    activeSpeechTokenRef.current = token;

    // --- FIX CORS / 403 FORBIDDEN LỖI GOOGLE TTS ---
    // Google TTS sẽ block nếu phát hiện request xuất phát từ localhost.
    // Phải chặn trình duyệt gửi header "Referer" bằng cách ép no-referrer vào document head tạm thời.
    let metaReferrer = document.querySelector('meta[name="referrer"]') as HTMLMetaElement;
    let oldReferrer = '';
    if (!metaReferrer) {
      metaReferrer = document.createElement('meta');
      metaReferrer.name = "referrer";
      metaReferrer.content = "no-referrer";
      document.head.appendChild(metaReferrer);
    } else {
      oldReferrer = metaReferrer.content;
      metaReferrer.content = "no-referrer";
    }

    // Lấy chuỗi các đoạn audio url thông qua googleTTS (tự động cắt ghép nếu quá 200 ký tự)
    const audioItems = googleTTS.getAllAudioUrls(text, {
      lang: 'vi',
      slow: false,
      host: 'https://translate.googleapis.com', // Cực kỳ quan trọng: dùng api domain
    });

    let currentChunkIndex = 0;

    const playNext = () => {
      if (activeSpeechTokenRef.current !== token) return;
      
      if (currentChunkIndex >= audioItems.length) {
        setSpeakingId(null);
        activeSpeechTokenRef.current = null;
        return;
      }

      const audioMeta = audioItems[currentChunkIndex];
      const url = audioMeta.url;
      
      const audio = new Audio(url);
      audio.playbackRate = 1.15; // Tăng tốc độ đọc lên 15%
      googleAudioRef.current = audio;

      // Bảo vệ Audio element không mang Referer (localhost) gửi qua Google
      // Nếu có thì Google Translate sẽ block file mp3 bằng mã 403 Forbidden.
      if ('referrerPolicy' in audio) {
         (audio as any).referrerPolicy = "no-referrer";
      }

      audio.onended = () => {
        currentChunkIndex++;
        playNext();
      };

      audio.onerror = (e) => {
        // Bỏ qua nếu token đã bị xóa (navigation away / component unmount)
        if (activeSpeechTokenRef.current !== token) return;
        console.error("Lỗi Google TTS tại đoạn:", audioMeta.shortText, e);
        setSpeakingId(null);
        activeSpeechTokenRef.current = null;
      };

      audio.play().catch((err) => {
        if (activeSpeechTokenRef.current !== token) return;
        console.error("Trình duyệt chặn phát âm thanh:", err);
        setSpeakingId(null);
        activeSpeechTokenRef.current = null;
      });
    };

    playNext();
  };


  // --- handleSendMessage (text) ---
  const handleSendMessage = () => {
    if (!chatInput.trim() || isAiThinking) return;
    sendMessage(chatInput.trim());
    setChatInput('');
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const { start: startRealtime, stop: stopRealtime } = useRealtimeFeed();

  const refreshWalletData = useCallback(async () => {
    try {
      const [wallet, assets] = await Promise.all([
        WalletService.getMyWallet('USDT'),
        WalletService.getMyAssets()
      ]);
      
      if (wallet) {
        tradingActions.setWalletData({
          availableBalance: wallet.availableBalance,
          lockedBalance: wallet.lockedBalance,
        });
      }
      
      const goldAsset = assets.find(a => a.assetSymbol === 'XAUT');
      if (goldAsset) {
        tradingActions.setWalletData({
          goldBalance: goldAsset.quantity,
          lockedGoldBalance: goldAsset.lockedQuantity,
        });
      }
    } catch (err) {
      console.warn('[TradingView] Failed to refresh wallet data', err);
    }
  }, []);

  const loadData = useCallback(async (tf: Timeframe) => {
    tradingActions.setIsChartLoading(true);
    refreshWalletData();
    try {
      const history = await getChartHistory(SYMBOL, tf, 2000);
      tradingActions.setChartData(history);
      
      const lastPrice = history[history.length - 1]?.close ?? 0;
      if (lastPrice > 0) {
        tradingActions.setCurrentPrice(lastPrice);
      }
      
      tradingActions.setSymbol(SYMBOL);
      tradingActions.setRealtimeActive(true);
    } catch (err) {
      console.error('[TradingView] Failed to load history', err);
      toast.error('Không thể tải dữ liệu lịch sử');
      tradingActions.setIsChartLoading(false);
    } 
    // Failsafe: ensure loading disappears after 10s if no socket message arrives
    setTimeout(() => {
      if (tradingState$.isChartLoading.get()) {
        tradingActions.setIsChartLoading(false);
      }
    }, 10000);
    
    // Fetch user trades after setup
    tradingActions.fetchAndSetOrders();
  }, []);

  useEffect(() => {
    tradingActions.setSymbol(SYMBOL);
    if (!user) return;
    loadData(timeframe);
    startRealtime();

    return () => { stopRealtime(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleTimeframeChange = (tf: Timeframe) => { 
    if (timeframe === tf || !user) return;
    tradingActions.setChartData([]); // Clear ghost candles immediately
    tradingActions.setTimeframe(tf);
    stopRealtime(); 
    loadData(tf); 
    startRealtime(); 
  };

  return (
    <div className="min-h-screen bg-background pb-8 relative">
      {!user && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md px-4">
          <div className="bg-card p-8 rounded-xl border border-border flex flex-col items-center gap-6 text-center max-w-sm shadow-2xl">
            <h2 className="text-2xl font-bold tracking-tight">Yêu cầu đăng nhập</h2>
            <p className="text-muted-foreground text-sm">
              Bạn cần đăng nhập để xem dữ liệu thị trường trực tuyến và tham gia mô phỏng giao dịch crypto.
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
                Trang chủ
              </Button>
              <Button onClick={() => router.push('/login')} className="flex-1">
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      )}

      {user && <TradingTutorial />}
      {/* ── Khoảng cách trên ──────────────────────────────────────── */}
      <div className={cn("max-w-[1600px] mx-auto px-4 pt-6 flex flex-col gap-4", !user && "pointer-events-none")}>

        {/* ── MarketHeader ──────────────────────────────────────────── */}
        <div id="tut-market-header" className="rounded-md border border-border bg-card overflow-hidden">
          <MarketHeader />
        </div>

        {/* ── Nội dung chính: Chart + OrderBook + OrderPanel ─────── */}
        <div className="hidden lg:flex gap-4 items-start">
          {/* Cột trái - Chart */}
          <div id="tut-trading-chart" className="flex-1 min-w-0">
            <div className="rounded-md border border-border bg-card overflow-hidden" style={{ height: 800 }}>
              <TradingChart
                positions={positions}
                currentPrice={currentPrice}
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />
            </div>
          </div>

          {/* Cột giữa — Order Book */}
          <div id="tut-order-book" className="flex flex-col w-[200px] 2xl:w-[240px] flex-none h-[800px]">
            <OrderBook />
          </div>

          {/* Cột phải — Order Panel */}
          <div id="tut-order-panel" className="flex flex-col w-[300px] xl:w-[320px] flex-none h-[800px]">
            <div className="rounded-md border border-border bg-card overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 border-b border-border bg-muted/10">
                <span className="text-xs font-black uppercase tracking-widest text-foreground">Đặt lệnh</span>
              </div>
              <div className="flex-1 overflow-auto">
                <OrderPanel />
              </div>
            </div>
          </div>
        </div>

        {/* ── Dashboard (Full Width) ─────────────────────────────── */}
        <div id="tut-trade-dashboard" className="hidden lg:block">
          <TradeDashboard />
        </div>

        {/* ── Mobile Layout ────────────────────────────────────────── */}
        <div className="flex lg:hidden flex-col gap-4">
          <div className="rounded-md border border-border bg-card overflow-hidden h-[400px]">
             <TradingChart 
               positions={positions} 
               currentPrice={currentPrice} 
               timeframe={timeframe} 
               onTimeframeChange={handleTimeframeChange}
             />
          </div>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <OrderPanel />
          </div>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <OrderBook />
          </div>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <TradeDashboard />
          </div>
        </div>

      </div>

      {/* ── AI Assistant Chat Bubble ─────────────────────────────── */}
      <BottomSheet>
        <BottomSheetTrigger asChild>
          <button id="tut-ai-chat" className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(0,0,0,0.15)] shadow-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-primary/60 hover:scale-110 transition-all duration-300 animate-bounce ring-4 ring-primary/20 cursor-pointer">
            <Bot size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <Sparkles size={16} className="absolute top-2 right-2 text-primary-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          </button>
        </BottomSheetTrigger>
        <BottomSheetContent className="flex flex-col h-[70vh] sm:h-[600px] w-full">
          <BottomSheetHeader className="border-b border-border pb-4 shrink-0 px-4 flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5 pt-2">
              <BottomSheetTitle className="text-xl flex items-center gap-2">
                <Bot className="text-primary" />
                AI Trading Assistant
              </BottomSheetTitle>
              <BottomSheetDescription>
                Hỏi AI về thị trường, xu hướng hoặc phân tích kỹ thuật.
              </BottomSheetDescription>
            </div>
            <button 
              onClick={refreshHistory} 
              disabled={isLoading}
              className="p-2.5 mt-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors disabled:opacity-50 shrink-0"
              title="Làm mới lịch sử chat"
            >
              <RefreshCw size={18} className={cn(isLoading && "animate-spin text-primary")} />
            </button>
          </BottomSheetHeader>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {isLoading && messages.length <= 1 ? (
              <div className="flex flex-col items-center justify-center h-[200px] my-auto gap-3 text-muted-foreground/60 w-full animate-in fade-in">
                <Loader2 size={32} className="animate-spin text-primary/60" />
                <p className="text-sm font-medium">Đang tải lịch sử trò chuyện...</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
              <div 
                key={msg.id}
                className={cn(
                  "group flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]",
                  msg.role === 'ai' ? "self-start" : "self-end"
                )}
              >
                <div 
                  className={cn(
                    "p-3 rounded-2xl text-sm break-words whitespace-pre-wrap",
                    msg.role === 'ai' 
                      ? "bg-muted rounded-tl-sm" 
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}
                >
                  {typeof msg.content === 'string' ? <MessageFormatter content={msg.content} /> : msg.content}
                </div>
                {msg.role === 'ai' && typeof msg.content === 'string' && (
                  <button 
                    onClick={() => toggleSpeak(msg.id, msg.content)}
                    className={cn(
                      "flex items-center gap-1.5 self-start px-2 py-1 hover:bg-muted/60 rounded-md transition-all text-xs text-muted-foreground",
                      speakingId === msg.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                    )}
                    title="Nghe AI đọc phản hồi này"
                  >
                    {speakingId === msg.id ? (
                      <>
                        <VolumeX size={14} className="text-primary animate-pulse" />
                        <span className="text-primary font-medium">Dừng đọc</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} />
                        <span>Nghe đọc</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
            
            {isAiThinking && (
              <div className="bg-muted p-3 px-4 rounded-2xl rounded-tl-sm self-start flex gap-2 items-center h-[44px]">
                <span className="text-sm font-medium text-foreground/70 animate-pulse">AI đang phân tích</span>
                <div className="flex gap-1.5 items-center mt-1">
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
              </>
            )}

            {/* Đánh dấu để có thể tự động scroll xuống dưới cùng */}
            <div ref={chatEndRef} className="h-4 shrink-0"></div>
          </div>
          <div className="mt-auto p-4 border-t border-border shrink-0 flex gap-3 items-center bg-background -mx-4">
            {isTranscribing ? (
              /* ── Đang nhận dạng giọng nói (Loading) ── */
              <div className="flex-1 flex items-center gap-3 bg-primary/10 border-2 border-primary/30 rounded-full pl-5 pr-4 h-[52px]">
                <Loader2 size={20} className="text-primary animate-spin shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-primary leading-tight">Đang nhận dạng giọng nói...</span>
                  <span className="text-xs text-muted-foreground truncate">Zipformer · Vietnamese ASR</span>
                </div>
                <div className="flex gap-1 ml-auto shrink-0">
                  <span className="w-1.5 h-4 bg-primary/60 rounded-full animate-[bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-4 bg-primary/60 rounded-full animate-[bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-4 bg-primary/60 rounded-full animate-[bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : audioUrl ? (
              /* ── Player nghe lại + nút discard ── */
              <div className="flex-1 flex items-center gap-2 bg-primary/10 border-2 border-primary/30 rounded-full pl-2 pr-1 h-[52px]">
                <audio
                  controls
                  src={audioUrl}
                  style={{ accentColor: 'hsl(var(--primary))' }}
                  className="flex-1 h-10 outline-none min-w-0 [&::-webkit-media-controls-enclosure]:bg-transparent [&::-webkit-media-controls-panel]:bg-transparent rounded-full"
                />
                <button
                  onClick={discardRecording}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors shrink-0 cursor-pointer"
                  title="Xóa ghi âm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : isRecording ? (
              <div className="flex-1 flex items-center justify-between bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full pl-6 pr-1 h-[52px]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold animate-pulse">Đang ghi âm...</span>
                </div>
                <button onClick={stopRecording} className="bg-rose-500 text-white hover:bg-rose-600 rounded-full w-[44px] h-[44px] flex items-center justify-center transition-colors shadow-sm cursor-pointer" title="Dừng ghi âm">
                  <Square size={16} fill="currentColor" />
                </button>
              </div>
            ) : (
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-muted/50 border border-border rounded-full pl-6 pr-12 text-base focus:outline-none focus:ring-1 focus:ring-primary h-[52px] shadow-inner"
                  placeholder="Nhập câu hỏi của bạn..."
                />
                <button
                  onClick={startRecording}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                  title="Nhập bằng giọng nói"
                >
                  <Mic size={20} />
                </button>
              </div>
            )}
            {/* Nút Send — nếu có audio thì gửi voice, không thì gửi text */}
            <button
              onClick={audioUrl ? handleSendVoice : handleSendMessage}
              disabled={isAiThinking || isTranscribing || isRecording || (!chatInput.trim() && !audioUrl)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-full h-[52px] w-[52px] flex flex-shrink-0 items-center justify-center transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:active:scale-100"
            >
              {isTranscribing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>


        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
});
