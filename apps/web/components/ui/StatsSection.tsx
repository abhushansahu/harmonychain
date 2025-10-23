'use client'

import React from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: '10K+', label: 'Active Artists' },
  { value: '1M+', label: 'Tracks Streamed' },
  { value: '$50K+', label: 'Artist Revenue' },
]

export default function StatsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 gradient-text">
                {stat.value}
              </h2>
              <p className="text-xl text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
