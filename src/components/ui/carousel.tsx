/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

// Simple utility merge similar to shadcn cn helper.
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CarouselContextValue {
  embla: ReturnType<typeof useEmblaCarousel>[1] | null;
  api: ReturnType<typeof useEmblaCarousel>[0] | null;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextValue | undefined>(undefined);

export function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error('useCarousel must be used within <Carousel>');
  return ctx;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: EmblaOptionsType;
}

export const Carousel: React.FC<CarouselProps> = ({ opts, className, children, ...rest }) => {
  const [viewportRef, emblaApi] = useEmblaCarousel(opts);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Inject ref into CarouselContent so its children become slides directly in track
  const processedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if ((child.type as any).displayName === 'CarouselContent') {
      return React.cloneElement(child as any, { viewportRef });
    }
    return child;
  });

  return (
    <CarouselContext.Provider
      value={{ embla: emblaApi, api: viewportRef, canScrollPrev, canScrollNext }}
    >
      <div className={cn('relative', className)} {...rest}>
        {processedChildren}
      </div>
    </CarouselContext.Provider>
  );
};

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportRef?: React.RefObject<HTMLDivElement>;
}

export const CarouselContent: React.FC<CarouselContentProps> = ({
  className,
  children,
  viewportRef,
  ...rest
}) => {
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn('flex select-none gap-8 pr-8', className)} aria-live="off" {...rest}>
        {React.Children.map(children, (child) => child)}
      </div>
    </div>
  );
};
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn('flex-[0_0_auto] w-[280px]', className)} {...rest}>
      {children}
    </div>
  );
};

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'prev' | 'next';
}

export const CarouselNavButton: React.FC<NavButtonProps> = ({ direction, className, ...rest }) => {
  const { embla, canScrollPrev, canScrollNext } = useCarousel();
  const disabled = direction === 'prev' ? !canScrollPrev : !canScrollNext;
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      disabled={disabled}
      onClick={() => {
        if (!embla) return;
        direction === 'prev' ? embla.scrollPrev() : embla.scrollNext();
      }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center shadow text-lg disabled:opacity-40',
        direction === 'prev' ? 'left-2' : 'right-2',
        className
      )}
      {...rest}
    >
      {direction === 'prev' ? '←' : '→'}
    </button>
  );
};
