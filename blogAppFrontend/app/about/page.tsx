"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

/* ======================
   Animation Variants
====================== */
const AUTHOR_NAME = "Tibebu Dereje";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/* ======================
   About Page
====================== */

export default function AboutPage() {
  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-6 py-20"
    >
      {/* ================= Title ================= */}
      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight
                   text-foreground text-center mb-14"
      >
        About This Blog
      </motion.h1>

      {/* ================= Intro ================= */}
      <motion.section variants={fadeUp} className="text-center mb-16">
        <p
          className="text-xl md:text-2xl text-muted-foreground leading-relaxed
                      max-w-2xl mx-auto mb-6"
        >
          Welcome to{" "}
          <span className="text-foreground font-semibold">My Blog</span> — a
          modern space for high-quality tutorials, practical guides, and deep
          insights into web development and software engineering.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Our goal is to help developers grow confidently and stay ahead in the
          rapidly evolving tech ecosystem.
        </p>
      </motion.section>

      {/* ================= Author ================= */}
      <motion.section
        variants={fadeUp}
        className="flex flex-col md:flex-row items-center gap-12 mb-20">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="md:w-1/3 flex justify-center">
          <Image
            src="/image/user-image.png"
            alt="Author"
            width={250}
            height={200}
            priority
            sizes="(max-width: 768px) 160px, 200px"
            className=" shadow-xl ring-1 ring-border dark:ring-white/10"/>
        </motion.div>
        <div className="md:w-2/3">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Hi, I’m{" "}
            <span className="text-foreground font-medium">{AUTHOR_NAME}</span>,
            a full-stack developer focused on building scalable, maintainable,
            and user-centric web applications.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            I work with Next.js, React, Node.js, Tailwind CSS, PostgreSQL,
            MongoDB, and cloud-native tools. This blog is my platform to share
            real-world experience and practical knowledge.
          </p>
        </div>
      </motion.section>

      {/* ================= Features ================= */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-20">
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-semibold
                     text-foreground text-center mb-10">
          What You’ll Find Here
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: "📘",
              title: "High-Quality Tutorials",
              desc: "Clear, structured guides from basics to advanced topics.",
            },
            {
              icon: "🚀",
              title: "Modern Tech Insights",
              desc: "Best practices, tools, and trends used in real projects.",
            },
            {
              icon: "📱",
              title: "Fully Responsive",
              desc: "A smooth reading experience on all devices.",
            },
            {
              icon: "🤝",
              title: "Community Driven",
              desc: "Learn, share, and grow together with other developers.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border  bg-background p-6 shadow-sm hover:shadow-lg
                         transition dark:bg-background/60 dark:shadow-[0_0_40px_rgba(59,130,246,0.08)]"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.icon} {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section variants={fadeUp} className="text-center">
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Join the Journey
        </h2>

        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
          Explore tutorials, improve your skills, and build production-ready
          applications with confidence.
        </p>
        <Link href="/blog">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white  
                    hover:bg-blue-700 shadow-lg dark:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
          >
            Explore Blog
          </motion.button>
        </Link>
      </motion.section>
    </motion.main>
  );
}
