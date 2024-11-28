import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import UserList from "./UserList";
import Layout from "../Layout/Layout";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";

Modal.setAppElement("#root"); // Set the app element for accessibility

interface User {
  _id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: string;
}

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

const UserDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [role, setRole] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setName("");
    setEmail("");
    setStatus("inactive");
    setRole("");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newUser = {
        name,
        email,
        status,
        role,
      };

      const createResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        newUser
      );
      if (createResponse && createResponse.data.success) {
        setUsers([...users, createResponse.data.user]);
        toastMessage(createResponse.data.message, "👏");
      } else {
        toastMessage(createResponse.data.message, "❌");
      }
      closeModal();
    } catch (err) {
      toastMessage((err as Error).message, "❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users`
        );
        const rolesResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/roles`
        );
        if (!usersResponse.data.success || !rolesResponse.data.success) {
          throw new Error("Failed to fetch data");
        }
        const usersData = await usersResponse.data.users;
        const rolesData = await rolesResponse.data.roles;
        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        toastMessage((err as Error).message, "❌");
      }
    };

    fetchData();
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
    <Layout
      title="User Management Dashboard | FlowManage"
      description="Efficiently manage users with the User Management Dashboard in RoleGuard. Create, edit, and manage user roles and permissions seamlessly."
      keywords="user management dashboard, manage users, role-based access control, RBAC, user roles, admin tools, RoleGuard"
      author="Sudhanshu Kushwaha"
      type="website"
    >
      <section className="user-dashboard">
        <header className="user-dashboard__header">
          <h1 className="user-dashboard__title">User Dashboard</h1>
          <button className="user-dashboard__add-button" onClick={openModal}>
            <IoMdAddCircle size={20} className="user-dashboard__icon" />
            Add User
          </button>
        </header>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="user-modal"
          overlayClassName="user-modal__overlay"
        >
          <h2 className="user-modal__title">New User</h2>
          <form className="user-modal__form" onSubmit={handleCreateUser}>
            <div className="user-modal__form-group">
              <label className="user-modal__label" htmlFor="user-name">
                Name:
              </label>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="user-modal__input"
              />
            </div>
            <div className="user-modal__form-group">
              <label className="user-modal__label" htmlFor="user-email">
                Email:
              </label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="user-modal__input"
              />
            </div>
            <div className="user-modal__form-group">
              <label className="user-modal__label" htmlFor="user-status">
                Status:
              </label>
              <select
                id="user-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "inactive")
                }
                required
                className="user-modal__input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="user-modal__form-group">
              <label className="user-modal__label" htmlFor="user-role">
                Role:
              </label>
              <select
                id="user-role"
                value={role || ""}
                onChange={(e) => setRole(e.target.value || "")}
                required
                className="user-modal__input"
              >
                <option value="" disabled>
                  Select Role
                </option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="user-modal__actions">
              <button
                type="button"
                onClick={closeModal}
                className="user-modal__cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="user-modal__submit-button"
              >
                {loading ? "Creating..." : "Add User"}
              </button>
            </div>
          </form>
        </Modal>

        <section className="user-dashboard__list">
          <UserList users={users} setUsers={setUsers} roles={roles} />
        </section>
      </section>
    </Layout>
  );
};

export default UserDashboard;
