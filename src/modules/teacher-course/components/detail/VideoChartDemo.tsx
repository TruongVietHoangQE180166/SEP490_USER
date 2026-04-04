import React, { useState, useMemo } from 'react';
import { useChartDemo } from '../../hooks/useChartDemo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { BarChart3, Plus, Minus, Pencil, Trash2, DollarSign, Calendar, Clock, Activity, Loader2, Eye, X, FileText, Target } from 'lucide-react';
import { DemoChart } from './DemoChart';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoChartDemoProps {
  videoId: string;
}

export const VideoChartDemo: React.FC<VideoChartDemoProps> = ({ videoId }) => {
  const { chartDemo, isLoading, isCreating, isUpdating, isDeleting, createChartDemo, updateChartDemo, deleteChartDemo } = useChartDemo(videoId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const EMPTY_FORM = {
    provideMoney: 10000,
    description: '',
    ts: '',
    startTradeTs: '',
    closeTs: '',
    limitTs: '',
    objectDone: 50,
  };

  // Convert unix timestamp (ms) to YYYY-MM-DD date string for date inputs
  const tsToDateStr = (ts: number | undefined) => {
    if (!ts) return '';
    return new Date(ts).toISOString().slice(0, 10);
  };

  const [formData, setFormData] = useState(EMPTY_FORM);


  const { isStepValid, validationError } = useMemo(() => {
    if (currentStep === 1) {
      if (!formData.ts || !formData.limitTs) return { isStepValid: false, validationError: 'Vui lòng chọn đầy đủ Ngày bắt đầu và Ngày kết thúc.' };
      const t = new Date(formData.ts).getTime();
      const l = new Date(formData.limitTs).getTime();
      if (isNaN(t) || isNaN(l)) return { isStepValid: false, validationError: 'Định dạng ngày không hợp lệ.' };
      if (t >= l) return { isStepValid: false, validationError: 'Ngày bắt đầu mốc Chart (ts) phải TRƯỚC Ngày kết thúc (limitTs).' };
      return { isStepValid: true, validationError: '' };
    }
    if (currentStep === 2) {
      if (!formData.closeTs) return { isStepValid: false, validationError: 'Vui lòng chọn Ngày điểm nến hiện tại.' };
      const t = new Date(formData.ts).getTime();
      const l = new Date(formData.limitTs).getTime();
      const c = new Date(formData.closeTs).getTime();
      if (isNaN(c)) return { isStepValid: false, validationError: 'Định dạng ngày không hợp lệ.' };
      if (c <= t || c >= l) return { isStepValid: false, validationError: 'Nến hiện tại (closeTs) phải nằm lọt giữa Ngày bắt đầu và Ngày kết thúc.' };
      return { isStepValid: true, validationError: '' };
    }
    if (currentStep === 3) {
      if (!formData.startTradeTs) return { isStepValid: false, validationError: 'Vui lòng chọn Ngày bắt đầu giao dịch.' };
      const t = new Date(formData.ts).getTime();
      const c = new Date(formData.closeTs).getTime();
      const st = new Date(formData.startTradeTs).getTime();
      if (isNaN(st)) return { isStepValid: false, validationError: 'Định dạng ngày không hợp lệ.' };
      if (st < t || st > c) return { isStepValid: false, validationError: 'Bắt đầu giao dịch (startTradeTs) phải nằm giữa Bắt đầu mốc và Nến hiện tại.' };
      return { isStepValid: true, validationError: '' };
    }
    if (currentStep === 4) {
      if (!formData.provideMoney || formData.provideMoney <= 0) return { isStepValid: false, validationError: 'Số dư khởi tạo phải lớn hơn 0.' };
      if (!formData.objectDone || formData.objectDone <= 0) return { isStepValid: false, validationError: 'Mục tiêu đạt phải lớn hơn 0.' };
      if (formData.provideMoney >= formData.objectDone) return { isStepValid: false, validationError: 'Số dư khởi tạo phải NHỎ HƠN Mục tiêu đạt để đảm bảo tính thử thách.' };
      if (!formData.description.trim()) return { isStepValid: false, validationError: 'Vui lòng nhập mô tả hiển thị.' };
      return { isStepValid: true, validationError: '' };
    }
    if (currentStep === 5) {
      return { isStepValid: true, validationError: '' };
    }
    return { isStepValid: false, validationError: '' };
  }, [formData, currentStep]);

  const handleOpenEdit = () => {
    if (!chartDemo) return;
    setFormData({
      provideMoney: chartDemo.provideMoney ?? 10000,
      description: chartDemo.description ?? '',
      ts: tsToDateStr(chartDemo.ts),
      startTradeTs: tsToDateStr(chartDemo.startTradeTs),
      closeTs: tsToDateStr(chartDemo.closeTs),
      limitTs: tsToDateStr(chartDemo.limitTs),
      objectDone: chartDemo.objectDone ?? 50,
    });
    setIsEditMode(true);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setIsEditMode(false);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  if (videoId.startsWith('temp-')) {
    return null; // Cannot create chart demo for a temporary unsaved video
  }

  if (isLoading) {
    return (
      <div className="ml-16 mt-2 p-3 border-l-2 border-primary/20 flex items-center gap-3 text-muted-foreground/60">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-xs font-medium">Đang tải cấu hình Chart Demo...</span>
      </div>
    );
  }

  return (
    <>
      <div className="ml-16 mt-2 pl-4 border-l-2 border-primary/20">
        {!chartDemo ? (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary/60">
              <BarChart3 size={16} />
              <span className="text-xs font-medium">Đồ thị minh họa (Demochart) chưa được thiết lập</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenCreate}
              className="h-8 px-3 text-[10px] font-black uppercase tracking-wider text-primary border-primary/20 hover:bg-primary hover:text-white"
            >
              <Plus size={14} className="mr-1" /> Tạo Chart Demo
            </Button>
          </div>
        ) : (
          <div className="bg-background border border-border/40 rounded-lg p-4 shadow-sm hover:border-primary/20 transition-all">
            <div className="flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
              <BarChart3 size={16} className="text-primary" />
              <h4 className="text-xs font-black uppercase text-primary tracking-widest">Dữ liệu Chart Demo</h4>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  {chartDemo.candles?.length || 0} Nến
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenEdit}
                  className="h-6 px-2 text-[10px] font-bold text-amber-500 hover:bg-amber-500/10 gap-1 rounded-md"
                >
                  <Pencil size={12} /> Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="h-6 px-2 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 gap-1 rounded-md"
                >
                  <Trash2 size={12} /> Xóa
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsDetailsOpen(true)}
                  className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary/10 gap-1 rounded-md"
                >
                  <Eye size={12} /> Xem chi tiết
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-2xl border bg-card p-4 rounded-xl shadow-sm border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 font-bold">
                  <Calendar size={12} /> Bắt đầu mốc Chart
                </span>
                <p className="text-sm font-semibold">{chartDemo.ts ? new Date(chartDemo.ts).toLocaleDateString('vi-VN') : '--'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-500 uppercase flex items-center gap-1 font-bold">
                  <Clock size={12} /> Bắt đầu GD
                </span>
                <p className="text-sm font-semibold text-emerald-500">{chartDemo.startTradeTs ? new Date(chartDemo.startTradeTs).toLocaleDateString('vi-VN') : '--'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-rose-500 uppercase flex items-center gap-1 font-bold">
                  <Activity size={12} /> Thời điểm nến
                </span>
                <p className="text-sm font-semibold text-rose-500">{chartDemo.closeTs ? new Date(chartDemo.closeTs).toLocaleDateString('vi-VN') : '--'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-amber-600 uppercase flex items-center gap-1 font-bold">
                  <Clock size={12} /> Kết thúc mốc
                </span>
                <p className="text-sm font-semibold text-amber-600">{chartDemo.limitTs ? new Date(chartDemo.limitTs).toLocaleDateString('vi-VN') : '--'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-blue-600 uppercase flex items-center gap-1 font-bold">
                  <BarChart3 size={12} /> Số dư được cấp
                </span>
                <p className="text-sm font-black text-blue-600">${chartDemo.provideMoney?.toLocaleString() || 0}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-purple-600 uppercase flex items-center gap-1 font-bold">
                  <Activity size={12} /> Mục tiêu đạt
                </span>
                <p className="text-sm font-bold text-foreground">{chartDemo.objectDone ? `$${chartDemo.objectDone.toLocaleString()}` : '--'}</p>
              </div>
            </div>
            {chartDemo.description && (
              <div className="mt-4 text-xs text-muted-foreground bg-muted/40 p-3 rounded-md italic border-l-2 border-primary/50">
                {chartDemo.description}
              </div>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={(val) => {
          setIsModalOpen(val);
          if (!val) { setCurrentStep(1); setIsEditMode(false); }
      }}>
        <AlertDialogContent className="max-w-3xl p-0 gap-0 border border-border/50 shadow-2xl bg-background overflow-hidden flex flex-col rounded-2xl">
          <AlertDialogHeader className="hidden sr-only">
            <AlertDialogTitle>Tạo Chart Demo</AlertDialogTitle>
            <AlertDialogDescription>Tạo phân đoạn đồ thị nến demo mới cho bài học</AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card shrink-0">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-inner">
                    <BarChart3 size={24} />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest border border-primary/20 flex items-center">
                            {isEditMode ? 'CHỈNH SỬA' : 'THÊM MỚI'}
                        </span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground tracking-tight italic">
                        {isEditMode ? 'Cập nhật Chart Demo' : 'Tạo đoạn Chart Demo'}
                    </h2>
                </div>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg outline-none">
                <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6 bg-muted/5 relative min-h-[350px] max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><BarChart3 size={120} /></div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-8 relative z-10 w-full px-4">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${currentStep === step ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : currentStep > step ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {step}
                  </div>
                </div>
              ))}
              <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-border/50 -z-10">
                <div className="h-full bg-primary/40 transition-all duration-500" style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6 relative z-10"
              >
                {currentStep > 1 && currentStep < 5 && (
                  <div className="mb-2 p-4 bg-card border border-border/60 rounded-xl shadow-xs text-xs space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><Activity size={80} /></div>
                    <div className="font-black uppercase tracking-widest text-[9px] text-primary/50 mb-3 border-b border-border/40 pb-2">Thông tin đã cung cấp</div>
                    {formData.ts && <div className="text-muted-foreground"><span className="inline-block w-36 uppercase font-black text-[9px] tracking-widest">Bắt đầu Chart:</span><span className="font-semibold text-foreground">{new Date(formData.ts).toLocaleString('vi-VN')}</span></div>}
                    {formData.limitTs && <div className="text-muted-foreground"><span className="inline-block w-36 uppercase font-black text-[9px] tracking-widest text-amber-500">Kết thúc (Limit):</span><span className="font-semibold text-foreground">{new Date(formData.limitTs).toLocaleString('vi-VN')}</span></div>}
                    {currentStep > 2 && formData.closeTs && <div className="text-muted-foreground"><span className="inline-block w-36 uppercase font-black text-[9px] tracking-widest text-rose-500">Nến hiện tại:</span><span className="font-semibold text-foreground">{new Date(formData.closeTs).toLocaleString('vi-VN')}</span></div>}
                    {currentStep > 3 && formData.startTradeTs && <div className="text-muted-foreground"><span className="inline-block w-36 uppercase font-black text-[9px] tracking-widest text-emerald-500">Bắt đầu GD:</span><span className="font-semibold text-foreground">{new Date(formData.startTradeTs).toLocaleString('vi-VN')}</span></div>}
                  </div>
                )}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1">Ngày bắt đầu mốc Chart (ts)</Label>
                      <Input
                        type="date"
                        value={formData.ts}
                        onChange={(e) => setFormData({ ...formData, ts: e.target.value })}
                        className="h-12 text-sm font-bold bg-background border-border/60 focus:border-primary/40 rounded-xl px-4 shadow-sm"
                      />
                      <p className="text-[10px] text-muted-foreground bg-primary/5 p-2 rounded-md font-medium border border-primary/10">Ngày xa nhất trong quá khứ mà đồ thị bắt đầu tải dữ liệu nến.</p>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">Ngày kết thúc (limitTs)</Label>
                      <Input
                        type="date"
                        value={formData.limitTs}
                        onChange={(e) => setFormData({ ...formData, limitTs: e.target.value })}
                        className="h-12 text-sm font-bold bg-background border-amber-500/20 text-amber-600 focus:border-amber-500/40 rounded-xl px-4 shadow-sm"
                      />
                      <p className="text-[10px] text-muted-foreground bg-amber-500/5 p-2 rounded-md font-medium border border-amber-500/10">Ngày nến tương lai cuối cùng tối đa mà người dùng có thể thực hiện chạy thử.</p>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1">Ngày nến hiện tại (closeTs)</Label>
                    <Input
                      type="date"
                      value={formData.closeTs}
                      onChange={(e) => setFormData({ ...formData, closeTs: e.target.value })}
                      className="h-12 text-sm font-bold bg-background border-rose-500/20 text-rose-600 focus:border-rose-500/40 rounded-xl px-4 shadow-sm"
                    />
                    <p className="text-[10px] text-muted-foreground bg-rose-500/5 p-2 rounded-md font-medium border border-rose-500/10">Vị trí ngày nến kết thúc (close) mà đồ thị dừng lại trước khi sinh viên bắt đầu. Phải nằm ở giữa "Bắt đầu mốc" và "Giới hạn kết thúc".</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">Ngày bắt đầu giao dịch (startTradeTs)</Label>
                    <Input
                      type="date"
                      value={formData.startTradeTs}
                      onChange={(e) => setFormData({ ...formData, startTradeTs: e.target.value })}
                      className="h-12 text-sm font-bold bg-background border-emerald-500/20 text-emerald-600 focus:border-emerald-500/40 rounded-xl px-4 shadow-sm"
                    />
                    <p className="text-[10px] text-muted-foreground bg-emerald-500/5 p-2 rounded-md font-medium border border-emerald-500/10">Ngày cho phép đánh dấu giao dịch bắt đầu. Phải nằm giữa "Ngày bắt đầu mốc" và "Ngày hiện tại".</p>
                  </div>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1">Số dư khởi tạo ($)</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50"><DollarSign size={20} /></div>
                        <Input
                          type="number"
                          value={formData.provideMoney}
                          onChange={(e) => setFormData({ ...formData, provideMoney: Number(e.target.value) })}
                          className="h-16 pl-12 pr-32 text-2xl font-black bg-background border-2 border-blue-500/20 text-blue-600 focus:border-blue-500/50 rounded-2xl shadow-[0_8px_30px_rgb(59,130,246,0.12)] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button onClick={() => setFormData({ ...formData, provideMoney: Math.max(0, formData.provideMoney - 1000) })} className="h-12 w-12 flex items-center justify-center bg-blue-500/10 rounded-xl hover:bg-blue-500 hover:text-white text-blue-600 font-bold transition-all group"><Minus size={20} className="group-active:scale-75 transition-transform" /></button>
                            <button onClick={() => setFormData({ ...formData, provideMoney: formData.provideMoney + 1000 })} className="h-12 w-12 flex items-center justify-center bg-blue-500/10 rounded-xl hover:bg-blue-500 hover:text-white text-blue-600 font-bold transition-all group"><Plus size={20} className="group-active:scale-75 transition-transform" /></button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mt-6">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-1">Mục tiêu lợi nhuận đạt ($)</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50"><Target size={20} /></div>
                        <Input
                          type="number"
                          value={formData.objectDone}
                          onChange={(e) => setFormData({ ...formData, objectDone: Number(e.target.value) })}
                          className="h-16 pl-12 pr-32 text-2xl font-black bg-background border-2 border-purple-500/20 text-purple-600 focus:border-purple-500/50 rounded-2xl shadow-[0_8px_30px_rgb(168,85,247,0.12)] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button onClick={() => setFormData({ ...formData, objectDone: Math.max(0, formData.objectDone - 50) })} className="h-12 w-12 flex items-center justify-center bg-purple-500/10 rounded-xl hover:bg-purple-500 hover:text-white text-purple-600 font-bold transition-all group"><Minus size={20} className="group-active:scale-75 transition-transform" /></button>
                            <button onClick={() => setFormData({ ...formData, objectDone: formData.objectDone + 50 })} className="h-12 w-12 flex items-center justify-center bg-purple-500/10 rounded-xl hover:bg-purple-500 hover:text-white text-purple-600 font-bold transition-all group"><Plus size={20} className="group-active:scale-75 transition-transform" /></button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mt-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">Mô tả hiển thị</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ví dụ: Demo biểu đồ BTC/USDT khung 15m..."
                        className="h-12 text-sm font-medium bg-background border-border/60 focus:border-primary/40 rounded-xl px-4 shadow-sm"
                      />
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/20 shadow-inner">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-xl font-black text-foreground">Tổng kết thiết lập</h3>
                        <p className="text-sm text-muted-foreground font-medium">Vui lòng kiểm tra lại tất cả các mốc thời gian thiết lập trước khi tạo.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-border/40 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Calendar size={14}/> Thời gian bắt đầu đồ thị</span>
                        <span className="text-sm font-bold">{new Date(formData.ts).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/40 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2"><Clock size={14}/> Thời điểm bắt đầu Trading</span>
                        <span className="text-sm font-bold">{new Date(formData.startTradeTs).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/40 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2"><Activity size={14}/> Điểm nến hiện tại</span>
                        <span className="text-sm font-bold">{new Date(formData.closeTs).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/40 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><Clock size={14}/> Giới hạn thời gian kết thúc</span>
                        <span className="text-sm font-bold">{new Date(formData.limitTs).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/40 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2"><BarChart3 size={14}/> Số dư khởi tạo</span>
                        <span className="text-sm font-black text-blue-600">${formData.provideMoney.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="text-[11px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-2"><Target size={14}/> Mục tiêu đạt</span>
                        <span className="text-sm font-black text-purple-600">${formData.objectDone.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center italic bg-muted/30 p-3 rounded-lg border-l-4 border-l-primary/40 shadow-inner">
                        "{formData.description}"
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <div className="flex-1 text-[11px] font-bold text-rose-500">
                {validationError}
            </div>
            <div className="flex items-center gap-3">
              {currentStep === 1 ? (
                <AlertDialogCancel onClick={() => setIsModalOpen(false)} className="h-10 px-6 font-bold text-[11px] uppercase tracking-widest rounded-xl border-border hover:bg-muted m-0">Hủy</AlertDialogCancel>
              ) : (
                <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} className="h-10 px-6 font-bold text-[11px] uppercase tracking-widest rounded-xl border-border hover:bg-muted">Quay lại</Button>
              )}
              
              {currentStep < 5 ? (
                <Button 
                  onClick={() => setCurrentStep(prev => prev + 1)} 
                  disabled={!isStepValid}
                  className="h-10 px-8 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20"
                >
                  Trang sau
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    const tsPayload = {
                      ...formData,
                      ts: new Date(formData.ts).getTime(),
                      startTradeTs: new Date(formData.startTradeTs).getTime(),
                      closeTs: new Date(formData.closeTs).getTime(),
                      limitTs: new Date(formData.limitTs).getTime(),
                    };
                    const done = () => {
                      setIsModalOpen(false);
                      setCurrentStep(1);
                      setIsEditMode(false);
                    };
                    if (isEditMode) {
                      updateChartDemo(tsPayload).then(done);
                    } else {
                      createChartDemo(tsPayload).then(done);
                    }
                  }} 
                  disabled={isCreating || isUpdating || !isStepValid}
                  className="h-10 px-8 rounded-xl font-black uppercase text-[11px] tracking-widest bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                >
                  {(isCreating || isUpdating) ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                  {isEditMode ? 'Lưu thay đổi' : 'Hoàn thành'}
                </Button>
              )}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {isDetailsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[96vw] h-[90vh] bg-background rounded-lg border border-border shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-card shrink-0">
                <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <BarChart3 size={28} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-primary/20 h-6 flex items-center">
                                CHI TIẾT ĐỒ THỊ DEMO
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground tracking-tight italic">
                            Xem lại lịch sử nến
                        </h2>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => setIsDetailsOpen(false)} className="h-10 px-8 font-bold text-[11px] uppercase tracking-widest rounded-sm bg-muted/20 hover:bg-muted/50 border border-border">Đóng cửa sổ</Button>
              </div>
              
              {/* Main Content */}
              <div className="p-6 overflow-hidden flex-1 bg-muted/5 flex flex-col lg:flex-row gap-6">
                
                {/* Info Sidebar (Vertical) */}
                {chartDemo && (
                  <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-1 border-l-4 border-l-primary/60">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Ngày bắt đầu mốc Chart</p>
                      <p className="text-sm font-bold text-foreground">
                        {chartDemo.ts ? new Date(chartDemo.ts).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'}
                      </p>
                    </div>

                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-1 border-l-4 border-l-emerald-500/60">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Ngày bắt đầu giao dịch</p>
                      <p className="text-sm font-bold text-emerald-500">
                        {chartDemo.startTradeTs ? new Date(chartDemo.startTradeTs).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'}
                      </p>
                    </div>

                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-1 border-l-4 border-l-rose-500/60">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Thời điểm nến hiện tại (Đang xét)</p>
                      <p className="text-sm font-bold text-rose-500">
                        {chartDemo.closeTs ? new Date(chartDemo.closeTs).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'}
                      </p>
                    </div>

                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-1 border-l-4 border-l-amber-500/60">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Ngày kết thúc mốc Chart</p>
                      <p className="text-sm font-bold text-amber-600">
                        {chartDemo.limitTs ? new Date(chartDemo.limitTs).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'}
                      </p>
                    </div>

                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-1 border-l-4 border-l-blue-500/60 mt-2">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Số dư được cấp</p>
                      <p className="text-xl font-black text-blue-600">
                        ${chartDemo.provideMoney?.toLocaleString() || 0}
                      </p>
                    </div>

                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-1 border-l-4 border-l-purple-500/60">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Mục tiêu sinh viên cần đạt</p>
                      <p className="text-sm font-black text-foreground">
                        {chartDemo.objectDone ? `$${chartDemo.objectDone.toLocaleString()}` : 'Không xác định'}
                      </p>
                    </div>

                    <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm space-y-2 flex-1 min-h-[140px]">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60 flex items-center gap-2">
                        <FileText size={12} /> Mô tả dữ liệu cần Demo
                      </p>
                      <div className="text-xs font-medium text-foreground/80 leading-relaxed bg-muted/40 p-3 rounded-md italic">
                        {chartDemo.description || 'Chưa thiết lập mô tả cho bài học này.'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col overflow-hidden">
                  {!chartDemo?.candles || chartDemo.candles.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground/60 font-medium text-sm border-2 border-dashed border-border/40 rounded-xl bg-muted/10 h-full flex flex-col items-center justify-center">
                      Chưa có dữ liệu nến nào được ghi nhận.
                    </div>
                  ) : (
                    <div className="border border-border/40 rounded-xl overflow-hidden bg-background flex-1 relative shadow-inner">
                      <DemoChart candles={chartDemo.candles} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="max-w-md p-0 gap-0 border border-border/50 shadow-2xl bg-background overflow-hidden rounded-2xl">
          <AlertDialogHeader className="hidden sr-only">
            <AlertDialogTitle>Xác nhận xóa Chart Demo</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-6 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
              <Trash2 size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Xóa Chart Demo?</h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Toàn bộ dữ liệu nến và cấu hình của Chart Demo này sẽ bị <span className="text-rose-500 font-bold">xóa vĩnh viễn</span> và không thể khôi phục.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            <AlertDialogCancel
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
              className="h-10 px-6 font-bold text-[11px] uppercase tracking-widest rounded-xl border-border hover:bg-muted m-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </AlertDialogCancel>
            <Button
              onClick={() => {
                deleteChartDemo().then(() => setIsDeleteConfirmOpen(false));
              }}
              disabled={isDeleting}
              className="h-10 px-8 rounded-xl font-black uppercase text-[11px] tracking-widest bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Xác nhận xóa</span>
                </>
              )}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
