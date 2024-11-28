import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Modal from "react-modal";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";

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

interface UserListProps {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  roles: Role[];
}
const UserList: React.FC<UserListProps> = ({ users, setUsers, roles }) => {
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "alphabetical" | "status">(
    "all"
  );

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dropdownUserId, setDropdownUserId] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.querySelector(".dropdown-menu");
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setDropdownUserId("");
      }
    };

    if (dropdownUserId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownUserId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const applyFilters = (): User[] => {
    let filteredUsers = [...users];

    if (search.trim()) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (filter) {
      case "alphabetical":
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "status":
        filteredUsers.sort((a, b) => {
          if (a.status === "active" && b.status === "inactive") return -1;
          if (a.status === "inactive" && b.status === "active") return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    return filteredUsers;
  };

  const filteredUsers = applyFilters();

  const handleEditUser = async (updatedUser: User) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${updatedUser._id}`,
        updatedUser
      );
      if (!response.data.success) {
        throw new Error("Failed to update user");
      }
      const updatedData = await response.data.user;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedData._id ? updatedData : user
        )
      );

      toastMessage("User updated successfully.", "👏");
      setEditingUser(null);
    } catch (err) {
      toastMessage((err as Error).message, "❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`
      );
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toastMessage(response.data.message, "👏");
      } else {
        toastMessage(response.data.message, "❌");
      }
    } catch (err) {
      toastMessage((err as Error).message, "❌");
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => setEditingUser(null);

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
    <div className="user-list__container">
      {/* Filter Section */}
      <div className="user-list__filter">
        <div className="user-list__searchbox">
          <p>
            <IoSearchOutline />
          </p>
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "alphabetical" | "status")
          }
          className="user-list__filter-dropdown"
        >
          <option value="all">All Users</option>
          <option value="alphabetical">Alphabetical Order</option>
          <option value="status">Status Order</option>
        </select>
      </div>

      {/* User Table */}
      <div className="user-list__table-container">
        <table className="user-list__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>
                  <Link
                    className="user-list__table-email"
                    to={`mailto:${user.email}`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {user.email}
                  </Link>
                </td>
                <td>
                  <span
                    className={`status-label ${
                      user.status === "active" ? "active" : "inactive"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  {roles.find((role) => role._id === user.role)?.name ||
                    "No Role"}
                </td>
                <td>
                  <div className="actions-dropdown">
                    <FiMoreHorizontal
                      className="actions-icon"
                      onClick={() =>
                        setDropdownUserId(
                          dropdownUserId === user._id ? "" : user._id
                        )
                      }
                    />
                    {dropdownUserId === user._id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setEditingUser(user);
                            setDropdownUserId("");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            handleDeleteUser(user._id);
                            setDropdownUserId("");
                          }}
                        >
                          Delete
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

      {/* Edit User Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onRequestClose={closeModal}
          className="user-modal"
          overlayClassName="user-modal__overlay"
        >
          <h2 className="user-model__title">Edit User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUser(editingUser);
            }}
            className="user-modal__form"
          >
            <div className="user-modal__form-group">
              <label className="user-modal__label">Name:</label>
              <input
                className="user-modal__input"
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
            </div>
            <div className="user-modal__form-group">
              <label className="user-model_lable">Email:</label>
              <input
                className="user-modal__input"
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </div>
            <div className="user-modal__form-group">
              <label className="user-modal__label">Status:</label>
              <select
                className="user-modal__input"
                value={editingUser.status}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    status: e.target.value as "active" | "inactive",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="user-modal__form-group">
              <label className="user-modal__label">Role:</label>
              <select
                className="user-modal__input"
                value={editingUser.role}
                onChange={(e) => {
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value,
                  });
                }}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
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
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserList;
