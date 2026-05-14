import { permanentRedirect } from "next/navigation";

export default function OldProductsRoute() {
  permanentRedirect("/katalog");
}
