import { DocumentationModule } from '@/modules/documentation/components/DocumentationModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài liệu hướng dẫn | VIC Teach',
  description: 'Hướng dẫn sử dụng hệ thống VIC Teach, từ giao dịch cơ bản đến các tính năng nâng cao.',
};

export default function DocumentationPage() {
  return (
    <div className="pt-0 min-h-screen bg-background">
      <DocumentationModule />
    </div>
  );
}
