"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("Sending...");

    try {
      const form = new FormData();
      form.append("access_key", "542848fa-9b4e-4931-bae7-07048a3f498f");
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("message", formData.message);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        setResult("✅ Message sent! We’ll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResult("❌ Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setResult("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 bg-background"
    >
      <div className="max-w-3xl w-full space-y-12">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Contact
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We’d love to hear from you! Reach out using the options below or send us a message.
          </p>
        </div>

        {/* Contact Links */}
        <div className="grid gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <p>Email: <a href="mailto:support@tibe.to" className="text-primary hover:underline">support@tibe.to</a></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐦</span>
            <p>Twitter: <Link href="https://twitter.com/tibe" target="_blank" className="text-primary hover:underline">@tibe</Link></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐛</span>
            <p>Report a vulnerability: <Link href="https://tibe.to/security" target="_blank" className="text-primary hover:underline">tibe.to/security</Link></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <p>Report a bug: <Link href="https://github.com/forem/forem/issues" target="_blank" className="text-primary hover:underline">GitHub Issues</Link></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <p>Request a feature: <Link href="https://github.com/forem/forem/discussions" target="_blank" className="text-primary hover:underline">GitHub Discussions</Link></p>
          </div>
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg space-y-6 mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Send a Message
          </h2>

          <div>
            <Label htmlFor="name">Name:</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-2" placeholder="Your Name" />
          </div>

          <div>
            <Label htmlFor="email">Email:</Label>
            <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-2" placeholder="you@example.com" />
          </div>

          <div>
            <Label htmlFor="message">Message:</Label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="mt-2 h-36 resize-none" placeholder="Your message..." />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>

          {result && <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">{result}</p>}
        </motion.form>
      </div>
    </motion.main>
  );
}
