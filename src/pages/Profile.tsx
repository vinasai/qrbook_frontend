import { useState, useEffect } from "react";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  Edit2,
  Camera,
  ArrowLeft,
} from "lucide-react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { EditProfileForm } from "../components/EditProfileForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const userId = Cookies.get("userId");

        if (!token || !userId) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`https://qrbook.ca/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        toast({
          title: "Error loading profile",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (!userData)
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading profile
      </div>
    );

  const profileCompletionPercentage = calculateProfileCompletion(userData);

  return (
    <div className="min-h-screen p-4 sm:p-8 mt-4 sm:mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl">
          <CardHeader className="relative pb-0">
            <div className="absolute top-4 left-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute top-4 right-4 space-x-2 font-sans">
              <Badge variant="outline" className="text-xs sm:text-sm">
                {userData.role || "User"}
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {userData.memberSince || "New Member"}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary">
                  <AvatarImage
                    src={userData.avatarUrl}
                    alt={userData.fullName}
                  />

                  <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl sm:text-4xl font-sans mt-4">
                {userData.fullName}
              </CardTitle>
              <CardDescription className="text-lg sm:text-2xl font-sans">
                {userData.email}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="mt-6">
            <Tabs defaultValue="profile" className="w-full font-sans">
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger
                  value="profile"
                  className="rounded-full text-xs sm:text-sm"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-full text-xs sm:text-sm"
                >
                  Security
                </TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="profile">
                    <ProfileTab
                      userData={userData}
                      setUserData={setUserData}
                      profileCompletionPercentage={profileCompletionPercentage}
                    />
                  </TabsContent>
                  <TabsContent value="security">
                    <SecurityTab />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ProfileTab({ userData, setUserData, profileCompletionPercentage }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <ProfileItem icon={User} label="Name" value={userData.fullName} />

        <ProfileItem icon={Mail} label="Email" value={userData.email} />

        <ProfileItem
          icon={Phone}
          label="Phone"
          value={userData.mobileNo || "-"}
        />

        <ProfileItem
          icon={Lock}
          label="Last Active"
          value={userData.lastActive || "Today"}
        />
      </div>

      <Separator />

      <div>
        <Label>Profile Completion</Label>
        <Progress value={profileCompletionPercentage} className="mt-2" />

        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {profileCompletionPercentage}% complete
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm
            userData={userData}
            setUserData={setUserData}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SecurityTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      <div className="flex-1">
        <Label className="text-xs sm:text-sm text-muted-foreground">
          {label}
        </Label>
        <p className="text-sm sm:text-base font-medium">{value}</p>
      </div>
    </div>
  );
}

function calculateProfileCompletion(userData) {
  const fields = ["fullName", "email", "mobileNo"]; // Removed avatarUrl
  const completedFields = fields.filter((field) => userData[field]);
  return Math.round((completedFields.length / fields.length) * 100);
}
