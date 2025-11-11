import Image from "next/image";

const items = [
    { name: "OpenAI",  logo: "/images/ecosystem/openai.svg" },
    { name: "HubSpot", logo: "/images/ecosystem/hubspot.svg" },
    { name: "GitHub",  logo: "/images/ecosystem/github.svg" },
    { name: "Zapier",  logo: "/images/ecosystem/zapier.svg" },
    { name: "Notion",  logo: "/images/ecosystem/notion.svg" },
    { name: "Meta",    logo: "/images/ecosystem/meta.svg" }
];

export default function PartnerStrip(){
    return (
        <section className="border-y border-brand-border bg-black/20">
            <div className="container py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {items.map(i=>(
                    <div key={i.name} className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                        <Image src={i.logo} alt={i.name} width={100} height={24} className="h-6 w-auto grayscale contrast-125" />
                    </div>
                ))}
            </div>
        </section>
    )
}