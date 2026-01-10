import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-[#fffaf6] text-gray-800">

      {/* ================= HERO SECTION ================= */}
      <section className="text-center py-28">
        <h1 className="text-5xl font-bold">
          Welcome to{" "}
          <span className="text-orange-500">PremiumStore</span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl mx-auto">
          Discover the latest fashion trends for the whole family.
          Quality clothing at affordable prices.
        </p>

        <div className="mt-10 flex justify-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1 text-orange-500">
            → Free Shipping Over ₹999
          </span>
          <span>• Easy Returns</span>
          <span>• Secure Payments</span>
        </div>
      </section>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="bg-white py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-gray-500 mt-2">
            Find the perfect style for everyone
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* MEN */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1520975916090-3105956dac38"
            title="Men"
            link="/products?category=Men"
          />

          {/* WOMEN */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
            title="Women"
            link="/products?category=Women"
          />

          {/* GIRLS */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
            title="Girls"
            link="/products?category=Girls"
          />

          {/* BOYS */}
          <CategoryCard
            image="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
            title="Boys"
            link="/products?category=Boys"
          />
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-[#fffaf6] py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          <Feature
            icon="📦"
            title="Free Shipping"
            desc="On orders above ₹999"
          />

          <Feature
            icon="🔄"
            title="Easy Returns"
            desc="30-day return policy"
          />

          <Feature
            icon="🔒"
            title="Secure Payments"
            desc="100% secure checkout"
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white py-6 text-center text-sm text-gray-500 border-t">
        © 2024 PremiumStore. All rights reserved.
      </footer>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function CategoryCard({ image, title, link }) {
  return (
    <div className="bg-gray-50 rounded-2xl shadow hover:shadow-lg transition p-4 text-center">
      <img
        src={image}
        alt={title}
        className="rounded-xl h-72 w-full object-cover"
      />
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>

      <Link
        to={link}
        className="inline-block mt-2 text-orange-500 text-sm font-medium hover:underline"
      >
        Shop Now →
      </Link>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div>
      <div className="mx-auto w-12 h-12 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full text-xl">
        {icon}
      </div>
      <h4 className="mt-4 font-semibold">{title}</h4>
      <p className="text-gray-500 text-sm mt-1">{desc}</p>
    </div>
  );
}
