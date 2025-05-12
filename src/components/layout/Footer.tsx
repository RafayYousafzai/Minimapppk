
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} ShopWave. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" aria-label="Facebook" className="text-secondary-foreground hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-secondary-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-secondary-foreground hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <p className="text-xs mt-4 text-muted-foreground text-center">
          Designed by an Expert AI Designer
        </p>
      </div>
    </footer>
  );
};

export default Footer;
