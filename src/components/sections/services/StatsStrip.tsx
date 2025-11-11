import { Card, CardBody } from "@/components/ui/card"

export default function StatsStrip(){
  const stats = [
    { k: "+30%", v: "Lead conversion", d: "after sales-ops automation" },
    { k: "40h", v: "Time saved / mo", d: "typical operations team" },
    { k: "2-4w", v: "Average launch", d: "from kickoff to value" },
  ]
  return (
    <section className="container py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(s=>(
          <Card key={s.k} className="bg-brand-accent/5">
            <CardBody className="flex items-center gap-4">
              <div className="text-3xl font-semibold text-brand-accent">{s.k}</div>
              <div>
                <div className="font-medium">{s.v}</div>
                <div className="text-sm text-brand-muted">{s.d}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}
