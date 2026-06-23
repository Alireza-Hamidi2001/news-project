// app/_components/Others.jsx
"use client";

import Image from "next/image";
import demo from "@/public/demo.png";

const othersData = [
    {
        id: 1,
        title: "Climate Change Summit 2024",
        summary:
            "Global leaders commit to reducing carbon emissions by 50% by 2030",
        image: demo,
    },
    {
        id: 2,
        title: "AI Revolution in Healthcare",
        summary: "New AI system detects cancer with 95% accuracy",
        image: demo,
    },
    {
        id: 3,
        title: "SpaceX Launches New Mission",
        summary: "Starship successfully completes orbital test flight",
        image: demo,
    },
    {
        id: 4,
        title: "Quantum Computing Breakthrough",
        summary: "Scientists achieve quantum supremacy with new processor",
        image: demo,
    },
    {
        id: 5,
        title: "Renewable Energy Record",
        summary: "Solar and wind power reach 40% of global electricity",
        image: demo,
    },
    {
        id: 6,
        title: "Cybersecurity Threats Rise",
        summary: "New AI-powered defense systems developed to counter attacks",
        image: demo,
    },
];

function Others() {
    return (
        <section className="mb-20 w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Latest News
                </h2>
                <button className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-300">
                    View All →
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {othersData.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-black/70 dark:hover:shadow-white/70"
                    >
                        {/* Image */}
                        <div className="relative w-full h-48 md:h-56 overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="p-4 md:p-5">
                            <h3 className="postTitle">{item.title}</h3>
                            <p className="postParagraph">{item.summary}</p>
                            <button className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1">
                                Read More
                                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Others;
