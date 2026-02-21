import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-600/15 via-amber-600/15 to-orange-600/15 border-t relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-yellow-400/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GD</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Godavari</span>
                <span className="text-xs text-muted-foreground">Delights</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Authentic handmade Putharekulu from Atreyapuram, crafted with traditional recipes and pure ingredients.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Follow Us</p>
                <div className="flex space-x-3">
                  <a 
                    href="https://www.youtube.com/@godavaridelights" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300 group-hover:shadow-lg">
                      <Youtube className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </a>
                  <a 
                    href="https://www.instagram.com/godavidelights.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:from-pink-500 group-hover:to-rose-600 transition-all duration-300 group-hover:shadow-lg">
                      <Instagram className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </a>
                  <a 
                    href="#facebook" 
                    className="group"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 group-hover:shadow-lg">
                      <Facebook className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </a>
                  <a 
                    href="#twitter" 
                    className="group"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:from-sky-500 group-hover:to-sky-600 transition-all duration-300 group-hover:shadow-lg">
                      <Twitter className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-primary">
                Products
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
              <Link href="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary">
                Terms &amp; Conditions
              </Link>
              <Link href="/refund-policy" className="block text-sm text-muted-foreground hover:text-primary">
                Return &amp; Refund Policy
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <div className="space-y-2">
              <Link
                href="/products?category=traditional"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Traditional Putharekulu
              </Link>
              <Link
                href="/products?category=premium"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Premium Collection
              </Link>
              <Link
                href="/products?category=festival"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Festival Specials
              </Link>
              <Link href="/products?category=gifts" className="block text-sm text-muted-foreground hover:text-primary">
                Gift Hampers
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>Atreyapuram Village,</p>
                  <p>West Godavari District,</p>
                  <p>Andhra Pradesh - 534134</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <a href="tel:+919885469456" className="hover:text-primary">+91 9885469456</a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:godavaridelights1@gmail.com" className="text-sm text-muted-foreground hover:text-primary">godavaridelights1@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Blended Multi-Language Footer with Animation */}
      <div className="border-t relative overflow-hidden">
        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm font-bold text-orange-700">© 2026, Godavari Delights</span>
              <span className="text-gray-300 text-lg">|</span>
              <span className="text-sm font-bold text-orange-700">godavaridelights.in</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <Link href="/privacy-policy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
              <span className="text-gray-300">|</span>
              <Link href="/terms" className="hover:text-orange-600 transition-colors">Terms &amp; Conditions</Link>
              <span className="text-gray-300">|</span>
              <Link href="/refund-policy" className="hover:text-orange-600 transition-colors">Return &amp; Refund Policy</Link>
            </div>
            
            <p className="text-xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
              One India, One Delight
            </p>

            {/* Multi-language Pootharekulu */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-gray-700 font-semibold">
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                పూతరేకులు
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                पूतरेकुलु
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                ಪೂತರೆಕುಲು
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                பூதரேகுலு
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                പൂതരേകുല്
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                પૂઠારેકુલુ
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                ਪੂਠਾਰੇਕੁਲੁ
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                پوتھرکلو
              </span>
              <span className="text-gray-400">•</span>
              <span className="px-3 py-2 bg-white/70 rounded-full hover:bg-orange-200 transition-all duration-300 cursor-default hover:shadow-md transform hover:scale-110">
                பூதरेकुलु
              </span>
            </div>

            <p className="text-xs text-gray-600 pt-2 font-medium">
              Made with ❤️ in Atreyapuram, Andhra Pradesh | Authentic Pootharekulu - The traditional sweet of India in all languages
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
