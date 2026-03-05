'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ExpandableDock from './expandable-dock';
import { Search, X, TrendingUp, Clock, Hash, SearchX } from 'lucide-react';
import { AUTH_ROUTES } from '@/constants/routes';

export const SearchDock = () => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't show on auth pages
  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));
  
  // Don't show on learning view
  const isLearnPage = pathname?.startsWith('/learn');

  // Mock trending searches
  const trendingSearches = [
    'React hooks',
    'Next.js 14',
    'TypeScript tips',
    'Tailwind CSS',
  ];

  // Mock recent searches (would come from localStorage or state)
  const recentSearches = [
    'Legend State',
    'Framer Motion',
    'shadcn/ui',
    'React Server Components',
    'Tailwind CSS',
    'Next.js API Routes',
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement actual search functionality
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleInputClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the dock header
    e.stopPropagation();
  };

  const handleInputMouseDown = (e: React.MouseEvent) => {
    // Prevent the mouse down from bubbling up to the dock header
    e.stopPropagation();
  };

  if (isAuthPage || isLearnPage) return null;
  
  return (
    <ExpandableDock
      headerContent={
        <div className="flex items-center gap-3 w-full">
          <Search className="w-5 h-5 text-foreground" />
          <span className="text-base font-medium text-foreground">
            Tìm kiếm nội dung...
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-6 h-full text-foreground px-1">
        {/* Search Input */}
        <div className="relative p-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={handleInputClick}
            onMouseDown={handleInputMouseDown}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleSearch(searchQuery);
              }
            }}
            placeholder="Nhập từ khóa tìm kiếm..."
            className="w-full pl-12 pr-14 py-3 bg-muted rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-border transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearSearch();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results or Suggestions */}
        <div className="flex-1 overflow-y-auto space-y-6 px-2">
          {searchQuery ? (
            // Search Results
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Kết quả tìm kiếm
              </h3>
              <div className="text-sm text-muted-foreground">
                Đang tìm kiếm "{searchQuery}"...
              </div>
              {/* TODO: Display actual search results here */}
              {/* No results message */}
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <SearchX className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Không tìm thấy kết quả nào</p>
              </div>
            </div>
          ) : (
            // Suggestions when no search query
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-3 pl-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tìm kiếm gần đây
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="w-full text-left px-4 py-3 bg-muted hover:bg-accent rounded-xl text-sm text-foreground transition-colors flex items-center gap-3"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="space-y-3 pl-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Xu hướng tìm kiếm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="px-4 py-2 bg-muted hover:bg-accent border border-border rounded-full text-sm text-foreground transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>


            </>
          )}
        </div>
      </div>
    </ExpandableDock>
  );
};