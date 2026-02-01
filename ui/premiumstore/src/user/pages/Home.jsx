import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-br from-slate-50 to-stone-100">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">
            Premium Fashion Collection
          </p>
          <h1 className="text-6xl md:text-7xl font-light tracking-tight mb-6">
            Elegance
            <span className="block font-serif italic text-amber-700">Redefined</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Curated collections that embody timeless style and uncompromising quality.
            Experience fashion that transcends trends.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
              </svg>
              Complimentary Shipping
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"/>
              </svg>
              Effortless Returns
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
              </svg>
              Secure Checkout
            </span>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-30 -z-0"></div>
      </section>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="py-28 px-6">
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-3">
            Explore Collections
          </p>
          <h2 className="text-5xl font-light tracking-tight">
            Curated for <span className="italic font-serif">You</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* MEN */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1520975916090-3105956dac38"
            title="Men's Collection"
            subtitle="Refined Essentials"
            link="/products?category=Men"
          />

          {/* WOMEN */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
            title="Women's Collection"
            subtitle="Timeless Elegance"
            link="/products?category=Women"
          />

          {/* GIRLS */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
            title="Girls' Collection"
            subtitle="Youthful Grace"
            link="/products?category=Girls"
          />

          {/* BOYS */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
            title="Boys' Collection"
            subtitle="Modern Classics"
            link="/products?category=Boys"
          />
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

          <Feature
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
            }
            title="Complimentary Delivery"
            desc="Enjoy free shipping on all orders above ₹999"
          />

          <Feature
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            }
            title="30-Day Returns"
            desc="Hassle-free returns within 30 days of purchase"
          />

          <Feature
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            }
            title="Secure Transactions"
            desc="Your payment information is always protected"
          />
        </div>
      </section>

    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function CategoryCard({ image, title, subtitle, link }) {
  return (
    <Link to={link} className="group relative overflow-hidden bg-white">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-xs tracking-wider uppercase opacity-80 mb-1">{subtitle}</p>
        <h3 className="text-xl font-light tracking-wide">{title}</h3>
        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="text-sm font-light">Explore Collection</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </div>
      </div>
      
      {/* Border effect */}
      <div className="absolute inset-0 border border-black/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none"></div>
    </Link>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-14 h-14 flex items-center justify-center bg-white text-amber-700 rounded-full shadow-sm mb-6">
        {icon}
      </div>
      <h4 className="text-lg font-light tracking-wide mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}