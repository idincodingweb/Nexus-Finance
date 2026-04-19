import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Camera, Save, Loader2, Settings as SettingsIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/finance-api";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  
  // Ambil data user terbaru dari localStorage
  const user = useMemo(() => {
    const saved = localStorage.getItem("nexus_user");
    return saved ? JSON.parse(saved) : {};
  }, []);
  
  const [nama, setNama] = useState(user.nama || "");
  const [image, setImage] = useState<string | null>(user.image || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("Max size 2MB, Bro! 😆");
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!nama) return toast.error("Nama wajib diisi!");
    setLoading(true);
    try {
      // Hanya kirim base64 kalau user baru aja pilih gambar baru (data:image...)
      const imagePayload = image?.startsWith("data:") ? image : undefined;
      
      const res = await authApi.updateProfile(user.userId || user.UserID, nama, imagePayload);
      
      if (res.status === "success") {
        // Update LocalStorage dengan data user baru dari server
        localStorage.setItem("nexus_user", JSON.stringify(res.user));
        toast.success("Profil diperbarui! 🔥");
        
        // Kasih jeda dikit biar user liat toast-nya
        setTimeout(() => {
           window.location.reload(); 
        }, 1000);
      } else {
        toast.error(res.message || "Gagal update");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-black tracking-tight">Settings Profil</h1>
          </div>
        </div>

        <div className="bg-card rounded-[35px] border border-border/50 p-8 max-w-md mx-auto shadow-xl shadow-blue-500/5">
          {/* FOTO PROFIL SECTION */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-muted flex items-center justify-center">
                {image ? (
                  <img 
                    src={image} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Jika link Drive gagal load, tampilkan fallback
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${nama}&background=random`;
                    }}
                  />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2.5 bg-blue-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-all hover:scale-110">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <h2 className="mt-4 font-bold text-lg">{nama || "User"}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* FORM SECTION */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase ml-1 text-muted-foreground tracking-widest">Nama Lengkap</Label>
              <Input 
                value={nama} 
                onChange={(e) => setNama(e.target.value)}
                className="py-6 rounded-2xl bg-muted/50 border-none text-black dark:text-white font-medium focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="w-full py-8 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-lg shadow-lg shadow-blue-600/20"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-5 h-5" />}
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;