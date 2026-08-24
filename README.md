# 🛒 E-Commerce Cart Recovery Dashboard

A modern, fast, and responsive management dashboard built with **React**, **Vite**, **Tailwind CSS v4**, and **Shadcn UI**. Integrates seamlessly with **Supabase Auth** and a custom **FastAPI** backend to manage dynamic automated abandoned cart rules.

---

## ✨ Features

- 🔐 **Authentication**: Built-in login with Supabase Auth (Email / Password).
- ⚙️ **Rule Management**: Interactive configuration for abandoned cart automation:
  - Global bot toggle (`is_active`).
  - Store identifier (`tenant_id`) supporting Shopify domains or Tiendanube IDs.
  - Interactive Sliders for max general discounts and new customer incentives.
  - Custom actions for low-margin items.
  - Custom thresholds for whale customers and grace periods.
- 🎨 **Modern UI/UX**: Ultra-clean interface styled with Tailwind CSS v4, Geist Font, and Shadcn UI components.
- 📱 **Fully Responsive**: Built for all screen sizes from mobile to desktop.

---

## 🚀 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Authentication**: [Supabase JS Client](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18.x or higher)
- **npm**, **pnpm**, or **yarn**
