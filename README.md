# Clothes Shopping Store — Full-Stack ASP.NET Web API Application

A full-stack web application for browsing, managing, and ordering costumes online, powered by an **ASP.NET Web API** backend, **Microsoft SQL Server** database, and a responsive **HTML/CSS/JavaScript** frontend.

## Features

- **Role-Based Access & Dashboards:** Separate interfaces and workflows for Customers and Admins (`admin_Dashboard.html`, `admin_UsersPage.html`).
- **Costume Catalog & Browsing:** Dynamic product listings with category filtering, search, and detailed item views backed by REST API endpoints.
- **Shopping Cart & Order Management:** Add-to-cart functionality, order placement, and admin order tracking/management.
- **RESTful API Architecture:** Clean CRUD operations built with ASP.NET Web API 2 and Entity Framework for seamless database communication.
- **Asynchronous Frontend Integration:** Real-time UI updates and form submissions powered by AJAX/Fetch calls without full-page reloads.

## Repository Structure

- **`Backend/`** — ASP.NET Web API 2 RESTful services, controllers, models, and Entity Framework data access layer.
- **`Frontend/`** — Client-side web interface consuming the Web API endpoints via AJAX/Fetch.
- **`SQLQuery.sql`** — Database schema, tables, and seed queries for SQL Server.
- **`Online Costume.docx`** — Project requirements and functional specifications.

## Tech Stack

- **Backend:** C#, ASP.NET Web API 2, Entity Framework
- **Database:** Microsoft SQL Server
- **Frontend:** HTML5, CSS3, JavaScript

## How to Run

1. **Database Setup:** Execute `SQLQuery.sql` in **SQL Server Management Studio (SSMS)** to create the database and tables.
2. **Backend:** Open the `.sln` file inside `Backend/` in **Visual Studio**, update the connection string in `Web.config` if needed, restore NuGet packages, and run the API (`F5`).
3. **Frontend:** Open `Frontend/` with **VS Code Live Server** (or a local server) and verify the API base URL matches your running backend port.
