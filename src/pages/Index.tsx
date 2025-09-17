import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import Portfolio from "@/components/Portfolio";
import LearningCenter from "@/components/LearningCenter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { yahooFinanceService, type Stock } from "@/services/yahooFinanceService";

// Fallback mock data for when API fails
const fallbackStocks: Stock[] = [
  {
    id: "aapl",
    name: "Apple Inc.",
    symbol: "AAPL",
    price: 150,
    change: 2.5,
    changePercent: 1.69,
    description: "Makes iPhones, iPads, and Mac computers that kids love!",
    category: "Technology"
  },
  {
    id: "googl",
    name: "Alphabet Inc.",
    symbol: "GOOGL", 
    price: 135,
    change: -1.2,
    changePercent: -0.88,
    description: "The company behind Google search and YouTube!",
    category: "Technology"
  },
  {
    id: "msft",
    name: "Microsoft Corp.",
    symbol: "MSFT",
    price: 330,
    change: 5.8,
    changePercent: 1.79,
    description: "Creates Xbox games and Windows computers!",
    category: "Technology"
  },
  {
    id: "tsla",
    name: "Tesla Inc.",
    symbol: "TSLA",
    price: 220,
    change: -8.5,
    changePercent: -3.72,
    description: "Makes cool electric cars and rockets!",
    category: "Technology"
  },
  {
    id: "dis",
    name: "Walt Disney Co.",
    symbol: "DIS",
    price: 95,
    change: 1.8,
    changePercent: 1.93,
    description: "Home of Mickey Mouse, Marvel heroes, and Disney movies!",
    category: "Entertainment"
  },
  {
    id: "mcd",
    name: "McDonald's Corp.",
    symbol: "MCD",
    price: 280,
    change: 3.2,
    changePercent: 1.15,
    description: "The famous golden arches restaurant everyone knows!",
    category: "Food"
  },
  {
    id: "nke",
    name: "Nike Inc.",
    symbol: "NKE",
    price: 110,
    change: -2.1,
    changePercent: -1.87,
    description: "Makes the coolest sneakers and sports gear!",
    category: "Sports"
  },
  {
    id: "nflx",
    name: "Netflix Inc.",
    symbol: "NFLX",
    price: 420,
    change: 12.5,
    changePercent: 3.07,
    description: "Your favorite streaming service for movies and shows!",
    category: "Entertainment"
  }
];

const learningModules = [
  {
    id: "1",
    title: "What is a Stock?",
    description: "Learn the basics of what stocks are and how they work",
    difficulty: "Beginner" as const,
    reward: 50,
    completed: false,
    duration: "5 min"
  },
  {
    id: "2", 
    title: "How to Read Stock Prices",
    description: "Understand stock prices and what the numbers mean",
    difficulty: "Beginner" as const,
    reward: 75,
    completed: false,
    duration: "8 min"
  },
  {
    id: "3",
    title: "Risk and Reward",
    description: "Learn about investment risk and potential rewards",
    difficulty: "Intermediate" as const,
    reward: 100,
    completed: false,
    duration: "12 min"
  },
  {
    id: "4",
    title: "Building a Portfolio",
    description: "How to diversify your investments across different stocks",
    difficulty: "Advanced" as const,
    reward: 150,
    completed: false,
    duration: "15 min"
  }
];

const Index = () => {
  const [virtualCoins, setVirtualCoins] = useState(1000);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [stocks, setStocks] = useState<Stock[]>(fallbackStocks);
  const [modules, setModules] = useState(learningModules);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch real stock data on component mount
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        const symbols = yahooFinanceService.getPopularStocks();
        const realStocks = await yahooFinanceService.getMultipleQuotes(symbols);
        
        if (realStocks.length > 0) {
          setStocks(realStocks);
          toast({
            title: "Live Market Data Loaded! 📈",
            description: "Now showing real stock prices from Yahoo Finance!",
          });
        } else {
          throw new Error("No stock data received");
        }
      } catch (error) {
        console.error("Failed to load real stock data:", error);
        setStocks(fallbackStocks);
        toast({
          title: "Using Demo Data 🎮",
          description: "Real market data unavailable. Using demo prices for learning!",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleBuyStock = (stock: Stock) => {
    if (virtualCoins >= stock.price) {
      setVirtualCoins(prev => prev - stock.price);
      
      setPortfolio(prev => {
        const existingStock = prev.find(item => item.symbol === stock.symbol);
        if (existingStock) {
          return prev.map(item =>
            item.symbol === stock.symbol
              ? { 
                  ...item, 
                  shares: item.shares + 1,
                  currentPrice: stock.price 
                }
              : item
          );
        } else {
          return [...prev, {
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            shares: 1,
            buyPrice: stock.price,
            currentPrice: stock.price,
            category: stock.category
          }];
        }
      });

      toast({
        title: "Stock Purchased! 🎉",
        description: `You bought 1 share of ${stock.symbol} for ${stock.price} coins!`,
      });
    } else {
      toast({
        title: "Not Enough Coins! 💰",
        description: `You need ${stock.price - virtualCoins} more coins to buy this stock.`,
        variant: "destructive",
      });
    }
  };

  const handleStartModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.completed) {
      setVirtualCoins(prev => prev + module.reward);
      setModules(prev => prev.map(m => 
        m.id === moduleId ? { ...m, completed: true } : m
      ));
      
      toast({
        title: "Lesson Completed! 🌟",
        description: `You earned ${module.reward} virtual coins!`,
      });
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
      <Header virtualCoins={virtualCoins} />
      
      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="market">Stock Market</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Stock Market</h2>
            <p className="text-muted-foreground">
              Choose companies to invest in with your virtual coins!
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground">Loading real market data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {stocks === fallbackStocks ? "Demo Data" : "Live Market Data"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stocks.map((stock) => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    onBuy={handleBuyStock}
                    userCoins={virtualCoins}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="portfolio">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">My Portfolio</h2>
            <p className="text-muted-foreground">
              Track your investments and see how they're performing
            </p>
          </div>
          
          <Portfolio stocks={portfolio} />
        </TabsContent>
        
        <TabsContent value="learn">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Learning Center</h2>
            <p className="text-muted-foreground">
              Complete lessons to earn coins and become a better investor!
            </p>
          </div>
          
          <LearningCenter 
            modules={modules}
            onStartModule={handleStartModule}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
