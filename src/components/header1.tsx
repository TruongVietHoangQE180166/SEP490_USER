'use client'
import Link from 'next/link'
import { Logo, LogoIcon } from '@/components/logo'
import { Menu, X, LogIn, User, LogOut, Settings, BookOpen, LayoutDashboard, Wallet, Newspaper, TrendingUp, Library, Users, Search } from 'lucide-react'
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
    { name: 'Khóa học', href: '/course', icon: <BookOpen /> },
    { name: 'Blog', href: '/blog', icon: <Newspaper /> },
    { name: 'Giao Dịch', href: '/trading', icon: <TrendingUp /> },
    { name: 'Tài liệu', href: '/documentation', icon: <Library /> },
    { name: 'Về chúng tôi', href: '/about', icon: <Users /> },
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

    // Lock body scroll when mobile menu is open
    React.useEffect(() => {
        if (menuState) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [menuState])
    
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
                                className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shadow-inner">
                                    <LogoIcon className="h-6 w-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                    VICTEACH
                                </span>
                            </Link>

                            <div className="flex items-center gap-2 lg:hidden">
                                <ThemeToggle />
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 block cursor-pointer p-2.5">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-foreground" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-foreground" />
                                </button>
                            </div>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground flex items-center gap-2 duration-150 py-1">
                                                {item.icon && React.cloneElement(item.icon as React.ReactElement, { className: 'w-4 h-4' })}
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6">
                            {/* Desktop Search Bar */}
                            <div className="relative group hidden xl:block min-w-[240px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm khóa học..." 
                                    className="h-10 w-full pl-10 pr-4 rounded-full bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm outline-none"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground pointer-events-none">
                                    <span className="text-[10px]">⌘</span>K
                                </div>
                            </div>

                            {/* Desktop Theme Toggle */}
                            <ThemeToggle />
                            
                            {/* Desktop Auth Navigation */}
                            <div className="flex items-center">
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
                                                    />
                                                ) : user?.username ? (
                                                    <span className="text-sm font-bold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <User className="h-5 w-5" />
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
                                                                />
                                                            ) : user?.username ? (
                                                                <span className="text-lg font-bold">
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </span>
                                                            ) : (
                                                                <User className="h-6 w-6" />
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
                                    <div className="flex items-center gap-3">
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
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Full Screen Mobile Menu Overlay */}
            <AnimatePresence>
                {menuState && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[99999] bg-background lg:hidden flex flex-col h-screen"
                    >
                        {/* Overlay Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <Link
                                href="/"
                                onClick={() => setMenuState(false)}
                                className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shadow-inner">
                                    <LogoIcon className="h-6 w-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-foreground">
                                    VICTEACH
                                </span>
                            </Link>

                            <button
                                onClick={() => setMenuState(false)}
                                className="p-2 -mr-2 text-foreground active:scale-95 transition-transform"
                                aria-label="Close Menu"
                            >
                                <X className="size-8" />
                            </button>
                        </div>

                        {/* Overlay Content - Scrollable Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
                            {/* Mobile Search Bar */}
                            <div className="relative group mb-8">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm khóa học..." 
                                    className="h-14 w-full pl-12 pr-4 rounded-2xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 transition-all text-lg outline-none font-medium"
                                />
                            </div>

                            {/* Main Menu Links */}
                            <ul className="space-y-6">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-5 text-2xl font-black tracking-tight text-foreground hover:text-primary transition-all group py-2"
                                            onClick={() => setMenuState(false)}>
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-transparent group-hover:border-primary/20">
                                                {item.icon && React.cloneElement(item.icon as React.ReactElement, { className: 'size-7' })}
                                            </div>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="my-10 h-px bg-border/50 w-full" />

                            {/* User / Auth Section */}
                            {isAuthenticated ? (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border/10">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-md ring-1 ring-border/20 overflow-hidden">
                                            {user?.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.username || 'User'} 
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : user?.username ? (
                                                <span className="text-xl font-bold">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            ) : (
                                                <User className="h-8 w-8" />
                                            )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="truncate text-xl font-black text-foreground">
                                                {user?.username || 'User'}
                                            </p>
                                            <p className="truncate text-sm text-muted-foreground font-medium">
                                                {user?.email || 'user@example.com'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Link 
                                            href={ROUTES.PRIVATE.PROFILE}
                                            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-foreground transition-all active:bg-accent border border-transparent shadow-sm bg-background/50"
                                            onClick={() => setMenuState(false)}
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            Hồ sơ cá nhân
                                        </Link>

                                        <Link 
                                            href={ROUTES.PRIVATE.MY_COURSE}
                                            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-foreground transition-all active:bg-accent border border-transparent shadow-sm bg-background/50"
                                            onClick={() => setMenuState(false)}
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            Khóa học của tôi
                                        </Link>

                                        <Link 
                                            href={ROUTES.PRIVATE.WALLET}
                                            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-foreground transition-all active:bg-accent border border-transparent shadow-sm bg-background/50"
                                            onClick={() => setMenuState(false)}
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                                                <Wallet className="h-5 w-5 text-primary" />
                                            </div>
                                            Ví của tôi
                                        </Link>

                                        {user && (getNormalizedRole(user.role) === 'ADMIN' || getNormalizedRole(user.role) === 'TEACHER') && (
                                            <Link 
                                                href={getNormalizedRole(user.role) === 'ADMIN' ? '/admin' : '/teacher'}
                                                className="flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-foreground transition-all active:bg-accent border border-transparent shadow-sm bg-background/50"
                                                onClick={() => setMenuState(false)}
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                                                    <LayoutDashboard className="h-5 w-5 text-primary" />
                                                </div>
                                                Trang quản trị ({getNormalizedRole(user.role) === 'ADMIN' ? 'Admin' : 'Giảng viên'})
                                            </Link>
                                        )}
                                        
                                        <div className="h-px bg-border/40 my-4 mx-4" />
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-red-500 transition-all active:bg-red-500/10 border border-transparent shadow-sm bg-background/50"
                                                >
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20">
                                                        <LogOut className="h-5 w-5 text-red-500" />
                                                    </div>
                                                    Đăng xuất
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-[2rem] p-8">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-2xl font-black">Xác nhận đăng xuất</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-base font-medium">
                                                        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="flex-col gap-3 mt-8">
                                                    <AlertDialogCancel className="w-full rounded-2xl h-14 font-bold text-lg m-0 border-2">Hủy</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        className="w-full bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white border-0 rounded-2xl h-14 font-bold text-lg m-0"
                                                        onClick={() => {
                                                            logout()
                                                            setMenuState(false)
                                                        }}>Đăng xuất</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="h-16 rounded-2xl font-black text-xl border-2">
                                        <Link href={ROUTES.AUTH.LOGIN} onClick={() => setMenuState(false)}>
                                            <LogIn className="w-6 h-6 mr-3" />
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-16 rounded-2xl font-black text-xl shadow-lg shadow-primary/20">
                                        <Link href={ROUTES.AUTH.REGISTER} onClick={() => setMenuState(false)}>
                                            <span>Sign Up</span>
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            <div className="mt-12 flex items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border/50">
                                <span className="font-bold text-muted-foreground">Giao diện</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
})