<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use App\Models\Twit;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        

        // dd($request->all());
        $request->validate([
            'comment_body'=>'required|string|max:200'
        ]);


        //
        // $twit = Twit::where('id',$request->twit_id)->where('status',0)->first();
        
        Comment::create([
            'comment_body' => $request->get('comment_body'),
            'user_id' => Auth::user()->id,
            // 'twit_id' => $request->get('twit_id'),
            // 'twit_id'=>Twit::all('id') ,
            //get id of the current twit being commented on
            'twit_id'=> $request->get('twit_id'),



            // 'like_dislike' => $request->get('like_dislike'),
            // 'parent_id' => $request->get('parent_id'),

        ]);

        // $request->user()->comments()->create([
        //     'comment_body' => 'comment_body'
        // ]);

        return redirect(route('twits.index'))->with('comment posted!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
