import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, Head } from "@inertiajs/inertia-react";
import Twit from "@/Components/Twit";
import File from "@/Components/File";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

function Index({ auth, twits }) {
    // dayjs.extend(relativeTime);
    //define props for form
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        // images: [],
    });
    //load more
    const [loadMore, setLoadmore] = useState(4);
    const TwitsPerPage = 4;
    const itemsRemaining = twits.length - loadMore;

    const PaginatedResults = () => {
        setLoadmore(loadMore + TwitsPerPage);
    };

    //post msg to controller & reset form
    const submit = (e) => {
        e.preventDefault();
        post(route("twits.store"), { onSuccess: () => reset() });
    };
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Twits" />
            <div className="flex md:flex-row flex-col container mx-auto max-w-7xl mt-10">
                <div className=" basis-full">
                    <div className="px-2 sm:px-6 lg:px-6">
                        <form onSubmit={submit} encType="multipart/form-data">
                        <div className="rounded-t-lg bg-white px-4 py-2 mb-2">
                            <textarea
                                value={data.message}
                                rows ="4"
                                placeholder={"What's happening?"}
                                className="w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0"
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                            />
                        </div>
                            <InputError
                                message={errors.message}
                                className="mt-2"
                            />
                        <div className="flex space-x-1 pl-0 sm:pl-2">
                           <PrimaryButton
                                className="mt-2"
                                processing={processing}
                            >
                                Post
                            </PrimaryButton>
                            <File
                                id="images"
                                name="images"
                                handleChange={(e) =>
                                    setData("images", e.target.files)
                                }
                                className="mt-2 ml-12"
                                multiple
                                type="file"
                            />
                            <InputError
                                message={errors.images}
                                className="mt-2"
                            />
                        </div>

                        </form>
                        {/* <form onSubmit={submit} encType="multipart/form-data">
  <div className="mb-4 w-full rounded-lg border border-gray-200 bg-white">
    <div className="rounded-t-lg bg-white px-4 py-2">
      <label for="comment" className="sr-only">Your comment</label>
      <textarea id="comment" rows="4" className="w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0" placeholder="What's on your mind? ..." required></textarea>
    </div>
    <div className="flex items-center justify-between border-t px-3 py-2">
      <button type="submit" className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200">Post Twit</button>
      <div className="flex space-x-1 pl-0 sm:pl-2"> */}
        {/* <button type="file"  className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
          <svg aria-hidden="true" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
        </button> */}
        {/* <File
                                id="images"
                                name="images"
                                handleChange={(e) =>
                                    setData("images", e.target.files)
                                }
                                className="mt-2 inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                multiple
                                type="file"
                            /> */}
      {/* </div>
    </div>
  </div>
</form>
 */}

                        <div className="mt-6">
                            {twits.slice(0, loadMore).map((twit) => (
                                <Twit key={twit.id} twit={twit} />
                            ))}
                            {itemsRemaining > 0 ? (
                                <div className="text-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold mb-4 py-2 px-4 rounded animate-pulse"
                                        onClick={() => PaginatedResults()}
                                    >
                                        Load more...
                                    </button>
                                </div>
                            ) : (
                                <p className="text-center">
                                    You've reached the end!!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
