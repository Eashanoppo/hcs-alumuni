"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Registrant } from '@/types';

interface RegistrationContextType {
  data: Partial<Registrant>;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<Registrant>) => void;
  setStep: (step: number) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<Registrant>>({
    attending: 'yes',
    volunteer_status: false,
    spouse_attending: false,
    children_count: 0,
    guests_count: 0,
    admission_class: '',
    leaving_class: '',
    certificate: 'SSC',
    ssc_batch: '',
    admission_year: '',
    leaving_year: '',
    batch: '' as any,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const updateData = (updates: Partial<Registrant>) => setData((prev) => ({ ...prev, ...updates }));

  return (
    <RegistrationContext.Provider value={{ data, step, nextStep, prevStep, updateData, setStep }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) throw new Error('useRegistration must be used within a RegistrationProvider');
  return context;
}
