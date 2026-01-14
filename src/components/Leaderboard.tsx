import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrophyIcon, TrendingUpIcon, TrendingDownIcon, UsersIcon, StarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LeaderboardUser {
  name: string;
  portfolioValue: number;
  returnPercentage: number;
  rank: number;
  group?: string;
}

interface LeaderboardProps {
  userGroup?: string;
}

interface LeaderboardData {
  globalLeaders: LeaderboardUser[];
  groupLeaders: LeaderboardUser[];
  userRank: number;
  userGroupRank: number;
  userStats: {
    portfolioValue: number;
    returnPercentage: number;
    displayName: string;
  };
}

const LeaderboardCard = ({ user, isCurrentUser = false }: { user: LeaderboardUser; isCurrentUser?: boolean }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <TrophyIcon className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <TrophyIcon className="w-5 h-5 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Leaderboard({ userGroup = "Beginners Club" }: LeaderboardProps) {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
    globalLeaders: [],
    groupLeaders: [],
    userRank: 0,
    userGroupRank: 0,
    userStats: {
      portfolioValue: 0,
      returnPercentage: 0,
      displayName: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    if (user) {
      fetchLeaderboardData();
    }
  }, [user]);

  const fetchLeaderboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch leaderboard data using secure RPC function
      const { data: leaderboardResults, error: leaderboardError } = await supabase
        .rpc('get_leaderboard_data');

      if (leaderboardError) {
        console.error('Error fetching leaderboard data:', leaderboardError);
        return;
      }

      // Fetch current user's rank using secure RPC function
      const { data: userRankData, error: userRankError } = await supabase
        .rpc('get_user_rank', { user_uuid: user.id });

      if (userRankError) {
        console.error('Error fetching user rank:', userRankError);
      }

      // Map leaderboard results to our interface
      const globalLeaders: LeaderboardUser[] = (leaderboardResults || []).map((entry: {
        rank_position: number;
        display_name: string;
        total_portfolio_value: number;
        total_returns: number;
        user_group: string;
      }) => ({
        name: entry.display_name || 'Anonymous',
        portfolioValue: Number(entry.total_portfolio_value) || 0,
        returnPercentage: Number(entry.total_returns) || 0,
        rank: Number(entry.rank_position),
        group: entry.user_group || 'General',
      }));

      setTotalPlayers(globalLeaders.length);

      // Filter group leaders
      const groupLeaders = globalLeaders
        .filter(leader => leader.group === userGroup)
        .map((leader, index) => ({
          ...leader,
          rank: index + 1,
        }));

      // Get current user's stats from the RPC result
      const currentUserData = userRankData && userRankData.length > 0 ? userRankData[0] : null;
      const userRank = currentUserData ? Number(currentUserData.user_rank) : 0;
      const userDisplayName = currentUserData?.display_name || '';
      
      // Find user's group rank
      const userGroupRank = groupLeaders.findIndex(
        leader => leader.name === userDisplayName
      ) + 1;

      setLeaderboardData({
        globalLeaders: globalLeaders.slice(0, 10),
        groupLeaders: groupLeaders.slice(0, 10),
        userRank,
        userGroupRank: userGroupRank > 0 ? userGroupRank : 0,
        userStats: {
          portfolioValue: currentUserData ? Number(currentUserData.total_portfolio_value) : 0,
          returnPercentage: currentUserData ? Number(currentUserData.total_returns) : 0,
          displayName: userDisplayName,
        },
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-3xl font-bold">
              {leaderboardData.userRank > 0 ? `#${leaderboardData.userRank}` : 'Unranked'}
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Out of {totalPlayers} players
            </p>
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
            <div className="text-3xl font-bold text-accent">
              {leaderboardData.userGroupRank > 0 ? `#${leaderboardData.userGroupRank}` : 'Unranked'}
            </div>
            <p className="text-muted-foreground text-sm">In {userGroup}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <StarIcon className="w-5 h-5" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leaderboardData.userStats.portfolioValue.toFixed(0)} coins
            </div>
            <p className="text-muted-foreground text-sm">
              {leaderboardData.userStats.returnPercentage >= 0 ? '+' : ''}
              {leaderboardData.userStats.returnPercentage.toFixed(1)}% return
            </p>
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
            {leaderboardData.globalLeaders.length > 0 ? (
              leaderboardData.globalLeaders.map((leader, index) => (
                <LeaderboardCard 
                  key={`global-${leader.rank}-${index}`} 
                  user={leader} 
                  isCurrentUser={leader.name === leaderboardData.userStats.displayName} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No rankings available yet!</p>
                <p className="text-sm">Start investing to see the leaderboard.</p>
              </div>
            )}
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
                {leaderboardData.groupLeaders.length} members
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            {leaderboardData.groupLeaders.length > 0 ? (
              leaderboardData.groupLeaders.map((leader, index) => (
                <LeaderboardCard 
                  key={`group-${leader.rank}-${index}`} 
                  user={leader} 
                  isCurrentUser={leader.name === leaderboardData.userStats.displayName} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No group rankings available yet!</p>
                <p className="text-sm">Join a group to compete with peers.</p>
              </div>
            )}
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
