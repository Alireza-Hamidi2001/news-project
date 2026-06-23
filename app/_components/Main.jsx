// app/_components/Main.jsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import demo from "@/public/demo.png";

const section_1 = [
    {
        id: 1,
        title: "Breaking News: Global Summit 2024",
        summary:
            "World leaders gather to discuss climate change and sustainable development goals",
        details:
            "The annual summit brings together representatives from over 190 countries to address the most pressing environmental challenges of our time.",
        image: demo,
    },
    {
        id: 2,
        title: "Tech Innovation Reaches New Heights",
        summary:
            "Revolutionary AI breakthrough promises to transform healthcare industry",
        details:
            "Scientists have developed a new artificial intelligence system capable of diagnosing diseases with unprecedented accuracy.",
        image: demo,
    },
    {
        id: 3,
        title: "Economic Growth Surpasses Expectations",
        summary:
            "Global markets show strong recovery with record-breaking performance",
        details:
            "Major economies have reported higher than expected GDP growth in the latest quarterly reports.",
        image: demo,
    },
    {
        id: 4,
        title: "Space Exploration: New Horizons",
        summary: "NASA announces mission to explore distant exoplanets",
        details:
            "The new space telescope will search for signs of life in the habitable zones of nearby star systems.",
        image: demo,
    },
];

function Main() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState("next");

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection("next");
        setCurrentIndex((prev) => (prev + 1) % section_1.length);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection("prev");
        setCurrentIndex(
            (prev) => (prev - 1 + section_1.length) % section_1.length,
        );
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentIndex) return;
        setIsTransitioning(true);
        setDirection(index > currentIndex ? "next" : "prev");
        setCurrentIndex(index);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    const currentItem = section_1[currentIndex];

    return (
        <section className="mb-4 md:mb-10 lg:mb-20 w-full overflow-hidden relative group">
            {/* ارتفاع مناسب برای موبایل و دسکتاپ */}
            <div className="h-[500px] sm:h-[550px] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)]">
                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full bg-rose-400/50 backdrop-blur-md border border-white/20 hover:bg-rose-400 transition-all duration-300 hover:scale-110 flex items-center justify-center text-white opacity-70 md:opacity-0 md:group-hover:opacity-100 active:scale-90"
                    aria-label="Previous slide"
                >
                    <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full bg-rose-400/50 backdrop-blur-md border border-white/20 hover:bg-rose-400 transition-all duration-300 hover:scale-110 flex items-center justify-center text-white opacity-70 md:opacity-0 md:group-hover:opacity-100 active:scale-90"
                    aria-label="Next slide"
                >
                    <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </button>

                {/* Content */}
                <div className="flex flex-col md:flex-row h-full">
                    {/* Image - در موبایل بالا و در دسکتاپ چپ */}
                    <div className="md:w-3/5 h-1/2 md:h-full relative">
                        <div
                            className="relative w-full h-full transition-all overflow-hidden duration-600 ease-in-out"
                            style={{
                                transform: isTransitioning
                                    ? direction === "next"
                                        ? "scale(0.9) translateX(-20px)"
                                        : "scale(0.9) translateX(20px)"
                                    : "scale(1) translateX(0)",
                                opacity: isTransitioning ? 0.3 : 1,
                            }}
                        >
                            <Image
                                src={currentItem.image}
                                alt={currentItem.title}
                                fill
                                className="object-cover md:object-contain hover:scale-110 transition-all duration-200"
                                priority
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />
                        </div>
                        {/* Gradient Overlay */}
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black md:bg-gradient-to-r md:from-black/30 md:via-transparent md:to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div> */}
                    </div>

                    {/* Text - در موبایل پایین و در دسکتاپ راست */}
                    <div className="md:w-2/5 h-1/2 md:h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-linear-to-br from-black/20 dark:from-white/10 to-transparent backdrop-blur-sm">
                        <div
                            className="transition-all duration-600 ease-in-out"
                            style={{
                                transform: isTransitioning
                                    ? direction === "next"
                                        ? "translateX(30px) scale(0.95)"
                                        : "translateX(-30px) scale(0.95)"
                                    : "translateX(0) scale(1)",
                                opacity: isTransitioning ? 0 : 1,
                            }}
                        >
                            <h2 className="postTitle text-[4rem] line-clamp-none">
                                &bull; {currentItem.title}
                            </h2>
                            <p className="postParagraph text-[1.6rem] line-clamp-3">
                                &mdash; {currentItem.summary}
                            </p>
                            <p className="postDetail">{currentItem.details}</p>
                            <button className="postParagraph text-[1.2rem] cursor-pointer">
                                Read more
                                <span className="inline-block transition-all duration-300 group-hover:translate-x-1 group-hover:ml-1">
                                    &rarr;
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    {section_1.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-500 rounded-full ${
                                index === currentIndex
                                    ? "w-8 sm:w-10 md:w-15 h-1.5 sm:h-2 md:h-3 bg-rose-400 shadow-lg shadow-rose-600"
                                    : "w-3 sm:w-4 md:w-5 h-1.5 sm:h-2 md:h-3 bg-rose-400/30 hover:bg-white/50"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Slide Counter */}
                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 right-2 sm:right-4 md:right-6 z-20 text-black/50 sm:text-[1.2rem] font-medium bg-rose-400/40   backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    {currentIndex + 1} / {section_1.length}
                </div>
            </div>
        </section>
    );
}

export default Main;
