import { Button } from "@/components/ui/button";
import { CoinsIcon, TrendingUpIcon, UserIcon, PlusIcon, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import coinIcon from "@/assets/coin-icon.png";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface HeaderProps {
  virtualCoins?: number;
}

export default function Header({ virtualCoins }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const displayCoins = virtualCoins ?? profile?.virtual_coins ?? 0;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    return (
      <header className="w-full bg-card shadow-card rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                EduPlay Market
              </h1>
              <p className="text-muted-foreground">Learn investing with virtual coins!</p>
            </div>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-card shadow-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
            <TrendingUpIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              EduPlay Market
            </h1>
            <p className="text-muted-foreground">Learn investing with virtual coins!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-muted rounded-full px-6 py-3">
            <img src={coinIcon} alt="Virtual Coins" className="w-8 h-8" />
            <span className="text-2xl font-bold text-accent">{displayCoins.toLocaleString()}</span>
            <span className="text-muted-foreground font-medium">Virtual Coins</span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/buy-coins')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Buy Coins
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full" onClick={handleSignOut}>
            <LogOutIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}