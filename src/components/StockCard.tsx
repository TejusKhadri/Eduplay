import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, TrendingDownIcon, ShoppingCartIcon } from "lucide-react";

interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  description: string;
  category: string;
}

interface StockCardProps {
  stock: Stock;
  onBuy: (stock: Stock) => void;
  userCoins: number;
}

export default function StockCard({ stock, onBuy, userCoins }: StockCardProps) {
  const isPositive = stock.change >= 0;
  const canAfford = userCoins >= stock.price;
  
  return (
    <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{stock.symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
          <Badge variant={stock.category === "Technology" ? "default" : 
                        stock.category === "Food" ? "secondary" : "outline"}>
            {stock.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{stock.price} coins</div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{stock.description}</p>
        
        <Button 
          variant={canAfford ? "coin" : "outline"} 
          className="w-full"
          onClick={() => onBuy(stock)}
          disabled={!canAfford}
        >
          <ShoppingCartIcon className="w-4 h-4" />
          {canAfford ? 'Buy Stock' : 'Not Enough Coins'}
        </Button>
      </CardContent>
    </Card>
  );
}