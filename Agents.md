Agent Instructions & Project Guidelines

Overview

This document outlines the core technical standards, libraries, and workflow rules that all AI agents and contributors must follow when generating, modifying, or refactoring code in this repository.

1. Core Tech Stack & Libraries

UI Components: shadcn/ui

Primary Component Library: Always prioritize using shadcn/ui components (built on Radix UI and Tailwind CSS) for standard UI elements (buttons, dialogs, forms, tables, cards, dropdowns, etc.).

Installation & Usage: Check components/ui/ before creating custom primitives. If a required shadcn/ui component is missing, instruct the user or run the CLI command (npx shadcn@latest add <component>) rather than building one from scratch.

Styling: Use Tailwind CSS utility classes and adhere strictly to the project's CSS variables (--background, --foreground, --primary, etc.) to maintain theme and dark-mode compatibility.

Data Visualization: Recharts

Charting Library: Use recharts for all graphs, charts, and data visualizations.

Responsiveness: Always wrap charts inside a <ResponsiveContainer width="100%" height={...}> to ensure proper scaling across viewports.

Styling Consistency: Style tooltips, axes, and grid lines using shadcn/ui theme tokens and Tailwind colors so charts blend seamlessly with the rest of the interface.

Animations: Anime.js

Animation Engine: Use animejs for complex, timeline-based, or staggered DOM/SVG animations.

React Integration: Ensure animations are properly scoped and cleaned up within useEffect hooks (or using anime.remove()) to prevent memory leaks or conflicts with React's rendering lifecycle.

Performance: Prefer animating GPU-accelerated properties (transform, opacity) and avoid layout-thrashing properties (width, height, top, left) whenever possible.

2. Extended Instructions & Workflows

Reference the .agents Directory

Mandatory Lookup: Before executing complex tasks, scaffolding new features, or making architectural decisions, you must inspect the .agents/ folder in the root directory.

Rule Precedence: Any specific workflows, prompt templates, coding conventions, or domain-specific rules defined inside .agents/ take precedence over general defaults.

Structure Check: Look for markdown files, schemas, or configuration files within .agents/ (e.g., .agents/workflows/, .agents/rules/, .agents/context.md) and apply their instructions to your current task.

3. Code Quality Checklist

Before finalizing any code output, verify that:

[ ] Standard UI elements use shadcn/ui primitives.

[ ] All charts are implemented via recharts and are responsive.

[ ] Interactive transitions/animations utilize anime.js cleanly.

[ ] All relevant instructions from the .agents/ directory have been read and applied.