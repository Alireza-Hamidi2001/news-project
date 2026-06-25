// app/_components/Others.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function Others({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <section className="mb-20 w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Latest News
                    </h2>
                </div>
                <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xl">
                        No posts in Others section
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-20 w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Latest News
                </h2>
                <Link
                    href="/news/category/all"
                    className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-300"
                >
                    View All →
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-black/70 dark:hover:shadow-white/70"
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
                                className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 mt-2"
                            >
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
