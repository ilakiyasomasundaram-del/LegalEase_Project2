import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api" });

export const getTemplates = () => api.get("/templates");
export const getDocuments = () => api.get("/documents");
export const getDocument = (id) => api.get(`/documents/${id}`);
export const generateDocument = (payload) => api.post("/documents/generate", payload);
export const updateDocument = (id,payload) => api.put(`/documents/${id}`, payload);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
export default api;