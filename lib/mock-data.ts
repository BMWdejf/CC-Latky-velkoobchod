export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  image: string;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviews: number;
};

export type Category = {
  id: string;
  label: string;
  image: string;
  href: string;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Bavlněná tkanina premium",
    brand: "CottonLux",
    price: 89,
    salePrice: 71,
    image: "https://placehold.co/300x380/eceef8/0067ff?text=Bavlna",
    isNew: false,
    isSale: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Přírodní hedvábí",
    brand: "SilkPro",
    price: 349,
    salePrice: null,
    image: "https://placehold.co/300x380/f9ebeb/ed0006?text=Hedv%C3%A1b%C3%AD",
    isNew: true,
    isSale: false,
    rating: 5.0,
    reviews: 56,
  },
  {
    id: "3",
    name: "Lněná tkanina organická",
    brand: "LinenCraft",
    price: 129,
    salePrice: null,
    image: "https://placehold.co/300x380/e6f2ec/027e46?text=L%C3%ADno",
    isNew: true,
    isSale: false,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "4",
    name: "Viskóza s tiskem",
    brand: "VisCo",
    price: 99,
    salePrice: 79,
    image: "https://placehold.co/300x380/f4f8ff/0067ff?text=Visk%C3%B3za",
    isNew: false,
    isSale: true,
    rating: 4.3,
    reviews: 201,
  },
  {
    id: "5",
    name: "Úplet bambusový",
    brand: "BambuTex",
    price: 149,
    salePrice: null,
    image: "https://placehold.co/300x380/f9f3cf/a06c33?text=%C3%9Aplet",
    isNew: true,
    isSale: false,
    rating: 4.9,
    reviews: 73,
  },
  {
    id: "6",
    name: "Satén polyesterový",
    brand: "GlossLine",
    price: 79,
    salePrice: 59,
    image: "https://placehold.co/300x380/eceef8/273569?text=Sat%C3%A9n",
    isNew: false,
    isSale: true,
    rating: 4.1,
    reviews: 312,
  },
  {
    id: "7",
    name: "Fleece termo",
    brand: "WarmTex",
    price: 109,
    salePrice: null,
    image: "https://placehold.co/300x380/f0f2f5/344054?text=Fleece",
    isNew: false,
    isSale: false,
    rating: 4.7,
    reviews: 147,
  },
  {
    id: "8",
    name: "Denim těžký",
    brand: "DenimHouse",
    price: 189,
    salePrice: 149,
    image: "https://placehold.co/300x380/e8ebf6/22284f?text=Denim",
    isNew: false,
    isSale: true,
    rating: 4.5,
    reviews: 98,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    label: "Pro ženy",
    image: "https://placehold.co/400x500/eceef8/273569?text=Pro+%C5%BEeny",
    href: "/katalog/zeny",
  },
  {
    id: "2",
    label: "Pro muže",
    image: "https://placehold.co/400x500/e8ebf6/22284f?text=Pro+mu%C5%BEe",
    href: "/katalog/muzi",
  },
  {
    id: "3",
    label: "Doplňky",
    image: "https://placehold.co/400x500/f9f3cf/a06c33?text=Dopl%C5%88ky",
    href: "/katalog/doplnky",
  },
];

export const HERO_PRODUCTS = [
  {
    id: "h1",
    label: "Letní kolekce",
    discount: "20% SLEVA",
    image: "https://placehold.co/180x220/eceef8/0067ff?text=Kolekce+1",
  },
  {
    id: "h2",
    label: "Prémiové látky",
    discount: "25% SLEVA",
    image: "https://placehold.co/180x220/e6f2ec/027e46?text=Kolekce+2",
  },
  {
    id: "h3",
    label: "Nová sezona",
    discount: "30% SLEVA",
    image: "https://placehold.co/180x220/f9ebeb/ed0006?text=Kolekce+3",
  },
];
