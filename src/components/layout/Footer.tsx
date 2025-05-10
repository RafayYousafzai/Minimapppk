const Footer = () => {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} ShopWave. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-muted-foreground">
          Designed by an Expert AI Designer
        </p>
      </div>
    </footer>
  );
};

export default Footer;
