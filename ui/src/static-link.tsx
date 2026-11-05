"use client";
import type { ComponentProps } from "react";
/** Native releases are static files: navigation must not request an RSC server. */
export default function StaticLink({ prefetch, ...props }: ComponentProps<"a"> & { prefetch?: boolean }) {
  void prefetch;
  return <a {...props}/>;
}
