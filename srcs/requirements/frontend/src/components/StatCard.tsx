/*
Example:

<StatCard label="statistics">
    <StatItem label="Rank" value="#42" accent/>
    <StatDivider />
    <StatItem label="Avg WPM" value="98"/>
    <StatDivider />
    <StatItem label="Level" value="13"/>
    <StatDivider />
    <StatItem label="played" value="26"/>
</StatCard>

*/

import { type ReactNode } from "react";
import Container from "./Container";

export interface StatCardProps {
  label?: string;
  children: ReactNode;
}

export function StatCard({ label, children }: StatCardProps) {
  return (
    <Container label={label}>
      <div className="@container"> {/* @container : width instead of viewport */}
        <div className="flex flex-col gap-2 py-1 @[14rem]:flex-row @[14rem]:justify-around @[14rem]:items-center @[14rem]:gap-0">
          {children}
        </div>
      </div>
    </Container>
  );
}

export interface StatItemProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatItem({ label, value, accent = false }: StatItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 @[14rem]:flex-col @[14rem]:items-center @[14rem]:gap-0.5 @[14rem]:min-w-[5rem]">
      <span className="text-dim text-xs uppercase tracking-widest font-mono">
        {label}
      </span>
      <span
        className={`font-mono text-xl font-bold tabular-nums ${
          accent ? "text-accent" : "text-default"}`}>
        {value}
      </span>
    </div>
  );
}

export function StatDivider() {
  return (
    <div className="h-px w-full bg-dim @[14rem]:h-8 @[14rem]:w-px" />
  );
}
