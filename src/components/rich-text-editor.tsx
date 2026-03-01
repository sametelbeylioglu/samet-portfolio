"use client";

import { useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const cmd = (c: string, v?: string) => {
    document.execCommand(c, false, v);
    ref.current?.focus();
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1 p-2 border border-[#27272a] rounded-t-md bg-[#18181b]/50">
        <button type="button" onClick={() => cmd("bold")} className="p-1.5 rounded hover:bg-accent font-bold">B</button>
        <button type="button" onClick={() => cmd("italic")} className="p-1.5 rounded hover:bg-accent italic">I</button>
        <button type="button" onClick={() => cmd("underline")} className="p-1.5 rounded hover:bg-accent underline">U</button>
        <span className="w-px bg-border mx-1" />
        <button type="button" onClick={() => cmd("formatBlock", "h2")} className="p-1.5 rounded hover:bg-accent text-xs">H2</button>
        <button type="button" onClick={() => cmd("formatBlock", "h3")} className="p-1.5 rounded hover:bg-accent text-xs">H3</button>
        <button type="button" onClick={() => cmd("formatBlock", "p")} className="p-1.5 rounded hover:bg-accent text-xs">P</button>
        <span className="w-px bg-border mx-1" />
        <button type="button" onClick={() => cmd("insertUnorderedList")} className="p-1.5 rounded hover:bg-accent">•</button>
        <button type="button" onClick={() => cmd("insertOrderedList")} className="p-1.5 rounded hover:bg-accent">1.</button>
        <button type="button" onClick={() => cmd("formatBlock", "blockquote")} className="p-1.5 rounded hover:bg-accent">"</button>
        <span className="w-px bg-border mx-1" />
        <button type="button" onClick={() => cmd("createLink", prompt("Link URL:") || "#")} className="p-1.5 rounded hover:bg-accent text-xs">Link</button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[200px] p-4 border border-t-0 border-[#27272a] rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-[#71717a]"
      />
    </div>
  );
}
