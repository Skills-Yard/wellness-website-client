"use client";

import React, { useRef, useState } from "react";
import { Loader2, RotateCcw, X, ZoomIn } from "lucide-react";

const VIEWPORT_SIZE = 280; // CSS px — the visible circular crop area
const OUTPUT_SIZE = 480; // px — the final square photo written to canvas
const MAX_ZOOM = 3;

interface ImageCropModalProps {
  file: File;
  onCancel: () => void;
  /** blob: what gets uploaded. previewUrl: a data URL for showing it
   *  immediately, before the network round trip. */
  onCropped: (blob: Blob, previewUrl: string) => void;
}

/**
 * Plain canvas-based cropper — drag to pan, scroll or the slider to zoom,
 * no extra dependency. Outputs a square JPEG (the circular look comes
 * from CSS `rounded-full` + `overflow-hidden` on the avatar, same as the
 * initials fallback). Ported from the partner app's ImageCropModal.
 */
export default function ImageCropModal({ file, onCancel, onCropped }: ImageCropModalProps) {
  const [imageUrl] = useState(() => URL.createObjectURL(file));
  const imgRef = useRef<HTMLImageElement>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  // Revoked at each real exit (cancel / after the crop is drawn) rather
  // than in a cleanup — a Strict-Mode remount cleanup would revoke the
  // URL out from under the still-loading <img>.
  const revoked = useRef(false);
  const revokeImage = () => {
    if (!revoked.current) {
      revoked.current = true;
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleCancel = () => {
    revokeImage();
    onCancel();
  };

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (img) setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  // "Cover" scaling (like CSS object-fit: cover) so the circle is always
  // filled, then the user's zoom multiplies on top.
  const baseScale = naturalSize
    ? Math.max(VIEWPORT_SIZE / naturalSize.w, VIEWPORT_SIZE / naturalSize.h)
    : 1;
  const effectiveScale = baseScale * zoom;
  const displayW = naturalSize ? naturalSize.w * effectiveScale : VIEWPORT_SIZE;
  const displayH = naturalSize ? naturalSize.h * effectiveScale : VIEWPORT_SIZE;
  const left = (VIEWPORT_SIZE - displayW) / 2 + offset.x;
  const top = (VIEWPORT_SIZE - displayH) / 2 + offset.y;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.originX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (e.clientY - dragRef.current.startY),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((prev) => Math.min(MAX_ZOOM, Math.max(1, prev - e.deltaY * 0.002)));
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleConfirm = () => {
    if (!naturalSize || !imgRef.current) return;
    setProcessing(true);
    // Map the visible circle back to source pixels.
    const srcX = -left / effectiveScale;
    const srcY = -top / effectiveScale;
    const srcSize = VIEWPORT_SIZE / effectiveScale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setProcessing(false);
      return;
    }
    ctx.drawImage(imgRef.current, srcX, srcY, srcSize, srcSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        setProcessing(false);
        if (blob) onCropped(blob, canvas.toDataURL("image/jpeg", 0.9));
        revokeImage();
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-espresso">Adjust your photo</h2>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full p-1.5 text-[#666] transition-colors hover:bg-stone-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="relative mx-auto cursor-grab touch-none overflow-hidden rounded-full bg-stone-900 select-none active:cursor-grabbing"
          style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onWheel={handleWheel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt=""
            onLoad={handleImageLoad}
            draggable={false}
            className="pointer-events-none absolute max-w-none"
            style={{ width: displayW, height: displayH, left, top }}
          />
        </div>
        <p className="mt-2 text-center text-[11px] text-[#999]">
          Drag to reposition, scroll to zoom
        </p>

        <div className="mt-4 flex items-center gap-3">
          <ZoomIn className="h-4 w-4 shrink-0 text-[#999]" />
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-amber-600"
          />
          <button
            type="button"
            onClick={handleReset}
            title="Reset"
            className="shrink-0 rounded-full p-1.5 text-[#999] transition-colors hover:bg-stone-100"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-medium text-[#666] transition-colors hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!naturalSize || processing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
            Use Photo
          </button>
        </div>
      </div>
    </div>
  );
}
