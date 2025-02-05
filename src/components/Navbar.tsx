import { useAuth } from "./AuthContext" // Adjust the path as needed
import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../components/theme-provider" // Adjust the path as needed
import { motion } from "framer-motion"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu" // Adjust the path as needed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Adjust the path as needed
import { Button } from "@/components/ui/button" // Adjust the path as needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Adjust the path as needed
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { QrCode } from "lucide-react" // Adjust the path as needed
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet" // Adjust the path as needed
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // Adjust the path as needed

export default function Navbar() {
  const { isLoggedIn, fullName, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
  const navRefs = useRef<(HTMLDivElement | null)[]>([])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "MyQRs", path: "/myqrs", protected: true },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-gray-900"
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          
          <QrCode className="h-8 w-8 text-white" />
          <span className="text-xl font-russo text-white">QRBook</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <div className="relative">
                {/* Hover Highlight */}
                <div
                  className="absolute h-[30px] transition-all duration-300 ease-out bg-gray-800 rounded-[6px] flex items-center"
                  style={{
                    ...hoverStyle,
                    opacity: hoveredIndex !== null ? 1 : 0,
                  }}
                />

                {/* Active Indicator */}
                <div
                  className="absolute bottom-[-6px] h-[2px] bg-white transition-all duration-300 ease-out"
                  style={activeStyle}
                />

                {/* Tabs */}
                <div className="relative flex space-x-[6px] items-center font-russo ">
                  {navItems.map(
                    (item, index) =>
                      (!item.protected || isLoggedIn) && (
                        <NavigationMenuItem key={item.name}>
                          <Link to={item.path} legacyBehavior passHref>
                            <NavigationMenuLink
                              ref={(el) => (navRefs.current[index] = el)}
                              className="px-3 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
                              onMouseEnter={() => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(null)}
                              onClick={() => setActiveIndex(index)}
                            >
                              {item.name}
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      ),
                  )}
                </div>
              </div>
            </NavigationMenuList>
          </NavigationMenu>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link className="font-russo" to="/profile">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-full text-left font-russo">Logout</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>This action will log you out of your account.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="font-russo">
              <Link to="/login">Get Started</Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="font-russo bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-300" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="font-russo">Menu</SheetTitle>
              <SheetDescription>Navigate through our app or manage your account.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4 font-russo">
              {navItems.map(
                (item) =>
                  (!item.protected || isLoggedIn) && (
                    <Button key={item.name} asChild variant="ghost">
                      <Link to={item.path}>{item.name}</Link>
                    </Button>
                  ),
              )}
              {isLoggedIn ? (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost">Logout</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>This action will log you out of your account.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <Button asChild className="font-russo">
                  <Link to="/login">Get Started</Link>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="font-russo bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300"
              >
                {theme === "dark" ? "Light" : "Dark"} Mode
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  )
}

