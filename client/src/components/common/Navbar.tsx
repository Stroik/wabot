import { Link } from "@tanstack/react-router";
import {
  RiDashboardFill,
  RiWhatsappFill,
  RiMessage2Fill,
  RiContactsBook2Fill,
  RiMailAddFill,
} from "react-icons/ri";
import { GoMegaphone } from "react-icons/go";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex justify-around">
        <li className="text-base py-2 hover:cursor-pointer">
          <NavbarLink
            to="/"
            className="text-base py-2 hover:cursor-pointer flex flex-col items-center group"
          >
            <RiDashboardFill size={24} className="group-hover:text-green-500" />
            <span className="hidden md:block group-hover:text-cyan-500">
              Escritorio
            </span>
          </NavbarLink>
        </li>
        <li className="text-base py-2 hover:cursor-pointer">
          <NavbarLink
            to="/bots"
            className="text-base py-2 hover:cursor-pointer flex flex-col items-center group"
          >
            <RiWhatsappFill size={24} className="group-hover:text-green-500" />
            <span className="hidden md:block group-hover:text-cyan-500">
              Whatsapps
            </span>
          </NavbarLink>
        </li>
        <li className="text-base py-2 hover:cursor-pointer">
          <NavbarLink
            to="/messages"
            className="text-base py-2 hover:cursor-pointer flex flex-col items-center group"
          >
            <RiMessage2Fill size={24} className="group-hover:text-green-500" />
            <span className="hidden md:block group-hover:text-cyan-500">
              Mensajes
            </span>
          </NavbarLink>
        </li>
        <li className="text-base py-2 hover:cursor-pointer">
          <NavbarLink
            to="/campaigns"
            className="text-base py-2 hover:cursor-pointer flex flex-col items-center group"
          >
            <GoMegaphone size={24} className="group-hover:text-green-500" />
            <span className="hidden md:block group-hover:text-cyan-500">
              Campañas
            </span>
          </NavbarLink>
        </li>
        <li className="text-base py-2 hover:cursor-pointer">
          <NavbarLink
            to="/books"
            className="text-base py-2 hover:cursor-pointer flex flex-col items-center group"
          >
            <RiContactsBook2Fill
              size={24}
              className="group-hover:text-green-500"
            />
            <span className="hidden md:block group-hover:text-cyan-500">
              Agendas
            </span>
          </NavbarLink>
        </li>
      </ul>
    </nav>
  );
}

interface NavbarLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

function NavbarLink({ to, children, className }: NavbarLinkProps) {
  return (
    <Link
      to={to}
      activeProps={{
        className: "text-cyan-500",
      }}
      className={className}
      search={{}}
      params={{}}
    >
      {children}
    </Link>
  );
}
