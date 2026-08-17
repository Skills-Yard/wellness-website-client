"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type ReviewFormProps = {
  initialRating?: number;
  initialComment?: string;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: { rating: number; comment: string }) => void;
  onCancel?: () => void;
};

export default function ReviewForm({
  initialRating = 0,
  initialComment = "",
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);

  const displayRating = hoverRating || rating;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (rating < 1) return;
        onSubmit({ rating, comment: comment.trim() });
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            className="cursor-pointer p-0.5"
            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                value <= displayRating ? "fill-amber-400 text-amber-400" : "text-slate-200",
              )}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Tell us about your experience (optional)"
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-amber-400"
      />

      <div className="flex gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-2xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={rating < 1 || isSubmitting}
          className="h-11 flex-1 rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-500/90"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
