import React from "react";
import { InspectionItem } from "@/lib/data";
import { Navigation, X, MapPin, Phone } from "lucide-react";

interface DirectionsModalProps {
  directionsItem: InspectionItem | null;
  onClose: () => void;
}

export function DirectionsModal({ directionsItem, onClose }: DirectionsModalProps) {
  if (!directionsItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {directionsItem.shopName}
              </h3>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                {directionsItem.distance}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="absolute top-10 left-12 flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white animate-ping" />
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white absolute" />
            <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
              Officer #408
            </span>
          </div>

          <div className="absolute bottom-10 right-14 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-rose-500 drop-shadow-md" />
            <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold shadow">
              {directionsItem.shopName}
            </span>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1="64"
              y1="50"
              x2="280"
              y2="140"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          </svg>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Address:</span>
              <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[200px] truncate">
                {directionsItem.address}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Circle:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                {directionsItem.circle}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Phone:</span>
              <span className="text-slate-900 dark:text-white font-mono">
                {directionsItem.phone}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${directionsItem.phone}`}
              className="h-12 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700"
            >
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Call Trader</span>
            </a>

            <button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${directionsItem.lat},${directionsItem.lng}`;
                window.open(url, "_blank");
              }}
              className="h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Maps</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectionsModal;
