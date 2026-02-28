import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const [activeMenus, setActiveMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrollState, setScrollState] = useState({
    hasScrollTop: false,
    hasScrollBottom: false,
  });
  const sidebarContentRef = useRef(null);

  // Función para manejar el estado del scroll
  const handleScroll = () => {
    const element = sidebarContentRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const hasScrollTop = scrollTop > 10;
    const hasScrollBottom = scrollTop < scrollHeight - clientHeight - 10;

    setScrollState({ hasScrollTop, hasScrollBottom });
  };

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);

      // Auto-colapsar en pantallas medianas
      if (width <= 1024 && width > 768) {
        setIsCollapsed(true);
      } else if (width > 1024) {
        setIsCollapsed(false);
      }

      // Cerrar menú móvil si se expande la pantalla
      if (width > 768) {
        setIsMobileOpen(false);
      }
    };

    handleResize(); // Ejecutar al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Configurar scroll listener
  useEffect(() => {
    const element = sidebarContentRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    // Verificar estado inicial del scroll
    handleScroll();

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  // Verificar scroll cuando cambia el contenido (menús expandidos)
  useEffect(() => {
    const timeout = setTimeout(handleScroll, 100);
    return () => clearTimeout(timeout);
  }, [activeMenus]);

  const toggleMenu = (menuId) => {
    // En modo colapsado, no mostrar submenús
    if (isCollapsed && !isMobile) return;

    setActiveMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const menuItems = [
    {
      id: "home",
      title: "Inicio",
      icon: "🏠",
      href: "/",
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "📊",
      href: "#dashboard",
    },
    {
      id: "productos",
      title: "Productos",
      icon: "📦",
      subItems: [
        {
          id: "crear-producto",
          title: "Crear Producto",
          href: "/products/create",
          icon: "➕",
        },
        {
          id: "catalogo",
          title: "Catálogo",
          href: "/products/catalog",
          icon: "📋",
        },
        {
          id: "listar-productos",
          title: "Inventario",
          href: "/products",
          icon: "📚",
        },
        {
          id: "categorias",
          title: "Categorías",
          href: "#categorias",
          icon: "🏷️",
        },
      ],
    },
    {
      id: "compras",
      title: "Compras",
      icon: "🛒",
      subItems: [
        {
          id: "registrar-compra",
          title: "Registrar",
          href: "/purchases/create",
          icon: "➕",
        },
        {
          id: "listar-compras",
          title: "Listar",
          href: "#listar",
          icon: "📄",
        },
        {
          id: "proveedores",
          title: "Proveedores",
          href: "#proveedores",
          icon: "🏢",
        },
      ],
    },
    {
      id: "ventas",
      title: "Ventas",
      icon: "💰",
      subItems: [
        {
          id: "ventas",
          title: "Registrar Venta",
          href: "/sales/create",
          icon: "🆕",
        },
        {
          id: "historial-ventas",
          title: "Historial",
          href: "#historial",
          icon: "📊",
        },
        {
          id: "clientes",
          title: "Clientes",
          href: "#clientes",
          icon: "👥",
        },
        {
          id: "cotizaciones",
          title: "Cotizaciones",
          href: "#cotizaciones",
          icon: "📝",
        },
      ],
    },
    {
      id: "finanzas",
      title: "Finanzas",
      icon: "💳",
      subItems: [
        {
          id: "caja",
          title: "Caja",
          href: "#caja",
          icon: "💵",
        },
        {
          id: "facturacion",
          title: "Facturación",
          href: "#facturacion",
          icon: "🧾",
        },
        {
          id: "gastos",
          title: "Gastos",
          href: "#gastos",
          icon: "💸",
        },
        {
          id: "impuestos",
          title: "Impuestos",
          href: "#impuestos",
          icon: "🏛️",
        },
      ],
    },
    {
      id: "reportes",
      title: "Reportes",
      icon: "📈",
      subItems: [
        {
          id: "ventas-reporte",
          title: "Reporte de Ventas",
          href: "#reporte-ventas",
          icon: "📊",
        },
        {
          id: "inventario-reporte",
          title: "Reporte de Inventario",
          href: "#reporte-inventario",
          icon: "📋",
        },
        {
          id: "financiero",
          title: "Estado Financiero",
          href: "#estado-financiero",
          icon: "💹",
        },
      ],
    },
    {
      id: "proveedores",
      title: "Proveedores",
      icon: "👨‍💼",
      subItems: [
        {
          id: "registrar-proveedor",
          title: "Registrar Proveedor",
          href: "/suppliers/create",
          icon: "➕",
        },
        {
          id: "nomina",
          title: "Nómina",
          href: "#nomina",
          icon: "💰",
        },
        {
          id: "listar-proveedores",
          title: "Listar Proveedores",
          href: "/suppliers",
          icon: "📅",
        },
      ],
    },
    {
      id: "clientes",
      title: "Clientes",
      icon: "👥",
      subItems: [
        {
          id: "nuevo-cliente",
          title: "Nuevo Cliente",
          href: "/customers/create",
          icon: "➕",
        },
        {
          id: "listar-clientes",
          title: "Listar Clientes",
          href: "/customers",
          icon: "📋",
        },
      ],
    },
    {
      id: "servicios",
      title: "Servicio Mecanico",
      icon: "🛠️",
      subItems: [
        {
          id: "nuevo-servicio",
          title: "Nuevo Servicio",
          href: "/mechanical-services/create",
          icon: "➕",
        },
        {
          id: "listar-servicios",
          title: "Listar Servicio",
          href: "/mechanical-services",
          icon: "📋",
        },
      ],
    },
    {
      id: "configuracion",
      title: "Configuración",
      icon: "⚙️",
      subItems: [
        {
          id: "empresa",
          title: "Datos de Empresa",
          href: "#empresa",
          icon: "🏢",
        },
        {
          id: "usuarios",
          title: "Usuarios",
          href: "#usuarios",
          icon: "👤",
        },
        {
          id: "permisos",
          title: "Permisos",
          href: "#permisos",
          icon: "🔐",
        },
        {
          id: "backup",
          title: "Respaldo",
          href: "#backup",
          icon: "💾",
        },
      ],
    },
    {
      id: "ayuda",
      title: "Ayuda",
      icon: "❓",
      subItems: [
        {
          id: "documentacion",
          title: "Documentación",
          href: "#docs",
          icon: "📖",
        },
        {
          id: "soporte",
          title: "Soporte Técnico",
          href: "#soporte",
          icon: "🛠️",
        },
        {
          id: "acerca",
          title: "Acerca de",
          href: "#acerca",
          icon: "ℹ️",
        },
      ],
    },
  ];

  const renderMenuItem = (item, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = activeMenus[item.id];
    const showSubItems = isActive && !isCollapsed;

    const paddingClass =
      level === 0
        ? ""
        : level === 1
          ? styles.paddingLevel1
          : styles.paddingLevel2;

    return (
      <div key={item.id} className={styles.menuItem}>
        {hasSubItems ? (
          <button
            className={`${styles.sidebarItem} ${paddingClass} ${isActive ? styles.active : ""
              }`}
            onClick={() => toggleMenu(item.id)}
            aria-expanded={showSubItems}
            title={isCollapsed ? item.title : ""}
          >
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {(!isCollapsed || isMobile) && (
              <>
                <span className={styles.sidebarText}>{item.title}</span>
                <span
                  className={`${styles.sidebarArrow} ${showSubItems ? styles.rotated : ""
                    }`}
                >
                  ▼
                </span>
              </>
            )}
          </button>
        ) : (
          <Link
            to={item.href || "#"}
            className={`${styles.sidebarItem} ${paddingClass}`}
            title={isCollapsed ? item.title : ""}
          >
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {(!isCollapsed || isMobile) && (
              <span className={styles.sidebarText}>{item.title}</span>
            )}
          </Link>
        )}

        {hasSubItems && showSubItems && (
          <div className={`${styles.submenu} ${styles.show}`}>
            {item.subItems.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = `
    ${styles.sidebar}
    ${isCollapsed && !isMobile ? styles.collapsed : ""}
    ${isMobile ? styles.mobile : ""}
    ${isMobileOpen ? styles.mobileOpen : ""}
  `.trim();

  const contentClasses = `
    ${styles.sidebarContent}
    ${scrollState.hasScrollTop ? styles.hasScrollTop : ""}
    ${scrollState.hasScrollBottom ? styles.hasScrollBottom : ""}
  `.trim();

  return (
    <>
      {/* Botón de menú hamburguesa para móvil */}
      {isMobile && (
        <button
          className={styles.hamburger}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Overlay para móvil */}
      {isMobile && isMobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <nav className={sidebarClasses} id="sidebar">
        {/* Header con logo */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <img
              src={logo}
              alt="Logo"
              className={styles.logoImage}
            />
            {(!isCollapsed || isMobile) && (
              <h4 className={styles.logoText}>D & F Motors</h4>
            )}
          </div>

          {/* Botón para colapsar/expandir en desktop */}
          {!isMobile && (
            <button
              className={styles.toggleButton}
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              <div className={styles.hamburgerIcon}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className={contentClasses} ref={sidebarContentRef}>
          <div className={styles.sidebarMenu}>
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img
                src="/api/placeholder/32/32"
                alt="Usuario"
                className={styles.avatarImage}
              />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Juan Pérez</span>
                <span className={styles.userRole}>Administrador</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
