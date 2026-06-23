// app/_components/ScrollableCards.jsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import demo from "@/public/demo.png";

const scrollData = [
    {
        id: 1,
        title: "Global Economy Shows Strong Recovery",
        summary: "Markets rebound with record growth in Q3 2024",
        image: demo,
    },
    {
        id: 2,
        title: "New AI Model Revolutionizes Coding",
        summary: "Developers can now build apps 10x faster",
        image: demo,
    },
    {
        id: 3,
        title: "Electric Vehicles Dominate Market",
        summary: "EV sales surpass traditional cars for first time",
        image: demo,
    },
    {
        id: 4,
        title: "Mars Colony Project Announced",
        summary: "First human settlement planned for 2035",
        image: demo,
    },
    {
        id: 5,
        title: "5G Network Covers 90% of World",
        summary: "Connectivity reaches remote areas globally",
        image: demo,
    },
    {
        id: 6,
        title: "Fusion Energy Breakthrough",
        summary: "Clean energy source now viable for commercial use",
        image: demo,
    },
    {
        id: 7,
        title: "Smart Cities Transform Urban Life",
        summary: "IoT technology makes cities more efficient",
        image: demo,
    },
    {
        id: 8,
        title: "Biotech Cures Rare Diseases",
        summary: "New gene therapy shows 100% success rate",
        image: demo,
    },
];

function ScrollableCards() {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Trending Now
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={scrollLeft}
                        className="bg-rose-400/50 hover:bg-rose-400 w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center text-white"
                        aria-label="Scroll left"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="bg-rose-400/50 hover:bg-rose-400 w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center text-white"
                        aria-label="Scroll right"
                    >
                        <FaChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {scrollData.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[280px] md:min-w-[320px] lg:min-w-[350px] snap-start group bg-white/5 backdrop-blur-sm overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 flex-shrink-0"
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
                            <button className="postParagraph text-[1.2rem] cursor-pointer">
                                Read More
                                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}

export default ScrollableCards;
