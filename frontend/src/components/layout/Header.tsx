import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PromptValar
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/studio" className="text-gray-700 hover:text-primary">
              Studio
            </Link>
            <Link to="/library" className="text-gray-700 hover:text-primary">
              Library
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-primary">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

