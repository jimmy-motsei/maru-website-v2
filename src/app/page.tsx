import CTAButton from '../components/CTAButton';

export default function Home() {
  return (
    <main className="wrap section">
      <h1 className="font-display text-[9vw] sm:text-5xl md:text-7xl leading-[1.05] tracking-[0.02em]">
        Next.js + Tailwind is live.
      </h1>
      <p className="hero-subtitle">Styled with your Studio-like globals.</p>
      <CTAButton variant="black" size="lg" className="mt-6">Request demo</CTAButton>
    </main>
  );
}
