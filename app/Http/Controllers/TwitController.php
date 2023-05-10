<?php

namespace App\Http\Controllers;

use App\Models\Twit;
use App\Models\Comment;
use DateTime;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File; //delete file
use Intervention\Image\Facades\Image;


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
            
            //fetch twits, users and related comments, get by latest
            'twits' => Twit::with(['user:id,name,avatar', 'comments:id,comment_body,like_dislike,created_at,user_id,twit_id,parent_id', 'comments.user:id,name,avatar','comments.replies','comments.replies.user','likes'])->latest()->get(),
            // get comment with replies
            // 'comments' => Comment::with('replies')->get(),
            // 'comments'=>Comment::whereNull('parent_id')->get()
            //RETURNS REPLIES
            'replies'=>Comment::whereNotNull('parent_id')->with(['user:id,name,avatar'])->latest()->get(),
            //RETURNS COMMENTS
            'comments'=>Comment::whereNull('parent_id')->with(['user:id,name,avatar'])->latest()->get()


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
                $path = public_path('uploads/images/'.$imageName);
                Image::make($image->getRealPath())->resize(800,null, function($constraint){
                    $constraint->aspectRatio();
                })->save($path);
                // $image->move(public_path('/uploads/images'), $imageName);
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
   

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Twit $twit)
    {
        $this->authorize('update', $twit);
        //TODO: delete image if twit is updated
        dd($request);
        $img = $request->images;
        //remove only images patched in the $request object
        $removedImage = $request->json; 
        if (!is_array($img)) {
            //get images in request changes object 
            foreach ($img as $image) {
                if (isset($twit->images)) {
                    if (in_array($image, $twit->images)) {
                        unlink(public_path('/uploads/images/') . $image);
                        }
                }
                
            }

        }

        //validate 
        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'images' => 'array | max:3 | nullable'
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
        $this->authorize('delete', $twit); 
        //i'm getting images in images column
        $img = $twit->images;
    
        //if images not 0 from db
        if (count($img) > 0) {
            foreach ($img as $image) {
                //image exists in public images
                if (file_exists(public_path('/uploads/images/').$image)) {
                    //remove it
                    unlink(public_path('/uploads/images/') . $image);
                }
            }
        }
        //then remove record from db
        $twit->delete();
        //remove comments 
        $twit->comments()->delete();
        //redirect
        return redirect(route('twits.index'));
    }
}
