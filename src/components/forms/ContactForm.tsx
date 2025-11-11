"use client"
import { useState, useRef, useEffect } from "react"

export default function ContactForm(){
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const start = useRef<number>(0)
  useEffect(()=>{ start.current = Date.now() },[])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setLoading(true)
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _honeypot: data.company,
        _elapsed: Date.now() - start.current
      })
    })
    setLoading(false)
    if(res.ok){ setDone(true); form.reset() }
  }

  if(done) return <p className="text-emerald-600">Thanks — we’ll be in touch shortly.</p>

  return (
    <form onSubmit={onSubmit} className="grid gap-3 max-w-xl">
      <label className="grid gap-1">
        <span className="text-sm">Name</span>
        <input name="name" required className="rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-emerald-300"/>
      </label>
      <label className="grid gap-1">
        <span className="text-sm">Email</span>
        <input name="email" type="email" required className="rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-emerald-300"/>
      </label>
      <label className="grid gap-1">
        <span className="text-sm">Message</span>
        <textarea name="message" required rows={5} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-emerald-300"/>
      </label>
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off"/>
      <button disabled={loading} className="rounded-xl bg-emerald-400 text-slate-900 font-medium px-5 py-3">
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  )
}
