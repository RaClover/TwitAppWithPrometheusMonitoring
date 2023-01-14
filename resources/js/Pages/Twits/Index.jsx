import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/inertia-react';
import Twit from '@/Components/Twit';

function Index({auth,twits}) {

    //define props for form
    const {data, setData, post, processing, reset, errors,} = useForm({
        message: ''
    });

    //post msg to controller & reset form
    const submit = (e) => {
        e.preventDefault();
        post(route('twits.store'),{onSuccess: ()=> reset()});
    };
  return (
    <AuthenticatedLayout auth={auth}>
        <Head title='Twits' />
        <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
            <form onSubmit={submit}>
                <textarea
                    value={data.message}
                    placeholder={"What's happening?"}
 
                    className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    onChange={e=>setData('message', e.target.value)}
                />
                <InputError message={errors.message}  className="mt-2" />
                <PrimaryButton className='mt-4' processing={processing}>Twit</PrimaryButton>
            </form>
            <div className='mt-6 bg-white shadow-sm rounded-lg divide-y'>
                {
                    twits.map(twit =>
                        <Twit key={twit.id} twit={twit}/>
                        )}
            </div>
        </div>
    </AuthenticatedLayout>
  )
}

export default Index
