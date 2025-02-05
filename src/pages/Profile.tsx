import { useState, useEffect } from "react"
import { z } from "zod"
import { User, Mail, Phone, Lock, Edit2, Activity, Camera } from "lucide-react"
import Cookies from "js-cookie"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { EditProfileForm } from "../components/EditProfileForm"
import { ChangePasswordForm } from "../components/ChangePasswordForm"
import { ActivityFeed } from "../components/ActivityFeed"
import { ConnectedAccounts } from "../components/ConnectedAccounts"
import { Badge } from "@/components/ui/badge"

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function Profile() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token")
        const userId = Cookies.get("userId")

        if (!token || !userId) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch user data")

        const data = await response.json()
        setUserData(data)
      } catch (error) {
        toast({
          title: "Error loading profile",
          description: "Failed to fetch user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  

  if (loading) return <div>Loading...</div>
  if (!userData) return <div>Error loading profile</div>

  const profileCompletionPercentage = calculateProfileCompletion(userData)

  return (
    <div className="min-h-screen p-8 mt-8 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl">
          <CardHeader className="relative pb-0">
            <div className="absolute top-4 right-4 space-x-2 font-geo">
              <Badge variant="outline">{userData.role || "User"}</Badge>
              <Badge variant="secondary">{userData.memberSince || "New Member"}</Badge>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary ">
                  <AvatarImage src={userData.avatarUrl} alt={userData.fullName} />
                  <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full" variant="secondary">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-4xl font-geo mt-4">{userData.fullName}</CardTitle>
              <CardDescription className="text-2xl font-geo">{userData.email}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="mt-6">
            <Tabs defaultValue="profile" className="w-full font-russo">
              <TabsList className="grid w-full grid-cols-4 rounded-full">
                <TabsTrigger value="profile" className="rounded-full">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-full">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-full">
                  Security
                </TabsTrigger>
                <TabsTrigger value="connected" className="rounded-full">
                  Connected
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
                  <TabsContent value="activity">
                    <ActivityFeed userId={userData.id} />
                  </TabsContent>
                  <TabsContent value="security">
                    <SecurityTab />
                  </TabsContent>
                  <TabsContent value="connected">
                    <ConnectedAccounts userId={userData.id} />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function ProfileTab({ userData, setUserData, profileCompletionPercentage }) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileItem icon={User} label="Name" value={userData.fullName} />
        <ProfileItem icon={Mail} label="Email" value={userData.email} />
        <ProfileItem icon={Phone} label="Phone" value={userData.mobileNo || "-"} />
        <ProfileItem icon={Activity} label="Last Active" value={userData.lastActive || "Today"} />
      </div>

      <Separator />

      <div>
        <Label>Profile Completion</Label>
        <Progress value={profileCompletionPercentage} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-1">{profileCompletionPercentage}% complete</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm userData={userData} setUserData={setUserData} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm />
        </DialogContent>
      </Dialog>
      {/* Add more security options here */}
    </div>
  )
}

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <Icon className="w-6 h-6 text-primary" />
      <div className="flex-1">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

function calculateProfileCompletion(userData) {
  const fields = ["fullName", "email", "mobileNo", "avatarUrl"]
  const completedFields = fields.filter((field) => userData[field])
  return Math.round((completedFields.length / fields.length) * 100)
}

