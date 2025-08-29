import React from 'react'
import Swal from 'sweetalert2'

function CreateProduct() {

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        try {
            const response = await fetch('http://localhost:9000/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            if (response.ok) {
                Swal.fire('¡Éxito!', 'Cliente registrado correctamente', 'success').then(() => {
                    navigate('/users/list')
                })
                e.target.reset()
            } else {
                Swal.fire('Error', 'Error al registrar cliente', 'error')
            }
        } catch (error) {
            Swal.fire('Error de conexión', '', 'error')
        }
    }

    return (
        <>
            {/* Contenido principal */}
            <div style={{ marginLeft: '25%', width: '75%', padding: '2rem' }}>
                <h4>Crear Producto</h4>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Nombre:</label>
                                <input type="text" className="form-control" name="companyName" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Alias:</label>
                                <input type="text" className="form-control" name="companyName" />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Descripción:</label>
                                <input type="text" className="form-control" name="companyName" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Marca</label>
                                <select className="form-select" name="regime">
                                    <option>RUS</option>
                                    <option>RER</option>
                                    <option>RMT</option>
                                    <option>RG</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Categoría</label>
                                <select className="form-select" name="regime">
                                    <option>RUS</option>
                                    <option>RER</option>
                                    <option>RMT</option>
                                    <option>RG</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Subcategoría</label>
                                <select className="form-select" name="regime">
                                    <option>RUS</option>
                                    <option>RER</option>
                                    <option>RMT</option>
                                    <option>RG</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Sku:</label>
                                <input type="text" className="form-control" name="companyName" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Código de barras:</label>
                                <input type="text" className="form-control" name="companyName" />
                            </div>
                        </div>
                    </div>




                    <div className="row mb-3 align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 w-50">Fecha de activación:</label>
                                <input type="date" className="form-control" name="sunatUser" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" defaultChecked />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    Activo
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                            GUARDAR
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateProduct