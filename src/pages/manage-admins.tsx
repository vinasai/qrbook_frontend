import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Admin {
  userId: string;
  fullName: string;
  email: string;
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://qrbook.ca/api/users/admins?page=${currentPage}&limit=5`,
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }
      const data = await response.json();
      setAdmins(data.admins);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const handleEdit = async (userId: string) => {
    const newEmail = prompt("Enter new email:");
    const newName = prompt("Enter new name:");
    if (!newEmail || !newName) return;

    try {
      const response = await fetch(`https://qrbook.ca/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: newName, email: newEmail }),
      });

      if (!response.ok) throw new Error("Update failed");
      fetchAdmins(); // Refresh data
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const response = await fetch(`https://qrbook.ca/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Deletion failed");

      // Reset to first page if last item on current page was deleted
      setCurrentPage((prev) =>
        admins.length === 1 && prev > 1 ? prev - 1 : prev,
      );
      fetchAdmins();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-white" />
        <h1 className="text-4xl font-sans text-white">Manage Admins</h1>
      </div>
      <div className="rounded-xl bg-[#1f1f1f] p-6 border border-white/10 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              <TableHead className="text-white font-sans">Name</TableHead>
              <TableHead className="text-white font-sans">E-Mail</TableHead>
              <TableHead className="text-right font-sans text-white">
                Manage
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow
                key={admin.userId}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <TableCell className="text-white font-sans">
                  {admin.fullName}
                </TableCell>
                <TableCell className="text-white font-sans">
                  {admin.email}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-[#2a2a2a] hover:bg-[#2a2a2a]/90 h-8 w-8"
                      onClick={() => handleEdit(admin.userId)}
                    >
                      <Pencil className="h-4 w-4 text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-[#2a2a2a] hover:bg-[#2a2a2a]/90 h-8 w-8"
                      onClick={() => handleDelete(admin.userId)}
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="text-white hover:bg-white/5"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === currentPage}
                    className="font-sans"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className="text-white hover:bg-white/5"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
