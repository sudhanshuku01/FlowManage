import React, { useState, useEffect } from "react";
import RoleList from "./RoleList";
import Layout from "../Layout/Layout";
import { IoMdAddCircle } from "react-icons/io";
import Modal from "react-modal";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

Modal.setAppElement("#root");
const baseUrl='http://localhost:5000';

const RoleDashboard: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissions] = useState<string[]>(["Read", "Write", "Delete"]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/roles`);
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await response.json();
        setRoles(data);
      } catch (err) {
        toastMessage((err as Error).message, "❌");
      }
    };

    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
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
      const newRole: Omit<Role, "id"> = {
        name: roleName,
        permissions: selectedPermissions,
      };

      const response = await fetch(`${baseUrl}/api/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      if (!response.ok) {
        throw new Error("Failed to create role");
      }

      const crertedRole = await response.json();
      setRoles([...roles, crertedRole]);
      setRoleName("");
      setSelectedPermissions([]);
      setIsModalOpen(false);
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
    <Layout>
      <div className="role-dashboard">
        <div className="role-dashboard__header">
          <h1 className="role-dashboard__title">Role Dashboard</h1>
          <button
            className="role-dashboard__add-button"
            onClick={() => setIsModalOpen(true)}
          >
            <IoMdAddCircle size={20} className="user-dashboard__icon" />
            Add Role
          </button>
        </div>

        {/* role list */}
        <RoleList roles={roles} setRoles={setRoles} />

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="role-modal"
          overlayClassName="role-modal__overlay"
        >
          <h2 className="role-modal__title">Create New Role</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRole();
            }}
          >
            <div className="role-modal__form-group">
              <label className="role-modal__label">Role Name:</label>
              <input
                type="text"
                value={roleName}
                required={true}
                onChange={(e) => setRoleName(e.target.value)}
                className="role-modal__input"
                placeholder="Enter role name"
              />
            </div>

            <div className="role-modal__form-group">
              <h3 className="role-modal__permissions-title">
                Select Permissions:
              </h3>
              {permissions.map((permission) => (
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
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="role-modal__submit-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Role"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default RoleDashboard;
