# 🍔 Hamburger Rapid — Fast Food Gourmet & Burger Factory

Plataforma omnicanal para **Hamburger Rapid**, estructurada como un monorepo arquitectónico de alto rendimiento con diseño visual de autor basado en el estilo **Burger Factory** (Dark Charcoal & Cheddar Amber Gold).

---

## 🎨 Referencia Visual de Diseño

La capa de **Landing E-commerce** ha sido rediseñada adoptando el estilo visual, la paleta de colores y los componentes de la imagen de referencia ubicada en:

📁 **`assets-references\images\5354a05ccc58c0d62da48539dcc550e8.jpg`**

### Elementos Visuales Incorporados:
- **Paleta Cromática Gastronómica:**
  - **Fondo Primario Oscuro:** Dark Charcoal (`#0D0D0D`, `#141414`, `#1B1B1B`).
  - **Acento Dorado Cheddar:** Warm Amber Gold (`#EAA222`, `#F5A623`, `#D97706`, `#FBECCB`).
  - **Lienzo de Catálogo:** Pure White (`#FFFFFF`) y Off-White Cálido (`#F7F7F8`) con bordes sutiles (`#E5E7EB`).
- **Tipografía de Alto Impacto:**
  - Encabezados Display en `Bebas Neue` (*"BURGERS DONE RIGHT"*, *"CUSTOMER FAVORITES"*, *"BURGERS BUILT ON PASSION"*).
  - Trazos manuscritos decorativos en `Caveat` (*"Made Fresh. Made to Crave."*, *"Our Menu"*, *"Make it a"*, *"About Us"*).
  - Interfaz y cuerpo de texto en `Plus Jakarta Sans`.
- **Componentes y Bloques de Diseño:**
  - **Header Temático:** Logotipo lineal dorado, navegación con estado activo dorado y botón CTA *"ORDER ONLINE"*.
  - **Hero Section:** Gran hamburguesa de autor sobre tabla rústica, doodle rays dorados, botón primario dorado *"VIEW MENU"*, botón outline *"ORDER IN PWA"*, valoración social 4.8 estrellas y sello circular *"100% FRESH BEEF • NEVER FROZEN"*.
  - **Barra de 4 Pilares de Calidad:** Iconos lineales dorados para *Premium Quality*, *Hand-Cut Fries*, *Hand-Spun Shakes* y *Made Fresh Daily*.
  - **Customer Favorites:** Grid de tarjetas con foto superior en marco oscuro, badges semánticos, descripción de ingredientes, precio en oro cálido y botón circular negro `+` con modal interactivo de detalles.
  - **Banner Promocional Dividido (Split Banner):** Bloque oscuro con combo *"Make it a MEAL! ($3.99)"* y bloque amarillo cheddar *"BURGERS BUILT ON PASSION"* con botón *"OUR STORY >"* y sello vintage artesanal con cubiertos cruzados.
  - **Footer Oscuro Integrado:** Tabla de horarios de atención (Mon-Thu, Fri-Sat, Sun), enlaces rápidos, redes sociales y tarjeta *"ORDER AHEAD & SKIP THE LINE!"*.

---

## 🏗️ Arquitectura de la Solución

El monorepo cuenta con tres aplicaciones frontend desacopladas y un servidor backend centralizado:

| Aplicación | Tecnología | Ruta de Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **Landing E-commerce** | [Astro](https://astro.build/) | `http://localhost:3000/` | Landing page moderna con estilo Burger Factory, catálogo de 10 variantes de autor, badges de especialidad, modal interactivo de ingredientes y llamado a la acción comercial. |
| **PWA Mobile** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) | `http://localhost:3000/app` | Aplicación móvil con navegación por 4 pestañas inferiores (**Menú**, **Ofertas**, **Órdenes**, **Perfil**), switch modo dual claro/oscuro, simulador de carrito y tracking de pedidos en vivo. |
| **Operations Dashboard** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) | `http://localhost:3000/admin` | Panel de control con gestión de inventario/stock de hamburguesas, métricas de consumidores por tiers de consumo (Oro VIP, Plata, Bronce) y telemetría de base de datos. |
| **Backend REST API** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) + [MySQL](https://www.mysql.com/) | `http://localhost:3000/api/*` | API con endpoints de salud, productos, actualización de stock y métricas de consumo con fallback in-memory automático. |

---

## 🍔 Catálogo de las 10 Hamburguesas Destacadas

1. **Classic Cheeseburger** / Burger Real Clásica ($12.99) — `⭐ Clásica de Autor` (Res seleccionada a la plancha de hierro fundido, doble cheddar fundido, pepinillos encurtidos).
2. **BBQ Bacon Burger** / Burger Real Doble ($14.99) — `🔥 Doble Impacto` (Doble smash caramelizada, cuádruple queso americano, bacon crocante, salsa BBQ ahumada).
3. **Avocado Ranch Burger** / Burger Guacamole ($14.49) — `🥑 Fusión Fresca` (Res a la brasa, aguacate fresco, queso pepper jack fundido, aderezo ranch de autor).
4. **Spicy Jalapeño Burger** / Burger Doble Fuego ($13.49) — `🌶️ Sabor Picante` (Doble medallón, jalapeños encurtidos al fuego, spicy chipotle mayo, pepper jack).
5. **Rey de las Burgers** / Crown Signature ($15.99) — `👑 Corona de Oro • Signature` (Doble Angus Black 100%, cheddar inglés añejo 12 meses, bacon jam al bourbon).
6. **Burger Trufa & Portobello** ($15.50) — `💎 Gourmet Select` (Carne madurada Dry-Aged 30 días, Portobello al vino tinto, mayonesa de trufa negra silvestre).
7. **Burger Crispy Smokehouse** ($11.99) — `🍗 Pollo Crujiente` (Pechuga campera en tempura ultracrujiente con especias cajún, coleslaw morada y miel habanero-maple).
8. **Burger BBQ Bourbon Flame** ($13.99) — `🔥 Ahumada a la Leña` (Ahumada con virutas de roble, aros de cebolla rebozados a la cerveza, salsa barbacoa bourbon).
9. **Burger Bacon Cheese Deluxe** ($10.99) — `🥓 Favorita Clásica` (Res parrillera, triple tocino ahumado grueso extra crocante, mix de quesos gouda y cheddar).
10. **Burger Green Garden Truffle** ($11.50) — `🌱 100% Plant-Based` (Medallón artesanal de quinoa, lentejas francesas y hongos, crema de trufa en pan rústico).

---

## 🚀 Comandos de Ejecución

### 1. Compilación de todas las capas
```bash
npm run build:all
```
*Compila Astro, la PWA en Vite y el Admin en Vite, sincronizando los artefactos generados en `server/public`.*

### 2. Iniciar Servidor Unificado
```bash
npm start
```
*Levanta el servidor Express en el puerto 3000 con soporte para MySQL y fallback en memoria.*

### 3. Desarrollo Individual
- **Landing (Astro):** `npm run dev --prefix apps/ecommerce` (Puerto 4321)
- **PWA (Vite):** `npm run dev --prefix apps/pwa`
- **Admin (Vite):** `npm run dev --prefix apps/admin`
