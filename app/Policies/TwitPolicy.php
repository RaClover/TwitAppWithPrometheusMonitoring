<?php

namespace App\Policies;

use App\Models\Twit;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TwitPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Twit $twit)
    {
        //
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Twit $twit)
    {
        //updates can only be made by author of the twit
        return $twit->user()->is($user);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Twit $twit)
    {
        //authorize author to delete, rather than reapeating logic we call the update method
        return $this->update($user, $twit);

    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Twit $twit)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Twit  $twit
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Twit $twit)
    {
        //
    }
}
