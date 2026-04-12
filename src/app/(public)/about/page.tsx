'use client';

import { GlowyWavesHero } from '@/components/uitripled/glowy-waves-hero-shadcnui';
import { TimelineBlock } from '@/components/uitripled/timeline-block-shadcnui';
import { GalleryGridBlock } from '@/components/uitripled/gallery-grid-block-shadcnui';
import { TeamSectionBlock } from '@/components/uitripled/team-section-block-shadcnui';
import { ContactFormSection } from '@/components/uitripled/contact-form-section-shadcnui';

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="relative">
        <GlowyWavesHero />
      </section>
      
      <section className="relative z-20 -mt-20 md:-mt-32">
        <TimelineBlock />
      </section>

      <section className="relative z-10 -mt-16 md:-mt-24">
        <TeamSectionBlock />
      </section>

      <section className="relative z-10 -mt-10 md:-mt-20">
        <GalleryGridBlock />
      </section>

      <section className="relative z-10 -mt-12 md:-mt-20">
        <ContactFormSection />
      </section>
    </main>
  );
}