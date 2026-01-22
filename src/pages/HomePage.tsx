import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DemoPreview from '../components/DemoPreview';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import DemoMockup from '../components/DemoMockup';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <DemoPreview />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <DemoMockup />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HomePage;