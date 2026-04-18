import Header from "../components/header";
import Footer from "../components/footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
