import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { isSignUp, setIsSignUp, currentUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, signUp } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(""); // State to store error message
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            setError(""); // Clear previous error message
            if (isSignUp) {
                await signUp(email, password, firstName, lastName);
                console.log("User signed up");
            } else {
                await signIn(email, password);
                console.log("User signed in");
            }
            navigate("/home");
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message); // Set error message
        }
    };

    useEffect(() => {
        if (currentUser) {
            navigate("/home");
        }
    }, [currentUser, navigate]);

    return (
        <section className="bg-white">
            <div className="flex min-h-screen">
                <div className="hidden lg:block lg:w-5/12 bg-gray-200">
                    <img
                        src="https://via.placeholder.com/600x800"
                        alt="Book Collection"
                        className="object-cover w-full h-full"
                    />
                </div>
                <main className="flex flex-col items-center justify-center lg:w-7/12 px-8 py-8 sm:px-12 lg:px-16 lg:py-12">
                    <div className="max-w-xl lg:max-w-3xl">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="inline-block shrink-0 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 hover:border-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Home
                            </button>
                        </div>
                        <h1 className="mt-6 xl:lg:text-5xl font-serif font-bold text-gray-900 sm:text-3xl md:text-4xl">
                            Welcome to Unbind
                        </h1>
                        <p className="mt-4 leading-relaxed text-gray-500">
                            Sign up to track your book collection, discover new books, and
                            share your reviews.
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAuth();
                            }}
                            className="mt-8 space-y-6"
                        >
                            {isSignUp && (
                                <>
                                    <div className="flex space-x-6">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="FirstName"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="FirstName"
                                                name="first_name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="mt-2 w-full rounded-md border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label
                                                htmlFor="LastName"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="LastName"
                                                name="last_name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="mt-2 w-full rounded-md border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex flex-col space-y-4">
                                <div className="w-full">
                                    <label
                                        htmlFor="Email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="Email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                    />
                                </div>
                                <div className="w-full">
                                    <label
                                        htmlFor="Password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="Password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <p className="text-sm text-gray-500">
                                    By creating an account, you agree to our
                                    <span className="text-gray-700 underline">
                                        {" "}
                                        terms and conditions{" "}
                                    </span>
                                    and
                                    <span className="text-gray-700 underline">
                                        {" "}
                                        privacy policy{" "}
                                    </span>
                                    .
                                </p>
                            </div>
                            {error && (
                                <div className="w-full text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="w-full sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="button"
                                    onClick={handleAuth}
                                    className="inline-block shrink-0 rounded-md border border-teal-600 bg-teal-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-teal-600 focus:outline-none focus:ring hover:bg-teal-50 active:text-teal-500"
                                >
                                    {isSignUp ? "Create an account" : "Log in"}
                                </button>
                                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                    {isSignUp ? (
                                        <>
                                            Already have an account?{" "}
                                            <span
                                                onClick={() => setIsSignUp(false)}
                                                className="text-gray-700 underline cursor-pointer"
                                            >
                                                Log in
                                            </span>
                                            .
                                        </>
                                    ) : (
                                        <>
                                            Don't have an account?{" "}
                                            <span
                                                onClick={() => setIsSignUp(true)}
                                                className="text-gray-700 underline cursor-pointer"
                                            >
                                                Sign up
                                            </span>
                                            .
                                        </>
                                    )}
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default LoginPage;
