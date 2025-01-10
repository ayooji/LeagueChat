import { FC, useState } from 'react';
import { RiHome2Fill } from 'react-icons/ri';
import { PiChatsTeardrop } from 'react-icons/pi';
import { useRouter } from 'next/navigation';

import { Workspace } from '@/types/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Typography from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CreateWorkspace from '@/components/create-workspace';
import ProgressBar from './progress-bar';
import { cn } from '@/lib/utils';
import { useColorPrefrences } from '@/providers/color-prefrences';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

type SidebarNavProps = {
  userWorkspacesData: Workspace[];
  currentWorkspaceData: Workspace;
};

const SidebarNav: FC<SidebarNavProps> = ({
  currentWorkspaceData,
  userWorkspacesData,
}) => {
  const router = useRouter();
  const [switchingWorkspace, setSwitchingWorkspace] = useState(false);
  const { color } = useColorPrefrences();

  // Updated background color
  let backgroundColor = 'bg-primary-dark';
  if (color === 'green') {
    backgroundColor = 'bg-green-700';
  } else if (color === 'blue') {
    backgroundColor = 'bg-blue-700';
  }

  // Function to switch workspaces
  const switchWorkspace = (id: string) => {
    setSwitchingWorkspace(true);
    router.push(`/workspace/${id}`);
    setSwitchingWorkspace(false);
  };

  // Function to copy invite link
  const copyInviteLink = (inviteCode: string) => {
    const currentDomain = window.location.origin;

    navigator.clipboard.writeText(
      `${currentDomain}/create-workspace/${inviteCode}`
    );

    toast.success('Invite link copied to clipboard');
  };

  // New function: Redirect to Home when Home icon is clicked
  const goToHome = () => {
    router.push('/');
  };

  return (
    <nav className="bg-dark-gradient h-full p-4 rounded-lg">
      <ul className="flex flex-col space-y-6">
        {/* Home Icon */}
        <li>
          <div
            className="flex flex-col items-center cursor-pointer group text-white hover:text-green-400"
            onClick={goToHome}
          >
            <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.1)] group-hover:bg-green-500 transition-all duration-300">
              <RiHome2Fill size={24} className="group-hover:scale-125" />
            </div>
            <Typography variant="p" text="Home" className="text-sm" />
          </div>
        </li>

        {/* Direct Messages Icon */}
        <li>
          <div className="flex flex-col items-center cursor-pointer group text-white hover:text-green-400">
            <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.1)] group-hover:bg-green-500 transition-all duration-300">
              <PiChatsTeardrop size={24} className="group-hover:scale-125" />
            </div>
            <Typography variant="p" text="Dms" className="text-sm" />
          </div>
        </li>

        {/* Workspace Popover */}
        <li>
          <div className="cursor-pointer items-center text-white w-10 h-10 rounded-lg overflow-hidden">
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage
                    src={currentWorkspaceData.image_url || ''}
                    alt={currentWorkspaceData.name}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-neutral-700">
                    <Typography
                      variant="p"
                      text={currentWorkspaceData.name.slice(0, 2)}
                    />
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="bottom">
                <Card className="w-[350px] border-0">
                  <CardContent className="flex p-0 flex-col">
                    {switchingWorkspace ? (
                      <div className="m-2">
                        <ProgressBar />
                      </div>
                    ) : (
                      userWorkspacesData.map((workspace) => {
                        const isActive =
                          workspace.id === currentWorkspaceData.id;

                        return (
                          <div
                            key={workspace.id}
                            className={cn(
                              isActive && `${backgroundColor} text-white`,
                              'cursor-pointer px-4 py-2 flex items-center gap-4 rounded-lg hover:bg-green-500'
                            )}
                            onClick={() =>
                              !isActive && switchWorkspace(workspace.id)
                            }
                          >
                            <Avatar>
                              <AvatarImage
                                src={workspace.image_url || ''}
                                alt={workspace.name}
                                className="object-cover w-10 h-10 rounded-lg"
                              />
                              <AvatarFallback>
                                <Typography
                                  variant="p"
                                  text={workspace.name.slice(0, 2)}
                                />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Typography
                                variant="p"
                                text={workspace.name}
                                className="text-sm"
                              />
                              <div className="flex items-center gap-x-2">
                                <Typography
                                  variant="p"
                                  text="Copy Invite Link"
                                  className="text-xs"
                                />
                                <Copy
                                  onClick={() =>
                                    copyInviteLink(workspace.invite_code!)
                                  }
                                  size={18}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <Separator />
                    <CreateWorkspace />
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarNav;