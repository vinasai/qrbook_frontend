import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function EditProfileForm({ userData, setUserData }) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");

      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedUser = await response.json();
      setUserData(updatedUser);
      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobileNo">Phone Number</Label>
        <Input id="mobileNo" {...register("mobileNo")} />
        {errors.mobileNo && <p className="text-red-500">{errors.mobileNo.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}