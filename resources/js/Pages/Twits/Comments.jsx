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
    //replies 
    const [reply, setReply] = useState(false)
    const [replyId, setReplyId] = useState()
    const { data, setData, post, clearErrors, reset, errors } = useForm({
        comment_body: "",
        twit_id: twit.id,
        parent_id: replyId,
    });
    //slice
    const [currentPage, setCurrentPage] = useState(0);
    const [commentsPerPage, setCommentsPerPage] = useState(5);

    const pageNumber = [];
    for (
        let i = 1;
        i <= Math.ceil(twit.comments.length / commentsPerPage);
        i++
    ) {
        pageNumber.push(i);
    }

    const paginatedprevComments = () => {
        setCurrentPage(0);
        setCommentsPerPage(5);
    };
    const paginatedComments = () => {
        setCurrentPage(currentPage + 5);
        setCommentsPerPage(commentsPerPage + 5);
    };

    const replyToComments = (commentId) => {
        setReply(true);
        setReplyId(commentId);
        setData(
            "parent_id",
            commentId
        )
       
    }

    const { auth, comments } = usePage().props;


// console.log(data)
    const submitComment = (e) => {
        e.preventDefault();
        post(route("comments.store"), {
            onSuccess: () => {
                reset();
            },
        });
        setReply(false)
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
                                    {twit.comments
                                        .slice(currentPage, commentsPerPage)
                                        .map((comment) => (
                                        
                                            <div
                                                key={comment.id}
                                                className=" sm:items-start mb-2"
                                               
                                            >
                                                <article className="border-t border-gray-200 p-6 text-base bg-gray-50 rounded-md">
                                                    <footer className="mb-2 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <p className="mr-3 inline-flex items-center text-sm text-gray-900">
                                                                <img
                                                                    className="mr-2 h-6 w-6 rounded-full bg-black"
                                                                    src={`/uploads/avatar/${comment.user.avatar}`}
                                                                    alt="user"
                                                                />
                                                                {
                                                                    comment.user
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                               
                                                                {dayjs(
                                                                    comment.created_at
                                                                ).fromNow()}
                                                            </p>
                                                        </div>

                                                        {comment.user_id ==
                                                        auth.user.id ? (
                                                            //only one who posted can delete 
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
                                                                            onClick={() => replyToComments(comment.id)}
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
                                                            // anyone can reply to a comment
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
                                                                            onClick={()=>replyToComments(comment.id)}
                                                                
                                                                        >
                                                                            Reply
                                                                        </button>
                                                                
                                                                    </Dropdown.Content>
                                                                </Dropdown>
                                                            </div>
                                                        )}
                                                    </footer>
                                                    <p className="text-black text-md">
                                                        {comment.comment_body}
                                                    </p>
                                                </article>

                                                {comment.replies.map(
                                                       //replies to comments TODO: add filter show less replies at ounce
                                                    (response) => (
                                                        <article
                                                            className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-gray-300 rounded-lg"
                                                            key={response.id}
                                                        >
                                                            <footer className="flex justify-between items-center mb-2">
                                                                <div className="flex items-center">
                                                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900">
                                                                        <img
                                                                            className="mr-2 w-6 h-6 rounded-full bg-red-200"
                                                                            src={`/uploads/avatar/${response.user.avatar}`}
                                                                            alt="user"
                                                                        ></img>
                                                                        {
                                                                            response
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        {dayjs(
                                                                            response.created_at
                                                                        ).fromNow()}
                                                                    </p>
                                                                </div>

                                                                {response.user_id ==
                                                                auth.user.id ? (
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
                                                                                <Dropdown.Link
                                                                                    as="button"
                                                                                    href={route(
                                                                                        "comments.destroy",
                                                                                        response.id
                                                                                    )}
                                                                                    method="delete"
                                                                                >
                                                                                    Delete
                                                                                </Dropdown.Link>
                                                                            </Dropdown.Content>
                                                                        </Dropdown>
                                                                    </div>
                                                                ) : null}
                                                            </footer>
                                                            <p className="text-gray-500">
                                                                {
                                                                    response.comment_body
                                                                }
                                                            </p>
                                                        </article>
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    {/* by default submit comment else reply form */}
                                    {reply ? (
                                      
                                        <div className=" sm:items-start">
                                        <form onSubmit={submitComment}>
                                            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                                                <img
                                                    className="w-9 rounded-full bg-red-500"
                                                    src={`/uploads/avatar/${auth.user.avatar}`}
                                                    alt={auth.user.name}
                                                />

                                                <textarea
                                                    id="chat"
                                                    rows="2"
                                                    className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-gray-40 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="@username"
                                                    value={data.comment_body}
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
                                                    value={replyId}
                                                    onChange={(e) =>
                                                        setData(
                                                            "parent_id",
                                                            replyId
                                                        )
                                                    }
                                                />

                                                <button
                                                    type="submit"
                                                    className="inline-flex justify-center p-2 text-green-600 rounded-full cursor-pointer bg-green-100 hover:bg-green-400 hover:text-white"
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-6 h-6 rotate-90"
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
                                    ): (
                                         <div className=" sm:items-start">
                                         <form onSubmit={submitComment}>
                                             <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                                                 <img
                                                     className="w-9 rounded-full bg-red-500"
                                                     src={`/uploads/avatar/${auth.user.avatar}`}
                                                     alt={auth.user.name}
                                                 />
 
                                                 <textarea
                                                     id="chat"
                                                     rows="1"
                                                     className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-gray-40 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                     placeholder="Your comment..."
                                                     value={data.comment_body}
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
                                                 {/* <input
                                                     type="hidden"
                                                     name="parent_id"
                                                     value={twit.id}
                                                     onChange={(e) =>
                                                         setData(
                                                             "parent_id",
                                                             e.target.value
                                                         )
                                                     }
                                                 /> */}
 
                                                 <button
                                                     type="submit"
                                                     className="inline-flex justify-center p-2 text-green-600 rounded-full cursor-pointer bg-green-100 hover:bg-green-400 hover:text-white"
                                                 >
                                                     <svg
                                                         aria-hidden="true"
                                                         className="w-6 h-6 rotate-90"
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
                                    )}

                                    {twit.comments.length > 5 && (
                                        <>
                                            {currentPage > pageNumber ? (
                                                <span
                                                    className={`text-xs p-2 m-5 cursor-pointer`}
                                                    onClick={() =>
                                                        paginatedprevComments()
                                                    }
                                                >
                                                    View previous comments
                                                </span>
                                            ) : (
                                                <span
                                                    className="text-xs p-2 m-5 cursor-pointer"
                                                    onClick={() =>
                                                        paginatedComments()
                                                    }
                                                >
                                                    View more comments
                                                </span>
                                            )}
                                        </>
                                    )}
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
