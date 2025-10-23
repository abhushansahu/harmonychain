'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA: {
    text: string
    href: string
  }
}

export default function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-blue-400 font-medium mb-4"
          >
            {subtitle}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={primaryCTA.href}
              className="btn-primary inline-flex items-center justify-center group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {primaryCTA.text}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href={secondaryCTA.href}
              className="btn-secondary inline-flex items-center justify-center"
            >
              {secondaryCTA.text}
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000" />
    </section>
  )
}
