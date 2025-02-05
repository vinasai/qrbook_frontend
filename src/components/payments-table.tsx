"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, MoreHorizontal } from "lucide-react"

interface Payment {
  id: string
  status: "Success" | "Processing" | "Failed"
  email: string
  amount: number
}

const initialPayments: Payment[] = [
  {
    id: "1",
    status: "Success",
    email: "ken99@yahoo.com",
    amount: 316.0,
  },
  {
    id: "2",
    status: "Success",
    email: "abe45@gmail.com",
    amount: 242.0,
  },
  {
    id: "3",
    status: "Processing",
    email: "monserrat44@gmail.com",
    amount: 837.0,
  },
  {
    id: "4",
    status: "Failed",
    email: "carmella@hotmail.com",
    amount: 721.0,
  },
]

export default function PaymentsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [filterText, setFilterText] = useState("")

  const filteredPayments = payments.filter((payment) => payment.email.toLowerCase().includes(filterText.toLowerCase()))

  const handleSelectAll = () => {
    if (selectedRows.length === payments.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(payments.map((payment) => payment.id))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "Success":
        return "text-green-500"
      case "Processing":
        return "text-yellow-500"
      case "Failed":
        return "text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="p-6 space-y-4 bg-background text-foreground max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-muted-foreground">Manage your payments.</p>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter emails..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Status</DropdownMenuItem>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Amount</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedRows.length === payments.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(payment.id)}
                    onCheckedChange={() => handleSelectRow(payment.id)}
                  />
                </TableCell>
                <TableCell>
                  <span className={getStatusColor(payment.status)}>{payment.status}</span>
                </TableCell>
                <TableCell>{payment.email}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Download receipt</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} of {payments.length} row(s) selected.
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

