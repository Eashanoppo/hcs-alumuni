"use client";

import { useRegistration } from "./RegistrationContext";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Shirt,
  MessageSquare,
} from "lucide-react";

export default function Step4() {
  const { nextStep, prevStep, updateData, data } = useRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-primary mb-2">
          অংশগ্রহণ সংক্রান্ত তথ্য (Participation)
        </h2>
        <p className="text-muted text-sm">
          অনুষ্ঠানে আপনার অংশগ্রহণ নিশ্চিত করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-bold text-primary">
              আপনি কি অনুষ্ঠানে উপস্থিত থাকবেন?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {["হ্যাঁ (Yes)", "না (No)"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="attending"
                    checked={data.attending === (opt === "হ্যাঁ (Yes)")}
                    onChange={() =>
                      updateData({ attending: opt === "হ্যাঁ (Yes)" })
                    }
                    className="w-4 h-4 text-primary focus:ring-accent"
                  />
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {data.attending && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-primary">
                  স্ত্রী/স্বামী কি অংশগ্রহণ করবেন? (Spouse Attending?)
                </label>
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={data.spouse_attending || false}
                      onChange={(e) => updateData({ spouse_attending: e.target.checked })}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <span className="text-sm font-bold text-muted group-hover:text-primary transition-colors">
                    {data.spouse_attending ? 'হ্যাঁ' : 'না'}
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-primary">
                  সন্তান সংখ্যা (Total Children)
                </label>
                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all font-bold"
                    value={data.children_count || 0}
                    onChange={(e) => updateData({ children_count: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <p className="text-[10px] text-muted font-bold uppercase tracking-wider">প্রথম সন্তান ফ্রি, পরবর্তী প্রতিজন ২০০ টাকা</p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary">
              টি-শার্ট সাইজ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Shirt
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <select
                required
                className="w-full bg-background border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-accent transition-all"
                value={data.tshirt_size || ""}
                onChange={(e) =>
                  updateData({ tshirt_size: e.target.value as any })
                }
              >
                <option value="">সাইজ নির্বাচন করুন</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-primary">
            বিশেষ বার্তা বা পরামর্শ
          </label>
          <textarea
            className="w-full bg-background border-none rounded-xl p-3 focus:ring-2 focus:ring-accent transition-all min-h-25"
            placeholder="আমাদের জন্য আপনার কোনো মেসেজ থাকলে লিখুন..."
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            className="w-full sm:w-auto px-10 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            পূর্ববর্তী ধাপ (Back)
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-12 py-4 rounded-xl bg-primary text-white font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            পরবর্তী ধাপ (Next)
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
