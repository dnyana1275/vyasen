import { useEffect, type PropsWithChildren } from "react";

import { installFocusVisibility } from "@/accessibility/focus-visibility";

export function FocusVisibility({ children }: PropsWithChildren) {
  useEffect(() => installFocusVisibility(document.documentElement), []);

  return children;
}
