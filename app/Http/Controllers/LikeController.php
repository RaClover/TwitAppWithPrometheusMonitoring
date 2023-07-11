<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request)
    {

        $isLiked = Like::where('user_id', Auth::user()->id)
        ->where('twit_id', $request->get('twit_id'))
        ->first();

        if($isLiked){
            $isLiked->delete();
            return redirect()->back();
        } else {
            Like::create([
                'user_id'=> Auth::user()->id,
                'twit_id'=> $request->get('twit_id'),
            ]);
        }

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param Like $like
     * @return Response
     */
    public function show(Like $like)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Like $like
     * @return Response
     */
    public function edit(Like $like)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Like $like
     * @return Response
     */
    public function update(Request $request, Like $like)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Like $like
     * @return Response
     */
    public function destroy(Like $like)
    {
        //
    }
}
