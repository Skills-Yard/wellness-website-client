export interface DynamicStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface DynamicDetailData {
  title: string;
  rating: string;
  reviews: string;
  media: string;
  categories: { id: string; name: string }[];
  services: {
    id: string;
    category: string;
    isSpotlight: boolean;
    tag?: string;
    title: string;
    rating: string;
    reviews: string;
    price: string;
    originalPrice: string | null;
    duration: string;
    features: string[];
    media: string;
  }[];
  steps: DynamicStep[];
}

export const DYNAMIC_DETAILS: Record<string, DynamicDetailData> = {
  // ── 1. MASSAGE THERAPY ──
  "massage": {
    title: "Massage Therapy",
    rating: "4.88",
    reviews: "14.5K bookings",
    media: "/images/detail/massage_detail.png",
    categories: [
      { id: "c1", name: "Stress Relief" },
      { id: "c2", name: "Pain Management" },
      { id: "c3", name: "Specialty Therapy" }
    ],
    services: [
      {
        id: "m-s1",
        category: "Stress Relief",
        isSpotlight: true,
        tag: "BESTSELLER",
        title: "Classic Swedish Massage",
        rating: "4.88",
        reviews: "14.5K reviews",
        price: "₹1,499",
        originalPrice: "₹1,999",
        duration: "60 mins",
        features: [
          "Delivers light to medium pressure for overall body relaxation",
          "Improves blood flow and relieves surface muscular tension",
          "Includes heated therapeutic massage oils"
        ],
        media: "/images/massage_swedish.png"
      },
      {
        id: "m-s2",
        category: "Pain Management",
        isSpotlight: true,
        tag: "THERAPEUTIC",
        title: "Deep Tissue Therapy",
        rating: "4.92",
        reviews: "8.9K reviews",
        price: "₹1,699",
        originalPrice: "₹2,199",
        duration: "75 mins",
        features: [
          "Uses slow, firm strokes to target deep muscle layers and knots",
          "Highly effective for relieving chronic muscle tightness & stiffness",
          "Includes hot compresses to soften muscle tissues"
        ],
        media: "/images/deep_tissue.png"
      },
      {
        id: "m-s3",
        category: "Stress Relief",
        isSpotlight: false,
        tag: "ORGANIC ACTIVE",
        title: "Aromatherapy Stress Relief",
        rating: "4.85",
        reviews: "11.2K reviews",
        price: "₹1,599",
        originalPrice: "₹2,099",
        duration: "60 mins",
        features: [
          "Uses natural lavender essential oil to soothe brain receptors",
          "Perfect treatment for fighting insomnia, anxiety, & daily fatigue",
          "Smooth, flowing Swedish movements with no heavy pressure"
        ],
        media: "/images/aromatherapy.png"
      },
      {
        id: "m-s4",
        category: "Specialty Therapy",
        isSpotlight: false,
        tag: "YOGA COMPRESSION",
        title: "Traditional Thai stretches",
        rating: "4.80",
        reviews: "6.4K reviews",
        price: "₹1,799",
        originalPrice: "₹2,299",
        duration: "90 mins",
        features: [
          "Performed fully clothed (loose outfit provided by therapist)",
          "Combines assisted stretching, compression, and joint pulling",
          "Improves joint flexibility and resets spine posture"
        ],
        media: "/images/thai_massage.png"
      },
      {
        id: "m-s5",
        category: "Stress Relief",
        isSpotlight: false,
        tag: "REFLEXOLOGY",
        title: "Foot Reflexology Therapy",
        rating: "4.90",
        reviews: "19.3K reviews",
        price: "₹999",
        originalPrice: "₹1,399",
        duration: "45 mins",
        features: [
          "Targets reflex zones on soles to stimulate corresponding organ systems",
          "Relieves leg swelling, heaviness, and ankle tightness",
          "Includes a refreshing herbal foot soak"
        ],
        media: "/images/foot_massage.png"
      },
      {
        id: "m-s6",
        category: "Pain Management",
        isSpotlight: false,
        tag: "RECOVERY",
        title: "Sports Injury Remedial",
        rating: "4.87",
        reviews: "4.1K reviews",
        price: "₹1,899",
        originalPrice: "₹2,499",
        duration: "60 mins",
        features: [
          "Targets muscle-tendon junctions to restore motion range",
          "Speeds up lactate clearance and reduces post-workout soreness",
          "Incorporates cross-fiber friction & passive stretching"
        ],
        media: "/images/sports_massage.png"
      }
    ],
    steps: [
      {
        id: "m-step-1",
        title: "Book your massage session",
        description: "Choose your preferred massage treatment, date, and time slot through our simple online portal.",
        image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-step-2",
        title: "Therapist arrives with setup",
        description: "Our certified therapist arrives 15 mins early with a portable bed, fresh linens, diffuser, and essential oils.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-step-3",
        title: "Indulge in 5-star spa therapy",
        description: "Disconnect and enjoy. The therapist adjusts the pressure, focus zones, and music to your liking.",
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-step-4",
        title: "Seamless pack up & aftercare",
        description: "We pack up and clean the space silently, leaving your home spotless so you can continue relaxing.",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },

  // ── 2. WELLNESS & BEAUTY ──
  "wellness": {
    title: "Wellness & Beauty Escapes",
    rating: "4.89",
    reviews: "12.1K bookings",
    media: "/images/detail/wellness_detail.png",
    categories: [
      { id: "c1", name: "Facial & Glow" },
      { id: "c2", name: "Hair & Scalp Care" },
      { id: "c3", name: "Body & Nails" }
    ],
    services: [
      {
        id: "w-s1",
        category: "Facial & Glow",
        isSpotlight: true,
        tag: "PREMIUM GLOW",
        title: "Gold Radiance Facial",
        rating: "4.89",
        reviews: "12.1K reviews",
        price: "₹1,899",
        originalPrice: "₹2,499",
        duration: "60 mins",
        features: [
          "Includes scrub exfoliation, steam, blackhead removal, & 24K gold dust serum",
          "Leaves skin with a bright, glowing, and visibly smooth texture",
          "Dermatologically tested organic products"
        ],
        media: "/images/wellness_facial.png"
      },
      {
        id: "w-s2",
        category: "Body & Nails",
        isSpotlight: true,
        tag: "DETOX WRAP",
        title: "Charcoal Detox Body Wrap",
        rating: "4.83",
        reviews: "4.2K reviews",
        price: "₹2,199",
        originalPrice: "₹2,799",
        duration: "75 mins",
        features: [
          "Full body scrub with activated charcoal to unclog pores",
          "Mineral-rich clay mask applied & wrapped to absorb deep toxins",
          "Includes final body moisturizing lotion massage"
        ],
        media: "/images/body_wrap.png"
      },
      {
        id: "w-s3",
        category: "Hair & Scalp Care",
        isSpotlight: false,
        tag: "SMOOTH & SHINE",
        title: "Luxury Keratin Hair Spa",
        rating: "4.91",
        reviews: "15.6K reviews",
        price: "₹1,299",
        originalPrice: "₹1,699",
        duration: "50 mins",
        features: [
          "Moroccan argan oil keratin cream mask application",
          "Deep steam treatment to nourish dry hair roots and follicles",
          "Includes head, neck, and shoulder relaxing massage"
        ],
        media: "/images/hair_spa.png"
      },
      {
        id: "w-s4",
        category: "Body & Nails",
        isSpotlight: false,
        tag: "BEST VALUE",
        title: "Royal Pedicure & Manicure",
        rating: "4.86",
        reviews: "18.2K reviews",
        price: "₹899",
        originalPrice: "₹1,199",
        duration: "70 mins",
        features: [
          "Soaking soak in warm water with rose petals & lavender oils",
          "Scrub, cuticle cleaning, filing, shaping, & organic cream massage",
          "Leaves hands & feet fully clean, soft, and tension-free"
        ],
        media: "/images/pedicure.png"
      },
      {
        id: "w-s5",
        category: "Hair & Scalp Care",
        isSpotlight: false,
        tag: "ANTI-STRESS",
        title: "Scalp Revitalizing Treatment",
        rating: "4.82",
        reviews: "5.8K reviews",
        price: "₹799",
        originalPrice: "₹1,099",
        duration: "40 mins",
        features: [
          "Targeted acupressure head massage to release mental blockages",
          "Uses tea tree and peppermint oil to stimulate hair health",
          "Great for relieving migraine, sinus pressure, and head fatigue"
        ],
        media: "/images/scalp_treatment.png"
      }
    ],
    steps: [
      {
        id: "w-step-1",
        title: "Choose salon & beauty services",
        description: "Select custom beauty facials, hair spas, or mani-pedis and choose your therapist.",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "w-step-2",
        title: "Sanitised prep at home",
        description: "Our beautician prepares the sterilised tools, steam machine, and fresh sheets inside your room.",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "w-step-3",
        title: "Soothing beauty treatment",
        description: "Relax during multi-step exfoliation, massage, and mask application using premium organic serums.",
        image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "w-step-4",
        title: "Clean finish & custom advice",
        description: "The therapist cleans the area and suggests routine protection tips for a long-lasting glow.",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },

  // ── 3. PHYSIOTHERAPY ──
  "physio": {
    title: "Physiotherapy & Rehab",
    rating: "4.90",
    reviews: "16.4K bookings",
    media: "/images/detail/physio_detail.png",
    categories: [
      { id: "c1", name: "Spinal Care" },
      { id: "c2", name: "Joint Recovery" },
      { id: "c3", name: "Posture Correction" }
    ],
    services: [
      {
        id: "p-s1",
        category: "Spinal Care",
        isSpotlight: true,
        tag: "CLINICAL",
        title: "Back Pain Relief Session",
        rating: "4.90",
        reviews: "16.4K reviews",
        price: "₹999",
        originalPrice: "₹1,299",
        duration: "50 mins",
        features: [
          "Spine mobilization and clinical lumbar muscle relief massage",
          "Includes guidance on core-strengthening exercises & posture tips",
          "Managed entirely by licensed and registered physiotherapists"
        ],
        media: "/images/physio_back_pain.png"
      },
      {
        id: "p-s2",
        category: "Joint Recovery",
        isSpotlight: true,
        tag: "JOINT REHAB",
        title: "Knee Rehabilitation Therapy",
        rating: "4.87",
        reviews: "9.8K reviews",
        price: "₹1,099",
        originalPrice: "₹1,499",
        duration: "60 mins",
        features: [
          "Muscle stimulation (EMS therapy) to reduce local inflammation",
          "Passive knee bending movements to recover joint fluid mobility",
          "Recommended for ligament strain recovery & chronic arthritis"
        ],
        media: "/images/knee_rehab.png"
      },
      {
        id: "p-s3",
        category: "Posture Correction",
        isSpotlight: false,
        tag: "ALIGNED LIFE",
        title: "Posture Correction & Ergonomics",
        rating: "4.82",
        reviews: "7.5K reviews",
        price: "₹899",
        originalPrice: "₹1,199",
        duration: "45 mins",
        features: [
          "Comprehensive physical alignment check and spine curvature review",
          "Active cervical stretching & shoulder retraction movements",
          "Corrects computer slouch pain & improves respiration flow"
        ],
        media: "/images/posture_correct.png"
      },
      {
        id: "p-s4",
        category: "Joint Recovery",
        isSpotlight: false,
        tag: "ATHLETES RECOVERY",
        title: "Sports Injury Physiotherapy",
        rating: "4.89",
        reviews: "4.9K reviews",
        price: "₹1,299",
        originalPrice: "₹1,699",
        duration: "60 mins",
        features: [
          "Advanced physiotherapy protocols for muscle sprains and tears",
          "Restores maximum motion range & joint stability safely",
          "Taping & local ultrasound therapy included"
        ],
        media: "/images/sports_physio.png"
      },
      {
        id: "p-s5",
        category: "Spinal Care",
        isSpotlight: false,
        tag: "PAIN RELIEF",
        title: "Neck & Shoulder strain relief",
        rating: "4.85",
        reviews: "11.7K reviews",
        price: "₹999",
        originalPrice: "₹1,299",
        duration: "45 mins",
        features: [
          "Deals with high-stress cervical trigger points & stiffness",
          "Cervical neck traction and joint mobilization therapy",
          "Instantly relieves muscle-tension headaches & upper back strain"
        ],
        media: "/images/neck_strain.png"
      }
    ],
    steps: [
      {
        id: "p-step-1",
        title: "Book clinical consultation",
        description: "Describe your physical pain zone and book an appointment with a registered physiotherapist.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "p-step-2",
        title: "Clinical assessment at home",
        description: "The therapist checks your joints range of motion, muscle strength, alignment, and pain threshold.",
        image: "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "p-step-3",
        title: "Rehab exercises & mobilization",
        description: "Experience manual joint stretching, trigger-point release, and targeted muscle activation routines.",
        image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "p-step-4",
        title: "Custom daily recovery routines",
        description: "Get a dynamic recovery guide, posture workouts list, and next recovery session timelines.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
};

export type DynamicService = DynamicDetailData["services"][number];