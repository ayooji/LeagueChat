"use client";

import { FC, useState } from "react";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useColorPrefrences } from "@/providers/color-prefrences";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Typography from "@/components/ui/typography";
import CreateChannelDialog from "@/components/create-channel-dialog";
import { Channel, User, Workspace } from "@/types/app";

const InfoSection: FC<{
  userData: User;
  currentWorkspaceData: Workspace;
  userWorkspaceChannels: Channel[];
  currentChannelId: string | undefined;
}> = ({
  userData,
  currentWorkspaceData,
  userWorkspaceChannels,
  currentChannelId,
}) => {
  const { color } = useColorPrefrences();
  const [isChannelCollapsed, setIsChannelCollapsed] = useState(true);
  const [isDirectMessageCollapsed, setIsDirectMessageCollapsed] =
    useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // 🎨 Dynamic background colors
  const backgroundColor = color === "green" ? "bg-green-900" : "bg-blue-900";
  const secondaryBg = color === "green" ? "bg-green-700" : "bg-blue-700";

  // ✨ Navigate to Channel
  const navigateToChannel = (channelId: string) => {
    const url = `/workspace/${currentWorkspaceData.id}/channels/${channelId}`;
    router.push(url);
  };

  // ✨ Navigate to Direct Message
  const navigateToDirectMessage = (memberId: string) => {
    const url = `/workspace/${currentWorkspaceData.id}/direct-message/${memberId}`;
    router.push(url);
  };

  return (
    <div
      className={cn(
        "fixed text-white left-20 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center",
        "bg-gradient-to-br from-dark-900 to-dark-700 shadow-lg"
      )}
    >
      {/* 🎨 Header Section */}
      <div className="w-full p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg shadow-md">
        <Typography
          variant="h4"
          text={currentWorkspaceData.name || "Your League"}
          className="text-center font-bold text-black"
        />
        <Typography
          variant="p"
          text="Power your fantasy conversations"
          className="text-center text-black text-sm"
        />
      </div>

      {/* 📚 Channels Section */}
      <div className="w-full flex flex-col gap-4 p-4">
        <Collapsible
          open={isChannelCollapsed}
          onOpenChange={() => setIsChannelCollapsed((prev) => !prev)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 text-lg text-white">
              {isChannelCollapsed ? <FaChevronDown /> : <FaChevronUp />}
              <Typography variant="p" text="Channels" className="font-bold" />
            </CollapsibleTrigger>
            <div
              className={cn(
                "cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 transition duration-300",
                secondaryBg
              )}
              onClick={() => setDialogOpen(true)}
            >
              <FaPlus className="text-white" />
            </div>
          </div>
          <CollapsibleContent>
            {userWorkspaceChannels.map((channel) => (
              <Typography
                key={channel.id}
                variant="p"
                text={`# ${channel.name}`}
                className={cn(
                  "px-4 py-2 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 text-white transition",
                  currentChannelId === channel.id && secondaryBg
                )}
                onClick={() => navigateToChannel(channel.id)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* 💬 Direct Messages Section */}
        <Collapsible
          open={isDirectMessageCollapsed}
          onOpenChange={() => setIsDirectMessageCollapsed((prev) => !prev)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 text-lg text-white">
              {isDirectMessageCollapsed ? <FaChevronDown /> : <FaChevronUp />}
              <Typography
                variant="p"
                text="Direct Messages"
                className="font-bold"
              />
            </CollapsibleTrigger>
            <div
              className={cn(
                "cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 transition duration-300",
                secondaryBg
              )}
            >
              <FaPlus className="text-white" />
            </div>
          </div>
          <CollapsibleContent>
            {currentWorkspaceData?.members?.map((member) => (
              <Typography
                key={member.id}
                variant="p"
                text={member.name || member.email}
                className={cn(
                  "px-4 py-2 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 text-white transition"
                )}
                onClick={() => navigateToDirectMessage(member.id)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* ➕ Create Channel Dialog */}
      <CreateChannelDialog
        setDialogOpen={setDialogOpen}
        dialogOpen={dialogOpen}
        workspaceId={currentWorkspaceData.id}
        userId={userData.id}
      />
    </div>
  );
};

export default InfoSection;
