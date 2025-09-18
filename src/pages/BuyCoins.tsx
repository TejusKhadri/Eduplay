import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, CreditCardIcon, GiftIcon, StarIcon, CheckIcon, ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus: number;
  popular?: boolean;
  description: string;
  features: string[];
}

const coinPackages: CoinPackage[] = [
  {
    id: "starter",
    name: "Starter",
    coins: 500,
    price: 0,
    bonus: 0,
    description: "Perfect for beginners",
    features: [
      "500 Virtual Coins",
      "Basic learning modules",
      "Portfolio tracking",
      "Educational content"
    ]
  },
  {
    id: "popular",
    name: "Investor",
    coins: 2000,
    price: 9.99,
    bonus: 500,
    popular: true,
    description: "Most popular choice",
    features: [
      "All in Starter +",
      "2500 Virtual Coins",
      "Advanced analytics",
      "Premium lessons",
      "Market insights"
    ]
  },
  {
    id: "mogul",
    name: "Pro Trader",
    coins: 5000,
    price: 19.99,
    bonus: 1500,
    description: "For serious investors",
    features: [
      "All in Investor +",
      "6500 Virtual Coins",
      "Advanced strategies",
      "1-on-1 mentoring",
      "Exclusive content"
    ]
  }
];

interface BuyCoinsProps {
  onCoinsAdded: (coins: number) => void;
}

export default function BuyCoins({ onCoinsAdded }: BuyCoinsProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePurchase = (coinPackage: CoinPackage) => {
    setSelectedPackage(coinPackage.id);
    
    setTimeout(() => {
      const totalCoins = coinPackage.coins + coinPackage.bonus;
      onCoinsAdded(totalCoins);
      setSelectedPackage(null);
      
      toast({
        title: "Purchase Successful! 🎉",
        description: `You received ${totalCoins} virtual coins to start investing!`,
      });
      
      navigate('/');
    }, 2000);
  };

  const handleFreeCoins = () => {
    const freeCoins = 500;
    onCoinsAdded(freeCoins);
    
    toast({
      title: "Free Coins Added! 🎁",
      description: `You received ${freeCoins} free demo coins!`,
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-6">
            <CoinsIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your investing journey with virtual coins designed for safe learning
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coinPackages.map((pkg, index) => (
            <Card 
              key={pkg.id} 
              className={`relative overflow-hidden transition-all duration-500 hover:scale-105 ${
                pkg.popular 
                  ? 'ring-2 ring-primary shadow-glow bg-gradient-to-br from-primary/10 to-primary/5' 
                  : 'shadow-card hover:shadow-glow bg-card/80 backdrop-blur-sm'
              } ${index === 0 ? 'md:transform md:scale-95' : ''} ${index === 2 ? 'md:transform md:scale-95' : ''}`}
              style={{
                background: pkg.popular 
                  ? 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary-glow) / 0.1))'
                  : undefined
              }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="px-4 py-2 text-sm font-bold gradient-primary text-primary-foreground">
                    <StarIcon className="w-4 h-4 mr-1" />
                    BEST DEAL
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {pkg.name}
                </CardTitle>
                {pkg.price === 0 ? (
                  <div className="text-6xl font-bold text-primary mb-2">FREE</div>
                ) : (
                  <div className="text-6xl font-bold text-primary mb-2">${pkg.price}</div>
                )}
                <p className="text-muted-foreground">{pkg.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-3 h-3 text-success-foreground" />
                      </div>
                      <span className="text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
                    pkg.popular 
                      ? 'gradient-primary text-primary-foreground hover:scale-105' 
                      : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                  onClick={() => pkg.price === 0 ? handleFreeCoins() : handlePurchase(pkg)}
                  disabled={selectedPackage === pkg.id}
                >
                  {selectedPackage === pkg.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {pkg.price === 0 ? 'Start for free' : 'Get Started'}
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Note */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-card/60 backdrop-blur-sm border-muted">
            <CardContent className="pt-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Safe Learning Environment</h3>
                <p className="text-lg text-muted-foreground">
                  This is a virtual trading platform designed to teach kids about investing. 
                  All transactions use virtual coins and no real money is involved in stock trading.
                </p>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium">100% Safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium">Educational Focus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium">Real Market Data</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}