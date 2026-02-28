import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import mechanicalServiceApi from "@/api/mechanicalServiceApi";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import styles from "./CreateMechanicalService.module.css";

const CreateMechanicalService = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            Swal.fire("Error", "El nombre del servicio es requerido", "error");
            return;
        }

        setIsLoading(true);

        try {
            // Preparar datos para el API
            const serviceData = {
                name: formData.name.trim(),
                referencePrice: "0"
            };

            console.log("📦 Datos del servicio mecánico a enviar:", serviceData);

            await mechanicalServiceApi.create(serviceData);

            Swal.fire({
                title: "¡Éxito!",
                text: "Servicio mecánico creado correctamente",
                icon: "success",
                confirmButtonText: "Continuar",
            }).then(() => {
                navigate("/mechanical-services");
            });
        } catch (error) {
            console.error("Error al crear el servicio:", error);
            Swal.fire("Error", "No se pudo crear el servicio", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        Swal.fire({
            title: "¿Está seguro?",
            text: "Se perderán todos los datos ingresados",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No, continuar",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/mechanical-services");
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Crear Servicio Mecánico</h1>
                <p className={styles.subtitle}>
                    Complete la información del nuevo servicio
                </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Información del Servicio</h3>

                        <div className={styles.formRowFull}>
                            <Input
                                label="Nombre"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre del servicio"
                                required
                            />
                        </div>

                        <div className={styles.formRowFull}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Ingrese una descripción del servicio"
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button
                        type="button"
                        onClick={handleCancel}
                        variant="secondary"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>

                    <Button type="submit" variant="primary" loading={isLoading}>
                        Guardar Servicio
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateMechanicalService;
