import React, { useEffect, useState } from "react";
import { MdOutlineChat } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { AiFillLock } from "react-icons/ai";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import {
  loginWithCometChat,
  signUpWithCometChat,
} from '../services/Chat'
import { setGlobalState, useGlobalState } from '../store'
import { useNavigate } from "react-router-dom";


const ChatButton = ({ label, className, recipient, job }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [currentUser] = useGlobalState('currentUser')

  const navigate = useNavigate()

  const handleSignUp = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat(connectedAccount)
          .then((user) => resolve(user))
          .catch((error) => {
            alert(JSON.stringify(error));
            reject(error);
          });
      }),
      {
        pending: "Signing up...",
        success: "Signed up successfully, please login 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  console.log(job?.owner+connectedAccount)

  const handleLogin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat(connectedAccount)
          .then((user) => {
            setGlobalState("currentUser", user);
            resolve(user);
          })
          .catch((error) => {
            alert(JSON.stringify(error));
            reject(error);
          });
      }),
      {
        pending: "Logging...",
        success: "Logged in successfully 👌",
        error: "Encountered error 🤯",
      }
    );
  }

  
  const handleChat = ()=> {
     navigate(`/chats/${recipient}`); 
  }

  const recentChats = ()=> {
    navigate('/recentconversations')
  }


  return (
    <Menu className="relative" as="div">
      <Menu.Button className={className} as="button">
        <MdOutlineChat size={20} /> <span>{label}</span>
      </Menu.Button>

      <Menu.Items
        className="absolute left-8 -bottom-20 mt-2 w-56 origin-top-right
          divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-black
          ing-1 ring-black ring-opacity-5 focus:outline-none"
      >
        {currentUser && currentUser.status != "offline" && connectedAccount != job?.owner ? (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? "bg-gray-200 text-black" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={recentChats}
                >
                  <FiUsers size={17} />
                  <span>Recent chats</span>
                </button>
              )}
            </Menu.Item>
          </>
        ) : currentUser && currentUser.status != "offline" && connectedAccount == job?.owner ? (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? "bg-gray-200 text-black" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleChat}
                >
                  <FiUsers size={17} />
                  <span>Chats</span>
                </button>
              )}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? "bg-gray-200 text-black" : "text-blue-500"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleSignUp}
                >
                  <AiFillLock size={17} />
                  <span>Sign Up</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? "bg-gray-200 text-black" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleLogin}
                >
                  <FiLogIn size={17} />
                  <span>Login</span>
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  );
};

export default ChatButton;
