import { useState, useEffect } from "react";
import { PaymentTable } from "@/components/payment-table";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Card {
  _id: string;
  id: string;
  name: string;
  paymentConfirmed: boolean;
  userId: string;
  email: string;
  createdAt: string;
}

export default function PaymentInfo() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://qrbook.ca:5002/api/cards?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setCards(data.cards);
        setTotalPages(data.totalPages);
        setError("");
      } catch (error) {
        setError("Failed to load payment data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePaymentUpdate = async (cardId: string, currentConfirmed: boolean) => {
    try {
      const updateResponse = await fetch(`https://qrbook.ca:5002/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentConfirmed: !currentConfirmed }),
      });

      if (!updateResponse.ok) throw new Error("Update failed");
      
      setCards(prev => prev.map(card => 
        card._id === cardId ? { ...card, paymentConfirmed: !currentConfirmed } : card
      ));
    } catch (error) {
      console.error("Error updating payment:", error);
      setError("Failed to update payment status");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (error) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="rounded-xl bg-destructive/10 p-6 border border-destructive/30">
          <div className="text-destructive flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Payment Management
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Manage payment statuses and monitor transaction confirmations
            </p>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="rounded-xl border bg-background/95 backdrop-blur-sm shadow-lg">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[52px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <PaymentTable 
              cards={cards} 
              renderSwitch={(card) => (
                <Switch
                  checked={card.paymentConfirmed}
                  onCheckedChange={() => 
                    handlePaymentUpdate(card._id, card.paymentConfirmed)
                  }
                  className="data-[state=checked]:bg-primary"
                />
              )}
            />
            
            {/* Pagination */}
            <div className="border-t p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      asChild
                      variant="ghost"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <Button size="sm" className="gap-1">
                        Previous
                      </Button>
                    </PaginationPrevious>
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <Button
                        variant={currentPage === i + 1 ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                          "h-8 w-8 font-medium",
                          currentPage === i + 1 && "pointer-events-none"
                        )}
                      >
                        {i + 1}
                      </Button>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      asChild
                      variant="ghost"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <Button size="sm" className="gap-1">
                        Next
                      </Button>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}