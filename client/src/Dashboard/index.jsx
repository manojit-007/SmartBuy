import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Dashboard from "./Dashboard";
import ProductForm from "@/Pages/ProductForm";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import AllOrders from "./AllOrders";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Index = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Redirect if user is not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/error");
    }
  }, [user, loading, navigate]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarProvider>
      {isMobile ? (
        <Dialog>
          <DialogContent aria-describedby="sidebar-description">
            <DialogTitle>
              {/* <VisuallyHidden>Sidebar</VisuallyHidden> */}
            </DialogTitle>
            <div className="w-[250px]">
              <li>home</li>
              <li>home</li>
              <li>home</li>
              <li>home</li>
              <li>home</li>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <AppSidebar />
      )}

      <main className="w-full" aria-describedby="main">
        <SidebarTrigger aria-describedby="Scroll trigger" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addNewProducts" element={<ProductForm />} />
          <Route path="/allOrders" element={<AllOrders />} />
        </Routes>
      </main>
    </SidebarProvider>
  );
};

export default Index;
