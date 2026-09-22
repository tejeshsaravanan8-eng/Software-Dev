"use client";
import { useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";

/** Apply the name and unit to the focusable Radix thumb as well as its wrapper. */
export function LabeledSlider({ labelId, value, min, max, step = 1, unit = '', onChange }: { labelId: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const thumb = root.current?.querySelector('[role="slider"]');
    thumb?.setAttribute('aria-labelledby', labelId);
    thumb?.setAttribute('aria-valuetext', `${value}${unit ? ' ' + unit : ''}`);
  }, [labelId, unit, value]);
  return <div ref={root}><Slider value={[value]} min={min} max={max} step={step} onValueChange={values => onChange(values[0])} /></div>;
}
