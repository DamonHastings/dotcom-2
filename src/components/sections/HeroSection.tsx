import React from 'react';
import Image from 'next/image';
import CTAGroup from '../ui/CTA';

type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  backgroundImage?: any;
  imageAlt?: string;
  ctas?: any[];
  unoptimized?: boolean;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  imageAlt = 'Hero image',
  ctas,
  unoptimized = false,
}) => {
  return (
    <header className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="col-span-1">
            {backgroundImage ? (
              <div className="w-full h-full rounded overflow-hidden shadow-sm">
                <Image
                  src={backgroundImage}
                  alt={imageAlt}
                  width={800}
                  height={800}
                  className="object-cover w-full h-full"
                  unoptimized={unoptimized}
                />
              </div>
            ) : null}
            {ctas && ctas.length ? (
              <div className="mt-4">
                <CTAGroup ctas={ctas} />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 prose max-w-none">
            {eyebrow ? <p className="text-sm text-indigo-600 font-medium">{eyebrow}</p> : null}
            {title ? <h1 className="text-3xl font-extrabold mb-4">{title}</h1> : null}
            {subtitle ? <p className="text-lg text-gray-700">{subtitle}</p> : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
