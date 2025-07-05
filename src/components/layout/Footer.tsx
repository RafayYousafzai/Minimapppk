
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Heart,
  Sparkles,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import {Button} from '@/components/ui/button'

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-secondary text-secondary-foreground">

      <div className="relative container mx-auto py-12 px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-foreground fill-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Minimapppk</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Your favorite destination for fancy and trendy products! We bring
              you the latest styles with love and care. ✨
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@shopwave.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold text-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
                Follow Our Journey
              </h4>
              <p className="text-muted-foreground text-sm">
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
              ].map(({ icon: Icon, label, href }) => (
                <Button key={label} variant="outline" size="icon" asChild>
                  <Link href={href} aria-label={label}>
                    <Icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Minimapppk. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
