"use client";

import { X, Trash2, MessageSquare, ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/products";

export interface CartItem {
  id: string;
  name: string;
  configuration: string;
  fabric: string;
  color: string;
  dimensions: string;
  quantity: number;
  price: string;
  priceNum: number;
  image: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity
}: CartModalProps) {
  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.priceNum * item.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    const lines = [
      "Hi URU Furniture, I'd like to place an order / consultation for:",
      ""
    ];

    items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name} × ${item.quantity}`);
      lines.push(`   Configuration: ${item.configuration}`);
      lines.push(`   Fabric: ${item.fabric}`);
      lines.push(`   Colour: ${item.color}`);
      lines.push(`   Dimensions: ${item.dimensions}`);
      lines.push(`   Price: ${item.price}`);
      lines.push("");
    });

    lines.push(`Estimated Total: ₹${totalAmount.toLocaleString("en-IN")}`);
    lines.push("");
    lines.push("Could you please confirm fabric availability, delivery timeline, and shipping charges?");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#fffefa] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ded9d0] relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#ded9d0]">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8a847b]">
              Your Selection
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#171614] mt-0.5">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#716c65] hover:text-[#171614] hover:bg-[#eae5dc] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-[#716c65]">
              <p className="text-base font-medium mb-1">Your cart is empty.</p>
              <p className="text-xs text-[#8a847b]">
                Select a sofa model from the Cloud Collection to start customizing.
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex gap-4 p-3.5 rounded-2xl bg-[#f7f5f0] border border-[#e4ded5] relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0"
                />

                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-start justify-between">
                    <h4 className="font-serif text-lg font-medium text-[#171614] truncate">
                      {item.name}
                    </h4>
                    <span className="text-sm font-semibold text-[#171614] tabular-nums">
                      {item.price}
                    </span>
                  </div>

                  <div className="text-xs text-[#716c65] space-y-0.5 mt-1">
                    <p>Config: <span className="text-[#171614] font-medium">{item.configuration}</span></p>
                    <p>Fabric: <span className="text-[#171614] font-medium">{item.fabric} · {item.color}</span></p>
                    <p className="text-[11px] text-[#8a847b]">{item.dimensions}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-[#eae5dc] text-xs font-bold hover:bg-[#ded8cc]"
                    >
                      −
                    </button>
                    <span className="text-xs font-semibold tabular-nums px-1">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-[#eae5dc] text-xs font-bold hover:bg-[#ded8cc]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="absolute right-3 top-3 text-[#9a4d42] hover:text-red-700 p-1"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-[#ded9d0] space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-[#716c65]">Estimated Subtotal</span>
              <span className="font-serif text-2xl font-bold text-[#171614] tabular-nums">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#257147] hover:bg-[#1e5c39] text-white rounded-full font-semibold text-sm transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order on WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-[11px] text-center text-[#8a847b]">
              Your configurations and fabric specifications will be transmitted securely to our WhatsApp advisors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
