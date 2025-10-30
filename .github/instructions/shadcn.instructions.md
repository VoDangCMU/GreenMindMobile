---
applyTo: '**'
---
shadcn/ui — LLM Developer Instruction
1. Overview

shadcn/ui is a collection of React components built with Radix UI primitives and TailwindCSS.

It provides an unopinionated, composable design system for both web and Capacitor hybrid mobile apps.

All components are fully customizable using Tailwind classes.

2. Core Dependencies

@radix-ui/react-* → accessibility and primitive logic.

lucide-react → icon set.

tailwindcss → styling utilities.

framer-motion → animations and transitions.

class-variance-authority (cva) → handles variant styling logic.

3. Common Components

Frequently used in hybrid mobile apps:

Layout: Card, Separator, Badge, Skeleton

Input: Button, Input, Label, Switch, Select

Overlay: Popover, Dialog, Sheet, Drawer, Toast, Tooltip

Navigation: Tabs, DropdownMenu

Feedback: Alert, Progress, Avatar

4. Mobile Adaptation (for Capacitor Apps)

Replace Popover with Sheet or Drawer on mobile for native-like UX.

Use Dialog in fullscreen mode when screen width < 768px.

Combine with Capacitor’s Device plugin to detect platform (Android, iOS, Web).

Responsive design handled with Tailwind breakpoints (sm:, md:, lg:).

5. Project Conventions

Components live under /components/ui/[component].tsx

Import style:

import { Button } from "@/components/ui/button"


Each component should export default and accept className for customization.

Global styling defined in globals.css.

6. Good Practices

Avoid nesting overlays (Popover inside Dialog).

Use Sheet with slide-up animation (framer-motion) for bottom sheets.

Keep layouts simple and mobile-first.

Use lucide-react icons only (no inline SVGs).

Always prefer utility classes over inline styles.

7. For LLM / Copilot Context

Copilot or AI assistants should:

Treat shadcn/ui as React + Tailwind component library, not a UI framework like MUI.

Generate code using imports like:

import { Button, Sheet } from "@/components/ui"


Prefer mobile-responsive and accessible markup.

When user asks for “native-like modal” → use Sheet, not Popover.

Respect Tailwind structure, don’t auto-insert inline CSS.