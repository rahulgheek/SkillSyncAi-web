import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileResponse, Achievement } from "../schemas";
import { addAchievement, updateAchievement, deleteAchievement, AchievementInput, getUploadSignature } from "../api";
import { Plus, ExternalLink, Calendar, Building2, Loader2, Pencil, Trash2, Trophy, Upload } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

export function AchievementsManager({ profile, isOwnProfile = true }: { profile: ProfileResponse, isOwnProfile?: boolean }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Certificate");
  const [certificateUrl, setCertificateUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setOrganization("");
    setDate("");
    setDescription("");
    setType("Certificate");
    setCertificateUrl("");
    setEditingAchievement(null);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setTitle(achievement.title);
    setOrganization(achievement.organization);
    setDate(achievement.date);
    setDescription(achievement.description || "");
    setType(achievement.type);
    setCertificateUrl(achievement.certificateUrl || "");
    setIsOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const sigData = await getUploadSignature("raw");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/raw/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCertificateUrl(res.data.secure_url);
      toast.success("Certificate uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload certificate.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addMutation = useMutation({
    mutationFn: addAchievement,
    onSuccess: () => {
      toast.success("Achievement added successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add achievement."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; input: AchievementInput }) => updateAchievement(data.id, data.input),
    onSuccess: () => {
      toast.success("Achievement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update achievement."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      toast.success("Achievement deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to delete achievement."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: AchievementInput = {
      title,
      organization,
      date,
      description,
      type,
      certificateUrl: certificateUrl || undefined,
    };
    if (editingAchievement && editingAchievement.id) {
      updateMutation.mutate({ id: editingAchievement.id, input });
    } else {
      addMutation.mutate(input);
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5 rounded-t-xl">
        <div>
          <CardTitle className="text-xl text-primary">Honors & Awards</CardTitle>
          <CardDescription>Showcase your certificates, hackathons, and special achievements.</CardDescription>
        </div>
        {isOwnProfile && (
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" /> Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAchievement ? "Edit Achievement" : "Add New Achievement"}</DialogTitle>
                <DialogDescription>
                  Record your success and upload certificates for proof.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AWS Solutions Architect" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input id="organization" required value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. Amazon Web Services" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date Achieved *</Label>
                    <Input id="date" type="month" required value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Hackathon">Hackathon</SelectItem>
                        <SelectItem value="Competition">Competition</SelectItem>
                        <SelectItem value="Award">Award</SelectItem>
                        <SelectItem value="Badge">Badge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Certificate / Proof</Label>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full relative" 
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        {certificateUrl ? "Replace File" : "Upload File"}
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".pdf,image/*" 
                        onChange={handleFileUpload} 
                      />
                    </div>
                  </div>
                </div>

                {certificateUrl && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    File uploaded successfully: 
                    <a href={certificateUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center">
                      View <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-destructive ml-auto" onClick={() => setCertificateUrl("")}>
                      Remove
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this achievement is about." className="h-24" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending || isUploading}>
                    {(addMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Achievement"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {(!profile.achievements || profile.achievements.length === 0) && (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
            No achievements added yet.
          </div>
        )}
        
        <div className="grid gap-4">
          {profile.achievements?.map((achievement) => (
            <div key={achievement.id} className="group border border-border bg-card hover:bg-muted/30 rounded-lg p-5 transition-all relative">
              {isOwnProfile && (
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                  <Button size="icon" variant="secondary" className="w-8 h-8" onClick={() => handleEdit(achievement)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="w-8 h-8" onClick={() => {
                    if (confirm("Are you sure you want to delete this achievement?")) {
                      deleteMutation.mutate(achievement.id!);
                    }
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="pr-16">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
                  {achievement.title}
                  <Badge variant="outline" className="bg-primary/5 text-primary">
                    {achievement.type}
                  </Badge>
                </h4>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    {achievement.organization}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {achievement.date}
                  </div>
                </div>
                
                {achievement.description && (
                  <p className="text-sm text-foreground/80 mt-4 leading-relaxed whitespace-pre-wrap">
                    {achievement.description}
                  </p>
                )}

                {achievement.certificateUrl && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <a 
                      href={achievement.certificateUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1.5" />
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
