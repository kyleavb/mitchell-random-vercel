"use client";

import { useState } from "react";
import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import { FaqSectionData } from "@/lib/types";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-outline-variant/30">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 px-0 bg-transparent border-none cursor-pointer text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-headline font-bold text-on-surface text-base">
          {question}
        </span>
        <span
          className={`shrink-0 text-secondary text-xl leading-none transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className="text-on-surface-variant leading-[1.7] pb-5 max-w-[80ch]"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({
  kicker,
  heading,
  items,
}: Omit<FaqSectionData, "type">) {
  return (
    <section className="bg-white py-32 max-md:py-16">
      <Container>
        <div className="max-w-[800px] mx-auto">
          {kicker && <Kicker>{kicker}</Kicker>}
          <h2 className="text-on-surface mb-8">{heading}</h2>
          <div className="border-t border-outline-variant/30">
            {items.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
