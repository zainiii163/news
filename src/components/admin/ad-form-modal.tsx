"use client";

import { useState, useEffect, useCallback } from "react";
import { Ad } from "@/types/ads.types";
import { ErrorMessage } from "@/components/ui/error-message";
import { MediaLibraryModal } from "./media-library-modal";
import { Media } from "@/types/media.types";
import { convertPriceToNumber } from "@/lib/helpers/ad-pricing";
import { useLanguage } from "@/providers/LanguageProvider";
import { getImageUrl, normalizeImageUrl } from "@/lib/helpers/imageUrl";
import { adsApi } from "@/lib/api/modules/ads.api";

interface AdFormModalProps {
  ad?: Ad | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isLoading?: boolean;
  error?: any;
}

const AD_TYPES = [
  { value: "BANNER_TOP", label: "Banner Top" },
  { value: "BANNER_SIDE", label: "Banner Side" },
  { value: "INLINE", label: "Inline" },
  { value: "FOOTER", label: "Footer" },
  { value: "SLIDER_TOP", label: "Slider Top (Homepage Hero)" },
  { value: "SLIDER", label: "Slider" },
  { value: "TICKER", label: "Ticker" },
  { value: "POPUP", label: "Popup" },
  { value: "STICKY", label: "Sticky" },
] as const;

const AD_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "EXPIRED", label: "Expired" },
  { value: "REJECTED", label: "Rejected" },
] as const;

const AD_POSITIONS = [
  { value: "", label: "None (Auto)" },
  { value: "HEADER", label: "Header" },
  { value: "HEADER_LEADERBOARD", label: "Header Leaderboard" },
  { value: "SIDEBAR", label: "Sidebar" },
  { value: "SIDEBAR_RECT", label: "Sidebar Rectangle" },
  { value: "INLINE_ARTICLE", label: "Inline Article (inside news article)" },
  { value: "MID_PAGE", label: "Mid Page (homepage, one slot)" },
  { value: "BETWEEN_SECTIONS_1", label: "Between Sections 1 (homepage)" },
  { value: "BETWEEN_SECTIONS_2", label: "Between Sections 2 (homepage)" },
  { value: "BETWEEN_SECTIONS_3", label: "Between Sections 3 (homepage)" },
  { value: "FOOTER", label: "Footer" },
  { value: "MOBILE", label: "Mobile" },
] as const;

export function AdFormModal({
  ad,
  onSubmit,
  onClose,
  isLoading = false,
  error,
}: AdFormModalProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    name: "", // Optional display name for easier identification (especially for ticker ads)
    type: "BANNER_TOP" as Ad["type"],
    imageUrl: "",
    targetLink: "",
    position: "",
    startDate: "",
    endDate: "",
    price: "",
    status: "PENDING" as Ad["status"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  const handleMediaSelect = (media: Media) => {
    if (media.type === "IMAGE" || media.type === "VIDEO") {
      // Normalize URL to prevent duplicates
      const normalizedUrl = normalizeImageUrl(media.url);
      setFormData({ ...formData, imageUrl: normalizedUrl });
      if (errors.imageUrl) setErrors({ ...errors, imageUrl: "" });
    }
    setShowMediaLibrary(false);
  };

  // Check for booking conflicts
  const checkBookingConflict = useCallback(async () => {
    if (!formData.startDate || !formData.endDate) return;

    const start = new Date(formData.startDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Don't check if start date is in the past (will be caught by validation)
    if (start < now) return;

    // Only check conflicts if position is specified (slider ads can have multiple on same date)
    if (!formData.position) return;

    setIsCheckingConflict(true);
    try {
      const response = await adsApi.checkConflict({
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        position: formData.position || null,
        excludeAdId: ad?.id,
      });

      if (response.data.data.isConflict && response.data.data.conflictingAd) {
        setErrors((prev) => ({
          ...prev,
          startDate: language === "it"
            ? `Questa data e posizione sono già prenotate dall'annuncio: "${response.data.data.conflictingAd.title}". Seleziona una data o posizione diversa.`
            : `This date and position are already booked by ad: "${response.data.data.conflictingAd.title}". Please select a different date or position.`,
        }));
      } else {
        // Clear conflict error if no conflict
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors.startDate?.includes("already booked")) {
            delete newErrors.startDate;
          }
          return newErrors;
        });
      }
    } catch (error) {
      // Silently fail conflict check - don't block form submission
      console.error("Failed to check booking conflict:", error);
    } finally {
      setIsCheckingConflict(false);
    }
  }, [formData.startDate, formData.endDate, formData.position, ad?.id, language]);

  // Check for conflicts when dates or position change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkBookingConflict();
    }, 500); // Debounce conflict check

    return () => clearTimeout(timeoutId);
  }, [checkBookingConflict]);

  useEffect(() => {
    if (ad) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      // Convert price from Decimal to number string if needed
      let priceStr = "";
      if (ad.price !== null && ad.price !== undefined) {
        let numPrice: number | null = null;
        
        if (typeof ad.price === "number") {
          numPrice = ad.price;
        } else if (typeof ad.price === "object" && ad.price !== null) {
          // Handle Prisma Decimal format
          // Try toNumber first (most reliable for Decimal.js)
          if (typeof (ad.price as any).toNumber === "function") {
            numPrice = (ad.price as any).toNumber();
          } else {
            // Fallback to convertPriceToNumber
            numPrice = convertPriceToNumber(ad.price);
          }
        } else if (typeof ad.price === "string") {
          // If it's a string, try to parse it (handle both European and US formats)
          let cleaned = ad.price.replace(/[€$£\s]/g, "").trim();
          
          // Handle European format (comma as decimal separator)
          // First, check if it's a simple European format (e.g., "400,00" or "155000,00")
          // If there's only one comma and it's near the end (last 3 chars), it's likely a decimal separator
          const commaCount = (cleaned.match(/,/g) || []).length;
          const dotCount = (cleaned.match(/\./g) || []).length;
          
          if (commaCount === 1 && !cleaned.includes(".")) {
            // Single comma, no dot - European format: 400,00 or 155000,00
            cleaned = cleaned.replace(",", ".");
          } else if (commaCount === 1 && dotCount === 1) {
            // One comma and one dot - determine which is decimal separator
            const commaIndex = cleaned.indexOf(",");
            const dotIndex = cleaned.indexOf(".");
            if (commaIndex > dotIndex) {
              // Format: 1.234,56 -> 1234.56 (European - dot is thousands, comma is decimal)
              cleaned = cleaned.replace(/\./g, "").replace(",", ".");
            } else {
              // Format: 1,234.56 -> 1234.56 (US - comma is thousands, dot is decimal)
              cleaned = cleaned.replace(/,/g, "");
            }
          } else if (commaCount > 1 && !cleaned.includes(".")) {
            // Multiple commas, no dots - likely thousands separators in European format
            // Last comma is decimal separator, others are thousands
            const lastCommaIndex = cleaned.lastIndexOf(",");
            const beforeLastComma = cleaned.substring(0, lastCommaIndex).replace(/,/g, "");
            const afterLastComma = cleaned.substring(lastCommaIndex + 1);
            cleaned = beforeLastComma + "." + afterLastComma;
          } else {
            // No commas or complex format - treat dots as decimal, remove other commas
            cleaned = cleaned.replace(/,/g, "").replace(/[^0-9.]/g, "");
          }
          
          numPrice = parseFloat(cleaned);
        } else {
          // Try convertPriceToNumber as last resort
          numPrice = convertPriceToNumber(ad.price);
        }
        
        // Store as whole euros only (no decimals) to avoid locale/string corruption
        if (numPrice !== null && !isNaN(numPrice) && numPrice >= 0) {
          priceStr = String(Math.round(numPrice));
        }
      }

      // Use setTimeout to defer state update
      setTimeout(() => {
        setFormData({
          title: ad.title,
          name: ad.name || "", // Support name field if available
          type: ad.type,
          imageUrl: ad.imageUrl,
          targetLink: ad.targetLink,
          position: ad.position || "",
          startDate: formatDateForInput(ad.startDate),
          endDate: formatDateForInput(ad.endDate),
          price: priceStr,
          status: ad.status,
        });
      }, 0);
    } else {
      // Set default dates for new ad
      const now = new Date();
      const future = new Date();
      future.setMonth(future.getMonth() + 1); // Default to 1 month from now

      const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      // Use setTimeout to defer state update
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          startDate: formatDateForInput(now),
          endDate: formatDateForInput(future),
        }));
      }, 0);
    }
  }, [ad]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!(formData.title || "").trim()) {
      newErrors.title =
        language === "it" ? "Il titolo è obbligatorio" : "Title is required";
    } else if ((formData.title || "").length < 3) {
      newErrors.title =
        language === "it"
          ? "Il titolo deve essere di almeno 3 caratteri"
          : "Title must be at least 3 characters";
    } else if ((formData.title || "").length > 255) {
      newErrors.title =
        language === "it"
          ? "Il titolo non può superare i 255 caratteri"
          : "Title must not exceed 255 characters";
    }

    if (!(formData.imageUrl || "").trim()) {
      newErrors.imageUrl =
        language === "it"
          ? "L'URL dell'immagine è obbligatorio"
          : "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl =
          language === "it"
            ? "L'URL dell'immagine deve essere un URL valido"
            : "Image URL must be a valid URL";
      }
    }

    // Target link is now optional, but if provided, must be valid URL
    if ((formData.targetLink || "").trim()) {
      try {
        new URL(formData.targetLink);
      } catch {
        newErrors.targetLink =
          language === "it"
            ? "Il link di destinazione deve essere un URL valido"
            : "Target link must be a valid URL";
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate =
        language === "it"
          ? "La data di fine è obbligatoria"
          : "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Only check if start date is in the past for NEW ads or PENDING ads
      // Allow past dates for ACTIVE/PAUSED ads (for extending campaigns, etc.)
      if (!ad || ad.status === "PENDING") {
        if (start < now) {
          newErrors.startDate =
            language === "it"
              ? "La data di inizio non può essere nel passato"
              : "Start date cannot be in the past";
        }
      }

      if (end <= start) {
        newErrors.endDate =
          language === "it"
            ? "La data di fine deve essere successiva alla data di inizio"
            : "End date must be after start date";
      }
    }

    // Price is optional; when provided must be whole euros (digits only)
    if (formData.price && formData.price.trim() !== "") {
      const digitsOnly = formData.price.toString().replace(/\D/g, "");
      const priceValue = digitsOnly === "" ? NaN : parseInt(digitsOnly, 10);
      if (isNaN(priceValue) || priceValue < 0 || !Number.isInteger(priceValue)) {
        newErrors.price =
          language === "it"
            ? "Il prezzo deve essere un numero intero positivo (es. 400)"
            : "Price must be a whole positive number (e.g. 400)";
      }
    } else {
      // Clear price error if field is empty (it's optional)
      if (errors.price) {
        delete newErrors.price;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate price when provided: whole euros only
    if (formData.price !== undefined && formData.price !== null && formData.price.toString().trim() !== "") {
      const digitsOnly = formData.price.toString().replace(/\D/g, "");
      const priceValue = digitsOnly === "" ? NaN : parseInt(digitsOnly, 10);
      if (isNaN(priceValue) || priceValue < 0 || !Number.isInteger(priceValue)) {
        setErrors((prev) => ({
          ...prev,
          price: language === "it"
            ? "Il prezzo deve essere un numero intero positivo (es. 400)"
            : "Price must be a whole positive number (e.g. 400)",
        }));
        return;
      }
    }

    if (validateForm()) {
      const submitData: any = {
        title: (formData.title || "").trim(),
        imageUrl: normalizeImageUrl((formData.imageUrl || "").trim()), // Normalize to prevent duplicates
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : new Date().toISOString(),
      };

      // Include type only if it's being changed (for updates) or always for new ads
      if (!ad || formData.type !== ad.type) {
        submitData.type = formData.type;
      }

      // Only include name if provided (it's optional)
      if (formData.name && (formData.name || "").toString().trim() !== "") {
        submitData.name = formData.name.toString().trim();
      }

      // Include targetLink - can be empty string or null for optional field
      // Backend accepts null/undefined for optional targetLink
      if (formData.targetLink && (formData.targetLink || "").toString().trim() !== "") {
        submitData.targetLink = formData.targetLink.toString().trim();
      } else if (ad) {
        // When editing, explicitly set to null if empty to allow clearing the link
        submitData.targetLink = null;
      }

      // Only include position if it's selected (not empty)
      if (formData.position && (formData.position || "").toString().trim() !== "") {
        submitData.position = formData.position.toString().trim();
      }

      // Price: whole euros only. Parse digits and send as number to avoid string/locale issues.
      if (formData.price !== undefined && formData.price !== null && formData.price.toString().trim() !== "") {
        const digitsOnly = formData.price.toString().replace(/\D/g, "");
        const priceValue = digitsOnly === "" ? NaN : parseInt(digitsOnly, 10);
        if (!isNaN(priceValue) && priceValue >= 0 && Number.isInteger(priceValue)) {
          submitData.price = priceValue;
        }
      }

      // For updates, include status
      if (ad) {
        submitData.status = formData.status;
      }

      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-none shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {ad ? t("admin.editAd") : t("admin.createAd")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoading}
            title={t("common.close")}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {error && <ErrorMessage error={error} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  language === "it" ? "Titolo annuncio" : "Advertisement title"
                }
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "it" ? "Nome Visualizzazione" : "Display Name"}
                <span
                  className="ml-1 text-xs font-normal text-gray-500"
                  title={
                    language === "it"
                      ? "Opzionale: Nome per identificare facilmente l'annuncio (specialmente per annunci ticker)"
                      : "Optional: Name to easily identify the ad (especially for ticker ads)"
                  }
                >
                  ({language === "it" ? "Opzionale" : "Optional"})
                </span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  language === "it"
                    ? "Es: Ticker Promozione Natale"
                    : "E.g.: Christmas Promotion Ticker"
                }
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {language === "it"
                  ? "Utile per identificare facilmente gli annunci ticker nella lista"
                  : "Useful for easily identifying ticker ads in the list"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.type")} <span className="text-red-500">*</span>
                <span
                  className="ml-2 text-xs font-normal text-gray-500"
                  title={
                    language === "it"
                      ? "Il tipo di annuncio determina le dimensioni e il comportamento dell'annuncio (es. Banner Top, Slider, Popup, ecc.)"
                      : "Ad type determines the size and behavior of the ad (e.g., Banner Top, Slider, Popup, etc.)"
                  }
                >
                  ({language === "it" ? "Tipo Annuncio" : "Ad Type"})
                </span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Ad["type"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {AD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {language === "it"
                      ? type.value === "BANNER_TOP"
                        ? "Banner Superiore"
                        : type.value === "BANNER_SIDE"
                        ? "Banner Laterale"
                        : type.value === "INLINE"
                        ? "In Linea"
                        : type.value === "FOOTER"
                        ? "Piè di Pagina"
                        : type.value === "SLIDER"
                        ? "Slider"
                        : type.value === "TICKER"
                        ? "Ticker"
                        : type.value === "SLIDER_TOP"
                        ? "Slider Superiore (Hero Homepage)"
                        : type.value === "POPUP"
                        ? "Popup"
                        : "Fisso"
                      : type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {language === "it"
                  ? "Il tipo di annuncio definisce le dimensioni e il comportamento (es. Banner Top: 728x90px, Slider: 1920x600px, Slider Top: per la sezione hero della homepage)"
                  : "Ad type defines the size and behavior (e.g., Banner Top: 728x90px, Slider: 1920x600px, Slider Top: for homepage hero section)"}
              </p>
            </div>

            {ad && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.status")}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Ad["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {AD_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.value === "PENDING"
                        ? t("admin.pending")
                        : status.value === "ACTIVE"
                        ? language === "it"
                          ? "Attivo"
                          : "Active"
                        : status.value === "PAUSED"
                        ? language === "it"
                          ? "In Pausa"
                          : "Paused"
                        : status.value === "EXPIRED"
                        ? language === "it"
                          ? "Scaduto"
                          : "Expired"
                        : t("admin.rejected")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "it" ? "URL Immagine/Video" : "Image/Video URL"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    // Normalize URL when user manually enters it to prevent duplicates
                    const normalizedUrl = normalizeImageUrl(e.target.value);
                    setFormData({ ...formData, imageUrl: normalizedUrl });
                    if (errors.imageUrl) setErrors({ ...errors, imageUrl: "" });
                  }}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.imageUrl ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/image.jpg or video.mp4"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowMediaLibrary(true)}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700 whitespace-nowrap"
                  disabled={isLoading}
                >
                  {t("admin.mediaLibrary")}
                </button>
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
              )}
              {formData.imageUrl && (
                <div className="mt-2">
                  {formData.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video
                      src={formData.imageUrl}
                      controls
                      className="max-h-48 w-auto rounded border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLVideoElement).style.display = "none";
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-24 w-auto rounded border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "it" ? "Link di Destinazione" : "Target Link"}
                <span
                  className="ml-1 text-xs font-normal text-gray-500"
                  title={
                    language === "it"
                      ? "Opzionale: Link a cui reindirizzare quando si clicca sull'annuncio"
                      : "Optional: Link to redirect to when clicking the ad"
                  }
                >
                  ({language === "it" ? "Opzionale" : "Optional"})
                </span>
              </label>
              <input
                type="url"
                value={formData.targetLink}
                onChange={(e) => {
                  setFormData({ ...formData, targetLink: e.target.value });
                  if (errors.targetLink)
                    setErrors({ ...errors, targetLink: "" });
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.targetLink ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com (optional)"
                disabled={isLoading}
              />
              {errors.targetLink && (
                <p className="mt-1 text-sm text-red-600">{errors.targetLink}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {language === "it"
                  ? "Opzionale: Se non specificato, l'annuncio non sarà cliccabile"
                  : "Optional: If not specified, the ad will not be clickable"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.price")} (€)
                <span
                  className="ml-1 text-xs font-normal text-gray-500"
                  title={
                    language === "it"
                      ? "Opzionale: Override manuale del prezzo. Se non impostato, il prezzo verrà calcolato automaticamente in base al tipo di annuncio e alla durata."
                      : "Optional: Manual price override. If not set, price will be calculated automatically based on ad type and duration."
                  }
                >
                  ({language === "it" ? "Opzionale" : "Optional"})
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  €
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.price}
                  onChange={(e) => {
                    // Whole euros only: allow only digits to avoid locale/string corruption
                    const cleaned = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, price: cleaned });
                    if (errors.price) setErrors({ ...errors, price: "" });
                  }}
                  onBlur={() => {
                    setFormData((prev) => {
                      const v = (prev.price || "").replace(/^0+/, "") || "";
                      return v !== prev.price ? { ...prev, price: v } : prev;
                    });
                  }}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                  disabled={isLoading}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {language === "it"
                  ? "Opzionale: solo numeri interi (es. 400). Se non impostato, il prezzo viene calcolato in base a tipo e durata."
                  : "Optional: whole euros only (e.g. 400). If not set, price is calculated from type and duration."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "it" ? "Posizione" : "Position"}
                <span
                  className="ml-1 text-xs font-normal text-gray-500"
                  title={
                    language === "it"
                      ? "Opzionale: Posizione specifica dell'annuncio (es. HEADER, SIDEBAR). Se non specificato, verrà assegnato automaticamente in base al tipo."
                      : "Optional: Specific ad position (e.g., HEADER, SIDEBAR). If not specified, will be auto-assigned based on type."
                  }
                >
                  ({language === "it" ? "Opzionale" : "Optional"})
                </span>
              </label>
              <select
                value={formData.position}
                onChange={(e) => {
                  setFormData({ ...formData, position: e.target.value });
                  if (errors.position) {
                    const newErrors = { ...errors };
                    delete newErrors.position;
                    setErrors(newErrors);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {AD_POSITIONS.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {language === "it"
                  ? "Opzionale: Specifica una posizione per prenotare uno slot specifico. Se non specificato, l'annuncio verrà assegnato automaticamente in base al tipo."
                  : "Optional: Specify a position to book a specific slot. If not specified, ad will be auto-assigned based on type."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "it" ? "Data di Inizio" : "Start Date"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                min={ad && ad.status !== "PENDING" ? undefined : new Date().toISOString().slice(0, 16)}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  if (errors.startDate) {
                    const newErrors = { ...errors };
                    delete newErrors.startDate;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading || isCheckingConflict}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
              {isCheckingConflict && (
                <p className="mt-1 text-xs text-gray-500">
                  {language === "it" ? "Verifica conflitti..." : "Checking conflicts..."}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "it" ? "Data di Fine" : "End Date"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                min={formData.startDate || new Date().toISOString().slice(0, 16)}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (errors.endDate) {
                    const newErrors = { ...errors };
                    delete newErrors.endDate;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading || isCheckingConflict}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {ad ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{ad ? "Update Advertisement" : "Create Advertisement"}</>
              )}
            </button>
          </div>
        </form>

        {/* Media Library Modal */}
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={handleMediaSelect}
          filterType="ALL"
          title={
            language === "it"
              ? "Seleziona Immagine o Video dalla Libreria Media"
              : "Select Image or Video from Media Library"
          }
        />
      </div>
    </div>
  );
}
