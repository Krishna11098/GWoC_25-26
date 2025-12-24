import { redirect } from "next/navigation";

export default function ShopPage() {
  // Redirect Shop to the Games marketplace
  redirect("/games");
}
