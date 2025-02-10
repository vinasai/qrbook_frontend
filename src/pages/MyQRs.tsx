"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Download, Filter, MoreVertical, Pencil } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext
} from "../components/ui/pagination"
import QRCode from "qrcode.react"
import axios from "axios"
import Cookies from "js-cookie"
import EditBusinessCardForm from '../components/edit-business-card-form';

type Card = {
  id: string
  name: string
  businessCardLink: string
  paymentConfirmed: boolean
}

export default function MyQRs() {
  const [cards, setCards] = useState<Card[]>([])
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const cardsPerPage = 8
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true)
        const userId = Cookies.get("userId")
        if (!userId) {
          throw new Error("User ID not found in cookies")
        }
        const response = await axios.get(`http://localhost:5000/api/cards/user/${userId}`)
        setCards(response.data)
        setFilteredCards(response.data)
      } catch (error) {
        console.error("Error fetching cards:", error)
        setError("Failed to fetch cards. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  useEffect(() => {
    const results = cards.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredCards(results)
    setCurrentPage(1)
  }, [searchTerm, cards])

  useEffect(() => {
    let results = cards
    if (filter === "temporary") {
      results = cards.filter((card) => !card.paymentConfirmed)
    } else if (filter === "permanent") {
      results = cards.filter((card) => card.paymentConfirmed)
    }
    setFilteredCards(results)
    setCurrentPage(1)
  }, [filter, cards])

  const handleDownload = (id: string, name: string) => {
    // Get the QR code canvas element by ID
    const canvas = document.getElementById(`qr-code-${id}`) as HTMLCanvasElement
    if (!canvas) return

    // Convert canvas to data URL and trigger download
    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handlePreview = (id: string) => {
    navigate(`/${id}`);
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditingCard(null);
  };

  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard)

  return (
    <div className="min-h-screen p-4 sm:p-8  mt-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-russo bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My QRs
            </h1>
            <p className="text-muted-foreground">Manage and customize your QR codes</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                className="pl-10 pr-4 w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                placeholder="Search QR codes..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>All QR Codes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("temporary")}>Temporary Links</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("permanent")}>Permanent Links</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="mt-4 text-center text-sm text-muted-foreground">Loading your QR codes...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCards.map((card) => (
                <Card
                  key={card.id}
                  className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <CardContent className="p-6 pb-16">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{card.name}</h3>
                        <p className="text-xs text-muted-foreground">Created {new Date().toLocaleDateString()}</p>
                      </div>
                      {!card.paymentConfirmed && (
                        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 py-1 px-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className="text-amber-700 dark:text-amber-400 text-xs font-medium">Temporary</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-inner group-hover:shadow-xl transition-shadow duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl"></div>
                        <QRCode
                          id={`qr-code-${card.id}`}
                          value={card.businessCardLink}
                          size={160}
                          level="H"
                          includeMargin={true}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handlePreview(card.id)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <span className="h-4 w-4 text-primary">👁️</span>
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(card.id, card.name)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="h-4 w-4 text-primary" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(card)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Pagination
              className="mt-12"
              currentPage={currentPage}
              totalPages={Math.ceil(filteredCards.length / cardsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
      {isEditing && editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <EditBusinessCardForm
              initialData={editingCard}
              onClose={handleCloseEdit}
              onSave={(updatedCard) => {
                // Here you would typically update the card in your state and/or send to the server
                console.log('Updated card:', updatedCard);
                handleCloseEdit();
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
