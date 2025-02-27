import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch"; // Changed from Checkbox to Switch

interface Card {
  _id: string;
  id: string;
  name: string;
  paymentConfirmed: boolean;
  userId: string;
  email: string;
}

interface PaymentTableProps {
  cards: Card[];
  onPaymentConfirmedChange: (cardId: string, currentConfirmed: boolean) => void;
}

export function PaymentTable({ cards, onPaymentConfirmedChange }: PaymentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b">
          <TableHead>Name</TableHead>
          <TableHead>Card ID</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Payment Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.map((card) => (
          <TableRow key={card._id}>
            <TableCell>{card.name}</TableCell>
            <TableCell>{card.id}</TableCell>
            <TableCell>{card.userId}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={card.paymentConfirmed}
                  onCheckedChange={() => 
                    onPaymentConfirmedChange(card._id, card.paymentConfirmed)
                  }
                />
                <span className={card.paymentConfirmed ? "text-green-600" : "text-amber-600"}>
                  {card.paymentConfirmed ? "Confirmed" : "Pending"}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}