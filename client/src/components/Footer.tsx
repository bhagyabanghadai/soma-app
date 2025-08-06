import { Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-soma-green mb-4">🌱 Soma</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering farmers with AI-driven insights for sustainable agriculture. 
              Growing smarter, greener, together.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-soma-green transition-colors duration-200"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-soma-green transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-soma-green transition-colors duration-200"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/dashboard" className="hover:text-soma-green transition-colors duration-200">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/soil-health" className="hover:text-soma-green transition-colors duration-200">
                  Soil Analysis
                </a>
              </li>
              <li>
                <a href="/water-usage" className="hover:text-soma-green transition-colors duration-200">
                  Water Management
                </a>
              </li>
              <li>
                <a href="/carbon-credits" className="hover:text-soma-green transition-colors duration-200">
                  Carbon Credits
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-soma-green transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-soma-green transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-soma-green transition-colors duration-200">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-soma-green transition-colors duration-200">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Soma Dashboard. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Powered by</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-semibold">
              AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
