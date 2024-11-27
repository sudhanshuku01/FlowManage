import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import UserList from "./UserList";
import Layout from "../Layout/Layout";
import { IoMdAddCircle } from "react-icons/io";

Modal.setAppElement("#root"); // Set the app element for accessibility

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: string | null;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}
const baseUrl = "http://localhost:5000";

const UserDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/roles`);
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (err) {
        toast.error((err as Error).message);
      }
    };

    fetchRoles();
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setName("");
    setEmail("");
    setStatus("inactive");
    setRole(null);
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

      const createResponse = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      console.log(createResponse)
      const updatedUser = await createResponse.json();

      toastMessage("User created successfully!", "👏");
      setUsers([...users, updatedUser]);
      closeModal();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`${baseUrl}/api/users`);
        const rolesResponse = await fetch(`${baseUrl}/api/roles`);
        if (!usersResponse.ok || !rolesResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const usersData = await usersResponse.json();
        const rolesData = await rolesResponse.json();
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
    <Layout>
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
                onChange={(e) => setRole(e.target.value || null)}
                required
                className="user-modal__input"
              >
                <option value="" disabled>
                  Select Role
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
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
