
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ReportPostProps {
  postId: string;
  userId?: string;
}

const reportReasons = [
  { value: "spam", label: "Spam", description: "Unsolicited or repetitive content" },
  { value: "inappropriate", label: "Inappropriate Content", description: "Content that violates community guidelines" },
  { value: "harassment", label: "Harassment", description: "Content that targets or threatens individuals" },
  { value: "misinformation", label: "Misinformation", description: "False or misleading information" },
  { value: "plagiarism", label: "Plagiarism", description: "Content copied from elsewhere without attribution" },
  { value: "hate_speech", label: "Hate Speech", description: "Content that promotes discrimination or violence" },
  { value: "other", label: "Other", description: "Please specify in the additional details" }
];

export default function ReportPost({ postId, userId }: ReportPostProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleReport = () => {
    // Here you would typically send this to your backend
    console.log({
      postId,
      userId,
      reason: selectedReason,
      details: additionalDetails,
      timestamp: new Date().toISOString(),
    });

    // Close dialog and show success message
    setIsOpen(false);
    toast({
      title: "Post Reported",
      description: "Thank you for helping keep our platform safe. Our moderation team will review this report.",
    });
    
    // Reset the form
    setSelectedReason("");
    setAdditionalDetails("");
  };

  const selectedReasonObj = reportReasons.find(reason => reason.value === selectedReason);

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
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div>
                  <Label htmlFor="report-reason">Reason</Label>
                  <Select
                    value={selectedReason}
                    onValueChange={setSelectedReason}
                  >
                    <SelectTrigger id="report-reason" className="w-full">
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
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-2 text-sm">
                {selectedReasonObj ? 
                  <p>{selectedReasonObj.description}</p> : 
                  <p>Please select a reason for reporting this content</p>
                }
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-details">Additional Details (Optional)</Label>
            <Textarea 
              id="report-details"
              placeholder="Please provide any additional information that may help our moderation team."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
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
