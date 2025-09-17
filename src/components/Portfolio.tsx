import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, TrendingDownIcon, PieChartIcon } from "lucide-react";

interface PortfolioStock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  category: string;
}

interface PortfolioProps {
  stocks: PortfolioStock[];
}

export default function Portfolio({ stocks }: PortfolioProps) {
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice), 0);
  const totalCost = stocks.reduce((sum, stock) => sum + (stock.shares * stock.buyPrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <CardTitle>My Portfolio</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">{totalValue.toFixed(0)} coins</p>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalGainLoss >= 0 ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
              <span className="text-lg font-bold">
                {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Return</p>
          </div>
        </div>
        
        {stocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stocks in your portfolio yet!</p>
            <p className="text-sm">Start investing to see your progress here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stocks.map((stock) => {
              const gainLoss = stock.shares * (stock.currentPrice - stock.buyPrice);
              const gainLossPercent = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
              const isPositive = gainLoss >= 0;
              
              return (
                <div key={stock.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stock.symbol}</span>
                      <Badge variant="outline" className="text-xs">{stock.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{stock.shares} shares</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{(stock.shares * stock.currentPrice).toFixed(0)} coins</p>
                    <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
                      {isPositive ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                      <span>{isPositive ? '+' : ''}{gainLossPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}