import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileResponse } from "../schemas";
import { searchSkills, addSkill, removeSkill, Skill } from "../api";
import { Loader2, Search, X } from "lucide-react";

export function SkillsManager({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [level, setLevel] = useState<string>("BEGINNER");
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2 && !selectedSkill) {
        setIsSearching(true);
        try {
          const res = await searchSkills(query);
          setResults(res);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedSkill]);

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      toast.success("Skill added successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSelectedSkill(null);
      setQuery("");
      setLevel("BEGINNER");
    },
    onError: () => {
      toast.error("Failed to add skill");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeSkill,
    onSuccess: () => {
      toast.success("Skill removed");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to remove skill");
    },
  });

  const handleAddSkill = () => {
    if (!selectedSkill) {
      toast.error("Please select a skill from the dropdown");
      return;
    }
    addMutation.mutate({ skillId: selectedSkill.id, level });
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-primary/5 rounded-t-xl">
        <CardTitle className="text-xl text-primary">{isOwnProfile ? "Your Skills" : "Skills"}</CardTitle>
        <CardDescription>
          {isOwnProfile ? "Add the skills you're proficient in and let AI match you to projects." : `Skills that ${profile.fullName} is proficient in.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        {isOwnProfile && (
          <div className="flex flex-col md:flex-row gap-3 relative">
            <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for a skill (e.g., React, Java)..." 
                value={selectedSkill ? selectedSkill.name : query} 
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedSkill) setSelectedSkill(null);
                }} 
                className="pl-9"
              />
              {isSearching && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
              {selectedSkill && (
                <button onClick={() => { setSelectedSkill(null); setQuery(""); }} className="absolute right-3 top-2.5">
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {results.length > 0 && !selectedSkill && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {results.map(skill => (
                  <div 
                    key={skill.id} 
                    className="px-4 py-2 hover:bg-muted cursor-pointer flex flex-col"
                    onClick={() => {
                      setSelectedSkill(skill);
                      setResults([]);
                    }}
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-48">
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleAddSkill} disabled={!selectedSkill || addMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Skill"}
          </Button>
        </div>
        )}
        
        <div className="flex flex-wrap gap-2 pt-2">
          {(!profile.skills || profile.skills.length === 0) && (
            <p className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg w-full text-center">
              No skills added yet. Add some skills to boost your profile!
            </p>
          )}
          {profile.skills?.map((skill) => (
            <Badge key={skill.studentSkillId} variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 group transition-all hover:bg-primary/20">
              <span className="font-medium">{skill.name}</span>
              <span className="text-[10px] text-muted-foreground ml-1 bg-background px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold shadow-sm">{skill.level}</span>
              {isOwnProfile && (
                <button 
                  onClick={() => removeMutation.mutate(skill.studentSkillId)}
                  disabled={removeMutation.isPending}
                  className="ml-1 text-primary/50 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
