import { FaqItem } from "@/src/utils/types";

export const FAQ_DATA: Record<"massage" | "wellness" | "physiotherapy", FaqItem[]> = {
    massage: [
        {
            id: 1,
            question: "How do I prepare for a home massage session?",
            answer: "Our therapists bring everything needed: a professional folding massage table, fresh sterilized linen, organic oils, and soft background music. You only need to provide a quiet, private room with a space of about 8x6 feet to set up the bed comfortably.",
        },
        {
            id: 2,
            question: "What massage pressure is right for me?",
            answer: "Swedish massage uses light-to-medium strokes ideal for mental relaxation and mild fatigue. Deep Tissue uses firm, targeted pressure to resolve deep muscle knots and athletic tightness. Thai massage is oil-free and focuses on active yoga-like stretching.",
        },
        {
            id: 3,
            question: "Can I choose a male or female therapist?",
            answer: "Yes. Vellora strictly adheres to same-gender policies for security and comfort. Male clients will be assigned certified male therapists, and female clients will be assigned certified female therapists.",
        }
    ],
    wellness: [
        {
            id: 1,
            question: "Are your facial and spa products safe for sensitive skin?",
            answer: "Absolutely. All our skincare facial creams, peeling scrubs, and body wraps are organic, hypoallergenic, and dermatologically tested. Our estheticians conduct a quick skin assessment before the session to customize products for your skin type.",
        },
        {
            id: 2,
            question: "How do you manage water setup for home pedicures?",
            answer: "Our pedicurists carry specialized portable massage tubs that do not require bathroom plumbing connection. You only need to provide access to warm water, and our therapist will handle the filling, draining, and full post-service clean-up.",
        },
        {
            id: 3,
            question: "How long do the beauty effects of the facial last?",
            answer: "Most clients experience an immediate, fresh glow that peaks within 24-48 hours. For long-term anti-aging and skin wellness benefits, we recommend scheduling a session once every 3-4 weeks.",
        }
    ],
    physiotherapy: [
        {
            id: 1,
            question: "Are the physiotherapists certified and registered?",
            answer: "Yes, 100%. Every Vellora physical therapist holds a professional degree (BPT or MPT) from a certified medical university, is registered with the state council, and has at least 3+ years of clinical and hospital rehab experience.",
        },
        {
            id: 2,
            question: "What equipment do physiotherapists bring to my home?",
            answer: "Depending on your diagnosis, our therapists bring portable electrotherapy devices (like TENS/IFT machines), therapeutic resistance bands, kinesiology tapes, massage balls, and foam rollers to conduct full rehabilitation exercises.",
        },
        {
            id: 3,
            question: "How many sessions will I need to cure my back pain?",
            answer: "During the first consultation, the therapist will conduct a thorough mobility and joint strain check. While mild posture sprains feel better in 2-3 sessions, chronic slips or post-surgery recovery plans usually range from 8 to 12 sessions.",
        }
    ]
};
