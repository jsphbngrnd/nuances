"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { MODE_ORDER } from "@/lib/modes";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ModeCard } from "@/components/mode-card";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "M14.5 5.75 8.25 12l6.25 6.25" : "M9.5 5.75 15.75 12 9.5 18.25"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ModeCarousel({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartScrollLeftRef = useRef<number>(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  function getNearestIndex(node: HTMLDivElement) {
    const cards = Array.from(
      node.querySelectorAll<HTMLElement>("[data-carousel-card]")
    );

    if (!cards.length) return 0;

    const viewportCenter = node.scrollLeft + node.clientWidth / 2;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  useEffect(() => {
    const currentNode = trackRef.current;
    if (!currentNode) return;

    function updateActiveIndex() {
      const node = trackRef.current;
      if (!node) return;
      setActiveIndex(getNearestIndex(node));
    }

    updateActiveIndex();
    currentNode.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      currentNode.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, []);

  function scrollToIndex(index: number) {
    const node = trackRef.current;
    if (!node) return;

    const cards = Array.from(
      node.querySelectorAll<HTMLElement>("[data-carousel-card]")
    );
    const target = cards[index];
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActiveIndex(index);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const node = trackRef.current;
    if (!node) return;

    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = node.scrollLeft;
    dragPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const node = trackRef.current;
    if (
      !node ||
      dragStartXRef.current === null ||
      dragPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const delta = event.clientX - dragStartXRef.current;
    node.scrollLeft = dragStartScrollLeftRef.current - delta;
    const clamped = Math.max(-42, Math.min(42, delta));
    setDragOffset(clamped);
  }

  function endDrag(pointerId?: number, currentTarget?: HTMLDivElement) {
    const node = trackRef.current;
    if (
      pointerId !== undefined &&
      dragPointerIdRef.current !== null &&
      dragPointerIdRef.current !== pointerId
    ) {
      return;
    }

    if (pointerId !== undefined && currentTarget?.hasPointerCapture(pointerId)) {
      currentTarget.releasePointerCapture(pointerId);
    }

    if (node) {
      setActiveIndex(getNearestIndex(node));
    }

    dragStartXRef.current = null;
    dragStartScrollLeftRef.current = 0;
    dragPointerIdRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }

  const prevDisabled = activeIndex === 0;
  const nextDisabled = activeIndex === MODE_ORDER.length - 1;

  return (
    <div className="mode-carousel-shell">
      <div className="mode-carousel-header">
        <div className="mode-carousel-meta">
          <span className="eyebrow">
            {locale === "fr" ? "Swipe through the modes" : "Swipe through the modes"}
          </span>
        </div>
        <div className="mode-carousel-controls">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={prevDisabled}
            className="mode-carousel-button"
            aria-label={locale === "fr" ? "Mode précédent" : "Previous mode"}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() =>
              scrollToIndex(Math.min(MODE_ORDER.length - 1, activeIndex + 1))
            }
            disabled={nextDisabled}
            className="mode-carousel-button"
            aria-label={locale === "fr" ? "Mode suivant" : "Next mode"}
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div className="mode-carousel-rail">
        <div
          ref={trackRef}
          className={cn("mode-carousel-track", isDragging && "mode-carousel-track-dragging")}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => endDrag(event.pointerId, event.currentTarget)}
          onPointerCancel={(event) => endDrag(event.pointerId, event.currentTarget)}
          onPointerLeave={(event) => endDrag(event.pointerId, event.currentTarget)}
        >
          {MODE_ORDER.map((mode, index) => (
            <div
              key={mode}
              data-carousel-card
              className={cn(
                "mode-carousel-card",
                index === activeIndex && "mode-carousel-card-active"
              )}
              style={
                index === activeIndex
                  ? ({
                      ["--mode-card-drag-x" as string]: `${dragOffset * 0.24}px`,
                      ["--mode-card-drag-rotate" as string]: `${dragOffset * 0.12}deg`,
                    } as CSSProperties)
                  : undefined
              }
            >
              <ModeCard mode={mode} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      <div className="mode-carousel-dots" aria-hidden="true">
        {MODE_ORDER.map((mode, index) => (
          <button
            key={mode}
            type="button"
            onClick={() => scrollToIndex(index)}
            className={cn(
              "mode-carousel-dot",
              index === activeIndex && "mode-carousel-dot-active"
            )}
            aria-label={
              locale === "fr"
                ? `Aller au mode ${index + 1}`
                : `Go to mode ${index + 1}`
            }
          />
        ))}
      </div>
    </div>
  );
}
