"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type InvoiceData, getDefaultInvoiceData } from "./types";

const STORAGE_KEY = "crypto-invoice-draft";

/* Invoice state with localStorage persistence — the whole "no DB" layer.
   Restores a saved draft after mount, saves on every change. */
export function useInvoiceDraft() {
  // NOTE: the draft must be loaded in an effect, not the useState
  // initializer — reading localStorage during the first client render
  // makes it differ from the server-rendered HTML and React throws a
  // hydration failure whenever a draft exists.
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    getDefaultInvoiceData
  );
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) {
          setInvoiceData({ ...getDefaultInvoiceData(), ...parsed.data });
        }
      }
    } catch {
      /* corrupt draft — start fresh */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: invoiceData }));
    } catch {
      /* storage full/unavailable — drafts just won't persist */
    }
  }, [invoiceData]);

  const updateInvoiceData = useCallback(
    (updater: (prev: InvoiceData) => InvoiceData) => {
      setInvoiceData(updater);
    },
    []
  );

  const resetDraft = useCallback(() => {
    setInvoiceData(getDefaultInvoiceData());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  return { invoiceData, updateInvoiceData, resetDraft };
}
