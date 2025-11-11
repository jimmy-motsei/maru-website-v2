'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeInUp } from '../../Framer';

const faqs = [
    {
        q: 'How do engagements start?',
        a: 'We begin with a short discovery to define use-cases and value. Then we launch a small pilot — most take 2–4 weeks.'
    },
    {
        q: 'Is our data safe?',
        a: 'Yes. All workflows are designed to comply with POPIA and can be hosted on South African cloud regions. Consent logs and audit trails are included.'
    },
    {
        q: 'Which tools do you work with?',
        a: 'We integrate across HubSpot, Pipedrive, Airtable, Notion, Slack, Xero, QuickBooks and more — using APIs or low-code automation where practical.'
    },
    {
        q: 'Do you provide training?',
        a: 'Every project includes hand-off sessions and lightweight runbooks so your team stays confident and self-sufficient.'
    }
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <motion.section
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="container py-12"
        >
            <motion.h3 variants={fadeInUp} className="text-xl md:text-2xl font-semibold mb-4">FAQs</motion.h3>
            <motion.div variants={fadeInUp} className="rounded-2xl border border-brand-border divide-y divide-zinc-800/60 overflow-hidden">
                {faqs.map((f, i) => (
                    <details key={i} open={open === i} onClick={(e) => { e.preventDefault(); setOpen(open === i ? null : i); }} className="bg-black/20">
                        <summary className="cursor-pointer list-none p-5 flex items-center justify-between">
                            <span className="font-medium">{f.q}</span>
                            <span className="text-zinc-400">{open === i ? '–' : '+'}</span>
                        </summary>
                        <div className="px-5 pb-5 text-brand-muted">{f.a}</div>
                    </details>
                ))}
            </motion.div>
        </motion.section>
    );
}
