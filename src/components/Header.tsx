import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="flex items-center space-x-4">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-8 w-8"
        />
        <h1 className="text-xl font-bold">KEY PROYECT</h1>
      </div>
      <Link
        to="/"
        className="text-sm hover:underline hover:text-indigo-200 transition"
      >
        Ir al inicio
      </Link>
    </header>
  );
};

export default Header;
