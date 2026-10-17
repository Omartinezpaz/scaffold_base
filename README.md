# 🍔 Hamburger Rapid — Plataforma Comercial Full-Stack (v1.0)

Arquitectura comercial unificada en **Paleta Clara Premium** compuesta por 3 aplicaciones frontend sincronizadas y un servidor API en Node.js + MySQL / In-Memory:

1. **E-commerce Landing (`apps/ecommerce` - Astro)**:
   - Catálogo de **10 variantes destacadas** de hamburguesas clásicas y especiales, incluyendo *"Rey de las Burgers"*, *"Burger Real Clásica"*, *"Burger Real Doble"* y *"Burger Doble Especial"*.
   - Precio, badge de nivel de especialidad, filtro por categoría y modal interactivo de **"Ver Detalles"** con ingredientes y maridaje.
2. **Mobile PWA (`apps/pwa` - React + Vite)**:
   - Navegación móvil con **4 pestañas inferiores** (*Menú, Ofertas, Ordenes, Perfil*).
   - Simulador completo de compra de hamburguesas, aplicación de combos/cupones y rastreador de estado de órdenes en vivo.
3. **Executive Admin Dashboard (`apps/admin` - React + Vite)**:
   - Listado e inventario de las hamburguesas disponibles.
   - Analítica y métricas de consumidores/clientes segmentados según su nivel de consumo.
   - Monitor en tiempo real del estado de la base de datos (`/api/health`).
