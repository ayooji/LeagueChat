'use client';

import { useTheme } from 'next-themes';
import { FC, ReactNode } from 'react';

import { useColorPrefrences } from '@/providers/color-prefrences';
import { cn } from '@/lib/utils';

const MainContent: FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { color } = useColorPrefrences();

  // Updated background color to dark blue to black with light green accent
  let backgroundColor = 'bg-gradient-to-br from-[#0B1A27] via-[#02040A] to-[#0F360D]';

  if (color === 'green') {
    backgroundColor = 'bg-gradient-to-br from-[#0B1A27] via-[#02040A] to-[#66FF66]';
  } else if (color === 'blue') {
    backgroundColor = 'bg-gradient-to-br from-[#000022] to-[#000000]';
  }

  return (
    <div
      className={cn(
        'md:px-6 md:pb-6 md:pt-20 min-h-screen transition-all duration-300',
        backgroundColor
      )}
    >
      <main
        className={cn(
          'md:ml-[280px] lg:ml-[420px] md:h-full overflow-y-auto shadow-lg rounded-xl p-8',
          theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-white text-gray-800'
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default MainContent;