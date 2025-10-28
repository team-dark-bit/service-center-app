import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import customerApi from "@/api/customerApi";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import styles from "./CustomerList.module.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/customers/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/customers/create");
  };

  const handleDelete = async (id,customer) => {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      html: `¿Desea eliminar al cliente <strong>${customer.fullName || customer.companyName}</strong>?<br>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await customerApi.delete(id);
        Swal.fire("Eliminado", "El cliente ha sido eliminado", "success");
        fetchCustomers();
      } catch (error) {
        console.error("Error eliminando cliente:", error);
        Swal.fire("Error", "No se pudo eliminar el cliente", "error");
      }
    }
  };

  // Definir columnas de la tabla
  const columns = [
    {
      key: "fullName", // Campo del objeto de datos
      label: "NombreCliente", // Texto que se muestra en el header
      sortable: true, // Permite ordenar esta columna
      //width: "200px", // Opcional: Ancho fijo
      render: (value) => <strong>{value}</strong>, // Opcional: Personalizar cómo se muestra
    },
    {
      key: "companyName",
      label: "Nombre Empresa",
      sortable: true,
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
      key: "phoneNumber",
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
          <h1 className={styles.title}>Clientes</h1>
          <p className={styles.subtitle}>
            {customers.length} cliente{customers.length !== 1 ? "s" : ""}{" "}
            registrado{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="success" onClick={handleCreate}>
          + Nuevo Cliente
        </Button>
      </div>

      {/* DataTable genérico */}
      <DataTable
        columns={columns}
        data={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        searchable={true}
        searchPlaceholder="Buscar por nombre, documento o email..."
        emptyMessage="No hay clientes registrados"
        hoverable={true}
        striped={false}
      />
    </div>
  );
};

export default CustomerList;
