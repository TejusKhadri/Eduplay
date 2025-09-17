import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpenIcon, StarIcon, PlayIcon } from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reward: number;
  completed: boolean;
  duration: string;
}

interface LearningCenterProps {
  modules: LearningModule[];
  onStartModule: (moduleId: string) => void;
}

export default function LearningCenter({ modules, onStartModule }: LearningCenterProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-primary" />
          <CardTitle>Learning Center</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete lessons to earn virtual coins and improve your investing skills!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{module.title}</h3>
                  {module.completed && <StarIcon className="w-4 h-4 text-accent fill-current" />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                
                <div className="flex items-center gap-2">
                  <Badge variant={
                    module.difficulty === 'Beginner' ? 'secondary' : 
                    module.difficulty === 'Intermediate' ? 'outline' : 'destructive'
                  }>
                    {module.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{module.duration}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-accent mb-2">
                  <StarIcon className="w-4 h-4" />
                  <span className="font-semibold">+{module.reward} coins</span>
                </div>
                
                <Button 
                  variant={module.completed ? "secondary" : "default"}
                  size="sm"
                  onClick={() => onStartModule(module.id)}
                >
                  <PlayIcon className="w-3 h-3" />
                  {module.completed ? 'Review' : 'Start'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}