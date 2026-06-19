import AdminGuard from "../Components/AdminGuard.jsx";
import Sidebar from "./../Components/Sidebar/Sidebar.jsx";


export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}