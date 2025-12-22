"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, FormEvent } from "react";
import { Link } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

      try {
      // Replace this with your backend API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.alert("Message Sent! 🎉\nThank you for reaching out. We'll get back to you soon.");

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      window.alert("Error 😢\nSomething went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 bg-linear-to-b from-background to-background/90"
    >
      <div className="max-w-3xl w-full space-y-12">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Contacts
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Forem would love to hear from you! Reach out using any of the
            methods below.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6"
        >
          {/* Email */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <p>
              Email:{" "}
              <a
                href="mailto:support@dev.to"
                className="text-primary hover:underline"
              >
                support@dev.to
              </a>
            </p>
          </div>

          {/* Twitter */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐦</span>
            <p>
              Twitter:{" "}
              <Link
                href="https://twitter.com/dev"
                target="_blank"
                className="text-primary hover:underline"
              >
                @dev
              </Link>
            </p>
          </div>

          {/* Security */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐛</span>
            <p>
              Report a vulnerability:{" "}
              <Link
                href="https://dev.to/security"
                target="_blank"
                className="text-primary hover:underline"
              >
                dev.to/security
              </Link>
            </p>
          </div>

          {/* Bug Report */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <p>
              To report a bug, create a bug report in our{" "}
              <Link
                href="https://github.com/forem/forem/issues"
                target="_blank"
                className="text-primary hover:underline"
              >
                open source repo
              </Link>
            </p>
          </div>

          {/* Feature Request */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <p>
              To request a feature, start a new{" "}
              <Link
                href="https://github.com/forem/forem/discussions"
                target="_blank"
                className="text-primary hover:underline"
              >
                GitHub Discussion
              </Link>{" "}
              in the Forem repo
            </p>
          </div>
        </motion.div>

        {/* Optional Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg space-y-6 mt-8"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Send a Message
          </h2>

          <div>
            <Label htmlFor="name" className="text-foreground font-medium">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-foreground font-medium">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-2 h-36 resize-none"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </motion.form>
      </div>
    </motion.main>
  );
}
