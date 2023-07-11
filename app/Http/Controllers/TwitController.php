<?php

namespace App\Http\Controllers;

use App\Events\TwitCreated;
use App\Models\Twit;
use App\Models\Comment;
use DateTime;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File; //delete file
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Log;
use Elasticsearch\Client;
use Illuminate\Support\Facades\Event;


class TwitController extends Controller
{




    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Twits/Index', [
            //we fetch the twits ordering by the latest

            //fetch twits, users and related comments, get by latest
            'twits' => Twit::with(['user:id,name,avatar', 'comments:id,comment_body,like_dislike,created_at,user_id,twit_id,parent_id', 'comments.user:id,name,avatar','comments.replies','comments.replies.user','likes'])->orderBy('id', 'desc')->get(),
            'replies'=>Comment::whereNotNull('parent_id')->with(['user:id,name,avatar'])->latest()->get(),
            //RETURNS COMMENTS
            'comments'=>Comment::whereNull('parent_id')->with(['user:id,name,avatar'])->latest()->get()


        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function welcome()
    {
        //guest rendered page, show twits
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'twits' => Twit::with('user:id,name,avatar')->orderBy('id', 'desc')->limit(3)->get(),
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'images' => 'array|max:3',
        ]);
        $images = [];
        $message = '';

        if ($request->hasFile('images')) {
            foreach ($validated['images'] as $image) {
                $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
                $path = public_path('uploads/images/' . $imageName);
                Image::make($image->getRealPath())->resize(800, null, function ($constraint) {
                    $constraint->aspectRatio();
                })->save($path);
                array_push($images, $imageName);
            }
            $message = $validated['message'];

            $twit = $request->user()->twits()->create([
                'message' => $message,
                'images' => $images,
            ]);

            // Dispatch the TwitCreated event
            event(new TwitCreated($twit));
        } else {
            $twit = $request->user()->twits()->create([
                'message' => $validated['message'],
            ]);

            // Dispatch the TwitCreated event
            Event::dispatch(new TwitCreated($twit));
        }

        return redirect(route('twits.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param Twit $twit
     * @return Response
     */
    public function show(Twit $twit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Twit $twit
     * @return Response
     */


    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Twit $twit
     * @return Response
     * @throws \Exception
     */
    public function update(Request $request, Twit $twit)
    {
        $this->authorize('update', $twit);

        $img = $request->images;
        //remove only images patched in the $request object
        $removedImage = $request->json;
        if (!is_array($img)) {
            if (!empty($twit->images)) {
                foreach ($img as $image) {
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
     * @param Twit $twit
     * @return Response
     */
    public function destroy(Twit $twit)
    {
        //to delete a twit, we need athorize
        $this->authorize('delete', $twit);
        //i'm getting images in images column
        $img = $twit->images;

        //if images not 0 from db
        if ($img !== null && count($img) > 0) {
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
