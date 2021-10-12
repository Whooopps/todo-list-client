import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSetAuth } from "../effects/use-auth";
import { useAxios } from "../effects/use-axios";
import { LoaderEllipsis } from "../loader/LoaderEllipsis";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const axios = useAxios();
  const setAuth = useSetAuth();

  function onHeaderClicked() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    function onDocumentClicked(e) {
      let current = e.target;
      while (current) {
        if (current.id === "user-greeting") {
          return;
        }
        current = current.parentElement;
      }
      setIsOpen(false);
    }
    document.addEventListener("click", onDocumentClicked);
    return () => {
      document.removeEventListener("click", onDocumentClicked);
    };
  }, []);

  useEffect(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/v1/user/me");
      setUserName(response.data.firstName);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function logout() {
    await axios.post("/api/v1/auth/logout");
    setAuth(false);
  }

  return (
    <div
      id="user-greeting"
      className="p-2 flex-grow-0 flex-shrink-0 self-end cursor-pointer relative"
      onClick={onHeaderClicked}
    >
      {isLoading ? (
        <LoaderEllipsis />
      ) : (
        <>
          <div className="inline-block rounded-full bg-yellow-400 text-white w-7 h-7 leading-7 text-center mr-2">
            {userName[0]}
          </div>
          <span className="">Hi, {userName}!</span>
          <div
            className={`bg-white shadow-lg absolute right-4 w-32 -bottom-10 rounded-sm overflow-hidden ${
              isOpen ? "" : "hidden"
            }`}
          >
            <ul className="">
              <li className="px-3 py-2 hover:bg-green-300" onClick={logout}>
                <i className="fas fa-sign-out-alt text-gray-700"></i> Logout
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
export default Header;
