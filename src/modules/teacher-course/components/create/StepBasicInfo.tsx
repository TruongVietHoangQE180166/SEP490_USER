import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Image as ImageIcon, Video, Info, Sparkles, DollarSign, Tag, Layers } from 'lucide-react';
import { COURSE_LEVELS, BasicInfo, COURSE_ASSETS } from './types';
import { cn } from '@/lib/utils';

interface StepBasicInfoProps {
  basicInfo: BasicInfo;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfo>>;
}

const CardSection = ({ title, icon: Icon, children, description }: { title: string, icon: any, children: React.ReactNode, description?: string }) => (
  <section className="group bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-border/80">
    <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-muted/5 group-hover:bg-muted/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-bold text-base tracking-tight">{title}</h3>
          {description && <p className="text-[11px] text-muted-foreground font-medium">{description}</p>}
        </div>
      </div>
      <Sparkles size={14} className="text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
    </div>
    <div className="p-8 space-y-6">
      {children}
    </div>
  </section>
);

export const StepBasicInfo = ({ basicInfo, setBasicInfo }: StepBasicInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Basic Info Section */}
      <CardSection 
        title="Thông tin tổng quan" 
        icon={Info} 
        description="Bắt đầu với những thông tin cơ bản nhất để thu hút học viên"
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80">
            Tiêu đề khoá học <span className="text-rose-500">*</span>
          </Label>
          <Input 
            id="title" 
            placeholder="VD: Mastery Crypto: Nền tảng cho người mới bắt đầu" 
            className="rounded-lg bg-background/50 h-12 text-base font-medium border-border/60 focus:ring-primary/20 transition-all"
            value={basicInfo.title}
            onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="desc" className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80">
            Mô tả chi tiết
          </Label>
          <Textarea 
            id="desc" 
            placeholder="Chia sẻ nội dung, lợi ích và lộ trình học tập..." 
            className="rounded-lg bg-background/50 min-h-[160px] resize-y text-base border-border/60"
            value={basicInfo.description}
            onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
          />
        </div>
      </CardSection>

      {/* Level Section */}
      <CardSection 
        title="Phân loại cấp độ" 
        icon={Layers} 
        description="Giúp học viên xác định độ khó phù hợp với bản thân"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {COURSE_LEVELS.map((level) => {
            const isSelected = basicInfo.level === level.value;
            
            // Extract core color name from colorClass (e.g., 'emerald' from 'bg-emerald-500/10')
            const colorName = level.colorClass.split('-')[1];

            return (
              <button
                key={level.value}
                onClick={() => setBasicInfo({ ...basicInfo, level: level.value })}
                className={cn(
                  "relative group/btn flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-300 min-h-[80px]",
                  isSelected 
                    ? cn("bg-background shadow-lg scale-100", 
                        colorName === 'emerald' && "border-emerald-500 ring-2 ring-emerald-500/10",
                        colorName === 'blue' && "border-blue-500 ring-2 ring-blue-500/10",
                        colorName === 'amber' && "border-amber-500 ring-2 ring-amber-500/10",
                        colorName === 'orange' && "border-orange-500 ring-2 ring-orange-500/10",
                        colorName === 'rose' && "border-rose-500 ring-2 ring-rose-500/10"
                      )
                    : "border-border/30 bg-muted/5 hover:border-border/60 hover:bg-muted/10 scale-[0.98] hover:scale-100",
                )}
              >
                <span className={cn(
                  "text-xs font-black uppercase tracking-[0.15em] transition-all",
                  isSelected ? "opacity-100 scale-110" : "text-muted-foreground opacity-60 group-hover/btn:opacity-100"
                )}>
                  {level.label}
                </span>

                {/* Sub-label based on level */}
                <span className={cn(
                  "text-[9px] font-bold uppercase mt-1 transition-opacity",
                  isSelected ? "opacity-40" : "opacity-0"
                )}>
                  {level.value.replace('_', ' ')}
                </span>
                
                {/* Visual Accent Bar */}
                <div className={cn(
                   "absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-t-full transition-all duration-300",
                   isSelected ? "w-1/2" : "w-0",
                   colorName === 'emerald' && "bg-emerald-500",
                   colorName === 'blue' && "bg-blue-500",
                   colorName === 'amber' && "bg-amber-500",
                   colorName === 'orange' && "bg-orange-500",
                   colorName === 'rose' && "bg-rose-500"
                )} />
              </button>
            );
          })}
        </div>
      </CardSection>

      {/* Assets Section */}
      <CardSection 
        title="Lĩnh vực chuyên môn" 
        icon={Sparkles} 
        description="Chọn tối đa 3 thẻ liên quan trực tiếp đến nội dung giảng dạy"
      >
        <div className="flex flex-wrap gap-2.5">
          {COURSE_ASSETS.map((asset) => {
            const isSelected = basicInfo.assets?.includes(asset);
            const isMax = (basicInfo.assets?.length || 0) >= 3 && !isSelected;

            return (
              <button
                key={asset}
                type="button"
                disabled={isMax}
                onClick={() => {
                  if (isSelected) {
                    setBasicInfo({ ...basicInfo, assets: basicInfo.assets.filter(a => a !== asset) });
                  } else {
                    setBasicInfo({ ...basicInfo, assets: [...(basicInfo.assets || []), asset] });
                  }
                }}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border-2 uppercase",
                  isSelected 
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : isMax 
                      ? "bg-muted/5 border-border/10 text-muted-foreground/20 cursor-not-allowed"
                      : "bg-background border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
                )}
              >
                {asset}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={cn(
                    "w-6 h-1.5 rounded-full transition-all duration-500",
                    (basicInfo.assets?.length || 0) >= s ? "bg-primary" : "bg-muted"
                  )} 
                />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-tighter">
              Đã chọn: {(basicInfo.assets?.length || 0)} / 3
            </span>
          </div>
          {(basicInfo.assets?.length || 0) === 3 && (
            <motion.p 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold text-amber-500 uppercase italic flex items-center gap-1"
            >
              <Info size={12} /> Đã đạt giới hạn tối đa
            </motion.p>
          )}
        </div>
      </CardSection>

      {/* Pricing Section */}
      <CardSection 
        title="Quản lý chi phí" 
        icon={DollarSign} 
        description="Cấu hình giá bán và các chương trình ưu đãi học phí"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Main Price Card */}
          <div className={cn(
            "relative p-8 rounded-2xl border-2 transition-all duration-500 flex flex-col justify-between",
            basicInfo.isFree 
              ? "bg-muted/10 border-border/20 opacity-40 grayscale" 
              : "bg-background border-primary/20 shadow-lg shadow-primary/[0.03]"
          )}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSign size={16} />
                  </div>
                  <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Giá niêm yết</Label>
                </div>
                {!basicInfo.isFree && <Sparkles size={14} className="text-primary/40 animate-pulse" />}
              </div>

              <div className="relative group">
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="rounded-xl bg-muted/5 h-16 px-6 text-2xl font-black border-2 border-border/40 focus:border-border/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all shadow-none placeholder:text-muted-foreground/20 pr-16"
                  value={basicInfo.price}
                  onChange={(e) => setBasicInfo({ ...basicInfo, price: e.target.value })}
                  disabled={basicInfo.isFree}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/60 tracking-wider">VND</div>
              </div>

              {/* Discount Box */}
              <div className={cn(
                "p-5 rounded-xl border-2 transition-all",
                basicInfo.hasDiscount && !basicInfo.isFree ? "bg-primary/[0.03] border-primary/20 shadow-inner" : "bg-muted/5 border-border/30"
              )}>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center h-6 w-11 shrink-0">
                    <input 
                      type="checkbox"
                      id="discount" 
                      checked={basicInfo.hasDiscount && !basicInfo.isFree}
                      onChange={(e) => setBasicInfo({ ...basicInfo, hasDiscount: e.target.checked })}
                      disabled={basicInfo.isFree}
                      className="peer sr-only"
                    />
                    <label htmlFor="discount" className="absolute inset-0 bg-muted border-2 border-border/60 rounded-full cursor-pointer transition-all peer-checked:bg-primary peer-checked:border-primary/80 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:after:translate-x-5" />
                  </div>
                  <Label htmlFor="discount" className="text-sm font-black uppercase tracking-tight cursor-pointer text-muted-foreground peer-checked:text-primary transition-colors">
                    Giảm giá đặc biệt
                  </Label>
                </div>

                <AnimatePresence>
                  {basicInfo.hasDiscount && !basicInfo.isFree && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 20 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden space-y-4"
                    >
                        {/* Scrollable grid for 5, 10, ..., 100% */}
                        <div className="flex flex-wrap gap-1.5 p-1 bg-muted/5 rounded-xl border border-border/20 max-h-[160px] overflow-y-auto custom-scrollbar">
                          {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(val => {
                            const isChosen = basicInfo.discountPercent === val.toString();
                            return (
                              <button 
                                key={val}
                                type="button"
                                onClick={() => setBasicInfo({ ...basicInfo, discountPercent: val.toString() })}
                                className={cn(
                                  "flex-1 min-w-[50px] h-10 rounded-lg text-[11px] font-black transition-all border-2",
                                  isChosen 
                                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105 z-10" 
                                    : "bg-background border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary active:scale-95"
                                )}
                              >
                                {val}%
                              </button>
                            );
                          })}
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {basicInfo.isFree && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-20 transition-opacity" />
            )}
          </div>

          {/* Free Checkbox Section */}
          <div className={cn(
            "relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center justify-center",
            basicInfo.isFree 
              ? "bg-emerald-500/[0.03] border-emerald-500 shadow-xl shadow-emerald-500/[0.05] ring-4 ring-emerald-500/5 translate-y-[-4px]" 
              : "bg-background border-border/40 hover:border-emerald-500/20 group"
          )}>
             <div className="absolute top-4 right-4 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
              <Sparkles size={24} />
            </div>

            <div className={cn(
              "w-20 h-20 rounded-[2rem] mb-6 flex items-center justify-center border-2 transition-all",
              basicInfo.isFree ? "bg-emerald-500 border-emerald-400 text-white shadow-lg rotate-0" : "bg-muted/10 border-border/60 text-muted-foreground group-hover:bg-emerald-500/5 group-hover:border-emerald-500 group-hover:text-emerald-500 group-hover:rotate-6"
            )}>
              <Tag size={32} />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="free" className={cn(
                "text-2xl font-black uppercase tracking-tighter cursor-pointer transition-colors",
                basicInfo.isFree ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
              )}>
                Phát hành miễn phí
              </Label>
              
              <div className="relative flex items-center justify-center h-8 w-16">
                 <input 
                  type="checkbox"
                  id="free" 
                  checked={basicInfo.isFree}
                  onChange={(e) => setBasicInfo({ ...basicInfo, isFree: e.target.checked })}
                  className="peer sr-only"
                />
                <label htmlFor="free" className="absolute inset-0 bg-muted/40 border-2 border-border/60 rounded-full cursor-pointer transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-400 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:after:translate-x-8 shadow-inner" />
              </div>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed max-w-[200px] mt-6 px-4">
              Khóa học miễn phí giúp bạn tiếp cận nhiều học viên hơn trong thời gian ngắn.
            </p>
          </div>
        </div>
      </CardSection>

      {/* Visual Assets Section */}
      <CardSection title="Ảnh thu nhỏ" icon={ImageIcon} description="Hiển thị ở trang danh sách khoá học">
        <label className="block border-2 border-dashed border-border/60 hover:border-primary/50 transition-all bg-muted/5 hover:bg-muted/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[240px] gap-4 text-center cursor-pointer group relative overflow-hidden">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const MAX_IMAGE_MB = 5;
              if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
                alert(`Ảnh quá lớn. Vui lòng chọn ảnh dưới ${MAX_IMAGE_MB}MB (hiện tại: ${(file.size / 1024 / 1024).toFixed(1)}MB).`);
                e.target.value = '';
                return;
              }
              setBasicInfo({ ...basicInfo, thumbnail: file });
            }}
          />
          
          {basicInfo.thumbnail || basicInfo.thumbnailUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden group/img">
               <img 
                src={basicInfo.thumbnail ? URL.createObjectURL(basicInfo.thumbnail) : basicInfo.thumbnailUrl} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                alt="Thumbnail preview" 
               />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                    <UploadCloud size={14} /> Thay đổi ảnh
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm">
                <UploadCloud size={32} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-foreground">Tải ảnh bìa của bạn</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">Khuyên dùng tỷ lệ 16:9 • PNG, JPG (Dưới 5MB)</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </label>
      </CardSection>
    </motion.div>
  );
};
