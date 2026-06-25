// app/login/page.jsx
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
    console.log("🔍 [Login Page] Rendering login page");

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    );
}
