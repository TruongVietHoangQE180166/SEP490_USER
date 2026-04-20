"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Làm thế nào để bắt đầu khóa học trên VIC Teach?",
    answer:
      "Rất đơn giản! Bạn chỉ cần đăng ký tài khoản, chọn khóa học mình quan tâm, nhấn 'Bắt đầu học ngay' đối với các khóa học miễn phí hoặc hoàn tất thanh toán cho các khóa học có phí để truy cập ngay lập tức.",
  },
  {
    question: "Tôi có được cấp chứng chỉ sau khi hoàn thành khóa học không?",
    answer:
      "Có! Sau khi bạn hoàn thành toàn bộ các bài học, xem đủ thời lượng video và vượt qua các bài kiểm tra (Quiz) với số điểm yêu cầu, hệ thống sẽ tự động cấp chứng chỉ điện tử mang tên bạn.",
  },
  {
    question: "Làm sao để thanh toán khóa học?",
    answer:
      "VIC Teach hỗ trợ nhiều hình thức thanh toán linh hoạt như: Chuyển khoản ngân hàng trực tiếp qua QR Code, thanh toán qua ví điện tử VNPay/Momo hoặc thẻ tín dụng quốc tế. Quá trình xử lý hoàn toàn tự động.",
  },
  {
    question: "Tôi có thể học trên điện thoại được không?",
    answer:
      "Hoàn toàn được. Website của VIC Teach được tối ưu hóa hiển thị trên mọi thiết bị (máy tính, máy tính bảng, điện thoại). Bạn chỉ cần kết nối internet là có thể học mọi lúc, mọi nơi.",
  },
  {
    question: "Lộ trình học tập tại VIC Teach có gì đặc biệt?",
    answer:
      "Chúng tôi xây dựng lộ trình học tập bài bản từ cơ bản đến nâng cao. Mỗi khóa học đều đi kèm với tài liệu hướng dẫn, mã nguồn mẫu và cộng đồng học viên để bạn trao đổi, giải đáp thắc mắc.",
  },
  {
    question: "Tôi có được hỗ trợ trong quá trình học không?",
    answer:
      "Tất nhiên rồi! Bạn có thể đặt câu hỏi ngay dưới mỗi bài học hoặc tham gia vào cộng đồng học viên trên Discord/Zalo của VIC Teach để được đội ngũ giảng viên và trợ giảng hỗ trợ 24/7.",
  },
];

export function FAQAccordionBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/10 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="secondary">
            <HelpCircle className="mr-1 h-3 w-3" />
            Hỏi đáp - FAQ
          </Badge>
          <h2 className="mb-4 text-3xl font-black tracking-tighter md:text-5xl uppercase italic">
            Câu Hỏi <span className="text-primary">Thường Gặp</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg font-medium">
            Bạn có thắc mắc? Chúng tôi có câu trả lời. Nếu không tìm thấy thông tin mình cần, đừng ngần ngại liên hệ với chúng tôi.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-5xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-md">
                  <motion.button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 text-left md:p-6 transition-colors hover:bg-primary/5"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span className="pr-4 text-base font-semibold md:text-lg">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/50 p-4 md:p-6">
                          <motion.p
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            className="text-sm text-muted-foreground md:text-base font-medium"
                          >
                            {faq.answer}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center md:mt-16 mx-auto max-w-5xl"
        >
          <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <MessageCircle className="mx-auto mb-4 h-14 w-14 text-primary" />
            <h3 className="mb-3 text-2xl font-black md:text-3xl tracking-tight uppercase">
              Vẫn chưa giải tỏa <span className="text-primary italic">thắc mắc?</span>
            </h3>
            <p className="mb-8 text-base text-muted-foreground md:text-lg max-w-xl mx-auto font-medium">
              Đội ngũ hỗ trợ của VIC Teach luôn sẵn sàng lắng nghe và giải đáp mọi vấn đề của bạn trong thời gian sớm nhất.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-14 px-8 font-black rounded-xl">
                Liên hệ ngay
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 font-bold rounded-xl border-border/50">
                Gửi Email hỗ trợ
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
