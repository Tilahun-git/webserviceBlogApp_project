"use client";

import { useState } from "react";
import { Github, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const socialLinks = [
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = async () => {
    if (!email) return;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <motion.footer
      className="bg-background border-t border-border/50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-serif font-bold text-foreground mb-4">
              Blog
            </h3>
            <p className="text-muted-foreground mb-4">
              Writing that blogs with the curious minds of the digital age.
              Exploring the intersection of technology, design, and creativity.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{link.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
            <p className="text-muted-foreground mb-4">
              Subscribe to get the latest posts delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleSubscribe}>Subscribe</Button>
              </motion.div>
            </div>
            {status === "success" && (
              <motion.p
                className="text-green-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Subscribed successfully!
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                className="text-red-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Subscription failed. Try again.
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Footer bottom */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} Blog. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
