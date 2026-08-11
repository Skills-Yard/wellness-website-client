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
  /**
   * "auto" tells the browser to start buffering ahead of the playhead as
   * soon as the element mounts, instead of waiting for an explicit play()
   * (some mobile browsers default to "none" without this, which stalls
   * autoplay entirely). Progressive MP4 playback (start before the whole
   * file downloads) additionally requires the source file itself to be
   * "faststart"-encoded — see CampaignVideo's usage notes.
   */
  preload?: "auto" | "metadata" | "none";
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
  preload = "auto",
}: CampaignVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = src.endsWith(".m3u8");
    const canPlayNativeHls =
      video.canPlayType("application/vnd.apple.mpegurl") !== "";

    // Belt-and-suspenders: the `autoPlay` HTML attribute is supposed to kick in
    // once a source is set on an already-mounted <video> too, but that's not
    // reliable enough in practice (especially inside carousels) to trust alone
    // — explicitly request playback once the source is actually attached.
    const tryPlay = () => {
      if (autoPlay) video.play().catch(() => {});
    };

    if (!isHls || canPlayNativeHls) {
      video.src = src;
      tryPlay();
      return;
    }

    let hls: Hls | null = null;
    let cancelled = false;

    import("hls.js").then(({ default: HlsCtor }) => {
      if (cancelled || !video) return;

      if (!HlsCtor.isSupported()) {
        // No MSE support and no native HLS — nothing more we can do.
        video.src = src;
        tryPlay();
        return;
      }

      hls = new HlsCtor();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(HlsCtor.Events.MANIFEST_PARSED, tryPlay);
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      className={className}
    />
  );
}
