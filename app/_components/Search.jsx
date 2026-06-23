// app/_components/Search.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    const openSearch = () => {
        setIsOpen(true);
    };

    const closeSearch = () => {
        setIsOpen(false);
        setSearchQuery("");
    };

    // فوکوس روی اینپوت هنگام باز شدن
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 300);
        }
    }, [isOpen]);

    // بستن با کلید Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                closeSearch();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    // جلوگیری از اسکرول هنگام باز بودن مدال
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        // منطق جستجو اینجا
        console.log("Searching for:", searchQuery);
        // می‌توانید به صفحه نتایج هدایت کنید یا API call بزنید
    };

    return (
        <>
            {/* دکمه جستجو */}
            <button
                onClick={openSearch}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Search"
            >
                <FaMagnifyingGlass className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* مدال جستجو - فقط در صورت باز بودن نمایش داده می‌شود */}
            {isOpen && (
                <>
                    {/* پس‌زمینه تاریک */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
                        onClick={closeSearch}
                    />

                    {/* مدال */}
                    <div
                        ref={modalRef}
                        className="fixed top-0 left-0 right-0 z-1001 transition-transform duration-500 ease-out"
                        style={{
                            transform: isOpen
                                ? "translateY(0)"
                                : "translateY(-100%)",
                        }}
                    >
                        <div className="w-full md:w-1/2 mx-auto bg-white dark:bg-zinc-900 shadow-2xl border-gray-200 dark:border-gray-700">
                            <div className="px-4 sm:px-6 py-6 sm:py-10">
                                {/* دکمه بستن */}
                                <div className="flex justify-end mb-3">
                                    <button
                                        onClick={closeSearch}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-300 hover:rotate-90"
                                        aria-label="Close search"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* عنوان */}
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
                                    Search
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                                    Type anything to search...
                                </p>

                                {/* فرم جستجو */}
                                <form
                                    onSubmit={handleSearch}
                                    className="relative"
                                >
                                    <div className="relative">
                                        <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Search news, topics, categories..."
                                            className="pl-12 pr-20 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-300 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSearchQuery("")
                                                }
                                                className="absolute right-16 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-all"
                                            >
                                                <FaTimes className="w-4 h-4 text-gray-400" />
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="btnSearch"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </form>

                                {/* پیشنهادات جستجو (اختیاری) */}
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="text-[1rem] text-gray-500 dark:text-gray-400 mr-2">
                                        Popular:
                                    </span>
                                    {[
                                        "Politics",
                                        "Technology",
                                        "Sports",
                                        "Economy",
                                        "Cinema",
                                    ].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchQuery(tag)}
                                            className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-full text-[1.2rem] transition-all duration-200 hover:scale-105"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>

                                {/* نتایج نمونه (اختیاری) */}
                                {searchQuery && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Showing results for "{searchQuery}"
                                        </p>
                                        <div className="space-y-1.5">
                                            {[1, 2, 3].map((item) => (
                                                <div
                                                    key={item}
                                                    className="p-2.5 bg-gray-50 dark:bg-zinc-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-all duration-200"
                                                >
                                                    <h4 className="text-sm text-gray-800 dark:text-white font-medium">
                                                        Result {item}: Related
                                                        to "{searchQuery}"
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Brief description of the
                                                        result...
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Search;
