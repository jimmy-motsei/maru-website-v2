import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function CTAJoin(){
  return (
    <section className="container py-16 text-center">
      <h3 className="text-2xl md:text-3xl font-semibold">Join the AI & automation revolution</h3>
      <p className="mt-2 text-brand-muted max-w-2xl mx-auto">Start small, scale fast — we’ll guide you from strategy to measurable outcomes.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/request-demo" className={buttonVariants()}>Request a demo</Link>
        <Link href="/contact" className={buttonVariants({ variant: "secondary" })}>Talk to an expert</Link>
      </div>
    </section>
  )
}
