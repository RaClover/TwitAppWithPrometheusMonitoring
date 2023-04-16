import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, Head } from "@inertiajs/inertia-react";
import Twit from "@/Components/Twit";
import File from "@/Components/File";

function Index({ auth, twits }) {
    //define props for form
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        // images: [],
    });
    //load more
    const [loadMore, setLoadmore] = useState(4)
    const TwitsPerPage = 4;
    const itemsRemaining = twits.length - loadMore

    const PaginatedResults = () => {
        setLoadmore(loadMore + TwitsPerPage)

    }

    //post msg to controller & reset form
    const submit = (e) => {
        e.preventDefault();
        post(route("twits.store"), { onSuccess: () => reset() });
    };
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Twits" />
            <div className="flex md:flex-row flex-col container mx-auto max-w-7xl mt-10">
                <div className="basis-1/4 max-md:hidden ">
                    <div className="w-[19.875rem] rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-900 ring-slate-700/10 sticky top-0">
                        <div className="flex items-center p-4 pb-0">
                            <img
                                src="/uploads/avatar/profile.jpg"
                                alt=""
                                className="h-10 w-10 flex-none rounded-full"
                            />
                            <div className="ml-4 flex-auto">
                                <div className="font-medium">John Doe</div>
                                <div className="mt-1 text-slate-500">
                                    Sent you an invite to connect.
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 p-4">
                            <div className="pointer-events-auto rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                                Accept
                            </div>
                            <div className="pointer-events-auto rounded-md px-4 py-2 text-center font-medium shadow-sm ring-1 ring-slate-700/10 hover:bg-slate-50">
                                Decline
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" basis-1/2">
                    <div className="px-2 sm:px-6 lg:px-6">
                        <form onSubmit={submit} encType="multipart/form-data">
                            <textarea
                                value={data.message}
                                placeholder={"What's happening?"}
                                className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.message}
                                className="mt-2"
                            />

                            <File
                                id="images"
                                name="images"
                                handleChange={(e) =>
                                    setData("images", e.target.files)
                                }
                                className="mt-2"
                                multiple
                                type="file"
                            />
                            <InputError
                                message={errors.images}
                                className="mt-2"
                            />

                            <PrimaryButton
                                className="mt-4"
                                processing={processing}
                            >
                                Post
                            </PrimaryButton>
                        </form>
                        <div className="mt-6">
                            {twits.slice(0,loadMore).map((twit) => (
                                <Twit key={twit.id} twit={twit} />
                            ))}
                            {itemsRemaining > 0 ? (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4 rounded" onClick={()=>PaginatedResults()}>
                        load more
                        </button>

                            ):(<p>You've reached the end!!</p>)}
                        </div>
                    </div>
                </div>
                <div className="basis-1/4 max-md:hidden">
                    <div className="p-1 sticky top-0">
                        <div className=" bottom-0 left-11 right-0 top-8 bg-slate-900/[0.03]"></div>
                        <div className="pointer-events-auto relative z-10 w-[24.125rem] rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-700 ">
                            <div>
                                <div className="flex items-center px-3.5 py-2.5 text-slate-400">
                                    Trending Topics...
                                </div>
                                <div className="border-t border-slate-400/20 px-3.5 py-3">
                                    <div className="mb-1.5 text-[0.6875rem] font-semibold text-slate-500">
                                        Recent Topics
                                    </div>

                                    <div className="flex items-center rounded-md p-1.5">
                                    <svg
                                            className="mr-1 h-4 w-4 flex-none stroke-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                        </svg>
                                        Sample Topic 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
