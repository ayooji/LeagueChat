'use client';

import { FC, useState } from 'react';

import Typography from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import CreateChannelDialog from '@/components/create-channel-dialog';

const NoDataScreen: FC<{
  workspaceName: string;
  userId: string;
  workspaceId: string;
}> = ({ userId, workspaceId, workspaceName }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="w-full h-[calc(100vh-63px)] flex flex-col items-center justify-center p-6 bg-opacity-80">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <Typography
          text={`👋 Welcome to the # ${workspaceName} League`}
          variant="h2"
          className="font-bold text-2xl md:text-3xl"
        />
        <Typography
          text="Get started by creating a channel or direct message"
          variant="p"
          className="mt-4 text-lg text-gray-500 dark:text-gray-400"
        />
      </div>

      {/* Create Channel Button */}
      <div className="flex flex-col items-center">
        <Button
          className="w-full max-w-sm py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out"
          onClick={() => setDialogOpen(true)}
        >
          <Typography
            text="➕ Create Channel"
            variant="p"
            className="font-medium text-xl"
          />
        </Button>
        <Typography
          text="Organize your conversations by creating different channels"
          variant="p"
          className="mt-3 text-sm text-gray-400"
        />
      </div>

      {/* Create Channel Dialog */}
      <CreateChannelDialog
        userId={userId}
        workspaceId={workspaceId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </div>
  );
};

export default NoDataScreen;