import dynamic from 'next/dynamic';
import React from 'react';

const StudioNoSSR = dynamic(
  async () => {
    const [{ NextStudio }, cfg] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../sanity.config'),
    ]);
    const C = () => <NextStudio config={cfg.default} />;
    return C;
  },
  { ssr: false }
);

export default function StudioPage() {
  return (
    <React.Suspense fallback={<div>Loading Studio…</div>}>
      <StudioNoSSR />
    </React.Suspense>
  );
}
