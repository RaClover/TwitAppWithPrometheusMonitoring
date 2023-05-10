//like componet
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { usePage } from "@inertiajs/inertia-react";

const Like = ({ twitId,twitCount }) => {
    const { auth } = usePage().props;
    const { data, setData, post } = useForm({
        twit_id: twitId,
        user_id: auth.user.id,

    });
        console.log(twitCount)
      //submit
      const onSubmit = (e) => {
        // e.preventDefault();
        post(route("likes.store"), {
            onSuccess: () => console.log('liked'),
        });
    };



    return (
        <>
            <button 
                onClick={() => {
                    onSubmit();
                }}
                type="submit"
                className="items-center inline-flex pr-3"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={`w-5 h-5 ${twitCount.map((element)=> element.user_id) == auth.user.id ? "fill-red-500" : "fill-gray-500"}`}
                >
                    <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z"></path>
                </svg>
                <span className="p-2">{twitCount.length}</span>
            </button>
        </>
    );
};

export default Like;