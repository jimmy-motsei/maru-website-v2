"use client";
import { motion } from "framer-motion";
import { stagger, fadeInUp, fadeIn } from "../../Framer";

export default function CTAJoin() {
    return (
        <motion.section
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="container py-16 text-center"
        >
            <div className="rounded-2xl border border-brand-border p-10 bg-[linear-gradient(135deg,rgba(61,184,198,.08),transparent)]">
                <motion.h3 variants={fadeInUp} className="text-2xl md:text-3xl font-semibold">
                    Join South Africa’s automation movement
                </motion.h3>
                <motion.p variants={fadeInUp} className="mt-2 text-brand-muted">
                    Start small, scale fast — we’ll guide you from quick wins to measurable outcomes, safely and locally.
                </motion.p>
                <motion.div variants={fadeIn} className="mt-6 inline-flex gap-3">
                    <a href="/request-demo" className="rounded-xl bg-brand-accent text-brand-accent-fore px-5 py-3 font-medium">Request a demo</a>
                    <a href="/contact?source=cta-join" className="rounded-xl border border-brand-border px-5 py-3">Talk to an expert</a>
                </motion.div>
            </div>
        </motion.section>
    );
}
