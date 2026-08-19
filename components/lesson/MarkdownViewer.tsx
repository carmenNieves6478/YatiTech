"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface Props {
  content: string;
}

export const MarkdownViewer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none space-y-6 text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-b border-indigo-500/30 pb-3 mt-8 mb-4 flex items-center gap-3">
              <span className="w-2 h-7 bg-indigo-500 rounded-full inline-block"></span>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-300 tracking-tight mt-6 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-400/80 rounded-full inline-block"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base my-3 font-normal">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-slate-300 my-4 pl-2 text-sm sm:text-base">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-slate-300 my-4 pl-2 text-sm sm:text-base">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-indigo-500 bg-indigo-950/40 p-4 rounded-r-2xl shadow-inner text-slate-200 backdrop-blur-sm text-sm sm:text-base italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800/80 text-white font-bold border-b border-slate-700 uppercase tracking-wider text-xs">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-slate-800/60">{children}</tbody>,
          tr: ({ children }) => (
            <tr className="hover:bg-indigo-950/30 transition-colors duration-150">{children}</tr>
          ),
          th: ({ children }) => <th className="px-4 py-3.5 font-bold text-indigo-300">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 font-medium text-slate-300">{children}</td>,
          img: ({ src, alt }) => (
            <figure className="my-6 space-y-2">
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || "Ilustración educativa"}
                  className="w-full max-h-[420px] object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              {alt && (
                <figcaption className="text-center text-xs text-slate-400 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          code: ({ children }) => (
            <code className="text-indigo-300 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded-lg text-xs font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs sm:text-sm font-mono text-indigo-200">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
