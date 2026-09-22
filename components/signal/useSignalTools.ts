"use client";
import { useEffect, useRef } from "react";
import type { Progress } from "@/lib/signal-progress";

type Tool = {
  name: string; title: string; description: string; inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): Progress | Promise<Progress | null>;
};
type ToolDocument = Document & { modelContext?: {
  registerTool(tool: Tool, options: { signal: AbortSignal }): void | Promise<void>;
} };

function validateEmptyInput(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length !== 0) {
    throw new Error("Expected an empty object with no properties.");
  }
}

/** Optional browser-native agent interface; ordinary browsers need no polyfill. */
export function useSignalTools(progress: Progress, onSendSignal: () => Promise<Progress | null>) {
  const latest = useRef({ progress, onSendSignal });
  useEffect(() => { latest.current = { progress, onSendSignal }; });
  useEffect(() => {
    const context = (document as ToolDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const schema = { type: "object", properties: {}, additionalProperties: false };
    const tools: Tool[] = [{
      name: "get_signal_intro_progress", title: "Read Signal intro progress",
      description: "Read saved XP and completed homepage intro modules. Does not award XP.",
      inputSchema: schema, annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) { validateEmptyInput(input); return { ...latest.current.progress }; },
    }, {
      name: "send_signal_intro", title: "Send an introductory signal",
      description: "Activate the hero's network illustration. The first signal saves 10 XP for a signed-in explorer; repeat signals award no extra XP. Does not complete a module.",
      inputSchema: schema, annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        validateEmptyInput(input);
        return latest.current.onSendSignal();
      },
    }];
    for (const tool of tools) {
      try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); }
      catch { /* This optional capability never blocks the visible interface. */ }
    }
    return () => lifecycle.abort();
  }, []);
}
