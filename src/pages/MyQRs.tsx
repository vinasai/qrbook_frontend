import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, Filter, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Pagination } from "../components/ui/pagination";
import QRCode from "qrcode.react";
import axios from "axios";
import Cookies from "js-cookie";

type Card = {
  id: string;
  name: string;
  businessCardLink: string;
  paymentConfirmed: boolean;
};

export default function MyQRs() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const userId = Cookies.get("userId");
        if (!userId) {
          throw new Error("User ID not found in cookies");
        }
        const response = await axios.get(`http://localhost:5000/api/cards/user/${userId}`);
        setCards(response.data);
        setFilteredCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setError("Failed to fetch cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const results = cards.filter((card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCards(results);
    setCurrentPage(1);
  }, [searchTerm, cards]);

  useEffect(() => {
    let results = cards;
    if (filter === "temporary") {
      results = cards.filter((card) => !card.paymentConfirmed);
    } else if (filter === "permanent") {
      results = cards.filter((card) => card.paymentConfirmed);
    }
    setFilteredCards(results);
    setCurrentPage(1);
  }, [filter, cards]);

  const handleDownload = (id: string, name: string) => {
    // Get the QR code canvas element by ID
    const canvas = document.getElementById(`qr-code-${id}`) as HTMLCanvasElement;
    if (!canvas) return;

    // Convert canvas to data URL and trigger download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreview = (id: string) => {
    navigate(`/business-card/${id}`);
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 mt-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-russo text-gray-900 dark:text-white">
            My QRs
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                className="pl-10 pr-4 w-full"
                placeholder="Search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All QR Codes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("temporary")}>
                  Temporary Links
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("permanent")}>
                  Permanent Links
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCards.map((card) => (
                <Card
                  key={card.id}
                  className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="text-xl font-passion text-gray-900 dark:text-white truncate">
                      {card.name}
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                    <QRCode
                    id={`qr-code-${card.id}`}  // Use card.id for unique ID
                    value={card.businessCardLink}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />

                      <div className="flex space-x-2 w-full">
                        <Button
                          onClick={() => handlePreview(card.id)}
                          className="flex-1 font-geo text-xl bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleDownload(card.id, card.name)}
                          
                          className="flex-1 font-geo text-xl bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {!card.paymentConfirmed && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 rounded-full bg-yellow-200 py-1 px-3">
                          <span className="text-yellow-700 text-xs font-medium">
                            Temporary
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Pagination
              className="mt-8"
              currentPage={currentPage}
              totalPages={Math.ceil(filteredCards.length / cardsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}