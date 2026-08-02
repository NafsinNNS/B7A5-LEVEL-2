# Assignment 5 - Frontend Project 

|:------------------------:|------------|
| **0, 1, 2, 3** | [RentNest](./1-RentNest-Frontend.md) 🏠 |

---

## ⚠️ Mandatory Requirements

> [!CAUTION]
> **MANDATORY - READ CAREFULLY**
> 
> The following **SIX requirements are MANDATORY**:
> 1. **API Integration & Documentation** - Consume all required backend endpoints. Provide a brief `API_INTEGRATION.md` file mapping frontend components to backend endpoints.
> 2. **Consistent UI Error Handling** - All API errors must show user-friendly, structured UI feedback (e.g., Toast notifications, inline form errors, Error Boundaries).
> 5. **Payment Integration** - Must integrate the frontend flow for **Stripe** (Checkout/Elements) or **SSLCommerz**. Simulated/fake payments (Cash on Delivery, Pay Later) are **NOT** accepted. Must handle success/cancel redirect pages.



---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js** (App Router) | React Framework, Routing, Server Components |
| **TypeScript** | Type safety (Mandatory) |
| **Tailwind CSS** | Styling (Shadcn UI, DaisyUI, or custom components allowed) |
| **Fetch**, **TanStack Query (React Query)** or **SWR** | Server state management and data fetching |
| **Auth.js** or **Custom JWT Middleware** | Authentication and protected routes |
| **Stripe.js** or **SSLCommerz JS** | Frontend payment gateway integration |

---

## 🎯 Key Rules

- **Roles**: Project has 3 fixed roles. The UI must dynamically render navigation, dashboards, and actions based on the authenticated user's role. Use Next.js Middleware for route protection.
- **Payment**: Payment integration is **MANDATORY**. The frontend must successfully initiate the payment (e.g., redirect to Stripe Checkout or SSLCommerz gateway) and handle the return URL (success/cancel pages) gracefully, updating the UI accordingly.
- **Backend Dependency**: You may connect to your own backend from a previous assignment, a partner's backend, or a provided mock backend. If using a mock, document it clearly, but real API integration is highly preferred.
- **Performance**: Optimize images using `next/image`, implement loading states (`loading.tsx`), and handle errors gracefully (`error.tsx`).
