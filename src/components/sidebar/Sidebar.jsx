import React from 'react'

function Sidebar() {
    return (
        <>

            {/* Sidebar fijo al lado izquierdo */}
            <nav
                className="bg-light border-end vh-100"
                style={{ width: '25%', minWidth: '220px', position: 'fixed', left: 0, top: 0 }}
                id="sidebar"
            >
                <div className="list-group list-group-flush">
                    <a href="#menu1" className="list-group-item list-group-item-action" data-bs-toggle="collapse" aria-expanded="false" aria-controls="menu1">
                        PRODUCTOSSSSSS
                    </a>
                    <div className="collapse" id="menu1">
                        <a href="#" className="list-group-item list-group-item-action ps-4">Catálogo</a>
                        <a href="#submenu1-2" className="list-group-item list-group-item-action ps-4" data-bs-toggle="collapse" aria-expanded="false" aria-controls="submenu1-2">
                            Compras
                        </a>
                        <div className="collapse" id="submenu1-2">
                            <a href="#" className="list-group-item list-group-item-action ps-5">Registrar</a>
                            <a href="#" className="list-group-item list-group-item-action ps-5">Listar</a>
                        </div>
                    </div>
                    <a href="#menu2" className="list-group-item list-group-item-action" data-bs-toggle="collapse" aria-expanded="false" aria-controls="menu2">
                        VENTAS
                    </a>
                    <div className="collapse" id="menu2">
                        <a href="#" className="list-group-item list-group-item-action ps-4">Submenú 2-1</a>
                    </div>
                </div>
            </nav>


        </>
    )
}

export default Sidebar