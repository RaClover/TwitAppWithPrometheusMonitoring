import { Link, Head } from "@inertiajs/inertia-react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                    {props.auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="text-sm text-gray-700 dark:text-gray-500 underline"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="text-sm text-gray-700 dark:text-gray-500 underline"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route("register")}
                                className="ml-4 text-sm text-gray-700 dark:text-gray-500 underline"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {props.twits.map((twit) => (
                        <div
                            className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg"
                            key={twit.id}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
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
                                                    &middot; edited
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    {/*TODO:: add image viewer guest */}
                                    <div className="ml-12">
                                        <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                            {twit.message}
                                        </div>
                                        <div className="container grid grid-cols-3 gap-1 mx-auto">
                                            {twit.images &&
                                                twit.images.map(
                                                    (image, index) => (
                                                        <div className="w-full rounded">
                                                            {/* generate key for images */}
                                                            <img
                                                                key={index}
                                                                src={`/uploads/images/${image}`}
                                                                className="mt-4"
                                                                width={200}
                                                                onClick={() =>
                                                                    openImageViewer(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
