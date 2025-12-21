'use client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Live2DViewer from '@/components/live2DViewer';
import VrmViewer from '@/components/vrmViewer';
import { speakMessageHandler } from '@/features/chat/handlers';

import Wrapper from '@/news/components/Wrapper';
import Chat from '@/news/components/Chat';

const Message = () => {

  const router = useRouter();

  const chatId = router.query.chatId;

  const modelType = 'vrm';

  return(
    <div>
      chat id: {chatId}
      {modelType === 'vrm' ? <VrmViewer /> : <Live2DViewer />}
      <Chat />
      <Wrapper />
    </div>
  )
};

export default Message;