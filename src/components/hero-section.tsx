import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { motion, AnimatePresence } from 'framer-motion'

const DASHBOARD_IMAGES = [
    "https://media.thuonghieuvaphapluat.vn/upload/2022/06/25/bitcoin-va-thi-truong-crypto-di-xuong-khien-cac-tho-dao-ngop-tho-vi-tra-nofb.jpg",
    "https://vnn-imgs-f.vgcloud.vn/2022/03/22/09/thi-truong-crypto-dong-von-roi-di-tuan-thu-2-lien-tiep.jpg?width=0&s=Z6HKaLTtnQ81QiLMqx2PuQ",
    "https://cafefcdn.com/203337114487263232/2022/4/12/photo-1-1649727295765413073863.jpg",
    "https://files.amberblocks.com/media/chnbzaa92ook5tnj/posts/py8v3uvz0tfhkn20/fsv94kigatwt01z8r9jclrach32hxcn1/market-sentiment.jpeg"
];

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % DASHBOARD_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="overflow-hidden relative pb-16">
            <div
                aria-hidden
                className="absolute inset-0 isolate hidden opacity-40 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-12 md:pt-16">
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                delayChildren: 1,
                                            },
                                        },
                                    },
                                    item: {
                                        hidden: {
                                            opacity: 0,
                                            y: 20,
                                        },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                type: 'spring' as const,
                                                bounce: 0.3,
                                                duration: 2,
                                            },
                                        },
                                    },
                                }}
                                className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32">
                                <Image
                                    src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                    alt=""
                                    aria-hidden="true"
                                    className="hidden size-full dark:block"
                                    width={3276}
                                    height={4095}
                                    priority
                                    unoptimized
                                />
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-8xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Chào mừng đến với VIC Teach</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <h1 className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem] font-black tracking-tighter">
                                    Nâng Tầm Tri Thức Cùng <span className="text-primary italic">VIC Teach</span>
                                </h1>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg font-medium text-muted-foreground">
                                    Nền tảng học trực tuyến hiện đại với hàng ngàn khóa học chất lượng cao, giúp bạn làm chủ kỹ năng và bứt phá sự nghiệp.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-8 h-14 font-black shadow-xl shadow-primary/20">
                                            <Link href="/course">
                                                <span className="text-nowrap">Bắt đầu học ngay</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-14 rounded-xl px-8 font-bold">
                                        <Link href="/course">
                                            <span className="text-nowrap">Khám phá khóa học</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-55% relative mx-auto mt-8 px-4 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-8xl overflow-hidden rounded-2xl border p-2 shadow-lg shadow-zinc-950/15 ring-1">
                                    <div className="relative overflow-hidden rounded-2xl aspect-15/8 bg-muted/20">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentImageIndex}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                                className="absolute inset-0"
                                            >
                                                <Image
                                                    src={DASHBOARD_IMAGES[currentImageIndex]}
                                                    alt={`VICTEACH - Nền tảng học Crypto chuyên nghiệp ${currentImageIndex + 1}`}
                                                    className="size-full object-cover"
                                                    width={2700}
                                                    height={1440}
                                                    priority={currentImageIndex === 0}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                        {/* Overlay to unify look */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
        </div>
    )
}
