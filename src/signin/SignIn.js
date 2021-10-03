import { Link } from "react-router-dom";
import { useState } from "react";


function SignIn() {

    let [isHidden, setIsHidden] = useState(true);
    

    return (
        <div>
            <div className="w-96 h-auto mt-20 bg-white  p-5 shadow-lg">
                <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">Log In</h1>
                <form>
                    <div className="">
                        <label>
                            <span className="text-gray-700 text-opacity-90">Email</span>
                            <input className="w-full border-b border-solid border-gray-300 outline-none" placeholder="" name="Email" />
                        </label>
                    </div>

                    <div className="mt-6">
                        <label>
                            <span className="text-gray-700 text-opacity-90">Password</span>
                            <div className="flex">
                                <input className="flex-grow w-full border-b border-solid border-gray-300 outline-none " placeholder="" type={isHidden ? 'password': 'text'}  name="Password" />
                                <i onClick={() => setIsHidden(!isHidden) } className={`${isHidden ? 'fas fa-eye' : 'fas fa-eye-slash'} flex-grow-0 flex-shrink-0 self-end pb-1 border-b border-solid border-gray-300 cursor-pointer`}></i>
                            </div>
                        </label>
                    </div>

                    <div className="mt-6 text-center">
                        <button className="bg-green-500 text-white rounded text-center px-5 py-1.5" type="submit">Log In</button>
                        <div className="mt-2">
                            <Link to="/signup"><span class="text-xs hover:underline">New user? Sign Up!</span></Link>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default SignIn;