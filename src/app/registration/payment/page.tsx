"use client";

import { useRegistration } from "@/components/registration/RegistrationContext";
import {
  CheckCircle2,
  CreditCard,
  Copy,
  AlertCircle,
  Phone,
  ArrowRight,
  Loader2,
  User,
} from "lucide-react";
import { useState, Suspense } from "react";
import { submitPayment } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { getRegistrantById } from "@/lib/db";
import { useEffect } from "react";

function PaymentForm() {
  const { data, updateData } = useRegistration();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const registrantId = data.id || urlId || "TEMP_ID";

  const [txId, setTxId] = useState("");
  const [sender, setSender] = useState("");
  const { notify } = useNotification();

  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (urlId && !data.id) {
        try {
          const remoteData = await getRegistrantById(urlId);
          if (remoteData) {
            updateData(remoteData);
            setDataLoaded(true);

            // Set session cookie if alumni_number exists
            if (remoteData.alumni_number) {
              document.cookie = `alumni_session=${remoteData.alumni_number}; path=/; max-age=86400; SameSite=Lax`;
              window.dispatchEvent(new Event("auth-change"));
            }
          }
        } catch (error) {
          console.error("Failed to load registrant data:", error);
        }
      } else if (data.id) {
        setDataLoaded(true);
        // Also set cookie if already have data
        if (data.alumni_number) {
          document.cookie = `alumni_session=${data.alumni_number}; path=/; max-age=86400; SameSite=Lax`;
          window.dispatchEvent(new Event("auth-change"));
        }
      }
    }
    loadData();
  }, [urlId, data.id, data.alumni_number, updateData]);

  const ALUMNI_FEE = 700;
  const SPOUSE_FEE = data.spouse_attending ? 300 : 0;
  const childrenCount = data.children_count || 0;
  const CHILDREN_FEE = childrenCount > 1 ? (childrenCount - 1) * 200 : 0;
  const total = ALUMNI_FEE + SPOUSE_FEE + CHILDREN_FEE;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitPayment({
        registrant_id: registrantId,
        amount: total,
        method: "BKASH",
        transaction_id: txId,
        sender_number: sender,
        status: "PENDING",
      });

      notify(
        "পেমেন্ট যাচাইয়ের জন্য পাঠানো হয়েছে। আমরা ২৪ ঘণ্টার মধ্যে নিশ্চিত করবো।",
        "success",
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Payment submission failed:", error);
      notify("পেমেন্ট সাবমিশন ব্যর্থ হয়েছে।", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter uppercase">
          Payment Verification
        </h1>
        <p className="text-muted font-black uppercase tracking-[0.3em] text-[10px]">
          Secure Institutional Transaction Portal
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-8">
              <h3 className="font-black text-primary mb-8 flex items-center gap-3 text-lg tracking-tight">
                <CheckCircle2 size={24} className="text-[#1F3D2B]" />
                অর্ডার সামারি
              </h3>
              <div className="space-y-5 text-sm">
                <div className="flex justify-between items-center p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100/50">
                  <span className="text-muted font-bold text-[10px] uppercase tracking-widest">
                    রেজিস্ট্রেশন ফি (Alumni)
                  </span>
                  <span className="font-black text-primary">
                    {ALUMNI_FEE} BDT
                  </span>
                </div>
                {data.spouse_attending && (
                  <div className="flex justify-between items-center p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100/50">
                    <span className="text-muted font-bold text-[10px] uppercase tracking-widest">
                      স্ত্রী/স্বামী ফি (Spouse)
                    </span>
                    <span className="font-black text-primary">
                      {SPOUSE_FEE} BDT
                    </span>
                  </div>
                )}
                {childrenCount > 0 && (
                  <div className="flex justify-between items-center p-4 bg-[#FAFAF7] rounded-2xl border border-gray-100/50">
                    <span className="text-muted font-bold text-[10px] uppercase tracking-widest">
                      সন্তান ফি ({childrenCount} জন)
                    </span>
                    <span className="font-black text-primary">
                      {CHILDREN_FEE} BDT
                    </span>
                  </div>
                )}
                <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="font-black text-primary uppercase text-xs tracking-widest">
                    সর্বমোট (Total)
                  </span>
                  <span className="text-3xl font-black text-primary tracking-tighter">
                    {total} BDT
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#1F3D2B] rounded-4xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={24} className="text-[#CEB888]" />
                  <p className="text-xs font-black uppercase tracking-widest text-[#CEB888]">
                    Reference Note
                  </p>
                </div>
                <p className="text-sm leading-relaxed font-bold opacity-80">
                  পেমেন্ট করার সময় রেফারেন্সে আপনার{" "}
                  <span className="text-white underline underline-offset-4 decoration-[#CEB888]">
                    ইমেইল
                  </span>{" "}
                  অথবা{" "}
                  <span className="text-white underline underline-offset-4 decoration-[#CEB888]">
                    মোবাইল নম্বর
                  </span>{" "}
                  অবশ্যই লিখুন।
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[3.5rem] shadow-premium border border-gray-100 p-10 md:p-14">
              <div className="flex justify-center mb-12">
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-6 sm:px-12 py-4 rounded-2xl border-2 border-[#1F3D2B] bg-[#1F3D2B]/5 shadow-lg w-full max-w-md"
                >
                  <img
                    src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg"
                    alt="bKash"
                    className="h-8 sm:h-10 w-auto object-contain"
                  />
                  <span className="font-black uppercase tracking-widest text-xs">
                    bKash Payment Selected
                  </span>
                </div>
              </div>

              <div className="bg-[#FAFAF7] rounded-[2.5rem] p-8 mb-12 border border-gray-100">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6">
                  Payment Instructions
                </p>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-gray-100 gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto text-center sm:text-left">
                      <div className="p-4 bg-[#1F3D2B]/5 rounded-2xl text-[#1F3D2B] shrink-0">
                        <Phone size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-black text-muted uppercase tracking-[0.2em] mb-1 wrap-break-word whitespace-normal">
                          Send Money To
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-primary tracking-tighter wrap-break-word whitespace-normal">
                          01912-591492
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText("01912-591492");
                        notify("নাম্বার কপি করা হয়েছে।", "success");
                      }}
                      className="p-4 rounded-2xl bg-[#FAFAF7] text-primary hover:bg-[#1F3D2B] hover:text-white transition-all shadow-sm w-full sm:w-auto flex justify-center shrink-0"
                    >
                      <Copy size={22} />
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                      আপনার নম্বর (Sender Number)
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold tracking-widest text-primary"
                      placeholder="017XXXXXXXX"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                      ট্রানজেকশন আইডি (TrxID)
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#FAFAF7] border border-gray-100 rounded-2xl p-5 focus:ring-2 focus:ring-[#1F3D2B]/10 transition-all font-bold uppercase tracking-[0.2em] text-primary"
                      placeholder="TRX12345678"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-black py-4 sm:py-6 px-4 rounded-2xl hover:bg-black hover:shadow-2xl transition-all flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm lg:text-lg uppercase tracking-widest disabled:opacity-50 text-center"
                  >
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        Verify & Confirm Payment
                        <ArrowRight size={20} className="sm:w-6 sm:h-6 shrink-0" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.location.href = "/profile"}
                    className="w-full mt-4 bg-gray-50 text-primary font-black py-4 px-4 rounded-2xl hover:bg-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-widest text-center border border-gray-200"
                  >
                    <User size={18} />
                    Back to Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-28">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      }
    >
      <PaymentForm />
    </Suspense>
  );
}
