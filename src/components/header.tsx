'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, LogIn, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { observer } from '@legendapp/state/react'
import { authState$ } from '@/modules/auth/store'
import { useLogout } from '@/modules/auth/hooks/useLogout'
import { ROUTES } from '@/constants/routes'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = observer(() => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [dropdownOpen, setDropdownOpen] = React.useState(false)
    const isAuthenticated = authState$.isAuthenticated.get()
    const user = authState$.user.get()
    const { logout } = useLogout()
    const pathname = usePathname()
    
    // Don't show header on auth pages
    const isAuthPage = pathname && Object.values(ROUTES.AUTH).some((route) => pathname.startsWith(route))

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
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
    
    if (isAuthPage) return null
    
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-8', isScrolled && 'bg-background/50 max-w-6xl rounded-2xl backdrop-blur-lg lg:px-8')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
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
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
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
                            
                            {/* Theme Toggle */}
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
                                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted overflow-hidden focus:outline-none focus:ring-0 ring-0 outline-none border-0 transition-all duration-200 hover:bg-accent hover:scale-105"
                                            aria-label="User menu"
                                        >
                                            {user?.name ? (
                                                <span className="font-semibold text-foreground">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            ) : (
                                                <User className="w-5 h-5 text-foreground" />
                                            )}
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {dropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border py-2 z-30">
                                                <div className="px-4 py-2 border-b border-border">
                                                    <p className="text-sm font-medium text-popover-foreground">
                                                        {user?.name || 'User'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {user?.email || 'user@example.com'}
                                                    </p>
                                                </div>
                                                <Link 
                                                    href={ROUTES.PRIVATE.PROFILE}
                                                    className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent/50 transition-colors"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <User className="w-4 h-4 mr-2" />
                                                    Hồ sơ
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout()
                                                        setDropdownOpen(false)
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-accent/50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant={isScrolled ? "default" : "outline"}
                                            size="sm">
                                            <Link href={ROUTES.AUTH.LOGIN}>
                                                <LogIn className="w-4 h-4 mr-2" />
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled && 'hidden')}>
                                            <Link href={ROUTES.AUTH.REGISTER}>
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="hidden">
                                            <Link href={ROUTES.AUTH.LOGIN}>
                                                <span>Get Started</span>
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