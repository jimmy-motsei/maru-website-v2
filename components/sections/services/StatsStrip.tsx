'use client';
import { motion } from 'framer-motion';
import { stagger, fadeInUp } from '../../Framer';

export default function StatsStrip() {
    const items = [
        { kpi: "+30%", label: "Lead conversion after automation" },
        { kpi: "40h", label: "Time saved / month per ops team" },
        { kpi: "2–4w", label: "Average implementation window" },
    ];
    return (
        <motion.section
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="border-y border-brand-border bg-black/20"
        >
            <div className="container py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {items.map((it) => (
                    <motion.div
                        key={it.kpi}
                        variants={fadeInUp}
                        className="rounded-2xl bg-black/30 p-6 border border-brand-border"
                    >
                        <div className="text-3xl font-semibold">{it.kpi}</div>
                        <div className="mt-1 text-sm text-zinc-300">{it.label}</div>
                    </motion.div>
                ))}
            </div>
            <motion.p
                variants={fadeInUp}
                className="text-center text-xs text-zinc-500 pb-6"
            >
                Results from recent client pilots (2024–2025).
            </motion.p>
        </motion.section>
    );
}
