import SideNavigation from "../_components/SideNavigation";

function layout({ children }) {
    return (
        <div>
            <SideNavigation />
            <div>{children}</div>
        </div>
    );
}

export default layout;
