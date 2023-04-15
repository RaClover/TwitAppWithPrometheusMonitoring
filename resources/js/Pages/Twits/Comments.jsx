// comments tailwindcss modal
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/inertia-react";
import InputError from "@/Components/InputError";
import { usePage } from "@inertiajs/inertia-react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Dropdown from "@/Components/Dropdown";

export default function Modal({ showModal, setShowModal, twit }) {
    dayjs.extend(relativeTime);
    const { data, setData, post, clearErrors, reset, errors } = useForm({
        comment_body: "",
        twit_id: twit.id,
        parent_id: null,

    });

    const { auth,comments } = usePage().props;

    // console.log(comments[0].replies)

    const submitComment = (e) => {
        e.preventDefault();
        post(route("comments.store"), {
            onSuccess: () => {
                console.log(comment_body)
                setData('comment_body', "");
                console.log(comment_body)

                // reset();
                setShowModal(true);
            },
        });
    };




    return (
        <>
            {showModal ? (
                <>
                    <div
                        className="fixed z-10 inset-0 overflow-y-auto "
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-end justify-center min-h-screen pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"
                                aria-hidden="true"
                            ></div>
                            <span
                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    {twit.comments.map((comment, index) => (
                                        // TODO: only show 5 comments at  a time
                                        //TODO: delete comment
                                        //replies to comments
                                        <div
                                            key={comment.id}
                                            className=" sm:items-start mb-2"
                                        >
                                            {/* delete comment */}
                                            {comment.user_id == auth.user.id ? (
                                            <div className="flex justify-end">
                                                <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button>
                                                       
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-gray-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <button
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                                        // onClick={() => setEdit(true)}
                                                    >
                                                        Reply
                                                    </button>

                                                    <Dropdown.Link
                                                        as="button"
                                                        href={route(
                                                            "comments.destroy",
                                                            comment.id
                                                        )}
                                                        method="delete"
                                                    >
                                                        Delete
                                                    </Dropdown.Link>

                                                </Dropdown.Content>
                                            </Dropdown>
                                        
                                            </div>
                                            ) : (
                                                null
                                            )}

                                        
                                            <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                                                <img
                                                    className="w-9 rounded-full bg-red-500"
                                                    src={`/uploads/avatar/${comment.user.avatar}`}
                                                    alt={comment.user.name}
                                                />
                                                <p className="text-xs p-2">
                                                    {comment.user.name}
                                                </p>
                                                <p
                                                    id="comment"
                                                    class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-gray-40 rounded-lg"
                                                >
                                                    {comment.comment_body}
                                                </p>
                                                    {/* {comment.parent_id == null ? 'reply to comment' : 'comment'} */}
                                                    {/* display comment replies */}
                                                    {/* {comments.replies.map((reply, index) => ( 
                                                        <p
                                                            key={reply.id}
                                                            className=" sm:items-start mb-2"
                                                        >
                                                            {reply}

                                                        </p>
                                                    ))}
                                                <p className="text-xs text-gray-500 text-right">
                                                    {dayjs(
                                                        comment.created_at
                                                    ).fromNow()}
                                                </p>
                                                             */}
                                
                                            </div>
                                            
                                                    {/* <p className=" text-right ">comment replies</p> */}
                                            <p className="text-xs text-gray-500 text-right">
                                            {dayjs(comment.created_at).fromNow()}
                                            </p>
                                        </div>
                                      
                                    ))} 


                                    <div className=" sm:items-start">
                                        <form onSubmit={submitComment}>
                                            <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                                                <img
                                                    className="w-9 rounded-full bg-red-500"
                                                    src={`/uploads/avatar/${auth.user.avatar}`}
                                                    alt={auth.user.name}
                                                />

                                                <textarea
                                                    id="chat"
                                                    rows="1"
                                                    class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-gray-40 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Your comment..."
                                                    onChange={(e) =>
                                                        setData(
                                                            "comment_body",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name="twit_id"
                                                    value={twit.id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "twit_id",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input 
                                                    type="hidden"
                                                    name="parent_id"
                                                    value={twit.id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "parent_id",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <button
                                                    type="submit"
                                                    class="inline-flex justify-center p-2 text-green-600 rounded-full cursor-pointer bg-green-100 hover:bg-green-400 hover:text-white"
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        class="w-6 h-6 rotate-90"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <InputError
                                                message={errors.comment_body}
                                                className="mt-2"
                                            />
                                        </form>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Done
                                    </button> 
                                    <button
                                        onClick={() => setShowModal(false)}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}
