import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { BrandWordmark } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-brand font-bold text-white">
            <BrandWordmark />
          </h1>
          <p className="mt-1 text-sm text-outline">Admin Panel</p>
        </div>

        <div className="glass glass-border rounded-lg p-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
