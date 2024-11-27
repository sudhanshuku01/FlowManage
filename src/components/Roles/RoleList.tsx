import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiMoreHorizontal } from "react-icons/fi";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

Modal.setAppElement("#root");
interface RoleListProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}
const baseUrl='http://localhost:5000';

const RoleList: React.FC<RoleListProps> = ({ roles, setRoles }) => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownRoleId, setDropdownRoleId] = useState<string | null>(null);

  const handleEditRole = async () => {
    if (!roleName) {
      toastMessage("Role name cannot be empty.", "❌");
      return;
    }

    if (selectedPermissions.length === 0) {
      toastMessage("Please select at least one permission.", "❌");
      return;
    }

    try {
      setLoading(true);
      const updatedRole: Role = {
        id: editingRole!.id,
        name: roleName,
        permissions: selectedPermissions,
      };

      const response = await fetch(
        `${baseUrl}/api/roles/${editingRole!.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRole),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      const updatedRoleData = await response.json();
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === updatedRoleData.id ? updatedRoleData : role
        )
      );
      closeModal();
    } catch (err) {
      toastMessage((err as Error).message, "❌");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  const startEditing = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermissions(role.permissions);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".actions-dropdown")) {
        setDropdownRoleId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toastMessage = (msg: string, icon?: string) => {
    toast(msg, {
      duration: 1500,
      icon: icon,
      style: {
        borderRadius: "40px",
        background: "#333",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: "300",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };

  return (
    <div className="rolelist">
      <div className="rolelist-table__container">
        <table className="rolelist-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.permissions.join(", ")}</td>
                <td>
                  <div className="actions-dropdown">
                    <FiMoreHorizontal
                      className="actions-icon"
                      onClick={() =>
                        setDropdownRoleId(
                          dropdownRoleId === role.id ? null : role.id
                        )
                      }
                    />
                    {dropdownRoleId === role.id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            startEditing(role);
                            setDropdownRoleId(null);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRole && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="role-modal"
          overlayClassName="role-modal__overlay"
        >
          <h2 className="role-modal__title">Edit Role</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditRole();
            }}
          >
            <div className="role-modal__form-group">
              <label>Role Name:</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="role-modal__input"
                placeholder="Enter role name"
              />
            </div>

            <div className="role-modal__form-group">
              <h3 className="role-modal__permissions-title">
                Select Permissions
              </h3>
              {["Read", "Write", "Delete"].map((permission) => (
                <label key={permission} className="role-modal__permission">
                  <input
                    type="checkbox"
                    value={permission}
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                  />
                  {permission}
                </label>
              ))}
            </div>

            <div className="role-modal__actions">
              <button
                type="button"
                className="role-modal__cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="role-modal__submit-button"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RoleList;
