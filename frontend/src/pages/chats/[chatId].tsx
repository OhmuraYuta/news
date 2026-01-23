'use client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import VrmViewer from '@/components/vrmViewer';

import Wrapper from '@/news/components/Wrapper';
import Chat from '@/news/components/Chat';
import Login from '@/news/components/Login';
import NewChatsBtn from '@/news/components/NewChat';
import HamburgerMenu from '@/news/components/HamburgerMenu';

const Message = () => {

  return(
    <div>
      <div className='flex justify-between'>
        <HamburgerMenu w={10} h={8} />
        <Login />
      </div>
      <Chat />
      <VrmViewer />
      <div className='fixed bottom-0 z-50'>
        <NewChatsBtn />
      </div>
    </div>
  )
};

export default Message;