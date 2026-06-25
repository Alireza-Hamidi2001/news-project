// app/news/layout.js
import SideNavigation from "../_components/SideNavigation";

export default function NewsLayout({ children }) {
    return (
        <div className="flex">
            <SideNavigation />
            <div className="flex-1">{children}</div>
        </div>
    );
}
