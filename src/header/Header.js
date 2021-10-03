import { useEffect, useState } from "react";
import { useHistory } from "react-router";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();

    function onHeaderClicked() {
        setIsOpen(!isOpen);
    }
    
    useEffect(() => {
        function onDocumentClicked(e) {
            let current = e.target;
            while(current) {
                if (current.id === "user-greeting") {
                    return;
                }
                current = current.parentElement;
            }
            setIsOpen(false);
        }
        document.addEventListener('click', onDocumentClicked);
        return () => {
            document.removeEventListener('click', onDocumentClicked);
        };
    }, []);

    function logout() {
        history.push('/signin');
    }

    return (
        <div id="user-greeting" className="p-2 flex-grow-0 flex-shrink-0 self-end cursor-pointer relative" onClick={onHeaderClicked}>
            <div className="inline-block rounded-full bg-yellow-400 text-white w-7 h-7 leading-7 text-center mr-2">S</div>
            <span className="">Hi, Suhail!</span>
            <div className={`bg-white shadow-lg absolute right-4 w-32 -bottom-10 rounded-sm overflow-hidden ${isOpen ? '' : 'hidden'}`}>
                <ul className="">
                    <li className="px-3 py-2 hover:bg-green-300" onClick={logout}><i className="fas fa-sign-out-alt text-gray-700"></i> Logout</li>
                </ul>
            </div>
        </div>
    );
}
export default Header;