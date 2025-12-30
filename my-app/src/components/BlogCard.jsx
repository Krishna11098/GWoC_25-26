"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function BlogCard({ post, index }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 1; // 0-based: even-indexed visually right image

  return (
    <article
      ref={ref}
      className={`rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4 md:p-6 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className={`flex flex-col ${post.image ? 'md:flex-row items-start md:items-center gap-6 md:gap-10' : ''} ${
          post.image && isEven ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Image - only show if exists */}
        {post.image && (
          <div className="w-full md:w-1/2">
            <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title || "Blog image"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className={post.image ? "w-full md:w-1/2" : "w-full"}>
          {post.category && (
            <span className="inline-block rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {post.category}
            </span>
          )}
          {post.title && (
            <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 ${post.category ? 'mt-3' : ''}`}>
              {post.title}
            </h3>
          )}
          <p className={`text-slate-700 ${post.title ? 'mt-2' : ''}`}>
            {post.description}
          </p>
          {post.href && post.href !== "#" && (
            <Link
              href={post.href}
              className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Read the full story
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
