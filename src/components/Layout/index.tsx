import Link from 'next/link';

const Header = () => (
  <header className="border-b py-4">
    <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
      <Link href="/">
        <a className="font-bold text-xl">Your Name</a>
      </Link>
      <nav>
        <Link href="/projects">
          <a className="mr-4">Projects</a>
        </Link>
        <Link href="/about">
          <a className="mr-4">About</a>
        </Link>
        <Link href="/contact">
          <a>Contact</a>
        </Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="border-t py-6 mt-12">
    <div className="max-w-4xl mx-auto px-4 text-sm text-muted-foreground">© {new Date().getFullYear()} Your Name</div>
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
