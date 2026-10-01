"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppModal from "@/components/WhatsAppModal";
import { WHATSAPP_NUMBER } from "@/lib/products";

export default function ContactPage() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Scroll reveal
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col font-sans">
      {/* Top banner */}
      <div className="bg-[#1c1917] text-stone-200 text-xs py-2 px-4 text-center">
        <span className="flex items-center justify-center gap-1.5 font-medium">
          <span>Crafted in Bangalore — Studio open Tue–Sun, 10:30 AM – 8:00 PM</span>
        </span>
      </div>

      <Navbar
        cartCount={0}
        onOpenCart={() => {}}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-16 pb-20 overflow-hidden border-b border-[#e7e5e4]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={heroRef}>
            <div className="reveal">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f3ef] border border-[#e7e5e4] text-xs font-semibold uppercase tracking-wider text-[#78716c] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                We respond within 1–2 business hours
              </span>
            </div>
            <h1 className="reveal font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1c1917] tracking-tight leading-[1.08] mb-5" style={{ transitionDelay: "80ms" }}>
              Let&apos;s start a conversation.
            </h1>
            <p className="reveal text-base sm:text-lg text-[#57534e] leading-relaxed max-w-2xl mx-auto font-light" style={{ transitionDelay: "160ms" }}>
              Whether you have questions about a sofa model, want to design a custom piece, or simply want to visit our Bangalore studio — our team is here to help.
            </p>
          </div>
        </section>

        {/* Main contact grid */}
        <section className="py-20 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left: Info Panel */}
            <div className="lg:col-span-4 space-y-8" ref={infoRef}>
              <div className="reveal-left">
                <h2 className="font-serif text-2xl text-[#1c1917] mb-2">Visit or Call Us</h2>
                <p className="text-sm text-[#57534e] leading-relaxed">
                  Our design advisors are available to discuss your project in detail — in-store, over call, or on WhatsApp.
                </p>
              </div>

              <div className="reveal-stagger space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: "Experience Studio",
                    value: "Plot 42, 100 Feet Road, Indiranagar\nBangalore, Karnataka 560038",
                  },
                  {
                    icon: Phone,
                    label: "Studio Phone",
                    value: `+${WHATSAPP_NUMBER}`,
                    href: `tel:+${WHATSAPP_NUMBER}`,
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@urufurniture.com",
                    href: "mailto:hello@urufurniture.com",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#e7e5e4] hover-lift">
                      <div className="w-9 h-9 rounded-xl bg-[#f5f3ef] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#78716c]" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-0.5">{item.label}</span>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-[#1c1917] hover:text-[#9a3412] transition-colors whitespace-pre-line">
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm text-[#1c1917] whitespace-pre-line">{item.value}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi URU Furniture, I'd like to inquire about your sofa collection.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[#1b4332] hover:bg-[#143225] text-white transition-all hover-lift"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-800/50 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block mb-0.5">WhatsApp (Fastest)</span>
                    <span className="text-sm text-white">+{WHATSAPP_NUMBER}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-300 ml-auto" />
                </a>
              </div>

              {/* Studio hours */}
              <div className="reveal p-5 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4]" style={{ transitionDelay: "200ms" }}>
                <h3 className="font-serif text-base text-[#1c1917] mb-3">Studio Hours</h3>
                <div className="space-y-1.5 text-xs text-[#57534e]">
                  <div className="flex justify-between">
                    <span>Tuesday – Friday</span>
                    <span className="font-medium text-[#1c1917]">10:30 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday – Sunday</span>
                    <span className="font-medium text-[#1c1917]">10:30 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monday</span>
                    <span className="font-medium text-amber-700">By Appointment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-8" ref={formRef}>
              <div className="reveal-right bg-white rounded-3xl border border-[#e7e5e4] p-8 sm:p-10 shadow-sm">
                {status === "success" ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1c1917]">Message Received!</h3>
                    <p className="text-sm text-[#57534e] max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. A confirmation email has been sent to your inbox, and our team will be in touch within 1–2 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 px-6 py-2.5 rounded-full bg-[#1c1917] text-white text-xs font-semibold hover:bg-black transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="font-serif text-2xl text-[#1c1917] mb-1">Send us a message</h2>
                      <p className="text-sm text-[#78716c]">
                        Fill in the form below and we&apos;ll send you a confirmation right away.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1.5">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Hridayansh Sharma"
                            className="w-full px-4 py-3 rounded-xl bg-[#f5f3ef] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1c1917] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1.5">
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-[#f5f3ef] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1c1917] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1.5">
                            Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl bg-[#f5f3ef] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1c1917] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1.5">
                            Subject
                          </label>
                          <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#f5f3ef] border border-[#e7e5e4] text-[#1c1917] text-sm focus:outline-none focus:border-[#1c1917] transition-colors appearance-none"
                          >
                            <option value="">Select a topic...</option>
                            <option>Cloud Sofa Inquiry</option>
                            <option>Custom Sofa Project</option>
                            <option>Fabric & Material Samples</option>
                            <option>Pricing & Quote</option>
                            <option>Book Studio Visit</option>
                            <option>Delivery & Installation</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1.5">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us about your space, preferred sofa model, dimensions, fabric preferences, or any custom requirements..."
                          className="w-full px-4 py-3 rounded-xl bg-[#f5f3ef] border border-[#e7e5e4] text-[#1c1917] text-sm placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1c1917] transition-colors resize-none"
                        />
                      </div>

                      {status === "error" && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-700">{errorMsg}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1c1917] hover:bg-black text-white text-sm font-semibold tracking-wide uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {status === "sending" ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Message</span>
                            </>
                          )}
                        </button>
                        <p className="text-xs text-[#a8a29e] text-center sm:text-left">
                          You&apos;ll receive a confirmation email instantly. We typically reply within 1–2 hours during studio hours.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section className="py-16 bg-[#f5f3ef] border-t border-[#e7e5e4]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10">
              <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">You might also want to</span>
            </div>
            <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { href: "/#collection", label: "Browse Collection", desc: "Explore all 6 Cloud Sofa models" },
                { href: "/#visit", label: "Book Studio Visit", desc: "Reserve private consultation time" },
                { href: "/#custom", label: "Custom Sofa", desc: "Design your bespoke piece" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-6 rounded-2xl bg-white border border-[#e7e5e4] hover:border-[#1c1917] hover:shadow-md transition-all group hover-lift"
                >
                  <h3 className="font-serif text-lg text-[#1c1917] mb-1 group-hover:text-[#9a3412] transition-colors">{item.label}</h3>
                  <p className="text-xs text-[#78716c]">{item.desc}</p>
                  <ArrowRight className="w-4 h-4 text-[#1c1917] mt-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenWhatsApp={(subject) => { setIsWhatsAppOpen(true); }} />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        initialSubject="Contact Inquiry"
      />
    </div>
  );
}
