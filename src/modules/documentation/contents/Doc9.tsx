import React from 'react';
import { Timer } from 'lucide-react';

const Doc9 = () => (
  <div className='py-32 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4'>
    <div className='w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/40'>
      <Timer size={32} />
    </div>
    <div className='space-y-2'>
      <h3 className='text-xl font-bold font-black'>Quy chuẩn nội dung</h3>
      <p className='text-muted-foreground font-medium'>Nội dung đang được biên soạn tiêu chuẩn. Vui lòng quay lại sau.</p>
    </div>
  </div>
);

export default Doc9;
