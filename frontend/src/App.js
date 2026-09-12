import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [updateStock, setUpdateStock] = useState({ id: "", stock: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  useEffect(() => {
    fetchProducts();
    fetchLowStock();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  const fetchLowStock = async () => {
    const res = await axios.get(`${API_URL}/products/low-stock`);
    setLowStock(res.data);
  };

  // CRUD Handlers
  const addProduct = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/products`, form);
    fetchProducts();
    fetchLowStock();
    setForm({ name: "", price: "", stock: "", category: "" });
  };

  const updateProductStock = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/products/${updateStock.id}`, {
      stock: updateStock.stock,
    });
    fetchProducts();
    fetchLowStock();
    setUpdateStock({ id: "", stock: "" });
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
      fetchLowStock();
    }
  };

  // Derived stats for KPI cards
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Filter & export
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => setSearchTerm("");

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Price", "Stock", "Category"];
    const rows = filteredProducts.map((p) => [
      p._id,
      p.name,
      p.price,
      p.stock,
      p.category,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `electrotrack_inventory_${new Date()
      .toISOString()
      .slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      {/* --- MODERN NAVIGATION BAR --- */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">ElectroTrack</span>
            <span className="brand-badge">v2.0</span>
          </div>
          <div className="nav-stats">
            <div className="nav-stat-item">
              <span className="stat-label">Products</span>
              <span className="stat-value">{totalProducts}</span>
            </div>
            <div className="nav-stat-item alert-stat">
              <span className="stat-label">⚠️ Low Stock</span>
              <span className="stat-value">{lowStockCount}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-container">
        {/* --- KPI STATS CARDS --- */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">📦</div>
            <div className="kpi-content">
              <span className="kpi-label">Total Products</span>
              <span className="kpi-value">{totalProducts}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">🏷️</div>
            <div className="kpi-content">
              <span className="kpi-label">Categories</span>
              <span className="kpi-value">{totalCategories}</span>
            </div>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-icon">🔔</div>
            <div className="kpi-content">
              <span className="kpi-label">Low Stock Alerts</span>
              <span className="kpi-value">{lowStockCount}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <span className="kpi-label">Inventory Value</span>
              <span className="kpi-value">${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* --- LOW STOCK ALERT CARD --- */}
        <div className="alert-card modern-alert">
          <div className="alert-header">
            <h2>⚠️ Low Stock Alert</h2>
            <span className="alert-badge">{lowStock.length} items</span>
          </div>
          {lowStock.length === 0 ? (
            <p className="success-msg">✓ All stock levels are healthy.</p>
          ) : (
            <ul className="low-stock-list">
              {lowStock.map((p, index) => (
                <li key={p._id} className="low-stock-item">
                  <span className="ls-number">{index + 1}.</span>
                  <span className="ls-name">{p.name}</span>
                  <span className="ls-detail">Stock: {p.stock}</span>
                  <span className="ls-detail category-tag">{p.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- ACTION CARDS (Add / Update) --- */}
        <div className="action-row">
          <div className="card action-card">
            <h3>➕ Add New Product</h3>
            <form onSubmit={addProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category (e.g., Laptop)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary">
                Add Product
              </button>
            </form>
          </div>

          <div className="card action-card">
            <h3>🔄 Update Stock</h3>
            <form onSubmit={updateProductStock}>
              <input
                type="text"
                placeholder="Product ID"
                value={updateStock.id}
                onChange={(e) =>
                  setUpdateStock({ ...updateStock, id: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="New Stock"
                value={updateStock.stock}
                onChange={(e) =>
                  setUpdateStock({ ...updateStock, stock: e.target.value })
                }
                required
              />
              <button type="submit" className="btn-secondary">
                Update Stock
              </button>
            </form>
            <p className="hint">📌 Find Product ID in the table below.</p>
          </div>
        </div>

        {/* --- PRODUCT TABLE --- */}
        <div className="card table-card">
          <div className="table-header">
            <h3>📋 Product Catalog</h3>
            <div className="search-actions">
              <input
                type="text"
                placeholder="🔍 Search by name or category..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={clearSearch} className="clear-btn">
                ✕ Clear
              </button>
              <button onClick={exportToCSV} className="export-btn">
                📎 Export CSV
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th className="action-col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      className={p.stock < 5 ? "warning-row" : ""}
                    >
                      <td className="id-cell">{p._id}</td>
                      <td className="product-name-cell">{p.name}</td>
                      <td>${p.price}</td>
                      <td>
                        <span className="stock-badge">{p.stock}</span>
                      </td>
                      <td>
                        <span className="category-badge">{p.category}</span>
                      </td>
                      <td className="action-col">
                        <button
                          className="delete-btn"
                          onClick={() => deleteProduct(p._id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODERN FOOTER --- */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">⚡ ElectroTrack</span>
            <span className="footer-divider">|</span>
            <span>Real‑time Inventory Analytics</span>
          </div>
          <div className="footer-right">
            <span>© 2026 All Rights Reserved</span>
            <span className="footer-divider">|</span>
            <span className="footer-tech">Built with MERN Stack (NoSQL)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
