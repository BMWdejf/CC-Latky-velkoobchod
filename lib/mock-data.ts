export const PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: [
    "Bavlněná tkanina premium",
    "Přírodní hedvábí",
    "Lněná tkanina",
    "Viskóza s tiskem",
    "Úplet bambusový",
    "Satén polyester",
    "Fleece termo",
    "Denim těžký",
    "Šifon jemný",
    "Kanvas pevný",
    "Žakár dekorační",
    "Tyl jemný",
  ][i],
  brand: [
    "CottonLux", "SilkPro", "LinenCraft", "VisCo", "BambuTex", "GlossLine",
    "WarmTex", "DenimHouse", "ChiffonEl", "CanvasK", "JacquardH", "TulleS",
  ][i],
  rating: (4.7 + (i % 3) * 0.1).toFixed(1),
  reviewCount: [180, 240, 95, 310, 72, 155, 88, 205, 63, 140, 190, 47][i],
  price: [89, 349, 129, 99, 149, 79, 109, 189, 69, 119, 199, 49][i],
  originalPrice: [null, null, null, 129, null, 99, null, 249, null, 149, null, 69][i] as number | null,
  image: `https://placehold.co/300x380/EEF2FF/0B5FFF?text=Latka+${i + 1}`,
  colors: ["#2C3E7A", "#C0392B", "#27AE60", "#F39C12"].slice(0, 2 + (i % 3)),
  sizes: ["XS", "S", "M", "L", "XL"],
  tab: (["new", "new", "bestseller", "new", "sale", "bestseller",
         "new", "sale", "bestseller", "new", "sale", "bestseller"] as const)[i],
}));

export const CATEGORIES_STRIP = [
  { label: "Sukně",   icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=S" },
  { label: "Košile",  icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=K" },
  { label: "Kabáty",  icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=Ka" },
  { label: "Kalhoty", icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=Kl" },
  { label: "Šály",    icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=Sal" },
  { label: "Trička",  icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=T" },
  { label: "Doplňky", icon: "https://placehold.co/48x48/EEF2FF/0B5FFF?text=D" },
];

export const SHOP_CATEGORIES = [
  {
    label: "Pro Muže",
    sub: "Stylové tkaniny pro pánskou módu",
    image: "https://placehold.co/400x220/F5F0E8/6B4226?text=Pro+Muze",
    href: "/katalog/muzi",
    bgClass: "bg-[#F5F0E8]",
  },
  {
    label: "Pro Ženy",
    sub: "Prémiové látky pro dámskou kolekci",
    image: "https://placehold.co/400x220/FDF2F4/9B2335?text=Pro+Zeny",
    href: "/katalog/zeny",
    bgClass: "bg-[#FDF2F4]",
  },
  {
    label: "Pro Děti",
    sub: "Bezpečné a příjemné materiály",
    image: "https://placehold.co/400x220/FFFBEB/B45309?text=Pro+Deti",
    href: "/katalog/deti",
    bgClass: "bg-[#FFFBEB]",
  },
];

export const INSTAGRAM_PHOTOS = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  image: `https://placehold.co/300x300/EEF2FF/0B5FFF?text=Foto+${i + 1}`,
  href: "https://instagram.com",
}));
