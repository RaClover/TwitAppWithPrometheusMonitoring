<?php

use App\Http\Controllers\MetricsController;
use App\Http\Controllers\ProbeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TwitController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Middleware\CountRequestsMiddleware;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Twit;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [TwitController::class,'welcome']); //public for guest page

Route::middleware([CountRequestsMiddleware::class])->group(function () {
    Route::get('/metrics',[MetricsController::class, 'getMetrics']);
});



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::resource('twits',TwitController::class)->only(['index','store','update','destroy'])->middleware(['auth', 'verified']);
    Route::resource('comments',CommentController::class)->only(['store','update','destroy'])->middleware(['auth', 'verified']);
    Route::resource('likes',LikeController::class)->only(['store','update','destroy'])->middleware(['auth','verified']);


});

require __DIR__.'/auth.php';
