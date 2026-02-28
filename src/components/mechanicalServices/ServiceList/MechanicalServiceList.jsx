import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import mechanicalServiceApi from "@/api/mechanicalServiceApi";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import styles from "./MechanicalServicesList.module.css";

const MechanicalServiceList = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await mechanicalServiceApi.getAll();
            setServices(data || []);
        } catch (error) {
            console.error("Error fetching mechanical services:", error);
            Swal.fire("Error", "No se pudieron cargar los servicios mecánicos", "error");
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        // navigate(`/mechanical-services/edit/${id}`);
        Swal.fire("Información", "Funcionalidad de edición en desarrollo", "info");
    };

    const handleCreate = () => {
        navigate("/mechanical-services/create");
    };

    const handleDelete = async (id, service) => {
        const result = await Swal.fire({
            title: "¿Está seguro?",
            html: `¿Desea eliminar el servicio <strong>${service.name}</strong>?<br>Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                // await mechanicalServiceApi.delete(id);
                Swal.fire("Información", "Funcionalidad de eliminación en desarrollo", "info");
                // fetchServices();
            } catch (error) {
                console.error("Error eliminando servicio:", error);
                Swal.fire("Error", "No se pudo eliminar el servicio", "error");
            }
        }
    };

    // Definir columnas de la tabla
    const columns = [
        {
            key: "name",
            label: "Servicio",
            sortable: true,
            render: (value) => <strong>{value}</strong>,
        },
        {
            key: "description",
            label: "Descripción",
            sortable: false,
        },
        {
            key: "referencePrice",
            label: "Precio Ref.",
            render: (value) => `S/ ${value || '0.00'}`,
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Servicios Mecánicos</h1>
                    <p className={styles.subtitle}>
                        {services.length} servicio{services.length !== 1 ? "s" : ""}{" "}
                        registrado{services.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button variant="success" onClick={handleCreate}>
                    + Nuevo Servicio
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                searchable={false} // Desactivado por solicitud del usuario
                emptyMessage="No hay servicios mecánicos registrados"
                hoverable={true}
                striped={false}
            />
        </div>
    );
};

export default MechanicalServiceList;
