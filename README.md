# ⚡ ElectroTrack - Real-time Inventory Management System

A NoSQL-based corporate data solution designed for an online electronics retailer. This application provides real-time product catalog and inventory tracking using the MERN stack.

## 🎯 Business Problem
Electronics retailers struggle with managing product inventory that has varying attributes across categories (smartphones, laptops, accessories, etc.). Traditional relational databases struggle with schema rigidity and scalability during peak periods. ElectroTrack solves this by utilizing MongoDB's flexible document model to store product data and provide real-time low-stock alerts.

## 🛠️ Tech Stack
- **Database:** MongoDB (NoSQL Document Database)
- **Backend:** Express.js + Node.js
- **Frontend:** React
- **ODM:** Mongoose
- **HTTP Client:** Axios
- **Styling:** Plain CSS (Custom modern dashboard)

## ✨ Features
- **CRUD Operations:** Create, Read, Update, and Delete products.
- **Real-time Low Stock Alert:** Automatically flags products with stock < 5.
- **Aggregation:** Retrieves low-stock products via NoSQL query (`$lt: 5`).
- **Search:** Filter products by name or category.
- **Export CSV:** Download the current inventory table as a CSV file.
- **KPI Dashboard:** Displays Total Products, Categories, Low Stock Alerts, and Total Inventory Value.
- **Modern UI:** Responsive dashboard with dark navigation bar and sticky footer.

## 📋 Prerequisites
Before running this application, ensure you have the following installed:
- **Node.js** (v18+)
- **npm** (v9+)
- **MongoDB Community Server** (running locally on port 27017)
- **MongoDB Shell (mongosh)** (optional, for direct database queries)

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/razmanf/electrotrack-inventory.git
cd mern-inventory
