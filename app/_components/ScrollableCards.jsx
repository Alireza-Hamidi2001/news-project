// app/_components/ScrollableCards.jsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaUser } from "react-icons/fa";
import Link from "next/link";
import { IoNotifications } from "react-icons/io5";

export default function ScrollableCards({ data = [] }) {
    const scrollRef = useRef(null);

    if (!data || data.length === 0) {
        return (
            <section className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Trending Now
                    </h2>
                </div>
                <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg p-8 text-center">
                    <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xl">
                        <IoNotifications className="w-8 h-8" />
                        No posts in Trending section
                    </p>
                </div>
            </section>
        );
    }

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
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[280px] md:min-w-[320px] lg:min-w-[350px] snap-start group bg-white/5 backdrop-blur-sm overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 flex-shrink-0"
                    >
                        {/* Image */}
                        <div className="relative w-full h-48 md:h-56 overflow-hidden">
                            {item.cover_image ? (
                                <Image
                                    src={item.cover_image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        No Image
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="p-4 md:p-5">
                            <h3 className="postTitle">{item.title}</h3>
                            <p className="postParagraph">{item.summary}</p>

                            {/* Author Info */}
                            {item.author && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-white/60">
                                    <FaUser className="w-3 h-3" />
                                    <span>{item.author.full_name}</span>
                                </div>
                            )}

                            <Link
                                href={`/news/${item.id}`}
                                className="postParagraph text-[1.2rem] cursor-pointer inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-1"
                            >
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
