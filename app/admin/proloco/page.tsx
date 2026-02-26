"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import { API_CONFIG } from "@/lib/api/apiConfig";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { useCategories } from "@/lib/hooks/useCategories";
import { CategoryResponse } from "@/types/category.types";
import { formatDate } from "@/lib/helpers/formatDate";

interface ProlocoUser {
  id: string;
  email: string;
  name: string;
  role: string;
  prolocoCity?: string;
  prolocoName?: string;
  prolocoCode?: string;
  prolocoPresident?: string;
  prolocoPresidentTel?: string;
  prolocoPresidentMail?: string;
  prolocoTel?: string;
  prolocoWebsite?: string;
  prolocoStatus?: string;
  prolocoApprovedAt?: string;
  prolocoAllowedCategories?: Array<{
    id: string;
    nameEn: string;
    nameIt: string;
    slug: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ProlocoManagement() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [prolocoUsers, setProlocoUsers] = useState<ProlocoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<ProlocoUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const { data: categoriesData } = useCategories(true);
  const categoriesList = (categoriesData as CategoryResponse | undefined)?.data || [];

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      router.push("/admin-login");
      return;
    }
    fetchProlocoUsers();
  }, [isAuthenticated, user, router, statusFilter]);

  const fetchProlocoUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = statusFilter
        ? `${API_CONFIG.BASE_URL}/users/proloco?status=${statusFilter}`
        : `${API_CONFIG.BASE_URL}/users/proloco`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProlocoUsers(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Errore nel caricamento degli utenti Pro Loco");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, categoryIds: string[]) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_CONFIG.BASE_URL}/users/proloco/approve`,
        { userId, categoryIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProlocoUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
      setSelectedCategories([]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Errore durante l'approvazione");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Sei sicuro di voler respingere questa richiesta Pro Loco?")) {
      return;
    }
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_CONFIG.BASE_URL}/users/proloco/reject`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProlocoUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Errore durante il rifiuto");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignCategories = async (userId: string, categoryIds: string[]) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_CONFIG.BASE_URL}/users/proloco/${userId}/categories`,
        { categoryIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProlocoUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
      setSelectedCategories([]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Errore durante l'assegnazione delle categorie");
    } finally {
      setActionLoading(false);
    }
  };

  const openApproveModal = (user: ProlocoUser) => {
    setSelectedUser(user);
    setSelectedCategories(user.prolocoAllowedCategories?.map((c) => c.id) || []);
    setIsModalOpen(true);
  };

  const openEditCategoriesModal = (user: ProlocoUser) => {
    setSelectedUser(user);
    setSelectedCategories(user.prolocoAllowedCategories?.map((c) => c.id) || []);
    setIsModalOpen(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestione Pro Loco</h1>
          <p className="mt-2 text-sm text-gray-600">
            Approva o respingi le richieste di registrazione Pro Loco e assegna le categorie consentite.
          </p>
        </div>

        {error && <ErrorMessage error={error} className="mb-6" />}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filtra per stato:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Tutti</option>
              <option value="PENDING">In attesa</option>
              <option value="APPROVED">Approvati</option>
              <option value="REJECTED">Respinti</option>
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pro Loco
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Città
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presidente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contatti
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prolocoUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Nessun utente Pro Loco trovato.
                    </td>
                  </tr>
                ) : (
                  prolocoUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.prolocoName || "—"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.prolocoCode || "—"}
                          </div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.prolocoCity || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.prolocoPresident || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.prolocoPresidentTel || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.prolocoPresidentMail || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{user.prolocoTel || "—"}</div>
                        <div className="text-xs">{user.prolocoWebsite || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.prolocoStatus === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : user.prolocoStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.prolocoStatus === "APPROVED"
                            ? "Approvato"
                            : user.prolocoStatus === "PENDING"
                            ? "In attesa"
                            : "Respinto"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.prolocoAllowedCategories && user.prolocoAllowedCategories.length > 0 ? (
                            user.prolocoAllowedCategories.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {cat.nameIt}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">Nessuna</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt, "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          {user.prolocoStatus === "PENDING" && (
                            <>
                              <button
                                onClick={() => openApproveModal(user)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                Approva
                              </button>
                              <button
                                onClick={() => handleReject(user.id)}
                                disabled={actionLoading}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                Respindi
                              </button>
                            </>
                          )}
                          {user.prolocoStatus === "APPROVED" && (
                            <button
                              onClick={() => openEditCategoriesModal(user)}
                              disabled={actionLoading}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            >
                              Modifica Categorie
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Approval/Category Assignment */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {selectedUser.prolocoStatus === "PENDING"
                    ? "Approva Pro Loco"
                    : "Assegna Categorie"}
                </h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Pro Loco:</strong> {selectedUser.prolocoName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Città:</strong> {selectedUser.prolocoCity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Codice:</strong> {selectedUser.prolocoCode}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleziona Categorie Consentite:
                  </label>
                  <div className="border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
                    {categoriesList.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center mb-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, cat.id]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((id) => id !== cat.id)
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          {cat.nameIt} ({cat.nameEn})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedUser(null);
                      setSelectedCategories([]);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={() => {
                      if (selectedUser.prolocoStatus === "PENDING") {
                        handleApprove(selectedUser.id, selectedCategories);
                      } else {
                        handleAssignCategories(selectedUser.id, selectedCategories);
                      }
                    }}
                    disabled={actionLoading || selectedCategories.length === 0}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading
                      ? "Salvataggio..."
                      : selectedUser.prolocoStatus === "PENDING"
                      ? "Approva e Salva"
                      : "Salva Categorie"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



