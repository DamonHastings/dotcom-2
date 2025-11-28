import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Bio() {
  return (
    <>
      <Head>
        <title>Damon Hastings — Bio</title>
        <meta name="description" content="Damon Hastings — Software Engineer & Media Designer" />
        {/* Load Fraunces from Google Fonts and prefer swap for performance. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main
        className="min-h-screen bg-black text-white"
        style={{
          fontFamily:
            "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto py-12 text-xl">
          <div className="grid grid-cols-12 gap-8">
            {/* Left content */}
            <div className="col-span-7">
              <section className="prose prose-invert max-w-none">
                <h2
                  className="text-3xl mb-4"
                  style={{
                    fontFamily: 'var(--font-fraunces, serif)',
                  }}
                >
                  15 years of helping innovative teams drive goals through engineering & design.
                </h2>
                <p className="text-yellow-400 font-semibold leading-relaxed mb-6">
                  I've built software that simplifies complexity, empowers communities, strengthens
                  small businesses, and scales products for thousands of users. Along the way, I've
                  developed a deep understanding of the systems that drive success, and the friction
                  that stalls it.
                </p>
                <hr className="mb-6 border-yellow-400" />
                <p>
                  My curiosity for technology began at an early age and turned into a lifelong
                  passion for understanding how things work, and how to make them work better.
                </p>

                <p>
                  I taught myself to take systems apart, rebuild them, and connect them. I followed
                  that curiosity into programming, business, economics, design, and the arts, trying
                  to understand not just technology, but the people, processes, and ideas it
                  supports.
                </p>

                <p>
                  Over the years, I've worked across architecture, nonprofits, healthcare
                  innovation, small business operations, and high-growth startups. In each
                  environment, I learned how teams build, how organizations grow, and how technology
                  quietly carries the weight behind meaningful work.
                </p>

                <p>
                  Today, I use that experience to help people bring ideas to life. To build products
                  that make people better. To create tools that move missions forward. And to
                  partner with teams who want to imagine what's possible, then actually build it.
                </p>

                <p className="mt-6">
                  Think you might have a need for my expertise? Just reach out.
                </p>

                <div className="mt-8 space-y-2">
                  <a
                    className="text-cyan-400 hover:text-cyan-300 block"
                    href="mailto:damonjhastings@gmail.com"
                  >
                    damonjhastings@gmail.com
                  </a>
                  <a
                    className="text-cyan-400 hover:text-cyan-300 block"
                    href="https://www.linkedin.com/in/damonjhastings"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/damonjhastings
                  </a>
                  <a
                    className="text-cyan-400 hover:text-cyan-300 block"
                    href="https://x.com/damon_hastings"
                    target="_blank"
                    rel="noreferrer"
                  >
                    x.com/damon_hastings
                  </a>
                </div>
              </section>
            </div>

            {/* Right sidebar */}
            <aside className="col-span-5 hidden md:block">
              <nav
                className="flex flex-col items-end gap-4 text-gray-300"
                style={{ fontFamily: 'var(--font-fraunces, serif)' }}
              >
                {/* <Link
                  href="/work-history"
                  className="text-cyan-400 hover:text-cyan-300 hover:text-decoration-line"
                >
                  View My Resume
                </Link> */}
                {/* <Link href="#availability" className="hover:text-white">
                  Availability
                </Link>
                <Link href="#about" className="hover:text-white">
                  About Me
                </Link> */}
              </nav>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
