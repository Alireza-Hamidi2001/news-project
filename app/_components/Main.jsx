// app/_components/Main.jsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaUser } from "react-icons/fa";
import Link from "next/link";
import { IoNotifications } from "react-icons/io5";

export default function Main({ data = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState("next");

    // اگر خبری نبود، نمایش پیام
    if (!data || data.length === 0) {
        return (
            <section className="mb-4 md:mb-10 lg:mb-20 w-full overflow-hidden relative group">
                <div className="h-[500px] sm:h-[550px] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-lg">
                    <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xl">
                        <IoNotifications className="w-8 h-8" />
                        No posts in Main section
                    </p>
                </div>
            </section>
        );
    }

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection("next");
        setCurrentIndex((prev) => (prev + 1) % data.length);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection("prev");
        setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
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

    const currentItem = data[currentIndex];

    return (
        <section className="mb-4 md:mb-10 lg:mb-20 w-full overflow-hidden relative group">
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
                    {/* Image */}
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
                            {currentItem.cover_image ? (
                                <Image
                                    src={currentItem.cover_image}
                                    alt={currentItem.title}
                                    fill
                                    className="object-cover md:object-contain"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        No Image
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Text */}
                    <div className="md:w-2/5 h-1/2 md:h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-black/20 dark:from-white/10 to-transparent backdrop-blur-sm">
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
                            <Link
                                href={`/news/${currentItem.id}`}
                                className="postParagraph text-[1.2rem] cursor-pointer inline-flex items-center gap-1 group-hover:translate-x-1 transition-all duration-300"
                            >
                                Read more →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    {data.map((_, index) => (
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
                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 right-2 sm:right-4 md:right-6 z-20 text-black/50 sm:text-[1.2rem] font-medium bg-rose-400/40 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    {currentIndex + 1} / {data.length}
                </div>
            </div>
        </section>
    );
}
