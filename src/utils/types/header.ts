export interface BentoCardItem {
    id: number;
    title: string;
    subtitle: string;
    img: string;
    borderRounded: string;
}

export interface CategoryServiceItem {
    id: number;
    label: string;
    image: string;
    badge?: string | null;
    badgeColor?: string;
    bg: string;
    path:string;
}
