// components/SignatureField.tsx
import { useState, useRef, type ChangeEvent } from 'react';
import { Upload, Edit2, X } from 'lucide-react';

type SignatureFieldProps = {
  signature?: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDraw: () => void;
  onChange: (signature: string) => void;
  onRemove: () => void;
};

export const SignatureField = ({
  signature,
  onUpload,
  onDraw,
  onChange,
  onRemove,
}: SignatureFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {signature ? (
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-center p-2 border border-gray-300 rounded-md">
            <img
              src={signature}
              alt="Firma del usuario"
              className="max-h-20 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDraw}
              className="flex items-center justify-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              <Edit2 className="mr-1 h-3 w-3" /> Cambiar
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center justify-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              <X className="mr-1 h-3 w-3" /> Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full"
            >
              <Upload className="mr-2 h-4 w-4" /> Subir imagen
            </button>
            <button
              type="button"
              onClick={onDraw}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full"
            >
              <Edit2 className="mr-2 h-4 w-4" /> Dibujar firma
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};