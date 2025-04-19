
import { useState } from "react";
import { Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportPostProps {
  postId: string;
  userId?: string;
}

const reportReasons = [
  { value: "spam", label: "Spam" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "harassment", label: "Harassment" },
  { value: "misinformation", label: "Misinformation" },
  { value: "plagiarism", label: "Plagiarism" },
  { value: "other", label: "Other" }
];

export default function ReportPost({ postId, userId }: ReportPostProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleReport = () => {
    // Here you would typically send this to your backend
    console.log({
      postId,
      userId,
      reason: selectedReason,
      timestamp: new Date().toISOString(),
    });

    // Close dialog and show success message
    setIsOpen(false);
    toast({
      title: "Post Reported",
      description: "Thank you for helping keep our platform safe.",
    });
    
    // Reset the form
    setSelectedReason("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Flag className="h-5 w-5 mr-1" />
          Report
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Report Post</AlertDialogTitle>
          <AlertDialogDescription>
            Please select a reason for reporting this post. This will be reviewed by our moderation team.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Select
            value={selectedReason}
            onValueChange={setSelectedReason}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {reportReasons.map((reason) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReport}
            disabled={!selectedReason}
          >
            Submit Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
