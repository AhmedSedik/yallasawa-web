"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ReleaseInfo } from "./github";

const ReleaseContext = createContext<ReleaseInfo>({
  version: "",
  downloadUrl: "#",
});

export function ReleaseProvider({ release, children }: { release: ReleaseInfo; children: ReactNode }) {
  return <ReleaseContext value={release}>{children}</ReleaseContext>;
}

export function useRelease() {
  return useContext(ReleaseContext);
}
