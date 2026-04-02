'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  useAnimation,
  PanInfo,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { cn } from '@/lib/utils';

interface BottomSheetContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contentProps: {
    height: string;
    className: string;
    closeThreshold: number;
  };
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error(
      'BottomSheet compound components must be used within BottomSheet',
    );
  }
  return context;
};

interface BottomSheetRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

const BottomSheetRoot = ({
  children,
  open,
  onOpenChange,
  defaultOpen,
  className,
}: BottomSheetRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      }
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange, isControlled],
  );

  const contentProps = {
    height: '55vh',
    className: className || '',
    closeThreshold: 0.3,
  };

  return (
    <BottomSheetContext.Provider
      value={{ isOpen, onOpenChange: handleOpenChange, contentProps }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

interface BottomSheetPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
  className?: string;
}

const BottomSheetPortal = ({
  children,
  container,
  className,
}: BottomSheetPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const portalContent = className ? (
    <div className={className}>{children}</div>
  ) : (
    children
  );

  return createPortal(portalContent, container || document.body);
};

interface BottomSheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const BottomSheetOverlay = forwardRef<HTMLDivElement, BottomSheetOverlayProps>(
  ({ className, onClick, ...props }, ref) => {
    const { isOpen, onOpenChange } = useBottomSheetContext();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
        onClick?.(e);
      },
      [onOpenChange, onClick],
    );

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={handleClick}
        className={cn(
          'absolute inset-0 bg-black/20 backdrop-blur-xs',
          className,
        )}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />
    );
  },
);
BottomSheetOverlay.displayName = 'BottomSheetOverlay';

interface BottomSheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const BottomSheetTrigger = ({
  asChild,
  children,
  className,
}: BottomSheetTriggerProps) => {
  const { onOpenChange } = useBottomSheetContext();

  const handleClick = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      className?: string;
      onClick?: (e: React.MouseEvent) => void;
    };

    return React.cloneElement(children, {
      className: cn(childProps.className, className),
      onClick: (e: React.MouseEvent) => {
        childProps.onClick?.(e);
        handleClick();
      },
    } as Partial<typeof childProps>);
  }

  return (
    <button onClick={handleClick} type='button' className={cn('', className)}>
      {children}
    </button>
  );
};

interface BottomSheetContentProps {
  children?: React.ReactNode;
  height?: string;
  className?: string;
  closeThreshold?: number;
}

const BottomSheetContent = ({
  children,
  height = '55vh',
  className = '',
  closeThreshold = 0.3,
}: BottomSheetContentProps) => {
  const { isOpen, onOpenChange } = useBottomSheetContext();
  const controls = useAnimation();
  const y = useMotionValue(0);
  useTransform(y, [100, 0], [1, 0]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(0);

  const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const calculateHeight = useCallback(() => {
    if (typeof window !== 'undefined') {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      let calculatedHeight;
      if (vw <= 640) {
        calculatedHeight = vh * 0.6;
      } else if (vw <= 1024) {
        calculatedHeight = vh * 0.65;
      } else {
        calculatedHeight = vh * 0.7; // Taller for bottom sheet AI chat
      }

      if (height.includes('vh')) {
        calculatedHeight = (parseInt(height) / 100) * vh;
      } else if (height.includes('px')) {
        calculatedHeight = parseInt(height);
      }

      return Math.min(calculatedHeight, vh * 0.9);
    }
    return 400;
  }, [height]);

  useEffect(() => {
    const updateHeight = () => {
      setSheetHeight(calculateHeight());
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [calculateHeight]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      controls.start({
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 40,
          mass: 0.8,
        },
      });
    } else {
      document.body.style.overflow = '';
      controls.start({
        y: sheetHeight + 50,
        transition: {
          type: 'tween',
          ease: [0.25, 0.46, 0.45, 0.94],
          duration: 0.3,
        },
      });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, controls, sheetHeight]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const shouldClose =
        info.offset.y > (sheetHeight * closeThreshold) ||
        info.velocity.y > 800;
      if (shouldClose) {
        onClose();
      } else {
        controls.start({
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 500,
            damping: 40,
          },
        });
      }
    },
    [controls, onClose, closeThreshold, sheetHeight],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  if (sheetHeight === 0) return null;

  return (
    <BottomSheetPortal>
      <div
        className={cn('fixed inset-0 z-[999]', !isOpen && 'pointer-events-none')}
      >
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={handleOverlayClick}
          className='absolute inset-0 bg-black/20 backdrop-blur-xs'
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        />
        <motion.div
          drag='y'
          dragConstraints={{ top: 0, bottom: sheetHeight }}
          dragElastic={{ top: 0.1, bottom: 0 }}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ y: sheetHeight + 50 }}
          className={cn(
            'absolute left-0 right-0 bottom-0 w-full bg-white dark:bg-[#0A0A0A] shadow-2xl',
            className,
          )}
          style={{
            height: sheetHeight,
            display: 'flex',
            flexDirection: 'column',
          }}
          onDrag={undefined}
        >
          <motion.div
            className='flex justify-center pt-4 pb-3 w-full touch-none cursor-ns-resize z-50'
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onPointerDown={(e) => e.stopPropagation()}
            onDrag={(e, info) => {
              setSheetHeight((prev) => {
                const maxH = window.innerHeight * 0.95;
                const minH = Math.max(400, window.innerHeight * 0.4);
                return Math.max(minH, Math.min(prev - info.delta.y, maxH));
              });
            }}
          >
            <div className='h-1.5 w-12 rounded-full bg-border hover:bg-primary transition-colors' />
          </motion.div>
          
          <div className='flex-1 overflow-hidden'>
            <div
              className='h-full flex flex-col overflow-y-auto px-4 pt-2 pb-0 scrollbar-hide'
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </BottomSheetPortal>
  );
};

interface BottomSheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheetHeader = ({ children, className }: BottomSheetHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-center pb-4',
        className,
      )}
    >
      {children}
    </div>
  );
};

interface BottomSheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheetTitle = ({ children, className }: BottomSheetTitleProps) => {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
    >
      {children}
    </h3>
  );
};

interface BottomSheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheetDescription = ({
  children,
  className,
}: BottomSheetDescriptionProps) => {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
      {children}
    </p>
  );
};

interface BottomSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheetFooter = ({ children, className }: BottomSheetFooterProps) => {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-4',
        className,
      )}
    >
      {children}
    </div>
  );
};

interface BottomSheetCloseProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const BottomSheetClose = ({
  asChild,
  children,
  className,
}: BottomSheetCloseProps) => {
  const { onOpenChange } = useBottomSheetContext();

  const handleClick = () => {
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      className?: string;
      onClick?: (e: React.MouseEvent) => void;
    };

    return React.cloneElement(children, {
      className: cn(childProps.className, className),
      onClick: (e: React.MouseEvent) => {
        childProps.onClick?.(e);
        handleClick();
      },
    } as Partial<typeof childProps>);
  }

  return (
    <button onClick={handleClick} type='button' className={cn('', className)}>
      {children}
    </button>
  );
};

const BottomSheet = BottomSheetRoot;

export {
  BottomSheet,
  BottomSheetPortal,
  BottomSheetOverlay,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
};
