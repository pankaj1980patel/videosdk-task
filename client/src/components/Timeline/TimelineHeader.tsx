import React from "react";
import { cn } from "@/lib/utils";
import { Clipboard } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type TimelineHeaderProps = {
  className?: string;
} & React.ComponentProps<"div">;

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center text-white p-4 justify-between text-sm font-bold border-b border-[#393939]",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-[5px]">
        <Clipboard size={17} />
        Participants wise Session Timeline
      </div>
      <div className="flex gap-[10px] items-center">
        Show participant timeline{" "}
        <Switch className="text-[#424FB0] bg-[#424FB0] ring-[#424FB0] [&>span]:bg-[#5568FE] data-[state=checked]:bg-[#2F3562] data-[state=unchecked]:bg-[#2F3562]" />
      </div>
    </div>
  );
};

export default TimelineHeader;
