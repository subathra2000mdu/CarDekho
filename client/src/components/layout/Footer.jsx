import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Car</span>
                <span className="text-primary-400">Dekho</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-md">
              India&apos;s smart car research platform. Find your perfect car with our AI-powered
              recommendation engine. Compare specs, read expert reviews, and build your shortlist.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/browse', label: 'Browse Cars' },
                { to: '/wizard', label: 'Find My Car' },
                { to: '/compare', label: 'Compare Cars' },
                { to: '/browse?bodyType=SUV', label: 'SUVs' },
                { to: '/browse?bodyType=Sedan', label: 'Sedans' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Brands</h4>
            <ul className="space-y-2">
              {['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia'].map((brand) => (
                <li key={brand}>
                  <Link
                    to={`/browse?make=${encodeURIComponent(brand)}`}
                    className="text-gray-500 hover:text-primary-400 text-sm transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} CarDekho Research Platform. Built for learning purposes.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs">
              Made with React, Express & MongoDB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
