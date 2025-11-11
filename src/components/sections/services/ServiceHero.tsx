"use client"

import Image from "next/image"
import Link from "next/link"

export default function ServiceHero() {
  return (
    <section className="container py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Your partner for <span className="text-brand-accent">business-ready AI</span> automation
          </h1>
          <p className="mt-4 text-brand-muted max-w-xl">
            We help South African B2B firms automate everyday work — from WhatsApp to the boardroom.
            Practical, profitable and fully POPIA-compliant.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/contact" className="rounded-xl bg-brand-accent text-brand-accent-fore px-5 py-3 font-medium">Book a call</Link>
            <Link href="/request-demo" className="rounded-xl border border-brand-border px-5 py-3">Request a demo</Link>
          </div>
          <p className="mt-3 text-sm text-brand-muted">Start with a simple audit. See ROI in weeks, not months.</p>
        </div>

        <div className="relative h-64 md:h-[360px] rounded-2xl overflow-hidden border border-brand-border">
          <Image
            src="/images/services/hero-services.png"
            alt="Automation team reviewing dashboards and workflows"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(600px_300px_at_70%_20%,rgba(61,184,198,.16),transparent_60%)]" />
        </div>
      </div>
    </section>
  )
}
