import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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
        <TableRow className="border-b border-white/10">
          <TableHead className="text-white">Name</TableHead>
          <TableHead className="text-white">Card ID</TableHead>
          <TableHead className="text-white">User ID</TableHead>
          <TableHead className="text-white">Payment Confirmed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.map((card) => (
          <TableRow key={card._id} className="border-b border-white/10">
            <TableCell className="text-white">{card.name}</TableCell>
            <TableCell className="text-white">{card.id}</TableCell>
            <TableCell className="text-white">{card.userId}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={card.paymentConfirmed}
                  onCheckedChange={() => 
                    onPaymentConfirmedChange(card._id, card.paymentConfirmed)
                  }
                  className="visible"
                />
                <span className="text-white">
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