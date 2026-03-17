# Complete Design System
*LegacyGuard Product Design — Generated 2026-03-17*

---

LegacyGuard Design System: Trust, Clarity, Control

## 1. Design Philosophy

LegacyGuard's design philosophy centers on **professionalism and unwavering trustworthiness**, employing a minimalist aesthetic enriched with warm accents to convey security and value. We prioritize **crystal-clear communication and intuitive control** over complex financial concepts, ensuring every interaction feels secure, simple, and empowering for users managing their digital legacy. Our visual language is sophisticated and understated, deliberately avoiding fleeting crypto trends to build enduring confidence.

## 2. Color System

### Primary Colors
*   **Primary: Deep Navy** (`--color-primary-500`, `#1a2332`) — Trust, stability, foundation.
*   **Primary Light:** (`--color-primary-400`, `#2a3a4f`) — Subtle variations, hover states.
*   **Accent: Warm Gold** (`--color-accent-500`, `#c9a84c`) — Value, legacy, key actions, highlights.
*   **Accent Light:** (`--color-accent-400`, `#e8d49a`) — Lighter accent for backgrounds or secondary elements.

### Semantic Colors
*   **Success:** (`--color-success-500`, `#22c55e`) — Confirmations, positive feedback, active status.
*   **Warning:** (`--color-warning-500`, `#f59e0b`) — Caution, pending actions, non-critical alerts.
*   **Error:** (`--color-error-500`, `#ef4444`) — Critical alerts, invalid inputs, destructive actions.
*   **Info:** (`--color-info-500`, `#3b82f6`) — Informational messages, helpful tips.

### Neutral Scale
*   **Background:** (`--color-neutral-50`, `#f8fafc`) — Main page background, clean canvas.
*   **Surface:** (`--color-neutral-100`, `#ffffff`) — Cards, modals, primary content areas.
*   **Border:** (`--color-neutral-200`, `#e2e8f0`) — Dividers, input borders, subtle separation.
*   **Text Primary:** (`--color-neutral-900`, `#0f172a`) — Headings, main body text, high contrast.
*   **Text Secondary:** (`--color-neutral-700`, `#64748b`) — Secondary information, labels, descriptions.
*   **Text Muted:** (`--color-neutral-500`, `#94a3b8`) — Placeholders, disabled states, subtle hints.

### Security Status Colors
*   **Secure:** (`--color-security-secure`, `#22c55e`) — Optimal security, all checks passed.
*   **Attention:** (`--color-security-attention`, `#f59e0b`) — Minor security concerns, recommended action.
*   **Critical:** (`--color-security-critical`, `#ef4444`) — Major security vulnerability, immediate action required.
*   **Inactive:** (`--color-security-inactive`, `#94a3b8`) — Feature not active, pending setup.

**Figma Implementation:** Create a "Colors" page with local styles for each color, grouped by category.
**React/Next.js Implementation:** Define CSS variables (e.g., `--color-primary-500: #1a2332;`) in a global stylesheet or theme provider. Use these variables in styled components or Tailwind CSS config.

## 3. Typography

**Font Family:**
*   **UI & Headings:** Inter (sans-serif)
*   **Code & Addresses:** JetBrains Mono (monospace)

**Scale:**
*   **H1:** (`--font-h1`) 32px / 700 (Bold), Line Height: 1.2, Letter Spacing: -0.02em
*   **H2:** (`--font-h2`) 24px / 600 (SemiBold), Line Height: 1.3, Letter Spacing: -0.01em
*   **H3:** (`--font-h3`) 20px / 600 (SemiBold), Line Height: 1.4, Letter Spacing: 0em
*   **H4:** (`--font-h4`) 16px / 600 (SemiBold), Line Height: 1.5, Letter Spacing: 0em
*   **Body:** (`--font-body`) 16px / 400 (Regular), Line Height: 1.6, Letter Spacing: 0em
*   **Body Small:** (`--font-body-sm`) 14px / 400 (Regular), Line Height: 1.5, Letter Spacing: 0em
*   **Caption:** (`--font-caption`) 12px / 400 (Regular), Line Height: 1.4, Letter Spacing: 0.01em
*   **Code/Address:** (`--font-code`) 14px / 400 (Regular), Line Height: 1.5, Letter Spacing: 0.02em (JetBrains Mono)

**Figma Implementation:** Create text styles for each scale item, linking to Inter and JetBrains Mono fonts.
**React/Next.js Implementation:** Import Inter and JetBrains Mono from Google Fonts or self-host. Define CSS classes or styled component variants for each typography style.

## 4. Spacing System

**Base Unit:** 4px

**Scale (Multiples of 4):**
*   `--spacing-xs`: 4px
*   `--spacing-sm`: 8px
*   `--spacing-md`: 12px
*   `--spacing-lg`: 16px
*   `--spacing-xl`: 24px
*   `--spacing-2xl`: 32px
*   `--spacing-3xl`: 48px
*   `--spacing-4xl`: 64px
*   `--spacing-5xl`: 96px

**Component Padding:**
*   **Cards:** `--padding-card`: 16px (`--spacing-lg`)
*   **Sections:** `--padding-section`: 24px (`--spacing-xl`)
*   **Pages:** `--padding-page`: 32px (`--spacing-2xl`)

**Figma Implementation:** Define spacing tokens using numbers (4, 8, 12, etc.) and apply them to auto-layout frames.
**React/Next.js Implementation:** Define CSS variables (e.g., `--spacing-lg: 16px;`) and use them with `padding`, `margin`, `gap` properties. Integrate with Tailwind CSS config for utility classes.

## 5. Border Radius

*   **Small:** (`--radius-sm`, 6px) — Buttons, input fields, badges.
*   **Medium:** (`--radius-md`, 12px) — Cards, larger interactive elements.
*   **Large:** (`--radius-lg`, 16px) — Modals, major content blocks.
*   **Full:** (`--radius-full`, 999px) — Avatars, pills, circular elements.

**Figma Implementation:** Create radius styles.
**React/Next.js Implementation:** Define CSS variables (e.g., `--radius-md: 12px;`) and apply to components.

## 6. Shadow System

*   **sm:** (`--shadow-sm`) `0 1px 2px rgba(0,0,0,0.05)` — Subtle lift for interactive elements.
*   **md:** (`--shadow-md`) `0 4px 6px rgba(0,0,0,0.07)` — Default card shadow, slight elevation.
*   **lg:** (`--shadow-lg`) `0 10px 15px rgba(0,0,0,0.1)` — Modals, dropdowns, significant elevation.
*   **xl:** (`--shadow-xl`) `0 20px 25px rgba(0,0,0,0.15)` — Hero elements, floating action buttons.

**Figma Implementation:** Create effect styles.
**React/Next.js Implementation:** Define CSS variables (e.g., `--shadow-md: 0 4px 6px rgba(0,0,0,0.07);`) and apply to components.

## 7. Iconography

**Icon Set:** Lucide Icons (open source, highly customizable, consistent style).

**Key Icons:**
*   **Security:** `ShieldCheck`, `Lock`, `Key`, `Eye`, `Fingerprint`, `Vault`, `ServerCog`
*   **Inheritance:** `Users`, `Heart`, `FileCheck`, `Clock`, `Bell`, `Gift`, `ScrollText`
*   **General UI:** `ChevronRight`, `ArrowLeft`, `Plus`, `X`, `Settings`, `User`, `Wallet`, `Info`, `AlertTriangle`, `CheckCircle`

**Sizes:**
*   **Inline:** 16px (`--icon-size-sm`) — Within text, small buttons.
*   **Buttons:** 20px (`--icon-size-md`) — Primary buttons, form elements.
*   **Navigation:** 24px (`--icon-size-lg`) — Sidebar, bottom tabs, larger UI elements.
*   **Features:** 32px (`--icon-size-xl`) — Feature highlights, empty states, hero sections.

**Figma Implementation:** Import Lucide Icons as components, create variants for sizes.
**React/Next.js Implementation:** Use `lucide-react` package. Create a wrapper `Icon` component that accepts `name` and `size` props, mapping to Lucide components.

```jsx
// Example Icon component
import dynamic from 'next/dynamic';

const icons = {
  ShieldCheck: dynamic(() => import('lucide-react').then((mod) => mod.ShieldCheck)),
  Lock: dynamic(() => import('lucide-react').then((mod) => mod.Lock)),
  // ... other icons
};

export function Icon({ name, size = 24, className }) {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
}
```

## 8. Component Library

### Buttons
**Purpose:** Initiate actions, navigate.
**Variants:**
*   **Primary:** (`variant="primary"`) Solid background (`--color-accent-500`), white text. For main actions.
*   **Secondary:** (`variant="secondary"`) Outline (`--color-border`), primary text (`--color-primary-500`). For less prominent actions.
*   **Ghost:** (`variant="ghost"`) Transparent background, primary text (`--color-primary-500`). For subtle actions, text links.
*   **Danger:** (`variant="danger"`) Solid background (`--color-error-500`), white text. For destructive actions.

**States:**
*   **Default:** Normal appearance.
*   **Hover:** Slight background tint, subtle shadow (`--shadow-sm`).
*   **Active:** Slightly darker background, subtle scale (0.98).
*   **Disabled:** Opacity 50%, no interaction.
*   **Loading:** Spinner icon replaces text, disabled state.

**Sizes:**
*   **sm:** (`size="sm"`) Height 32px, `--font-body-sm`, `--radius-sm`.
*   **md:** (`size="md"`) Height 40px, `--font-body`, `--radius-sm`.
*   **lg:** (`size="lg"`) Height 48px, `--font-body`, `--radius-sm`.

**Figma Implementation:** Create a `Button` component with variants for `variant`, `state`, `size`, and `icon` slots.
**React/Next.js Implementation:** `Button` component with `variant`, `size`, `isLoading`, `isDisabled`, `onClick` props.

```jsx
// components/Button.jsx
import { cva } from 'class-variance-authority';
import { Spinner } from './Spinner'; // A simple spinner component

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500",
  {
    variants: {
      variant: {
        primary: "bg-accent-500 text-white hover:bg-accent-400 active:bg-accent-600",
        secondary: "border border-border text-primary-500 hover:bg-neutral-50 active:bg-neutral-100",
        ghost: "text-primary-500 hover:bg-neutral-50 active:bg-neutral-100",
        danger: "bg-error-500 text-white hover:bg-error-400 active:bg-error-600",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-sm", // 32px height
        md: "h-10 px-4 text-base rounded-sm", // 40px height
        lg: "h-12 px-5 text-base rounded-sm", // 48px height
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({ children, variant, size, isLoading, isDisabled, ...props }) {
  return (
    <button
      className={buttonVariants({ variant, size, isDisabled: isDisabled || isLoading })}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
      {children}
    </button>
  );
}
```

### Cards
**Purpose:** Group related information, provide clear boundaries.
**Base Card:** (`Card` component) `bg-surface`, `rounded-md`, `shadow-md`, `p-lg`.

*   **Vault Card:** (`Card variant="vault"`)
    *   **Content:** Vault name (H3), status indicator, asset summary (e.g., "3 Assets"), last activity timestamp.
    *   **Actions:** View details button, quick actions (e.g., "Edit").
    *   **Props:** `vaultName`, `status`, `assetCount`, `lastActivity`, `onViewDetails`, `onEdit`.
*   **Heir Card:** (`Card variant="heir"`)
    *   **Content:** Avatar (or initial), heir name (H4), relationship (e.g., "Spouse"), status (e.g., "Active", "Claim Pending").
    *   **Actions:** View profile button.
    *   **Props:** `heirName`, `relationship`, `status`, `avatarUrl`, `onViewProfile`.
*   **Alert Card:** (`Card variant="alert" severity="warning"`)
    *   **Content:** Icon (based on severity), message (Body), optional detailed description.
    *   **Actions:** Primary button (e.g., "Resolve"), secondary button (e.g., "Dismiss").
    *   **Props:** `severity` (success, warning, error, info), `title`, `message`, `actionLabel`, `onAction`, `onDismiss`.
*   **Metric Card:** (`Card variant="metric"`)
    *   **Content:** Label (Caption), Value (H2), optional trend indicator (e.g., `+5%` with up arrow).
    *   **Purpose:** Display key performance indicators or summary data.
    *   **Props:** `label`, `value`, `trend` (optional), `trendType` (up, down, neutral).

**Figma Implementation:** Create a base `Card` component, then create specific variants (Vault, Heir, Alert, Metric) as nested components with appropriate slots.
**React/Next.js Implementation:** `Card` component with `variant` prop and slots for content.

```jsx
// components/Card.jsx
import { cva } from 'class-variance-authority';

const cardVariants = cva(
  "bg-surface rounded-md shadow-md p-lg",
  {
    variants: {
      variant: {
        default: "",
        vault: "border-l-4 border-accent-500", // Visual distinction for vaults
        heir: "flex items-center gap-md",
        alert: "flex items-start gap-md",
        metric: "text-center",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Card({ children, variant, className, ...props }) {
  return (
    <div className={cardVariants({ variant, className })} {...props}>
      {children}
    </div>
  );
}

// Example VaultCard usage
export function VaultCard({ vaultName, status, assetCount, lastActivity, onViewDetails }) {
  return (
    <Card variant="vault">
      <h3 className="text-h3">{vaultName}</h3>
      <StatusIndicator type="plan" status={status} />
      <p className="text-body-sm text-text-secondary">{assetCount} Assets</p>
      <p className="text-caption text-text-muted">Last activity: {lastActivity}</p>
      <Button size="sm" variant="secondary" onClick={onViewDetails}>View Details</Button>
    </Card>
  );
}
```

### Status Indicators
**Purpose:** Visually communicate the state of an item or system.

*   **Security Score Badge:** (`SecurityScoreBadge`)
    *   **Content:** Numeric score (0-100), color-coded background based on score range.
    *   **Colors:** Secure (80-100, `--color-security-secure`), Attention (50-79, `--color-security-attention`), Critical (0-49, `--color-security-critical`).
    *   **Props:** `score` (number).
*   **Plan Status:** (`StatusIndicator type="plan" status="Active"`)
    *   **Content:** Text label (e.g., "Active", "Pending", "Triggered", "Expired").
    *   **Colors:** Active (`--color-success-500`), Pending (`--color-warning-500`), Triggered (`--color-error-500`), Expired (`--color-security-inactive`).
    *   **Props:** `status` (string).
*   **Check-in Status:** (`StatusIndicator type="checkin" status="On time"`)
    *   **Content:** Text label (e.g., "On time", "Due soon", "Overdue").
    *   **Colors:** On time (`--color-success-500`), Due soon (`--color-warning-500`), Overdue (`--color-error-500`).
    *   **Props:** `status` (string).

**Figma Implementation:** Create a `Badge` component with `type` and `status` variants, and a separate `SecurityScoreBadge` component.
**React/Next.js Implementation:** `Badge` or `StatusIndicator` component with `type` and `status` props, using color mapping logic.

### Form Elements
**Purpose:** Collect user input securely and clearly.

*   **Text Inputs:** (`Input type="text"`)
    *   **States:** Default, Focus (accent ring), Error (red border), Disabled.
    *   **Props:** `label`, `placeholder`, `value`, `onChange`, `error`, `disabled`.
*   **Dropdowns:** (`Select`)
    *   **States:** Default, Open, Disabled.
    *   **Props:** `label`, `options`, `value`, `onChange`.
*   **Toggles:** (`Toggle`)
    *   **States:** Off, On, Disabled.
    *   **Props:** `label`, `checked`, `onChange`.
*   **Sliders:** (`Slider`)
    *   **Purpose:** Select a value from a range (e.g., share percentage).
    *   **Props:** `label`, `min`, `max`, `step`, `value`, `onChange`.
*   **Crypto Address Input:** (`CryptoAddressInput`)
    *   **Features:** Real-time validation (checksum, format), ENS resolution with visual indicator, copy button.
    *   **States:** Valid, Invalid, Resolving ENS.
    *   **Props:** `label`, `value`, `onChange`, `onResolveENS`, `error`.
*   **Duration Selector:** (`DurationSelector`)
    *   **Purpose:** Select time periods (e.g., "3 months", "1 year") for trigger timing.
    *   **Features:** Dropdown for common periods, or custom input for specific days/months/years.
    *   **Props:** `label`, `value` (e.g., `{ amount: 3, unit: 'months' }`), `onChange`.

**Figma Implementation:** Create components for each form element with states and variants.
**React/Next.js Implementation:** Dedicated components for each, using `useState` for internal state and `props` for external control. Integrate with form libraries like React Hook Form.

```jsx
// components/CryptoAddressInput.jsx
import { useState } from 'react';
import { Input } from './Input'; // Base input component
import { Icon } from './Icon';

export function CryptoAddressInput({ label, value, onChange, onResolveENS, error, ...props }) {
  const [ensName, setEnsName] = useState(null);
  const [isResolving, setIsResolving] = useState(false);

  const handleBlur = async (e) => {
    if (onResolveENS && value) {
      setIsResolving(true);
      try {
        const resolved = await onResolveENS(value);
        setEnsName(resolved);
      } catch (err) {
        setEnsName(null); // Clear ENS if resolution fails
      } finally {
        setIsResolving(false);
      }
    }
  };

  return (
    <div>
      <Input
        label={label}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        error={error}
        placeholder="0x..."
        {...props}
      />
      {isResolving && <p className="text-caption text-info-500 flex items-center"><Spinner className="w-3 h-3 mr-1" /> Resolving ENS...</p>}
      {ensName && !isResolving && (
        <p className="text-caption text-text-secondary flex items-center">
          <Icon name="CheckCircle" size={12} className="mr-1 text-success-500" /> Resolved to: {ensName}
        </p>
      )}
      {error && <p className="text-caption text-error-500">{error}</p>}
    </div>
  );
}
```

### Modals & Dialogs
**Purpose:** Capture user attention for critical information or actions.
**Base Modal:** (`Modal` component) Full-screen overlay, `bg-surface` content, `rounded-lg`, `shadow-xl`, `p-2xl`. Close button (`X` icon) in top right.

*   **Confirmation Modal:** (`Modal variant="confirm"`)
    *   **Content:** Title (H2), descriptive message (Body), input field for typed phrase (e.g., "CONFIRM").
    *   **Actions:** Primary button (disabled until phrase matches), Secondary button (Cancel).
    *   **Props:** `title`, `message`, `confirmPhrase`, `onConfirm`, `onCancel`.
*   **Security Verification Modal:** (`Modal variant="security"`)
    *   **Content:** Title, instructions, input for 2FA code, biometric prompt, or hardware wallet connection.
    *   **Actions:** Verify button, Cancel.
    *   **Props:** `title`, `instructions`, `verificationType` (e.g., '2FA', 'biometric', 'hardware'), `onVerify`, `onCancel`.
*   **Success Celebration Modal:** (`Modal variant="success"`)
    *   **Content:** Animated checkmark (Lottie), celebratory message (H2), optional next steps.
    *   **Actions:** Primary button (e.g., "Go to Dashboard").
    *   **Props:** `title`, `message`, `actionLabel`, `onAction`.

**Figma Implementation:** Create a `Modal` component with variants for `type` and slots for content/actions.
**React/Next.js Implementation:** `Modal` component using a portal for rendering, with `isOpen`, `onClose` props, and children for content.

### Navigation
**Purpose:** Guide users through the application structure.

*   **Sidebar (Desktop):** (`Sidebar`)
    *   **Structure:** Logo, main navigation links (Icon + Label), secondary links (e.g., Settings, Help), user profile/wallet status.
    *   **States:** Active link highlighted (`--color-accent-500` border/text).
    *   **Props:** `navItems`, `secondaryNavItems`, `userProfile`.
*   **Bottom Tabs (Mobile):** (`BottomTabs`)
    *   **Structure:** Fixed at bottom, 3-5 primary navigation icons with labels.
    *   **States:** Active tab highlighted.
    *   **Props:** `navItems`.
*   **Breadcrumbs:** (`Breadcrumbs`)
    *   **Purpose:** Show current location in a multi-step flow or hierarchical structure.
    *   **Structure:** `Home > Section > Current Page`.
    *   **Props:** `path` (array of `{ label, href }`).

**Figma Implementation:** Create `Sidebar`, `BottomTabs`, `Breadcrumbs` components with nested navigation items.
**React/Next.js Implementation:** Dedicated components, using `next/link` for navigation.

## 9. Layout Grid

**Desktop:**
*   **Columns:** 12
*   **Max-width:** 1280px (centered)
*   **Gutter:** 24px (`--spacing-xl`)
*   **Margin:** 32px (`--spacing-2xl`) on either side of max-width content.

**Tablet:**
*   **Columns:** 8
*   **Max-width:** 768px
*   **Gutter:** 16px (`--spacing-lg`)
*   **Margin:** 24px (`--spacing-xl`)

**Mobile:**
*   **Columns:** 4
*   **Max-width:** 375px
*   **Gutter:** 16px (`--spacing-lg`)
*   **Margin:** 16px (`--spacing-lg`)

**Figma Implementation:** Set up layout grids for different artboard sizes.
**React/Next.js Implementation:** Use CSS Grid or Flexbox with media queries. Integrate with a framework like Tailwind CSS for responsive utility classes.

## 10. Animation Rules

*   **Transitions:**
    *   **Micro-interactions:** 150ms ease-out (buttons, toggles, hover states).
    *   **Layout/Component changes:** 300ms ease-in-out (modal open/close, sidebar expand/collapse).
*   **Loading:**
    *   **Strategy:** Skeleton screens for content loading, not spinners. Spinners only for button actions.
    *   **Skeleton:** Subtle pulse animation (`background-position` or `opacity`).
*   **Success:**
    *   **Animation:** Subtle checkmark animation (Lottie) in success modals or inline.
*   **Security:**
    *   **Verification:** Shield pulse animation for security verification modals (e.g., 2FA prompt).
*   **Avoid:** Bouncing, flashing, aggressive, or distracting animations. Animations should be functional and subtle.

**Figma Implementation:** Document animation durations and easing curves. Use Lottie files for complex animations.
**React/Next.js Implementation:** Use CSS `transition` properties. Integrate `react-lottie` or similar for Lottie animations. Implement skeleton loaders using CSS or a library.

## 11. Interaction Feedback

*   **Click:** Subtle scale (0.98) and a slight shadow change for interactive elements (buttons, cards).
*   **Hover:** Background tint (lighter for light backgrounds, darker for dark backgrounds) and `cursor: pointer` for clickable elements.
*   **Focus:** 2px ring in `--color-accent-500` around focused interactive elements for keyboard navigation.
*   **Success:** Green checkmark icon, brief success message (toast), and subtle haptic feedback (mobile).
*   **Error:** Red shake animation on input fields, clear error message below the field, and a red border.

**Figma Implementation:** Document interaction states for all interactive components.
**React/Next.js Implementation:** Implement CSS pseudo-classes (`:hover`, `:active`, `:focus`) and JavaScript event handlers. Use a toast notification library for messages. Integrate with browser APIs for haptic feedback.

## 12. Accessibility

*   **WCAG 2.1 AA Compliance:** All designs and implementations must adhere to WCAG 2.1 AA standards.
*   **Minimum Contrast Ratios:** Ensure text and interactive elements meet minimum contrast ratios (4.5:1 for small text, 3:1 for large text/UI components).
*   **Keyboard Navigation:** All interactive elements and workflows must be fully navigable and operable via keyboard (`Tab`, `Enter`, `Space`, arrow keys). Focus states are critical.
*   **Screen Reader Labels:** Provide descriptive `aria-label` or `aria-labelledby` attributes for all interactive elements, icons, and complex UI components, especially for security-sensitive workflows.
*   **Semantic HTML:** Use appropriate HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<button>`, `<input>`) to convey structure and meaning.
*   **Form Validation:** Provide clear, accessible error messages for form validation.
*   **Responsive Design:** Ensure the application is usable and accessible across various screen sizes and devices.

**Figma Implementation:** Use accessibility plugins for contrast checking. Document `aria-label` requirements in component descriptions.
**React/Next.js Implementation:** Leverage libraries like `react-aria` or `headlessui` for accessible component primitives. Conduct regular accessibility audits using tools like Lighthouse or Axe.