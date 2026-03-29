"use client";

import { useState, useEffect } from "react";
import {
  ImageIcon,
  Plus,
  Trash2,
  Calendar,
  LayoutDashboard,
  Loader2,
  Camera,
  ArrowLeft,
  Image as ImageIconLucide,
} from "lucide-react";
import Link from "next/link";
import {
  adminCreateGalleryPhoto,
  adminDeleteGalleryPhoto,
} from "@/app/actions/admin";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useNotification } from "@/lib/contexts/NotificationContext";
import ImageCropperModal from "@/components/ui/ImageCropperModal";

export default function AdminGallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    title_bn: "",
    tag: "Events",
    size: "small",
  });
  const { notify, confirm } = useNotification();

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Failed to load photos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onCropComplete = (croppedFile: File) => {
    setImageToCrop(null);
    setFile(croppedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      notify("Please select a photo", "error");
      return;
    }

    try {
      setUploading(true);
      const image_url = await uploadToCloudinary(file);
      await adminCreateGalleryPhoto({
        ...form,
        image_url,
      });
      setFile(null);
      setForm({ title: "", title_bn: "", tag: "Events", size: "small" });
      notify("Photo added to gallery!", "success");
      await loadPhotos();
    } catch (error: any) {
      notify(`Upload failed: ${error.message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete this photo?");
    if (!isConfirmed) return;
    try {
      await adminDeleteGalleryPhoto(id);
      await loadPhotos();
      notify("Photo deleted successfully", "success");
    } catch (error: any) {
      notify(`Delete failed: ${error.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-8 md:p-12">
      {imageToCrop && (
        <ImageCropperModal 
          image={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onCropComplete={onCropComplete}
          aspect={4 / 3}
        />
      )}
      <header className="flex items-center gap-6 mb-12">
        <Link
          href="/admin/dashboard"
          className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
        >
          <ArrowLeft size={20} className="text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            Photo Gallery Management
          </h1>
          <p className="text-muted text-sm font-medium">
            Manage memories and event captures for the alumni portal.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 sticky top-12">
            <h3 className="text-xl font-black text-primary mb-8 flex items-center gap-3">
              <Plus size={24} className="text-[#CEB888]" />
              Add to Gallery
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block ml-2">
                  Select Photo
                </label>
                <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-4 text-center hover:border-primary transition-all cursor-pointer bg-[#FAFAF7] group h-[200px] flex items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    required
                    onChange={handlePhotoSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    accept="image/*"
                  />
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera
                        className="text-muted group-hover:text-primary"
                        size={32}
                      />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Upload Image
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">
                  Memory Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-bold"
                  placeholder="e.g. Reunion 2026 - Cultural Night"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">
                    Category / Tag
                  </label>
                  <select
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full px-6 py-4 bg-[#FAFAF7] border-none rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-black text-[10px] uppercase tracking-widest"
                  >
                    <option value="Events">Events</option>
                    <option value="Campus">Campus</option>
                    <option value="Sports">Sports</option>
                    <option value="Historic">Historic</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <ImageIconLucide size={18} /> Add Photo
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2
                className="animate-spin mx-auto text-primary/20"
                size={48}
              />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
              <ImageIconLucide
                size={48}
                className="mx-auto text-gray-100 mb-6"
              />
              <p className="text-muted font-bold tracking-tight">
                Gallery is empty.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-premium transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-[#FAFAF7] border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#CEB888]">
                        {p.tag}
                      </span>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="font-black text-primary tracking-tight line-clamp-1">
                      {p.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
