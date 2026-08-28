# LMS Koperasi Desa Kelurahan Merah Putih 

Standalone React + Vite + Tailwind CSS prototype for the LMS interface.

This repository is the UI/prototype layer. It is designed to be ported into the existing `lms_apn` Laravel + Inertia + React application later.

## Pages

- `/` — Landing page
- `/login` — Login UI
- `/register` — Registration UI

## Existing `lms_apn` authentication contract

Login payload:

```text
login
password
remember
```

`login` accepts email or phone number.

Register payload:

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

Existing region endpoints:

```text
GET /api/regions/provinces
GET /api/regions/provinces/{province}/cities
GET /api/regions/cities/{city}/districts
GET /api/regions/districts/{district}/villages
```

The prototype uses local mock region data. Replace it with the existing endpoints during integration.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

```text
src/
├── assets/
├── components/
│   ├── auth/
│   ├── common/
│   ├── landing/
│   └── ui/
├── data/
├── hooks/
├── layouts/
├── lib/
├── pages/
│   ├── Auth/
│   └── Home/
├── App.jsx
├── index.css
└── main.jsx
```

## Integration principle

Do not copy the standalone `index.html` into Laravel.

Port the finished UI components/pages into:

```text
lms_apn/resources/js/pages/
lms_apn/resources/js/components/
lms_apn/resources/js/layouts/
```

Keep Laravel routes, Inertia, Fortify, validation, database, and business logic intact.
