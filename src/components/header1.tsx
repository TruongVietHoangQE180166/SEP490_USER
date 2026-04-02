'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, LogIn, User, LogOut, Settings, BookOpen, LayoutDashboard, Wallet } from 'lucide-react'
import { getNormalizedRole } from '@/modules/auth/utils'
import { Button } from '@/components/ui/button'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { observer } from '@legendapp/state/react'
import { authState$ } from '@/modules/auth/store'
import { useLogout } from '@/modules/auth/hooks/useLogout'
import { ROUTES } from '@/constants/routes'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CryptoTicker } from '@/components/CryptoTicker'
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


const menuItems = [
    { name: 'Khóa học', href: '/course' },
    { name: 'Blog', href: '/blog' },
    { name: 'Giao Dịch', href: '/trading' },
    // { name: 'Features', href: '#link' },
    // { name: 'About', href: '#link' },
    // { name: 'Speech to Text', href: '/speech-to-text' },

]

export const HeroHeader = observer(() => {
    const [menuState, setMenuState] = React.useState(false)
    const [dropdownOpen, setDropdownOpen] = React.useState(false)
    const [isClient, setIsClient] = React.useState(false)
    const isAuthenticated = isClient ? authState$.isAuthenticated.get() : false
    const user = isClient ? authState$.user.get() : null
    const { logout } = useLogout()
    const pathname = usePathname()
    
    React.useEffect(() => {
        setIsClient(true)
    }, [])
    
    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
                setDropdownOpen(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [dropdownOpen])
    
    // Don't show header on auth pages, learn pages, admin or teacher pages
    const isAuthPage = !!pathname && Object.values(ROUTES.AUTH).some((route) => pathname?.startsWith(route))
    const isLearnPage = !!pathname && pathname?.startsWith('/learn')
    const isAdminPage = !!pathname && pathname?.startsWith('/admin')
    const isTeacherPage = !!pathname && pathname?.startsWith('/teacher')
    
    if (isAuthPage || isLearnPage || isAdminPage || isTeacherPage) return null
    
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="bg-background fixed z-40 w-full border-b">
                <CryptoTicker />
                <div className="mx-auto max-w-8xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex items-center">
                                <ThemeToggle />
                            </div>
                            
                            {/* Auth Navigation */}
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {isAuthenticated ? (
                                    <div className="relative user-dropdown">
                                        {/* User Avatar */}
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="group flex items-center justify-center rounded-full border border-border/40 bg-background/50 p-1 transition-all duration-200 hover:bg-accent hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-ring/20 outline-none"
                                            aria-label="User menu"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-border/50 transition-all duration-200 group-hover:scale-105 overflow-hidden">
                                                {user?.avatar ? (
                                                    <img 
                                                        src={user.avatar} 
                                                        alt={user.username || 'User'} 
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={(e) => {
                                                            // Fallback to initials if image fails to load
                                                            e.currentTarget.style.display = 'none';
                                                            const parentElement = e.currentTarget.parentElement;
                                                            if (parentElement) {
                                                                const nextElement = e.currentTarget.nextSibling;
                                                                if (nextElement && 'style' in nextElement) {
                                                                    (nextElement as HTMLElement).style.display = 'flex';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                ) : user?.username ? (
                                                    <span className="text-sm font-bold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <User className="h-5 w-5" />
                                                )}
                                                {user?.username && !user?.avatar && (
                                                    <span className="text-sm font-bold hidden">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                                                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute right-0 mt-3 w-72 rounded-2xl border border-border/50 bg-popover p-2 shadow-2xl z-50 ring-1 ring-black/5"
                                                >
                                                    <div className="flex items-center gap-4 p-4 mb-2 rounded-xl bg-gradient-to-br from-muted/50 to-muted/10 border border-border/20">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-sm ring-1 ring-border/20 overflow-hidden">
                                                            {user?.avatar ? (
                                                                <img 
                                                                    src={user.avatar} 
                                                                    alt={user.username || 'User'} 
                                                                    className="w-full h-full object-cover rounded-full"
                                                                    onError={(e) => {
                                                                        // Fallback to initials if image fails to load
                                                                        e.currentTarget.style.display = 'none';
                                                                        const parentElement = e.currentTarget.parentElement;
                                                                        if (parentElement) {
                                                                            const nextElement = e.currentTarget.nextSibling;
                                                                            if (nextElement && 'style' in nextElement) {
                                                                                (nextElement as HTMLElement).style.display = 'flex';
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            ) : user?.username ? (
                                                                <span className="text-lg font-bold">
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </span>
                                                            ) : (
                                                                <User className="h-6 w-6" />
                                                            )}
                                                            {user?.username && !user?.avatar && (
                                                                <span className="text-lg font-bold hidden">
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <p className="truncate text-sm font-bold text-foreground">
                                                                {user?.username || 'User'}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground font-medium">
                                                                {user?.email || 'user@example.com'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Link 
                                                            href={ROUTES.PRIVATE.PROFILE}
                                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground group"
                                                            onClick={() => setDropdownOpen(false)}
                                                        >
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 border border-border/50 group-hover:bg-background group-hover:border-primary/20 transition-colors shadow-sm">
                                                                <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                            </div>
                                                            Hồ sơ cá nhân
                                                        </Link>

                                                        <Link 
                                                            href={ROUTES.PRIVATE.MY_COURSE}
                                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground group"
                                                            onClick={() => setDropdownOpen(false)}
                                                        >
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 border border-border/50 group-hover:bg-background group-hover:border-primary/20 transition-colors shadow-sm">
                                                                <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                            </div>
                                                            Khóa học của tôi
                                                        </Link>

                                                        <Link 
                                                            href={ROUTES.PRIVATE.WALLET}
                                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground group"
                                                            onClick={() => setDropdownOpen(false)}
                                                        >
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 border border-border/50 group-hover:bg-background group-hover:border-primary/20 transition-colors shadow-sm">
                                                                <Wallet className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                            </div>
                                                            Ví của tôi
                                                        </Link>

                                                        {user && (getNormalizedRole(user.role) === 'ADMIN' || getNormalizedRole(user.role) === 'TEACHER') && (
                                                            <Link 
                                                                href={getNormalizedRole(user.role) === 'ADMIN' ? '/admin' : '/teacher'}
                                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground group"
                                                                onClick={() => setDropdownOpen(false)}
                                                            >
                                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 border border-border/50 group-hover:bg-background group-hover:border-primary/20 transition-colors shadow-sm">
                                                                    <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                </div>
                                                                Trang quản trị ({getNormalizedRole(user.role) === 'ADMIN' ? 'Admin' : 'Giảng viên'})
                                                            </Link>
                                                        )}
                                                        
                                                        <div className="my-1 h-px bg-border/40 mx-2" />
                                                        
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button
                                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10 hover:text-red-600 group"
                                                                >
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 border border-border/50 group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-colors shadow-sm">
                                                                        <LogOut className="h-4 w-4 text-red-500/70 group-hover:text-red-600 transition-colors" />
                                                                    </div>
                                                                    Đăng xuất
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction 
                                                                        className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white border-0"
                                                                        onClick={() => {
                                                                        logout()
                                                                        setDropdownOpen(false)
                                                                    }}>Đăng xuất</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm">
                                            <Link href={ROUTES.AUTH.LOGIN}>
                                                <LogIn className="w-4 h-4 mr-2" />
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm">
                                            <Link href={ROUTES.AUTH.REGISTER}>
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
})