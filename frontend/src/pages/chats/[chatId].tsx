'use client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Live2DViewer from '@/components/live2DViewer';
import VrmViewer from '@/components/vrmViewer';
import { speakMessageHandler } from '@/features/chat/handlers';

import Wrapper from '@/news/components/Wrapper';
import Chat from '@/news/components/Chat';
import Login from '@/news/components/Login';
import NewChatsBtn from '@/news/components/NewChat';
import HamburgerMenu from '@/news/components/HamburgerMenu';

const Message = () => {

  const router = useRouter();

  const chatId = router.query.chatId;

  const modelType = 'vrm';

  return(
    <div>
      chat id: {chatId}
      <HamburgerMenu w={10} h={8} />
      <div className='absolute bottom-60 z-50'>
        <Chat />
      </div>
      {modelType === 'vrm' ? <VrmViewer /> : <Live2DViewer />}
      {/* <Wrapper /> */}
      <div className='absolute bottom-0 z-50'>
        <NewChatsBtn />
        <Login />
      </div>
    </div>
  )
};

export default Message;