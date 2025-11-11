import Image from "next/image"
import { Placeholder } from "./Placeholder"

export default function Feature({
  title, lead, bullets, align = "left", cta, image
}: {
  title: string
  lead: string
  bullets?: string[]
  align?: "left" | "right"
  cta?: { href: string; label: string }
  image?: { src: string; alt: string; width?: number; height?: number }
}){
  const Text = (
    <div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-brand-muted">{lead}</p>
      {bullets?.length ? (
        <ul className="mt-4 space-y-2 text-sm text-brand-muted">
          {bullets.map(b => (
            <li key={b} className="pl-5 relative before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-accent/80">{b}</li>
          ))}
        </ul>
      ) : null}
      {cta ? <a href={cta.href} className="mt-5 inline-block text-sm text-brand-accent">{cta.label} →</a> : null}
    </div>
  )

  const Visual = image ? (
    <div className="rounded-2xl overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width ?? 1200}
        height={image.height ?? 800}
        className="h-64 md:h-80 w-full object-cover edge-fade"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={false}
      />
    </div>
  ) : (
    <Placeholder className="h-64 md:h-80" />
  )

  return (
    <section className="section">
      <div className={`grid gap-8 md:grid-cols-2 items-center ${align==="right" ? "md:[&>*:first-child]:order-2" : ""}`}>
        {Text}
        {Visual}
      </div>
    </section>
  )
}
