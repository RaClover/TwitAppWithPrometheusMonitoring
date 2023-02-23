<?php

namespace App\Http\Controllers;

use App\Models\Twit;
use DateTime;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File; //delete file


class TwitController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        //return Inertia::render('Twits/Twits',['answer'=> $nub, 'mydate'=> $mydate]);

        return Inertia::render('Twits/Index', [
            //we fetch the twits ordering by the latest
            'twits' => Twit::with('user:id,name,avatar')->latest()->get(),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function welcome()
    {
        //guest rendered page, show twits
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'twits' => Twit::with('user:id,name,avatar')->latest()->limit(3)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // TODO: learn more about laravel validation

        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'images' => 'array | max:3'
        ]);
        $images = [];
        $message = '';

        //if images are present, we loop through them and save them to the public folder
        if ($request->hasFile('images')) {
            foreach ($validated['images'] as $image) {
                $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('/uploads/images'), $imageName);
                array_push($images, $imageName);
            }
            $message = $validated['message'];

            $request->user()->twits()->create([
                'message' => $message,
                'images' => $images
            ]);
        } else {
            $request->user()->twits()->create([
                'message' => $validated['message'],
            ]);
        }
        //then redirect 
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
    public function removeImage(Twit $twit)
    {
        //TODO:unlink image


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
        //by default authorize prevents everyone/ Authorize method::create a policy to allow users.
        $this->authorize('update', $twit);
        //TODO: delete image if twit is updated

        // $imgs = $request->images;
    
        // if(count($imgs) >= 1) {
        //     // dd($imgs);
        //     foreach ($imgs as $image) {
        //         if (file_exists(public_path('/uploads/images/'.$image))) {
        //             // dd($image);
                    
        //             unlink(public_path('/uploads/images/'. $image));
        //             // dd(public_path('/uploads/images/'.$image));
        //             // File::delete(public_path('/uploads/images/'.$image));
        //         }
        //     }
        // }
        
        //validate 
        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'images' => 'array | max:3'
        ]);
        
        $twit->update($validated);
        
        return redirect(route('twits.index'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Http\Response
     */
    public function destroy(Twit $twit)
    {

        //to delete a twit, we need athorize
        $this->authorize('delete', $twit); //authorize deleting

        //from db
        $img = $twit->images;

        //if images not NULL from db
        if ($img) {
            //loop through the array
            foreach ($img as $image) {
                //image exists in public folder
                if (file_exists($image)) {
                    //remove it
                    unlink(public_path('/uploads/images/') . $image);
                }
            }
        }
        //then remove record from db
        $twit->delete();
        //redirect
        return redirect(route('twits.index'));
    }
}
