# Project Folder Structure

## Overview

This document describes the recommended folder structure for the project and the rules for distributing logic across layers.

```Bash
src/
├─ core/                 # Engine: Singleton services, configs, and app initialization
│  ├─ components/        # Global layout: Header, Footer, Sidebar
│  ├─ guards/            # Global route guards (e.g., auth.guard.ts)
│  ├─ interceptors/      # HTTP Interceptors (auth, error handling)
│  ├─ services/          # Global stores and API (AuthService, ThemeService)
│  ├─ constants/         # API endpoints, masks, environment settings
│  └─ initializers/      # APP_INITIALIZER logic (loading configs before bootstrap)
├─ pages/                # Routing containers (Smart Components)
│  └─ home/
│     ├─ components/     # Small parts specific only to this page
│     ├─ home.component.ts
│     └─ ...
├─ features/             # Business Logic: Interactive modules
│  └─ auth/              # Example: AuthByEmail, Search, Cart
│     ├─ components/     # Internal feature-specific components
│     ├─ services/       # Feature-specific stores and API logic
│     └─ models/         # Interfaces and types for the feature
├─ shared/               # Reusable Resources: "Dumb" components and utils
│  ├─ ui/                # UI-kit (wrappers for Angular Material, etc.)
│  ├─ pipes/             # Common pipes (date-format, currency)
│  ├─ directives/        # Common directives
│  └─ services/          # Helpers, validators, common API clients
├─ assets/               # Static assets
│  ├─ styles/             # Global styles, themes, variables
│  ├─ images/             # Images, icons, illustrations
│  ├─ favicon/            # Favicon files
│  └─ localize/           # Localization files (i18n, translations)
└─ app/                  # Root module and routing configuration
```

---

# Logic Distribution Rules

## Where Should the Store (State) Live?

### Global State

If the data is required across the entire application (e.g., user profile, current theme, localization settings), it must be placed in: `core/services`

### Local State

If the store belongs to a specific business scenario (e.g., shopping cart, registration form, search filters), it must be placed in: `features/[feature-name]/services`

---

# Nesting and Shared vs Features

### Nesting

If a page (e.g., `home`) has small parts not used elsewhere, use `pages/home/components`. Rule: Avoid nesting deeper than 2-3 levels. If a component becomes too complex, move parts to `shared` or `features`.

### Shared Layer

Contains "dumb" (stateless) components. They are agnostic of business logic and only receive data via inputs.

### Features Layer

Contains logic that "does something" (API calls, state mutations, specific business scenarios).

---

# Main Rules

- If a service or configuration is needed globally and initialized once → **core**
- If it is a reusable utility function (e.g., date formatting, percentage calculation) → **shared**
- If it belongs to a specific business scenario → **features**
