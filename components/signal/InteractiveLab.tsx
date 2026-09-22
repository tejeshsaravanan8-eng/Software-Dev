"use client";
import { Binary, MessageSquareText, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ModuleId } from "@/lib/signal-progress";
import { FundamentalsActivity } from "./FundamentalsActivity";
import { ToolsActivity } from "./ToolsActivity";
import { EthicsActivity } from "./EthicsActivity";
import { SaveStatus } from "./ProgressProvider";

export function InteractiveLab({ active, onChange }: { active: ModuleId; onChange: (id: ModuleId) => void }) {
  return <section id="lab" tabIndex={-1} className="lab-section" data-active={active} aria-labelledby="interactive-heading">
    <div className="page-width">
      <div className="section-heading"><div><p className="section-kicker">02 — YOUR AI WORKBENCH</p><h2 id="interactive-heading">A little less theory.<br /><em>A little more doing.</em></h2></div><p>Change an input. Build a better prompt. Make a judgment call. Finish an intro here to earn its badge and 40 XP.</p></div>
      <Tabs value={active} onValueChange={id => onChange(id as ModuleId)} className="learning-tabs">
        <TabsList aria-label="Choose an AI intro activity" className="learning-tab-list">
          <TabsTrigger value="fundamentals" id="ai-fundamentals"><Binary aria-hidden="true" /><span>01 <span className="tab-long-label">AI </span>Fundamentals</span></TabsTrigger>
          <TabsTrigger value="tools" id="ai-tools"><MessageSquareText aria-hidden="true" /><span>02 <span className="tab-long-label">AI </span>Tools</span></TabsTrigger>
          <TabsTrigger value="ethics" id="ai-ethics"><ShieldCheck aria-hidden="true" /><span>03 <span className="tab-long-label">AI </span>Ethics</span></TabsTrigger>
        </TabsList>
        {/* Keep each activity mounted so changing tabs preserves unfinished work. */}
        <TabsContent value="fundamentals" forceMount className="learning-tab-panel"><FundamentalsActivity /></TabsContent>
        <TabsContent value="tools" forceMount className="learning-tab-panel"><ToolsActivity /></TabsContent>
        <TabsContent value="ethics" forceMount className="learning-tab-panel"><EthicsActivity /></TabsContent>
      </Tabs>
      <SaveStatus />
    </div>
  </section>;
}
