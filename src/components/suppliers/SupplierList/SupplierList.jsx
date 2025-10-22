import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supplierApi from "@/api/supplierApi";
import styles from "./SupplierList.module.css";

const SupplierList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierApi.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplierId) => {
    navigate(`/suppliers/edit/${supplierId}`);
  };

  const handleDelete = async (supplier) => {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      html: `¿Desea eliminar al proveedor <strong>${supplier.name}</strong>?<br>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await supplierApi.delete(supplier.id);
        Swal.fire("¡Eliminado!", "Proveedor eliminado correctamente", "success");
        fetchSuppliers(); // Recargar la lista
      } catch (error) {
        console.error("Error deleting supplier:", error);
        Swal.fire("Error", "No se pudo eliminar el proveedor", "error");
      }
    }
  };

  const handleCreate = () => {
    navigate("/suppliers/create");
  };

  // Filtrar suppliers por búsqueda
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.documentNumber.includes(searchTerm) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Proveedores</h1>
          <p className={styles.subtitle}>
            {filteredSuppliers.length} proveedor{filteredSuppliers.length !== 1 ? "es" : ""} registrado{filteredSuppliers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={handleCreate} className={styles.createButton}>
          + Nuevo Proveedor
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar por nombre, documento o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Tabla */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo Doc</th>
              <th>N° Documento</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th className={styles.actionsCol}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className={styles.nameCell}>{supplier.name}</td>
                  <td>{supplier.documentType}</td>
                  <td>{supplier.documentNumber}</td>
                  <td>{supplier.phone || "-"}</td>
                  <td>
                    <span
                      className={
                        supplier.active
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {supplier.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => handleEdit(supplier.id)}
                      className={styles.editButton}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(supplier)}
                      className={styles.deleteButton}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.emptyState}>
                  {searchTerm
                    ? "No se encontraron proveedores con ese criterio"
                    : "No hay proveedores registrados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;