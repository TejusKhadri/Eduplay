import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrophyIcon, TrendingUpIcon, TrendingDownIcon, UsersIcon, StarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  portfolioValue: number;
  totalReturn: number;
  returnPercentage: number;
  rank: number;
  group?: string;
  activeStocks: number;
  weeklyReturn: number;
}

interface LeaderboardProps {
  userGroup?: string;
}

// Mock leaderboard data - this will be replaced with real data from Supabase
const mockGlobalLeaders: LeaderboardUser[] = [
  {
    id: "1",
    name: "Alex Chen",
    portfolioValue: 15420,
    totalReturn: 5420,
    returnPercentage: 54.2,
    rank: 1,
    group: "Investing Pros",
    activeStocks: 8,
    weeklyReturn: 12.5
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    portfolioValue: 14230,
    totalReturn: 4230,
    returnPercentage: 42.3,
    rank: 2,
    group: "Tech Investors",
    activeStocks: 6,
    weeklyReturn: 8.7
  },
  {
    id: "3",
    name: "Mike Davis",
    portfolioValue: 13850,
    totalReturn: 3850,
    returnPercentage: 38.5,
    rank: 3,
    group: "Investing Pros",
    activeStocks: 12,
    weeklyReturn: 15.2
  },
  {
    id: "4",
    name: "Emma Wilson",
    portfolioValue: 12900,
    totalReturn: 2900,
    returnPercentage: 29.0,
    rank: 4,
    group: "Beginners Club",
    activeStocks: 4,
    weeklyReturn: 6.8
  },
  {
    id: "5",
    name: "You",
    portfolioValue: 1000,
    totalReturn: 0,
    returnPercentage: 0,
    rank: 847,
    group: "Beginners Club",
    activeStocks: 0,
    weeklyReturn: 0
  }
];

const mockGroupLeaders: LeaderboardUser[] = [
  {
    id: "4",
    name: "Emma Wilson", 
    portfolioValue: 12900,
    totalReturn: 2900,
    returnPercentage: 29.0,
    rank: 1,
    group: "Beginners Club",
    activeStocks: 4,
    weeklyReturn: 6.8
  },
  {
    id: "6",
    name: "James Brown",
    portfolioValue: 8500,
    totalReturn: 1500,
    returnPercentage: 17.6,
    rank: 2,
    group: "Beginners Club", 
    activeStocks: 3,
    weeklyReturn: 4.2
  },
  {
    id: "5",
    name: "You",
    portfolioValue: 1000,
    totalReturn: 0,
    returnPercentage: 0,
    rank: 3,
    group: "Beginners Club",
    activeStocks: 0,
    weeklyReturn: 0
  }
];

const LeaderboardCard = ({ user, isCurrentUser = false }: { user: LeaderboardUser; isCurrentUser?: boolean }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <TrophyIcon className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <TrophyIcon className="w-5 h-5 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`transition-all hover:shadow-md ${isCurrentUser ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getRankIcon(user.rank)}
            </div>
            
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{user.name}</h4>
                {isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
              </div>
              {user.group && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <UsersIcon className="w-3 h-3" />
                  {user.group}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-bold text-lg">
              {user.portfolioValue.toLocaleString()} coins
            </div>
            <div className={`flex items-center gap-1 text-sm ${user.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {user.returnPercentage >= 0 ? 
                <TrendingUpIcon className="w-4 h-4" /> : 
                <TrendingDownIcon className="w-4 h-4" />
              }
              {user.returnPercentage >= 0 ? '+' : ''}{user.returnPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {user.activeStocks} stocks
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Leaderboard({ userGroup = "Beginners Club" }: LeaderboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="gradient-primary text-primary-foreground">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              Your Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#847</div>
            <p className="text-primary-foreground/80 text-sm">Out of 1,234 players</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Group Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">#3</div>
            <p className="text-muted-foreground text-sm">In {userGroup}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <StarIcon className="w-5 h-5" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.0%</div>
            <p className="text-muted-foreground text-sm">This week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
          <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
          <TabsTrigger value="group">My Group</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Top Investors Worldwide</h3>
            <Badge variant="outline" className="text-xs">
              Live Rankings
            </Badge>
          </div>
          
          <div className="space-y-3">
            {mockGlobalLeaders.map((user) => (
              <LeaderboardCard 
                key={user.id} 
                user={user} 
                isCurrentUser={user.name === "You"} 
              />
            ))}
          </div>
          
          <div className="text-center py-6">
            <Button variant="outline" className="gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              View Full Rankings
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="group" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{userGroup} Rankings</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <UsersIcon className="w-3 h-3 mr-1" />
                12 members
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            {mockGroupLeaders.map((user) => (
              <LeaderboardCard 
                key={user.id} 
                user={user} 
                isCurrentUser={user.name === "You"} 
              />
            ))}
          </div>
          
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Group Challenge
              </CardTitle>
              <CardDescription>
                Compete with your group members to see who can achieve the highest returns!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Weekly Challenge</p>
                  <p className="text-xs text-muted-foreground">Ends in 3 days</p>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5" />
            Ready to Climb the Rankings?
          </CardTitle>
          <CardDescription>
            Start investing to improve your position on the leaderboard!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button className="gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              Start Investing
            </Button>
            <Button variant="outline" className="gap-2">
              <UsersIcon className="w-4 h-4" />
              Join a Group
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}