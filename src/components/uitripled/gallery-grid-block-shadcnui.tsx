"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid, X, ZoomIn } from "lucide-react";
import { KeyboardEvent, useState } from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    title: "Trụ sở hiện đại",
    category: "Kiến trúc",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    title: "Không gian học tập",
    category: "Môi trường",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    title: "Phòng nghiên cứu",
    category: "Công nghệ",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800",
    title: "Tư duy sáng tạo",
    category: "Nghệ thuật",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    title: "Giải pháp số",
    category: "Công nghệ",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    title: "Hợp tác chiến lược",
    category: "Con người",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    title: "Phân tích dữ liệu",
    category: "Công nghệ",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    title: "Đội ngũ chuyên gia",
    category: "Con người",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    title: "Khát vọng vươn xa",
    category: "Nghệ thuật",
  },
];

export function GalleryGridBlock() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("Tất cả");

  const categories = [
    "Tất cả",
    ...new Set(galleryImages.map((img) => img.category)),
  ];

  const filteredImages =
    filter === "Tất cả"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex(
        (img) => img.id === selectedImage
      );
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex(
        (img) => img.id === selectedImage
      );
      const prevIndex =
        (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].id);
    }
  };

  const selectedImageData = galleryImages.find(
    (img) => img.id === selectedImage
  );

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    imageId: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedImage(imageId);
    }
  };

  return (
    <section
      className="w-full bg-transparent py-20 md:py-32"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-[1850px] px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
          role="region"
          aria-labelledby="gallery-heading"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-montserrat font-bold uppercase tracking-widest text-[10px]" variant="secondary">
            <Grid className="mr-2 h-3.5 w-3.5" />
            Thư viện hình ảnh
          </Badge>
          <h2
            id="gallery-heading"
            className="mb-6 text-4xl font-black tracking-tight md:text-5xl font-cinzel text-foreground"
          >
            Hệ Sinh Thái <span className="text-primary">Kỹ Thuật Số</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground font-montserrat leading-relaxed">
            Khám phá thế giới công nghệ blockchain và tài chính phi tập trung thông qua những hình ảnh trực quan sinh động.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Gallery categories"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Gallery items"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                role="listitem"
              >
                <Card
                  className="group relative cursor-pointer overflow-hidden border-border transition-all hover:border-ring hover:shadow-xl p-0 gap-0"
                  onClick={() => setSelectedImage(image.id)}
                  onKeyDown={(event) => handleCardKeyDown(event, image.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${image.title}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <motion.img
                      src={image.url}
                      alt={image.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                    />

                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                      aria-hidden="true"
                    >
                      <ZoomIn className="mb-2 h-8 w-8 text-[var(--muted-foreground)]" />
                      <h3 className="mb-1 text-center text-lg font-semibold text-[var(--muted-foreground)]">
                        {image.title}
                      </h3>
                      <Badge variant="secondary">{image.category}</Badge>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && selectedImageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-dialog-title"
              aria-describedby="gallery-dialog-description"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] max-w-5xl"
              >
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -right-12 top-0 text-[var(--muted-foreground)] hover:bg-white/10"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close gallery dialog"
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Navigation Buttons */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="View previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="View next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>

                {/* Image */}
                <motion.img
                  key={selectedImage}
                  src={selectedImageData.url}
                  alt={selectedImageData.title}
                  className="max-h-[80vh] w-auto rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Image Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 text-center text-[var(--muted-foreground)]"
                  id="gallery-dialog-description"
                >
                  <h3
                    className="mb-2 text-xl font-semibold"
                    id="gallery-dialog-title"
                  >
                    {selectedImageData.title}
                  </h3>
                  <Badge variant="secondary">
                    {selectedImageData.category}
                  </Badge>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
