import { Link, Head } from '@inertiajs/inertia-react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                    {props.auth.user ? (
                        <Link href={route('dashboard')} className="text-sm text-gray-700 dark:text-gray-500 underline">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-sm text-gray-700 dark:text-gray-500 underline">
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 text-sm text-gray-700 dark:text-gray-500 underline"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                {props.twits.map(twit =>
                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg" key={twit.id}>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center" >
                           
                                    <div className="ml-4 text-lg leading-7 font-semibold text-white">
                                        
                                           {twit.user.name}
                                        
                                        <small className="ml-2 text-sm text-gray-300">{dayjs(twit.created_at).fromNow()}</small>
                                       {twit.created_at !== twit.updated_at && <small className="text-sm purple-500"> &middot; edited</small>}
                                       
                                    </div>
                                </div>
                             
                                <div className="ml-12">
                                    <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                        {twit.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        )}
                        <div className="">
                        <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                            <div className="mx-auto max-w-md">
                            <img src="/" className="h-6" alt="Tailwind Play" />
                            <div className="divide-y divide-gray-300/50">
                                <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
                                <p>An advanced online playground for Tailwind CSS, including support for things like:</p>
                                <p>Perfect for learning how the framework works, prototyping a new idea, or creating a demo to share online.</p>
                                </div>
                                <div className="pt-8 text-base font-semibold leading-7">
                                <p className="text-gray-900">Want to dig deeper into Tailwind?</p>
                                <p>
                                    <a href="/" className="text-sky-500 hover:text-sky-600">Read the docs &rarr;</a>
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                </div>
            </div>
        </>
    );
}
