"use client";

import { useEffect, useRef } from "react";
import type Hls from "hls.js";

type CampaignVideoProps = {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  className?: string;
};

/**
 * Plays promotional campaign video. Most campaign videos are delivered as
 * HLS (.m3u8) for faster loads. Browsers with native HLS support (Safari,
 * iOS) just get a plain <video src>; everywhere else hls.js is lazy-loaded
 * (only when an .m3u8 source actually needs it) to attach the stream. Plain
 * .mp4 sources always just set src directly.
 */
export default function CampaignVideo({
  src,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  className,
}: CampaignVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = src.endsWith(".m3u8");
    const canPlayNativeHls =
      video.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (!isHls || canPlayNativeHls) {
      video.src = src;
      return;
    }

    let hls: Hls | null = null;
    let cancelled = false;

    import("hls.js").then(({ default: HlsCtor }) => {
      if (cancelled || !video) return;

      if (!HlsCtor.isSupported()) {
        // No MSE support and no native HLS — nothing more we can do.
        video.src = src;
        return;
      }

      hls = new HlsCtor();
      hls.loadSource(src);
      hls.attachMedia(video);
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      className={className}
    />
  );
}
