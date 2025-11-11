import { Zap, TrendingUp, Repeat, Shield } from "lucide-react"

export default function IconsRow(){
  const items = [
    { icon: Zap, title: "Faster cycles" },
    { icon: TrendingUp, title: "Revenue impact" },
    { icon: Repeat, title: "No busywork" },
    { icon: Shield, title: "Governance" }
  ]
  return (
    <section className="container py-12">
      <div className="grid gap-4 sm:grid-cols-4">
        {items.map(({icon:Icon,title})=>(
          <div key={title} className="rounded-2xl border border-brand-border p-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent"><Icon size={18}/></span>
            <div className="font-medium">{title}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
