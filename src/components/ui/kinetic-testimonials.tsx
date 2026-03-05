'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  name: string;
  handle: string;
  review: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  cardClassName?: string;
  avatarClassName?: string;
}

interface KineticTestimonialProps {
  testimonials?: Testimonial[];
  className?: string;
  cardClassName?: string;
  avatarClassName?: string;
  desktopColumns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  speed?: number;
  title?: string;
  subtitle?: string;
}

interface TestimonialWithId extends Testimonial {
  uniqueId: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(
  ({ testimonial, index, cardClassName = '', avatarClassName = '' }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const gradients = [
      'from-pink-500 via-purple-500 to-orange-400',
      'from-blue-500 via-teal-500 to-green-400',
      'from-purple-500 via-pink-500 to-red-400',
      'from-indigo-500 via-blue-500 to-cyan-400',
      'from-orange-500 via-red-500 to-pink-400',
      'from-emerald-500 via-blue-500 to-purple-400',
      'from-rose-500 via-fuchsia-500 to-indigo-400',
      'from-amber-500 via-orange-500 to-red-400',
    ];

    const gradientClass = gradients[index % gradients.length];

    return (
      <div
        className='w-full mb-4 shrink-0'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          className={`transition-all duration-300 pointer-events-none relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 ${
            isHovered ? 'text-white shadow-2xl border-transparent scale-105' : ''
          } ${cardClassName}`}
        >
          {isHovered && (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradientClass} z-0 opacity-90`}
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 20%, black 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 20%, black 100%)',
              }}
            />
          )}

          <CardContent className='p-6 md:p-8 relative z-10'>
            <p className='text-sm md:text-base mb-6 leading-relaxed transition-colors duration-300 text-foreground/80 font-medium italic'>
              "{testimonial.review}"
            </p>

            <div className='flex items-center space-x-4'>
              <Avatar className={`w-10 md:w-12 h-10 md:h-12 border-2 border-background shadow-md ${avatarClassName}`}>
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0'>
                <p
                  className={`font-black text-sm md:text-base tracking-tight ${
                    isHovered ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {testimonial.name}
                </p>
                <p
                  className={`text-xs md:text-sm font-medium ${
                    isHovered ? 'text-white/80' : 'text-primary'
                  }`}
                >
                  {testimonial.handle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

TestimonialCard.displayName = 'TestimonialCard';

const KineticTestimonial: React.FC<KineticTestimonialProps> = ({
  testimonials = [],
  className = '',
  cardClassName = '',
  avatarClassName = '',
  desktopColumns = 6,
  tabletColumns = 3,
  mobileColumns = 2,
  speed = 1,
  title = 'What developers are saying',
  subtitle = 'Hear from the developer community about their experience with ScrollX-UI',
}) => {
  const [actualMobileColumns, setActualMobileColumns] = useState(mobileColumns);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setActualMobileColumns(1);
      } else {
        setActualMobileColumns(mobileColumns);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [mobileColumns]);

  const createColumns = useCallback(
    (numColumns: number) => {
      if (!testimonials || testimonials.length === 0) {
        return [];
      }

      const columns: TestimonialWithId[][] = [];
      const testimonialsPerColumn = 10;

      for (let i = 0; i < numColumns; i++) {
        const columnTestimonials: TestimonialWithId[] = [];

        for (let j = 0; j < testimonialsPerColumn; j++) {
          const testimonialIndex = (i * 11 + j * 3) % testimonials.length;
          columnTestimonials.push({
            ...testimonials[testimonialIndex],
            uniqueId: `${i}-${j}-${testimonialIndex}`,
          });
        }

        columns.push([...columnTestimonials, ...columnTestimonials]);
      }

      return columns;
    },
    [testimonials],
  );

  const desktopColumnsData = useMemo(
    () => createColumns(desktopColumns),
    [createColumns, desktopColumns],
  );
  const fiveColumnsData = useMemo(() => createColumns(5), [createColumns]);
  const fourColumnsData = useMemo(() => createColumns(4), [createColumns]);
  const tabletColumnsData = useMemo(
    () => createColumns(tabletColumns),
    [createColumns, tabletColumns],
  );
  const mobileColumnsData = useMemo(
    () => createColumns(actualMobileColumns),
    [createColumns, actualMobileColumns],
  );

  const renderColumn = useCallback(
    (
      columnTestimonials: TestimonialWithId[],
      colIndex: number,
      prefix: string,
      containerHeight: number,
    ) => {
      const moveUp = colIndex % 2 === 0;
      const animationDuration = (40 + colIndex * 3) / speed;

      return (
        <div
          key={`${prefix}-${colIndex}`}
          className='flex-1 overflow-hidden relative testimonial-column'
          style={{ height: `${containerHeight}px` }}
        >
          <div
            className={`flex flex-col ${
              moveUp ? 'animate-scroll-up' : 'animate-scroll-down'
            }`}
            style={{
              animationDuration: `${animationDuration}s`,
            }}
          >
            {columnTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${prefix}-${colIndex}-${testimonial.uniqueId}-${index}`}
                testimonial={testimonial}
                index={colIndex * 3 + index}
                cardClassName={cardClassName}
                avatarClassName={avatarClassName}
              />
            ))}
          </div>
        </div>
      );
    },
    [speed, cardClassName, avatarClassName],
  );

  return (
    <section
      className={`pt-4 md:pt-6 pb-16 md:pb-24 bg-background transition-colors duration-300 ${className}`}
    >
      <div className='relative w-full text-foreground pt-8 md:pt-12 pb-12 flex flex-col items-center overflow-hidden'>
        <div className="mx-auto max-w-4xl text-center px-6 mb-12">
            <h2 className='text-3xl md:text-5xl font-black text-center mb-6 tracking-tighter uppercase'>
                {title.split(' ').map((word, i) => 
                    word.toLowerCase() === 'chúng' || word.toLowerCase() === 'tôi' ? 
                    <span key={i} className="text-primary italic mr-2">{word} </span> : 
                    <span key={i} className="mr-2">{word}</span>
                )}
            </h2>
            <p className='text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto'>
                {subtitle}
            </p>
        </div>

        {testimonials && testimonials.length > 0 && (
          <div className="w-full px-0">
            <div className='hidden xl:flex gap-4 w-full overflow-hidden relative'>
              <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none' />
              <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none' />

              {desktopColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, 'desktop', 800),
              )}
            </div>

            <div className='hidden lg:flex xl:hidden gap-4 w-full overflow-hidden relative'>
              <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none' />
              <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none' />

              {createColumns(Math.max(desktopColumns - 1, 3)).map(
                (columnTestimonials, colIndex) =>
                  renderColumn(columnTestimonials, colIndex, 'five', 800),
              )}
            </div>

            <div className='hidden md:flex lg:hidden gap-4 w-full overflow-hidden relative'>
              <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none' />
              <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none' />

              {createColumns(Math.max(desktopColumns - 2, 2)).map(
                (columnTestimonials, colIndex) =>
                  renderColumn(columnTestimonials, colIndex, 'four', 800),
              )}
            </div>

            <div className='hidden sm:flex md:hidden gap-4 w-full overflow-hidden relative'>
              <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none' />
              <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none' />

              {tabletColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, 'tablet', 800),
              )}
            </div>

            <div className='sm:hidden flex gap-3 w-full overflow-hidden relative px-4'>
              <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none' />
              <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none' />

              {mobileColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, 'mobile', 600),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KineticTestimonial;
