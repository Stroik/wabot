import { Outlet, Link } from "@tanstack/react-router";
import Navbar from "./Navbar";
import { RiWhatsappFill } from "react-icons/ri";

export default function Layout() {
  return (
    <>
      <header className="grid grid-cols-2 place-content-center">
        <h1 className="text-2xl font-bold px-4 flex items-center group">
          <Link to="/" className="flex gap-2 items-center justify-center">
            <RiWhatsappFill size={42} className="group-hover:text-green-500" />
            <span className="group-hover:text-cyan-600">WABulk</span>
          </Link>
        </h1>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Todos los derechos reservados © WABulk</p>
      </footer>
    </>
  );
}
