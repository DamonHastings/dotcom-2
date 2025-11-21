import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

const Header = () => (
  <header className="border-b py-4">
    <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
      <Link href="/" className="font-bold text-xl">
        Your Name
      </Link>
      <div className="flex items-center">
        <nav className="mr-4">
          <Link href="/projects" className="mr-4">
            Projects
          </Link>
          <Link href="/about" className="mr-4">
            About
          </Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="border-t py-6 mt-12">
    <div className="max-w-4xl mx-auto px-4 text-sm text-muted-foreground">
      © {new Date().getFullYear()} Your Name
    </div>
  </footer>
);

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
