import { getUser } from "@/lib/actions";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getUser();
  return <Navbar balance={user.balance} />;
}
