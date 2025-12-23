"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Menu, Search } from "lucide-react";
import { navItems } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function MobileNavigtaion() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
   const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <div className="md:hidden flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchClick}
                  className="text-white hover:text-blue-400">
                  <Search className="w-5 h-5" />
                </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle></SheetTitle>
          <ThemeToggle />
          <div className="flex flex-col space-y-4 mt-8 p-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
