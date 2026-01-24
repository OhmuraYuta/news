'use client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import VrmViewer from '@/components/vrmViewer';

import Wrapper from '@/news/components/Wrapper';
import Chat from '@/news/components/Chat';
import Login from '@/news/components/Login';
import HamburgerMenu from '@/news/components/HamburgerMenu';

const Message = () => {

  return(
    <div className='relative top-0 w-screen h-screen'>
      <div className='flex justify-between'>
        <HamburgerMenu w={10} h={8} />
        <Login />
      </div>
      <Chat />
      <div className='absolute top-0 w-full h-full after:bg-[#cfcfcf] after:content-[""] after:absolute after:bottom-0 after:h-[21vh] after:w-screen after:z-10'>
        <VrmViewer />
      </div>
    </div>
  )
};

export default Message;