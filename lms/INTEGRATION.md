# Integration Map — UI Prototype → lms_apn

## Purpose

This repository is the standalone visual layer. The production backend remains in `lms_apn`.

## Page mapping

| Prototype | Existing Laravel/Inertia target |
|---|---|
| `src/pages/Home/HomePage.jsx` | Public landing page / Laravel route for `/` |
| `src/pages/Auth/LoginPage.jsx` | `resources/js/pages/auth/login.tsx` |
| `src/pages/Auth/RegisterPage.jsx` | `resources/js/pages/auth/register.tsx` |
| `src/components/auth/*` | `resources/js/components/auth/*` |
| `src/components/common/*` | `resources/js/components/*` or shared components |
| `src/layouts/AuthLayout.jsx` | `resources/js/layouts/*` |
| `src/hooks/useTheme.js` | Align with existing `use-appearance.tsx` during integration |

## Backend contracts to preserve

### Login

POST `/login`

```text
login
password
remember
```

`login` is intentionally a single field because the existing backend accepts either email or phone.

### Register

POST `/register`

```text
name
email
phone
province_id
city_id
district_id
village_id
password
password_confirmation
```

### Region cascade

```text
GET /api/regions/provinces
GET /api/regions/provinces/{province}/cities
GET /api/regions/cities/{city}/districts
GET /api/regions/districts/{district}/villages
```

## What should change during integration

1. Keep the JSX structure and visual classes as the UI source of truth.
2. Replace local form state submission with Inertia's existing form mechanism.
3. Replace `src/data/regions.js` with calls to the existing region endpoints.
4. Map Laravel validation errors into the existing `error` props.
5. Reuse the existing Fortify routes and authentication logic.
6. Do not copy this project's `index.html` into Laravel.
7. Do not duplicate the database/authentication logic in this repository.

## Design-system rule

New pages should reuse:

- `AuthLayout`
- `AuthCard`
- `AuthHeader`
- `AuthInput`
- `PasswordInput`
- `RegionSelect`
- `ThemeToggle`
- existing red / burgundy / neutral tokens

This makes future pages such as forgot password, email verification, dashboard, learning path, quiz, profile, and settings easier to add without creating a second visual system.
