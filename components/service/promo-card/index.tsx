"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Star, Volume2, VolumeX, Play } from "lucide-react";
import { Card } from "@/ui/card";
import type { PromoCardItem } from "@/types/service-page";

interface PromoCardProps {
  data: PromoCardItem;
  onViewDetails?: (id: string) => void;
  onAdd?: (id: string) => void;
}

export default function PromoCard({ data, onViewDetails, onAdd }: PromoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <Card className="bg-white border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Media Section */}
      <div className="relative w-full aspect-[16/9] bg-[#F8FAFC] overflow-hidden">
        {data.media.type === "video" ? (
          <>
            <video
              ref={videoRef}
              src={data.media.src}
              poster={data.media.poster}
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
              onClick={togglePlay}
            />

            {/* Play overlay */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 cursor-pointer border-none"
              >
                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
              </button>
            )}

            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer border-none"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Video progress bar placeholder */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
              <div className="h-full bg-white/80 w-1/3 rounded-r-full" />
            </div>
          </>
        ) : (
          <Image
            src={data.media.src}
            alt={data.media.alt}
            fill
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
        )}

        {/* Overlay text on media */}
        {data.overlay && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
              <h3 className="text-white text-xl md:text-2xl font-black leading-tight drop-shadow-md">
                {data.overlay.headline}
              </h3>
              {data.overlay.sublines?.map((line, idx) => (
                <p key={idx} className="text-white/80 text-xs font-medium drop-shadow-sm">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Badge + Title Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            {data.badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-sm">
                🏆 {data.badge}
              </span>
            )}
            <h3 className="text-base md:text-lg font-bold text-[#0F172A] leading-snug">
              {data.title}
            </h3>
          </div>

          {/* Add button */}
          <button
            onClick={() => onAdd?.(data.id)}
            className="shrink-0 px-5 py-2 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#0F172A] bg-white hover:border-amber-500 hover:text-amber-600 transition-all cursor-pointer shadow-sm"
          >
            Add
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="w-4 h-4 fill-[#F59E0B] stroke-none" />
          <span className="font-semibold text-[#F59E0B]">{data.rating}</span>
          <span className="text-slate-400 font-normal">
            ({data.reviewCount >= 1000
              ? `${(data.reviewCount / 1000).toFixed(0)}K`
              : data.reviewCount.toLocaleString()}{" "}
            reviews)
          </span>
        </div>

        {/* Price & Duration */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-[#0F172A]">
            Starts at ₹{data.currentPrice.toLocaleString("en-IN")}
          </span>
          {data.originalPrice && data.originalPrice > data.currentPrice && (
            <span className="line-through text-slate-400 text-xs">
              ₹{data.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-[#64748B]">•</span>
          <span className="text-[#64748B]">{data.duration}</span>
        </div>

        {/* Highlights */}
        {data.highlights.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {data.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#64748B]">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* View Details link */}
        <button
          onClick={() => onViewDetails?.(data.id)}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer transition-colors border-none bg-transparent p-0 pt-1"
        >
          View details
        </button>
      </div>
    </Card>
  );
}
