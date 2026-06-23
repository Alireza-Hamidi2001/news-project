import Image from "next/image";
import demo from "@/public/demo.png";
import Main from "../_components/Main";
import Others from "../_components/Others";
import ScrollableCards from "../_components/ScrollableCards";

function News() {
    return (
        <section className="p-8 grid grid-cols-1 gap-8 pt-20 min-h-[calc(100vh-5rem)] bg-gray-100 dark:bg-zinc-800 overflow-auto md:ml-64">
            <Main />
            <Others />
            <ScrollableCards />
        </section>
    );
}

export default News;
