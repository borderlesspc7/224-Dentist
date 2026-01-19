import React from "react";
import { PERMISSION_GROUPS, PERMISSION_LABELS, type Permission } from "../../../config/permissions";
import "./PermissionSelector.css";

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPermissions,
  onChange,
  disabled = false,
}) => {
  const handleTogglePermission = (permission: Permission) => {
    if (disabled) return;

    const isSelected = selectedPermissions.includes(permission);
    if (isSelected) {
      onChange(selectedPermissions.filter((p) => p !== permission));
    } else {
      onChange([...selectedPermissions, permission]);
    }
  };

  const handleToggleGroup = (groupPermissions: readonly Permission[]) => {
    if (disabled) return;

    const allSelected = groupPermissions.every((p) =>
      selectedPermissions.includes(p)
    );

    if (allSelected) {
      // Deselect all from group
      onChange(
        selectedPermissions.filter((p) => !groupPermissions.includes(p as Permission))
      );
    } else {
      // Select all from group
      const newPermissions = new Set([...selectedPermissions, ...groupPermissions]);
      onChange(Array.from(newPermissions));
    }
  };

  const isGroupFullySelected = (groupPermissions: readonly Permission[]) => {
    return groupPermissions.every((p) => selectedPermissions.includes(p));
  };

  const isGroupPartiallySelected = (groupPermissions: readonly Permission[]) => {
    const selectedCount = groupPermissions.filter((p) =>
      selectedPermissions.includes(p)
    ).length;
    return selectedCount > 0 && selectedCount < groupPermissions.length;
  };

  return (
    <div className="permission-selector">
      <div className="permission-groups">
        {PERMISSION_GROUPS.map((group) => {
          const fullySelected = isGroupFullySelected(group.permissions);
          const partiallySelected = isGroupPartiallySelected(group.permissions);

          return (
            <div key={group.id} className="permission-group">
              <div className="group-header">
                <label className="group-label">
                  <input
                    type="checkbox"
                    checked={fullySelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = partiallySelected && !fullySelected;
                      }
                    }}
                    onChange={() => handleToggleGroup(group.permissions)}
                    disabled={disabled}
                    className="group-checkbox"
                  />
                  <span className="group-name">{group.name}</span>
                  <span className="group-count">
                    {group.permissions.filter((p) => selectedPermissions.includes(p)).length}/{group.permissions.length}
                  </span>
                </label>
              </div>
              <div className="group-permissions">
                {group.permissions.map((permission) => (
                  <label
                    key={permission}
                    className={`permission-item ${
                      selectedPermissions.includes(permission) ? "selected" : ""
                    } ${disabled ? "disabled" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handleTogglePermission(permission)}
                      disabled={disabled}
                      className="permission-checkbox"
                    />
                    <span className="permission-label">
                      {PERMISSION_LABELS[permission]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionSelector;

