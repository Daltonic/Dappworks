import React from "react";
import { useGlobalState, setGlobalState } from "../store";
import { MdAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";

const ChatAuth = () => {
  const [chatAuthModal] = useGlobalState("chatAuthModal");

  const closeModal = () => {
    setGlobalState("chatAuthModal", "scale-0");
  };

 

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${chatAuthModal}`}
    >
      <div className="bg-white text-black rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="relative">
          <div>
            <div className="p-2 my-3">
              <h3>Chat authentication</h3>
            </div>
            <div className="flex justify-center items-center mt-5">
              <button
                className="py-1 px-4 bg-green-600 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAuth;
