import React from "react";
import "./DataTable.css";
import { EyeIcon, EditIcon, TrashIcon } from "lucide-react";

interface Column {
    key: string;
    label: string;
    width?: string;
    render?: (value: any, record: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onView?: (record: any) => void;
    onEdit?: (record: any) => void;
    onDelete?: (record: any) => void;
    loading?: boolean;
    emptyMessage?: string;
}

export default function DataTable({
    columns,
    data,
    onView,
    onEdit,
    onDelete,
    loading = false,
    emptyMessage = "No records found",
}: DataTableProps) {
    if (loading) {
        return (
            <div className="data-table">
                <div className="table-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="data-table">
                <div className="table-empty">
                    <p>{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="data-table">
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{ width: column.width }}
                                    className="table-header-cell"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <th className="table-header-cell actions-header">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((record, index) => (
                            <tr key={record.id || index} className="table-row">
                                {columns.map((column) => (
                                    <td key={column.key} className="table-cell">
                                        {column.render
                                            ? column.render(record[column.key], record)
                                            : record[column.key]}
                                    </td>
                                ))}
                                {(onView || onEdit || onDelete) && (
                                    <td className="table-cell actions-cell">
                                        <div className="action-buttons">
                                            {onView && (
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => onView(record)}
                                                    title="View"
                                                >
                                                    <EyeIcon />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    className="action-btn edit-btn"
                                                    onClick={() => onEdit(record)}
                                                    title="Edit"
                                                >
                                                    <EditIcon />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => onDelete(record)}
                                                    title="Delete"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
