import LandingNavbar from "@/components/UI/Landing/Landing.Navbar";
import LandingSideBar from "@/components/UI/Landing/Sidebar.landing";

export default function Home() {
  return (
    <main className="relative">
      <LandingNavbar />
      <LandingSideBar />
    </main>
  );
}
