// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [activeMenus, setActiveMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menuId) => {
    // En modo colapsado, no mostrar submenús
    if (isCollapsed && !isMobile) return;
    
    setActiveMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
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
      id: 'home',
      title: 'Inicio',
      icon: '🏠',
      href: '#home'
    },
    {
      id: 'productos',
      title: 'Productos',
      icon: '📦',
      subItems: [
        { 
          id: 'catalogo', 
          title: 'Catálogo', 
          href: '#catalogo',
          icon: '📋'
        },
        {
          id: 'compras',
          title: 'Compras',
          icon: '🛒',
          subItems: [
            { id: 'registrar', title: 'Registrar', href: '#registrar', icon: '➕' },
            { id: 'listar', title: 'Listar', href: '#listar', icon: '📄' }
          ]
        }
      ]
    },
    {
      id: 'ventas',
      title: 'Ventas',
      icon: '💰',
      subItems: [
        { 
          id: 'nueva-venta', 
          title: 'Nueva Venta', 
          href: '#nueva-venta',
          icon: '🆕'
        },
        { 
          id: 'historial', 
          title: 'Historial', 
          href: '#historial',
          icon: '📊'
        }
      ]
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: '📈',
      href: '#reportes'
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: '⚙️',
      href: '#configuracion'
    }
  ];

  const renderMenuItem = (item, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = activeMenus[item.id];
    const showSubItems = isActive && !isCollapsed;
    
    const paddingClass = level === 0 ? '' : 
                        level === 1 ? styles.paddingLevel1 : 
                        styles.paddingLevel2;

    return (
      <div key={item.id} className={styles.menuItem}>
        {hasSubItems ? (
          <button
            className={`${styles.sidebarItem} ${paddingClass} ${isActive ? styles.active : ''}`}
            onClick={() => toggleMenu(item.id)}
            aria-expanded={showSubItems}
            title={isCollapsed ? item.title : ''}
          >
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {(!isCollapsed || isMobile) && (
              <>
                <span className={styles.sidebarText}>{item.title}</span>
                <span className={`${styles.sidebarArrow} ${showSubItems ? styles.rotated : ''}`}>▼</span>
              </>
            )}
          </button>
        ) : (
          <a 
            href={item.href || '#'} 
            className={`${styles.sidebarItem} ${paddingClass}`}
            title={isCollapsed ? item.title : ''}
          >
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {(!isCollapsed || isMobile) && (
              <span className={styles.sidebarText}>{item.title}</span>
            )}
          </a>
        )}
        
        {hasSubItems && showSubItems && (
          <div className={`${styles.submenu} ${styles.show}`}>
            {item.subItems.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = `
    ${styles.sidebar}
    ${isCollapsed && !isMobile ? styles.collapsed : ''}
    ${isMobile ? styles.mobile : ''}
    ${isMobileOpen ? styles.mobileOpen : ''}
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
              src="/api/placeholder/40/40" 
              alt="Logo" 
              className={styles.logoImage}
            />
            {(!isCollapsed || isMobile) && (
              <h4 className={styles.logoText}>MiEmpresa</h4>
            )}
          </div>
          
          {/* Botón para colapsar/expandir en desktop */}
          {!isMobile && (
            <button 
              className={styles.toggleButton}
              onClick={toggleSidebar}
              aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
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
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarMenu}>
            {menuItems.map(item => renderMenuItem(item))}
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