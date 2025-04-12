
import { Link } from "react-router-dom";
import { Facebook, Send, Mail, PhoneCall } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/lovable-uploads/53d6aaaa-d701-48e1-b151-b1fa9058576c.png"
                alt="UKRFISH Logo"
                className="h-12 w-auto bg-white rounded-md p-1"
              />
            </Link>
            <p className="text-sm mt-2">
              ГС "Риба України" - об'єднання професіоналів рибної галузі для сталого розвитку 
              та захисту інтересів рибного господарства в Україні.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4 text-yellow-accent">Швидкі посилання</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white hover:text-yellow-accent transition-colors">
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white hover:text-yellow-accent transition-colors">
                  Новини
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-yellow-accent transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-white hover:text-yellow-accent transition-colors">
                  Членство
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4 text-yellow-accent">Контакти</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <PhoneCall size={16} className="mr-2" />
                <span>+380 44 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:info@ukrfish.org" className="hover:text-yellow-accent transition-colors">
                  info@ukrfish.org
                </a>
              </li>
              <li>
                м. Київ, вул. Рибна, 123, 04123
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4 text-yellow-accent">Слідкуйте за нами</h3>
            <div className="flex space-x-3 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-primary p-2 rounded-full hover:bg-yellow-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://t.me/ukrfish" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-primary p-2 rounded-full hover:bg-yellow-accent transition-colors">
                <Send size={20} />
              </a>
            </div>
            
            <h3 className="text-lg font-bold mb-2 text-yellow-accent">Розсилка новин</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Ваш email"
                className="px-3 py-2 rounded-l-md text-gray-800 w-full focus:outline-none"
              />
              <button
                type="button"
                className="bg-yellow-accent text-blue-primary px-4 py-2 rounded-r-md hover:bg-yellow-400 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} ГС "Риба України". Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
