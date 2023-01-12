<?php

namespace App\Http\Controllers;

use App\Models\Twit;
use DateTime;
use Illuminate\Http\Request;
use Inertia\Inertia;


class TwitController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
           // $nub = 400 + 300;
           // $mydate = new DateTime('now');
        //
        //dd('hello world');
       //return Inertia::render('Twits/Twits',['answer'=> $nub, 'mydate'=> $mydate]);

       return Inertia::render('Twits/Index',[
            //we fetch the twits ordering by the latest
            'twits'=> Twit::with('user:id,name')->latest()->get(),

       ]);
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
        //validate message
        $validated = $request->validate([
            'message'=> 'required|string|max:255'
        ]);

        //then we save the message
        $request->user()->twits()->create($validated);

        return redirect(route('twits.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Http\Response
     */
    public function show(Twit $twit)
    {
       //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Http\Response
     */
    public function edit(Twit $twit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Twit $twit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Http\Response
     */
    public function destroy(Twit $twit)
    {
        //
    }
}
