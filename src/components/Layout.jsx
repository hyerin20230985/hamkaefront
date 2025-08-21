
import Navbar from "./components/Navbar";

export default function Layout({ children }) {
    return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      <Navbar /> {/* ✅ 모든 페이지에 하단 Navbar */}
    </div>
    );
}
