import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import Portfolio from "@/components/Portfolio";
import LearningCenter from "@/components/LearningCenter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the stock market simulation
const initialStocks = [
  {
    id: "1",
    name: "Apple Inc.",
    symbol: "AAPL",
    price: 150,
    change: 2.5,
    changePercent: 1.7,
    description: "Technology company that makes phones, computers and tablets",
    category: "Technology"
  },
  {
    id: "2", 
    name: "McDonald's Corp.",
    symbol: "MCD",
    price: 85,
    change: -1.2,
    changePercent: -1.4,
    description: "Popular fast food restaurant chain around the world",
    category: "Food"
  },
  {
    id: "3",
    name: "Tesla Inc.",
    symbol: "TSLA", 
    price: 200,
    change: 8.3,
    changePercent: 4.3,
    description: "Electric car company that also makes solar panels and batteries",
    category: "Technology"
  },
  {
    id: "4",
    name: "Coca-Cola Co.",
    symbol: "KO",
    price: 45,
    change: 0.8,
    changePercent: 1.8,
    description: "Beverage company that makes soft drinks and juices",
    category: "Food"
  },
  {
    id: "5",
    name: "Microsoft Corp.",
    symbol: "MSFT",
    price: 180,
    change: 3.2,
    changePercent: 1.8,
    description: "Technology company that makes software and cloud services",
    category: "Technology"
  },
  {
    id: "6",
    name: "Disney Co.",
    symbol: "DIS",
    price: 120,
    change: -2.1,
    changePercent: -1.7,
    description: "Entertainment company that makes movies and theme parks",
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
  const [stocks] = useState(initialStocks);
  const [modules, setModules] = useState(learningModules);

  const handleBuyStock = (stock: any) => {
    if (virtualCoins >= stock.price) {
      setVirtualCoins(prev => prev - stock.price);
      
      // Add to portfolio or increase shares
      setPortfolio(prev => {
        const existingStock = prev.find(p => p.id === stock.id);
        if (existingStock) {
          return prev.map(p => 
            p.id === stock.id 
              ? { ...p, shares: p.shares + 1 }
              : p
          );
        } else {
          return [...prev, {
            ...stock,
            shares: 1,
            buyPrice: stock.price,
            currentPrice: stock.price
          }];
        }
      });
      
      toast({
        title: "Stock Purchased! 🎉",
        description: `You bought 1 share of ${stock.symbol} for ${stock.price} coins`,
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onBuy={handleBuyStock}
                userCoins={virtualCoins}
              />
            ))}
          </div>
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
