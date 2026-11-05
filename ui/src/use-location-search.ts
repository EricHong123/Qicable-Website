"use client";
import { useSyncExternalStore } from "react";
function subscribeToLocation(notify: () => void) {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
}
export function useLocationSearch() {
  return useSyncExternalStore(
    subscribeToLocation,
    () => window.location.search,
    () => "",
  );
}
