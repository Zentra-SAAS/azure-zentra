import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, BarChart3, ShoppingCart, Shield, Rocket } from 'lucide-react';
import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
const Hero3D = lazy(() => import('./Hero3D'));
import { MagneticButton } from './ui/MagneticButton';
import { TextReveal } from './ui/TextReveal';

const Hero: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["-5deg", "5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="home" className="relative pt-20 pb-16 overflow-hidden min-h-[600px] flex items-center" >
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0" />}>
        <Hero3D mouseX={mouseX} mouseY={mouseY} />
      </Suspense>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
            >
              <TextReveal text="Manage all your shops." delay={0.2} />{' '}
              <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent block mt-2">
                <TextReveal text="Smarter. Faster. Simpler." delay={1.5} />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Zentra — AI-powered multi-branch shop management for small businesses.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-6">
              <MagneticButton strength={40}>
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-violet-500/30"
                >
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Try Demo — No Signup
                </Link>
              </MagneticButton>

              <MagneticButton strength={40}>
                <a
                  href="#trial"
                  className="inline-flex items-center justify-center px-6 py-3 border border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 font-medium rounded-lg transition-all duration-200"
                >
                  Start 30-Day Free Trial
                </a>
              </MagneticButton>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm text-gray-500 dark:text-gray-400">
              No credit card required for 30-day trial
            </motion.p>
          </motion.div>

          {/* Right Content - Dashboard Mockup with Subtler 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="relative perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Pulsing Glow Behind Card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/30 to-pink-500/30 blur-2xl rounded-3xl animate-pulse -z-10" />

            {/* Floating Badges - Refined */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 bg-white/90 dark:bg-gray-800/90 p-3 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-md"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-current" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 z-20 bg-white/90 dark:bg-gray-800/90 p-3 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-md"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400 fill-current" />
              </div>
            </motion.div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/30 transform transition-transform duration-75 ease-out preserve-3d relative overflow-hidden">
              {/* Shimmer Effect on Card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />

              {/* Reflective Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none rounded-2xl" />

              {/* Dashboard Content */}
              <div className="relative z-10">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Store Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05, translateZ: 20 }}
                    className="bg-gradient-to-r from-violet-500 to-violet-600 p-4 rounded-lg text-white shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-violet-100 text-sm">Revenue</p>
                        <p className="text-2xl font-bold">₹45.2K</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-violet-200" />
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, translateZ: 20 }}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 rounded-lg text-white shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-pink-100 text-sm">Orders</p>
                        <p className="text-2xl font-bold">127</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-pink-200" />
                    </div>
                  </motion.div>
                </div>

                {/* Chart Area */}
                <div className="bg-gray-50/80 dark:bg-gray-700/80 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Trend</p>
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                  </div>

                  {/* Animated Chart Bars */}
                  <div className="flex items-end justify-between h-24 space-x-1">
                    {[40, 65, 45, 80, 35, 90, 70].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        className="bg-gradient-to-t from-violet-400 to-pink-400 rounded-t-sm flex-1"
                        whileHover={{ scaleY: 1.1, filter: 'brightness(1.2)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
  );
};

export default Hero;