// app/not-found.jsx
import Link from "next/link";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";
import { FaFaceFrown } from "react-icons/fa6";
import GoBackButton from "./_components/GoBackButton";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <div className="text-[12rem] md:text-[16rem] font-bold text-gray-200 dark:text-gray-700 select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaFaceFrown className="w-24 h-24 md:w-32 md:h-32 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 mb-12">
                    <h1 className="title">Page Not Found</h1>
                    <p className="mainText">
                        Oops! The page you are looking for doesn&apos;t exist or
                        has been moved.
                    </p>
                    <div className="mainText text-[1.4rem]">
                        <span>We couldn&apos;t find the requested page</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row w-[50%] mx-auto items-center justify-center gap-4">
                    <Link href="/news" className="confirmBtn bg-emerald-500">
                        <FaHome className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <GoBackButton />
                </div>

                {/* Help Text */}
                <div className="w-auto mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <p className="text-[1.4rem] text-yellow-700 dark:text-yellow-300">
                        If you think this is a mistake, please check the URL
                        or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
}
