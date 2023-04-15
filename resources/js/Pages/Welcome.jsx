import { useState } from "react";
import { Link, Head } from "@inertiajs/inertia-react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
dayjs.extend(relativeTime);
export default function Welcome(props) {
    const [register, setRegister] = useState(false);
    const handleRegister = () => {
        setRegister(true);
        if (register === true) {
            setRegister(false);
        }
    };
    return (
        <>
            <Head title="Welcome" />
            <div className="relative items-top justify-center min-h-screen bg-gray-100 sm:pt-0">
                <div className="mx-auto max-w-screen-2xl px-6 pb-16 pt-16 sm:px-8 md:px-12 md:pb-20 md:pt-20 lg:pb-24 lg:pt-24">
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-1/2">
                            <div className="max-w-3xl">
                                <h1 className="font-alt-40 text-solar-700 mb-4 text-xl uppercase tracking-wider lg:text-2xl">
                                    .......
                                </h1>
                                <h2 className="lg:text-66xl md:tracking-tightish leading-extra-tight mb-6 font-serif text-5xl md:mb-8 md:text-6xl">
                                    TwitBook
                                </h2>
                                <p className="text-charcoal-500 mb-8 text-lg md:mb-10 lg:mb-12 lg:text-xl xl:text-2xl">
                                    Connect with everyone and interact with
                                    everybody. It's free for life and after that
                                    you pay $1000/mo
                                </p>
                                <p className="text-2xl">Recent Twits</p>
                                <div className="max-w-6xl mx-auto sm:px-6 lg:px-2">
                                    {props.twits.slice(0, 2).map((twit) => (
                                        <div
                                            className="mt-6 bg-gray-600 overflow-hidden shadow sm:rounded-lg"
                                            key={twit.id}
                                        >
                                            <div className="add something">
                                                <div className="p-6 border-t border-gray-200">
                                                    <div className="flex items-center">
                                                        <img
                                                            className="w-9 h-9 rounded-full"
                                                            src={`/uploads/avatar/${twit.user.avatar}`}
                                                            alt={twit.user.name}
                                                        />
                                                        <div className="ml-4 text-lg leading-7 font-semibold text-white">
                                                            {twit.user.name}
                                                            <small className="ml-2 text-sm text-gray-300">
                                                                {dayjs(
                                                                    twit.created_at
                                                                ).fromNow()}
                                                            </small>
                                                            {twit.created_at !==
                                                                twit.updated_at && (
                                                                <small className="text-sm purple-500">
                                                                    {" "}
                                                                    &middot;
                                                                    edited
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-12">
                                                        <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                                            {twit.message}
                                                            <p className="text-red-400 mt-1">
                                                                {twit.images &&
                                                                    "Sign to view images"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 md:mt-12">
                                    <a
                                        href="#"
                                        className="button-super text-white hover:bg-iris-600 font-sans-medium text-md relative flex items-center justify-center overflow-hidden rounded-lg bg-blue-400 px-4 py-2 shadow transition ease-in-out hover:text-white focus:ring sm:inline-flex sm:justify-between sm:px-6 sm:py-3 sm:text-lg md:px-7 md:py-3 md:text-xl"
                                        data-cursor="scale"
                                        onClick={() =>
                                            setRegister(handleRegister)
                                        }
                                    >
                                        <span className="relative z-20">
                                            {register
                                                ? "Sign in instead"
                                                : "Create an account"}
                                        </span>
                                        <span className="text-charcoal-100 relative mx-2">
                                            <svg
                                                width="22"
                                                height="16"
                                                viewBox="0 0 22 16"
                                                fill="currentColor"
                                                preserveAspectRatio="xMidYMid meet"
                                            >
                                                <path
                                                    d="M.145 6.81H18.84v2.38H.145V6.81z"
                                                    fill="currentColor"
                                                ></path>
                                                <path
                                                    d="M13.654 15.977l-1.69-1.668L18.359 8l-6.393-6.31L13.654.024 21.734 8l-8.08 7.977z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full sm:ml-16 sm:w-1/2">
                            <div className="relative flex">
                                <div className="area relative z-20 w-full">
                                    {register ? <Register /> : <Login />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-44 bg-gradient-to-b from-zinc-200 to-gray-100">
                    <div className="max-w-6xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                        <nav
                            className="-mx-5 -my-2 flex flex-wrap justify-center"
                            aria-label="Footer"
                        >
                            <div className="px-5 py-2">
                                <a
                                    href="#"
                                    className="text-base text-gray-500 hover:text-gray-900"
                                >
                                    Privacy Terms
                                </a>
                            </div>
                        </nav>
                        <p className="mt-8 text-center text-base text-gray-400">
                            &copy; 2023 TwitBook, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
