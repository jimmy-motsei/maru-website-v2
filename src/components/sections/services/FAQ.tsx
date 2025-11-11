"use client"
import { useState } from "react"

const Q = [
  { q: "How do engagements start?", a: "We begin with a short discovery to define use-cases and value, then launch a pilot. Most pilots run 2–4 weeks." },
  { q: "Which tools do you use?", a: "We’re vendor-agnostic. Typical stack includes OpenAI, Claude, AirTable, Zapier/Make, Slack, and your CRM/ERP." },
  { q: "Can you work with our data?", a: "Yes. We integrate with your systems via APIs/ETL and follow data-handling best practices." },
  { q: "Do you provide training?", a: "Yes. Our AI Academy workshops upskill teams on safe, effective AI usage and process change." }
]

export default function FAQ(){
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="container py-12">
      <h3 className="text-xl font-semibold">FAQs</h3>
      <div className="mt-4 divide-y divide-brand-border rounded-2xl border border-brand-border">
        {Q.map((item, i)=>(
          <details key={i} open={open===i} onClick={(e)=>{ e.preventDefault(); setOpen(open===i?null:i) }} className="group">
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between">
              <span className="font-medium">{item.q}</span>
              <span className="text-brand-muted group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-brand-muted">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
