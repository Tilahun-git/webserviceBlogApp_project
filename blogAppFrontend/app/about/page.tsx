"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

/* ======================
   Animation Variants
====================== */
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
  const teamMembers = [
    { name: "Tibebu Dereje", role: "Frontend Developer" },
    { name: "Elias Nuredin", role: "Backend Developer" },
    { name: "Elias Ferhan", role: "Frontend Developer" },
    { name: "Tilahun Tareke", role: "Full Stack Developer" },
    { name: "Eyob Abate", role: "Backend Developer" },
  ];

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
        About Our Blog
      </motion.h1>

      {/* ================= Intro ================= */}
      <motion.section variants={fadeUp} className="text-center mb-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
          Welcome to <span className="text-foreground font-semibold">Our Group Blog</span> — 
          a collaborative platform created by a team of 5 passionate developers and tech enthusiasts.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Our goal is to share practical tutorials, insights, and projects that help developers of all levels grow their skills and stay up-to-date with modern web development technologies.
        </p>
      </motion.section>

      {/* ================= Our Mission ================= */}
      <motion.section variants={fadeUp} className="text-center mb-20">
        <h2 className="text-3xl font-semibold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          As a team, we aim to simplify complex topics, provide real-world coding examples, and foster a collaborative learning community. By combining our diverse skills and experiences, we create content that’s practical, reliable, and engaging for readers.
        </p>
      </motion.section>

      {/* ================= Interactive Team Section ================= */}
      <motion.section variants={fadeUp} className="mb-20">
        <h2 className="text-3xl font-semibold text-foreground text-center mb-10">Meet the Team</h2>

        <div className="grid md:grid-cols-5 gap-6 justify-items-center">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="w-36 h-36 flex flex-col items-center justify-center 
                         rounded-xl border border-border bg-background shadow-md
                         dark:bg-background/60 dark:shadow-[0_0_20px_rgba(59,130,246,0.08)]
                         cursor-pointer relative group"
            >
              {/* Initials Circle */}
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>

              {/* Name */}
              <h3 className="text-center text-foreground font-semibold">{member.name}</h3>

              {/* Role Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-[-3rem] w-32 bg-gray-800 text-white text-sm text-center rounded-md px-2 py-1
                           opacity-0 group-hover:opacity-100 transition-all pointer-events-none"
              >
                {member.role}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= Features ================= */}
      <motion.section variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-20">
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-semibold text-foreground text-center mb-10"
        >
          What You’ll Find Here
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: "📘", title: "Comprehensive Tutorials", desc: "From fundamentals to advanced topics, explained clearly." },
            { icon: "💡", title: "Team Insights", desc: "Practical tips and real-world approaches shared by our team." },
            { icon: "⚡", title: "Collaborative Projects", desc: "Learn by exploring projects developed collectively by our group." },
            { icon: "🌐", title: "Community Engagement", desc: "Connect, discuss, and grow with fellow learners and developers." },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-lg
                         transition dark:bg-background/60 dark:shadow-[0_0_40px_rgba(59,130,246,0.08)]"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.icon} {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section variants={fadeUp} className="text-center">
        <h2 className="text-3xl font-semibold text-foreground mb-4">Join the Journey</h2>
        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
          Explore tutorials, projects, and insights created by our team. Learn, collaborate, and build modern web applications with confidence.
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
