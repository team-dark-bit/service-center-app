// src/components/suppliers/SupplierList.jsx - VERSIÓN CON DATATABLE
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supplierApi from "@/api/supplierApi";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import styles from "./SupplierList.module.css";

const SupplierList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (id) => {
    navigate(`/suppliers/edit/${id}`);
  };

  const handleDelete = async (id, supplier) => {
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
        await supplierApi.delete(id);
        Swal.fire(
          "¡Eliminado!",
          "Proveedor eliminado correctamente",
          "success"
        );
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        Swal.fire("Error", "No se pudo eliminar el proveedor", "error");
      }
    }
  };

  const handleCreate = () => {
    navigate("/suppliers/create");
  };

  // Definir columnas de la tabla
  const columns = [
    {
      key: "name", // ✅ Campo del objeto de datos
      label: "Nombre", // ✅ Texto que se muestra en el header
      sortable: true, // ✅ Permite ordenar esta columna
      //width: "200px", // ⚠️ Opcional: Ancho fijo
      render: (value) => <strong>{value}</strong>, // ⚠️ Opcional: Personalizar cómo se muestra
    },
    {
      key: "documentType",
      label: "Tipo Doc",
      sortable: true,
    },
    {
      key: "documentNumber",
      label: "N° Documento",
      sortable: true,
    },
    {
      key: "phone",
      label: "Teléfono",
    },
    {
      key: "active",
      label: "Estado",
      render: (value) => (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "600",
            background: value ? "#d4edda" : "#f8d7da",
            color: value ? "#155724" : "#721c24",
            display: "inline-block",
          }}
        >
          {value ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Proveedores</h1>
          <p className={styles.subtitle}>
            {suppliers.length} proveedor{suppliers.length !== 1 ? "es" : ""}{" "}
            registrado{suppliers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="success" onClick={handleCreate}>
          + Nuevo Proveedor
        </Button>
      </div>

      {/* DataTable genérico */}
      <DataTable
        columns={columns}
        data={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        searchable={true}
        searchPlaceholder="Buscar por nombre, documento o email..."
        emptyMessage="No hay proveedores registrados"
        hoverable={true}
        striped={false}
      />
    </div>
  );
};

export default SupplierList;
