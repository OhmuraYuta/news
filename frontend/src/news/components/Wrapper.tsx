import Chats from "./Chats";
import Login from "./Login";
import NewChatsBtn from "./NewChat";
import HamburgerMenu from "./HamburgerMenu";

export default function Wrapper() {
  return(
    <div  className='absolute top-0 z-50'>
      <HamburgerMenu w={10} h={8} />
      <div className="absolute bottom-0">
        <NewChatsBtn />
        <Chats />
        <Login />
      </div>
    </div>
  )
}