import { useAuth } from "./AuthContext"
import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../components/theme-provider"
import { motion } from "framer-motion"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { QrCode } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
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
} from "@/components/ui/alert-dialog"

export default function Navbar() {
  const { isLoggedIn, fullName, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const navRefs = useRef<(HTMLDivElement | null)[]>([])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "MyQRs", path: "/myqrs", protected: true },
  ]

  // Set active index based on current URL path
  useEffect(() => {
    const currentPath = location.pathname
    const index = navItems.findIndex(item => item.path === currentPath)
    setActiveIndex(index !== -1 ? index : 0)
  }, [location.pathname])

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
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 w-full z-50 bg-gray-900 py-2"
  >
    <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
      <Link to="/" className="flex items-center space-x-2">
        <QrCode className="h-6 w-6 text-white" />
        <span className="text-2xl font-extrabold text-white">QRBook</span>
      </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-1">
              {navItems.map(
                (item, index) =>
                  (!item.protected || isLoggedIn) && (
                    <NavigationMenuItem key={item.name}>
                      <Link to={item.path}>
                        <div
                          className="relative px-3 py-2"
                          ref={(el) => (navRefs.current[index] = el)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {/* Hover background effect */}
                          {hoveredIndex === index && (
                            <motion.div
                              layoutId="hoverBackground"
                              className="absolute inset-0 bg-gray-800 rounded-md -z-10"
                              transition={{ type: "spring", duration: 0.2 }}
                            />
                          )}
                          
                          {/* Active indicator */}
                          {activeIndex === index && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                              transition={{ type: "spring", duration: 0.5 }}
                            />
                          )}
                          
                          <span className="text-sm font-medium font-sans text-white">
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    </NavigationMenuItem>
                  ),
              )}
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
                  <Link className="font-sans" to="/profile">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-full text-left font-sans">Logout</button>
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
            <Button asChild className="font-sans">
              <Link to="/login">Get Started</Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="font-sans bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-300" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
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
              <SheetTitle className="font-sans">Menu</SheetTitle>
              <SheetDescription>Navigate through our app or manage your account.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4 font-sans">
              {navItems.map(
                (item) =>
                  (!item.protected || isLoggedIn) && (
                    <Button key={item.name} asChild variant="ghost" className={location.pathname === item.path ? "bg-gray-200 dark:bg-gray-800" : ""}>
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
                <Button asChild className="font-sans">
                  <Link to="/login">Get Started</Link>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="font-sans bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300"
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