# BU Laundry Tracker

A laundry tracking application for **Bennett University** students and the laundry team.

## Features

### For Students
- **Track laundry bag** — Real-time status from submission to delivery
- **Complaints** — Report slot, bag, damaged, or unironed cloth issues with photo uploads
- **Complaint chat** — Direct messaging with the laundry team
- **Lost slip/bag** — Apply for a replacement slip or bag
- **Profile** — View and edit personal details

### For Laundry Team
- **Dashboard** — Overview of bags, complaints, and reapply requests
- **Manage bags** — Update bag status (washing → drying → ironing → ready → delivered)
- **Handle complaints** — Review photos, chat with students, resolve issues
- **Reapply requests** — Approve or reject lost slip/bag applications

## Design

- Color theme: Bennett University blue (`#054D9F`), red (`#E31837`), and white
- Custom BU logo and responsive layout (desktop sidebar + mobile bottom nav)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@bennett.edu.in | bu2024 |
| Laundry Team | laundry@bennett.edu.in | bu2024 |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- LocalStorage for demo data persistence
