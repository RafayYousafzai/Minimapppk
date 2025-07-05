import Link from "next/link";
import {
  Facebook,
  Instagram,
  Heart,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#9b78e8] via-[#efd1ff] to-[#9b78e8]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-[#fff] rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#ffffff] rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full animate-bounce"></div>
      </div>

      <div className="relative container mx-auto py-12 px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#9b78e8] fill-[#9b78e8]" />
              </div>
              <h3 className="text-2xl font-bold text-black">Minimapppk</h3>
              <Sparkles className="w-5 h-5 text-[#9b78e8]" />
            </div>
            <p className="text-gray-800 leading-relaxed max-w-md">
              Your favorite destination for fancy and trendy products! We bring
              you the latest styles with love and care. ✨
            </p>
            <div className="flex items-center gap-2 text-gray-800">
              <Heart className="w-4 h-4 fill-[#9b78e8] text-[#9b78e8]" />
              <span className="text-sm">
                Made with love for our amazing customers
              </span>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div className="space-y-4">
            <h4 className="text-lg font-bold text-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9b78e8]" />
              Quick Links
            </h4>
            <div className="space-y-2">
              {["About Us", "Products", "Contact", "products", "track-order"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="block text-gray-800 hover:text-black hover:translate-x-1 transition-all duration-300"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div> */}

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-black flex items-center gap-2">
              <Heart className="w-4 h-4 fill-[#9b78e8] text-[#9b78e8]" />
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-800">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@shopwave.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-800">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-300 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold text-black mb-2 flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-[#9b78e8]" />
                Follow Our Journey
              </h4>
              <p className="text-gray-800 text-sm">
                Stay updated with our latest collections and exclusive offers!
              </p>
            </div>
            <div className="flex gap-4">
              {[
                {
                  icon: MessageCircle,
                  label: "Whatsapp",
                  href: "https://l.instagram.com/?u=https%3A%2F%2Fchat.whatsapp.com%2FJR3lDyCXENn78cIwC66pJO&e=AT0_0ifaWGX4Pky45n7Szrpre1xj6DIojGMN0j0tmgjunHRwBPIOB2ayvfK0-oNw2bZ2VYhUkqsfwlsqYO5nIgr85QkscMTX",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/minimapppk/?igsh=NGlubnFqaWtxb2E3#",
                },
                // { icon: Twitter, label: "Twitter", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group w-12 h-12 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#9b78e8] hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Icon className="h-5 w-5 text-gray-800 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-800">
              <Heart className="w-4 h-4 fill-[#9b78e8] text-[#9b78e8] animate-pulse" />
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Minimapppk. All rights
                reserved.
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-800 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-[#9b78e8]" />
              Minimapppk
              <Heart className="w-3 h-3 fill-[#9b78e8] text-[#9b78e8]" />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#efd1ff] via-[#9b78e8] to-[#efd1ff]"></div>
    </footer>
  );
};

export default Footer;
