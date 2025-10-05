import Footer from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24">{children}</main>
      <Footer />
    </>
  );
}
