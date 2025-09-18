import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, CreditCardIcon, GiftIcon, StarIcon } from "lucide-react";

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus: number;
  popular?: boolean;
  description: string;
}

const coinPackages: CoinPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    coins: 500,
    price: 4.99,
    bonus: 0,
    description: "Perfect for beginners to start investing!"
  },
  {
    id: "popular",
    name: "Popular Pack",
    coins: 1200,
    price: 9.99,
    bonus: 200,
    popular: true,
    description: "Most popular choice with bonus coins!"
  },
  {
    id: "investor",
    name: "Young Investor",
    coins: 2500,
    price: 19.99,
    bonus: 500,
    description: "For serious young investors with big bonus!"
  },
  {
    id: "mogul",
    name: "Future Mogul",
    coins: 5000,
    price: 39.99,
    bonus: 1000,
    description: "Maximum coins for future business leaders!"
  }
];

interface BuyCoinsProps {
  onCoinsAdded: (coins: number) => void;
}

export default function BuyCoins({ onCoinsAdded }: BuyCoinsProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = (coinPackage: CoinPackage) => {
    // Simulate purchase process
    setSelectedPackage(coinPackage.id);
    
    setTimeout(() => {
      const totalCoins = coinPackage.coins + coinPackage.bonus;
      onCoinsAdded(totalCoins);
      setSelectedPackage(null);
      
      toast({
        title: "Purchase Successful! 🎉",
        description: `You received ${totalCoins} virtual coins to start investing!`,
      });
    }, 2000);
  };

  const handleFreeCoins = () => {
    // Give free coins for demo purposes
    const freeCoins = 100;
    onCoinsAdded(freeCoins);
    
    toast({
      title: "Free Coins Added! 🎁",
      description: `You received ${freeCoins} free demo coins!`,
    });
  };

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <CoinsIcon className="w-10 h-10 text-primary" />
          Buy Virtual Coins
        </h1>
        <p className="text-muted-foreground text-lg">
          Purchase virtual coins to start your investing journey safely!
        </p>
      </div>

      {/* Free Demo Section */}
      <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <GiftIcon className="w-6 h-6" />
            Try for Free!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            New to investing? Get free demo coins to explore our platform!
          </p>
          <Button onClick={handleFreeCoins} variant="outline" size="lg">
            <GiftIcon className="w-4 h-4 mr-2" />
            Get 100 Free Demo Coins
          </Button>
        </CardContent>
      </Card>

      {/* Coin Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coinPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative transition-all duration-300 hover:scale-105 ${
              pkg.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-card hover:shadow-glow'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="px-3 py-1 text-xs font-bold">
                  <StarIcon className="w-3 h-3 mr-1" />
                  MOST POPULAR
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">
                ${pkg.price}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <CoinsIcon className="w-6 h-6 text-primary" />
                  {pkg.coins.toLocaleString()}
                </div>
                {pkg.bonus > 0 && (
                  <div className="text-sm text-success font-semibold">
                    + {pkg.bonus} bonus coins!
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                {pkg.description}
              </p>
              
              <Button 
                className="w-full"
                onClick={() => handlePurchase(pkg)}
                disabled={selectedPackage === pkg.id}
                variant={pkg.popular ? "default" : "outline"}
              >
                {selectedPackage === pkg.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    Buy Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Educational Note */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Educational Platform</h3>
            <p className="text-sm text-muted-foreground">
              This is a virtual trading platform designed to teach kids about investing. 
              All transactions use virtual coins and no real money is involved in stock trading.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}