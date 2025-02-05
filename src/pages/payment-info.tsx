import { useState, useEffect } from "react";
import { PaymentTable } from "@/components/payment-table";
import { CreditCard } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Card {
  _id: string;
  id: string;
  name: string;
  paymentConfirmed: boolean;
  userId: string;
  email: string;
}

export default function PaymentInfo() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cards?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        setCards(data.cards);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePaymentUpdate = async (cardId: string, currentConfirmed: boolean) => {
    const isConfirmed = window.confirm("Are you sure you want to update the payment status?");
    if (!isConfirmed) return;

    try {
      // Update payment status
      const updateResponse = await fetch(`http://localhost:5000/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentConfirmed: !currentConfirmed }),
      });

      if (!updateResponse.ok) throw new Error("Update failed");
      
      // Refresh data after update
      const refreshResponse = await fetch(
        `http://localhost:5000/api/cards?page=${currentPage}&limit=${itemsPerPage}`
      );
      const newData = await refreshResponse.json();
      setCards(newData.cards);
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment status");
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="h-8 w-8 text-white" />
        <h1 className="text-4xl font-russo text-white">Payment Info</h1>
      </div>
      <div className="rounded-xl bg-[#1f1f1f] p-6 border border-white/10 shadow-lg">
        <PaymentTable cards={cards} onPaymentConfirmedChange={handlePaymentUpdate} />
        
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(1, currentPage - 1));
                  }}
                  className="text-white hover:bg-white/5"
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={page === currentPage}
                    className="font-russo"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                  }}
                  className="text-white hover:bg-white/5"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}