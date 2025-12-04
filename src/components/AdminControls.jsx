import { useState, useEffect } from "react";
import {
  Settings,
  Users,
  Plus,
  Trash2,
  RefreshCw,
  X,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";


export default function AdminControls() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lead");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("United States of America");
  const [showPassword, setShowPassword] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      // setUsers(dummyUsers);
      setLoadingUsers(false);
    }, 800);
  }, []);

  const addUser = () => {
    const newUser = {
      user_id: String(Date.now()),
      email,
      full_name: "N/A",
      created_at: new Date().toISOString(),
      role,
      status: false,
      country,
    };

    setUsers([newUser, ...users]);
    setShowCreateModal(false);
    setEmail("");
    setPassword("");
    showToast("User Created Successfully!", "success");
  };

  const deleteUser = () => {
    setUsers(users.filter((u) => u.user_id !== selectedUser.user_id));
    setShowDeleteModal(false);
    showToast("User Deleted", "success");
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filtered.slice(pageStart, pageStart + rowsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Settings className="text-blue-600 w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Controls</h1>
        <p className="text-gray-600">Manage users and system settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 border rounded-lg shadow">
          <Users className="text-blue-500 mb-2" />
          <h3 className="font-semibold text-gray-900">Total Users</h3>
          <p className="text-gray-700">{users.length}</p>
        </div>
        <div className="bg-white p-6 border rounded-lg shadow">
          <Users className="text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Paid Users</h3>
          <p className="text-gray-700">
            {users.filter((u) => u.status === true).length}
          </p>
        </div>
        <div className="bg-white p-6 border rounded-lg shadow">
          <Users className="text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Unpaid Users</h3>
          <p className="text-gray-700">
            {users.filter((u) => u.status === false).length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 border rounded-lg shadow-lg">
        <div className="flex justify-between mb-5">
          <button
            className="bg-gray-200 px-4 py-2 rounded flex gap-2"
            onClick={() => setLoadingUsers(true)}
          >
            <RefreshCw className="w-4" /> Refresh
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4" /> Create User
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            className="border w-full pl-10 px-3 py-2 rounded-md"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadingUsers ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.user_id} className="border-t">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <select
                      className="border px-2 py-1 rounded"
                      defaultValue={u.status ? "paid" : "unpaid"}
                      onChange={(e) =>
                        setUsers(
                          users.map((user) =>
                            user.user_id === u.user_id
                              ? { ...user, status: e.target.value === "paid" }
                              : user
                          )
                        )
                      }
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className="text-red-600"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft />
          </button>

          <p>
            Page {currentPage} of {Math.ceil(filtered.length / rowsPerPage)}
          </p>

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
            disabled={currentPage === Math.ceil(filtered.length / rowsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 p-4 bg-white border rounded-lg shadow-lg flex gap-3">
          {toast.type === "success" ? (
            <Check className="text-green-600" />
          ) : (
            <AlertCircle className="text-red-600" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Create User</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Email"
                className="border w-full px-3 py-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="border w-full px-3 py-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <select
                className="border w-full px-3 py-2 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="lead">Lead</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="border w-full px-3 py-2 rounded"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>United States of America</option>
                <option>United Kingdom</option>
                <option>Ireland</option>
              </select>
            </div>

            <button
              onClick={addUser}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Create User
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-center">
            <AlertCircle className="text-red-600 w-12 h-12 mx-auto mb-3" />
            <h2 className="font-semibold text-lg">Delete User?</h2>
            <p className="text-gray-600 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2 rounded bg-gray-200"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded bg-red-600 text-white"
                onClick={deleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
