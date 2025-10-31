import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { trackFeatureUsed } from '../services/analytics';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>EA FC 25 Squad Builder - Free Chemistry Calculator | Gaming Tools</title>
        <meta
          name="description"
          content="Build your perfect EA FC 25 Ultimate Team squad with accurate chemistry calculations, player search, and SBC solver. Free and fast."
        />
      </Helmet>

      <div className="relative">
        {/* Hero Section with FUT-style gradient */}
        <section className="relative bg-gradient-to-br from-ea-blue-600 via-ea-blue-700 to-pitch-dark text-white overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-pitch-gradient" />
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <span className="w-2 h-2 bg-chem-perfect rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Free • Fast • Accurate</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Build Your Perfect
                <span className="block bg-gradient-to-r from-ea-green-400 to-fut-gold bg-clip-text text-transparent">
                  Ultimate Team
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Real-time chemistry calculation, 20,000+ players, intelligent SBC solver.
                Everything you need to dominate FUT.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/squad-builder"
                  onClick={() => trackFeatureUsed('hero_cta_squad_builder')}
                  className="group relative px-8 py-4 bg-white text-ea-blue-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚽ Start Building
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>

                <a
                  href="#features"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-fut-gold">20K+</div>
                  <div className="text-sm text-blue-200">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fut-gold">33</div>
                  <div className="text-sm text-blue-200">Max Chemistry</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fut-gold">30+</div>
                  <div className="text-sm text-blue-200">Formations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" className="w-full h-12 fill-gray-50">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Build
                <span className="block text-ea-blue-600">Championship Squads</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pro-level tools used by Weekend League competitors
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature Card 1 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-ea-blue-500">
                <div className="w-16 h-16 bg-gradient-to-br from-chem-perfect to-ea-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">⚗️</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  Accurate Chemistry
                </h3>
                <p className="text-gray-600 mb-4">
                  Real-time chemistry calculation that matches in-game results. FIFA 23+
                  system with Icons, Heroes, and manager bonuses.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-chem-perfect/20 text-chem-perfect rounded-full text-xs font-semibold">
                    99.9% Accurate
                  </span>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-ea-blue-500">
                <div className="w-16 h-16 bg-gradient-to-br from-ea-blue-500 to-ea-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  Smart Player Search
                </h3>
                <p className="text-gray-600 mb-4">
                  Search 20,000+ players instantly. Advanced filters for position, rating,
                  price, nationality, league, and more.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-ea-blue-500/20 text-ea-blue-700 rounded-full text-xs font-semibold">
                    20K+ Players
                  </span>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-fut-gold">
                <div className="w-16 h-16 bg-gradient-to-br from-fut-gold to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🧩</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">SBC Solver</h3>
                <p className="text-gray-600 mb-4">
                  Intelligent SBC solutions that only use 11 players. No bench waste like
                  EA's companion app. Save thousands of coins.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-fut-gold/20 text-orange-700 rounded-full text-xs font-semibold">
                    No Bench Waste
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-pitch-dark to-ea-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Dominate FUT?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of players building championship squads with our free tools
            </p>
            <Link
              to="/squad-builder"
              onClick={() => trackFeatureUsed('bottom_cta_squad_builder')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ea-blue-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              ⚽ Start Building Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
