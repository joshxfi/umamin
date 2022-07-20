import React, { useState } from 'react';
import { dehydrate, useMutation, useQuery } from 'react-query';
import { RiSendPlaneFill } from 'react-icons/ri';
import { NextSeo } from 'next-seo';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { getUser, queryClient, sendMessage } from '@/api';

const SendTo = ({ username }: { username: string }) => {
  const [message, setMessage] = useState('');
  const [msgSent, setMsgSent] = useState<boolean>(false);

  const router = useRouter();

  const { data: user } = useQuery(
    ['user', { username }],
    () => getUser({ username }),
    { select: (data) => data.user }
  );

  const { mutate, data, isLoading } = useMutation(sendMessage);

  const handleSend: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (user) {
      mutate(
        {
          input: {
            receiverUsername: username,
            content: message,
            receiverMsg: user.message,
          },
        },
        {
          onSuccess: () => {
            setMessage('');
            setMsgSent(true);
          },
        }
      );
    }
  };

  return (
    <>
      <NextSeo
        openGraph={{
          title: user
            ? `👀 Send anonymous messages to ${user.username}!`
            : '404 - User not found',
          description:
            'Create your own link to start receiving anonymous confessions and messages!',
        }}
      />
      <section className='flex justify-center md:absolute md:left-0 md:top-0 md:h-screen md:w-full md:items-center'>
        {!user ? (
          <h1 className='h1-text'>Are you lost?</h1>
        ) : (
          <>
            {/* Top */}
            <div className='card w-full overflow-hidden bg-secondary-100 md:w-[720px]'>
              <div className='flex items-center justify-between border-b-2 border-primary-100 bg-secondary-200 px-7 py-2'>
                <p className='font-medium capitalize text-white'>
                  <span className='font-light text-gray-400'>To&#58;</span>{' '}
                  {username}
                </p>
                <div className='relative h-[40px] w-[110px] md:h-[50px] md:w-[130px]'>
                  <Image
                    src='/assets/logo.svg'
                    layout='fill'
                    objectFit='contain'
                  />
                </div>
              </div>

              {/* Message */}
              <div className='flex min-h-[170px] flex-col justify-between space-y-5 px-5 py-10 sm:space-y-0 sm:px-10 sm:py-7'>
                <div className='chat-p receive inline-block self-start font-medium'>
                  Send me an anonymous message!
                </div>
                {data?.sendMessage.content && (
                  <div className='chat-p send inline-block self-end'>
                    {data.sendMessage.content}
                  </div>
                )}
              </div>

              {/* Send Message */}
              <form
                onSubmit={handleSend}
                className='relative flex h-[100px] items-center justify-between bg-secondary-200 py-5 px-4 md:h-[85px] md:px-7'
              >
                {!msgSent ? (
                  <>
                    <input
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      minLength={1}
                      maxLength={200}
                      type='text'
                      placeholder='Send an anonymous message..'
                      className='w-full rounded-full border-2 border-primary-100 bg-secondary-100 py-3 px-5 pr-12 outline-none transition-all md:py-2'
                    />

                    {isLoading ? (
                      <span className='loader absolute right-10' />
                    ) : (
                      <button
                        type='submit'
                        className='absolute right-9 cursor-pointer text-2xl text-primary-100 transition-all md:right-12'
                      >
                        <RiSendPlaneFill />
                      </button>
                    )}
                  </>
                ) : (
                  <div className='w-full'>
                    <p className='text-center font-medium text-[#DAB5D3]'>
                      Anonymous message sent!
                    </p>
                    <div className='flex justify-center space-x-2 font-normal text-primary-100 [&>:nth-child(odd)]:cursor-pointer [&>:nth-child(odd)]:transition-all [&>:nth-child(odd):hover]:text-[#ED6FD5]'>
                      <button type='button' onClick={() => setMsgSent(false)}>
                        Send again
                      </button>
                      <span className='text-[#DAB5D3]'>•</span>
                      <button
                        type='button'
                        onClick={() => router.push('/create')}
                      >
                        Create your link
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export async function getServerSideProps({
  params,
}: {
  params: { username: string };
}) {
  await queryClient.prefetchQuery(['user', { username: params.username }], () =>
    getUser({ username: params.username })
  );

  return {
    props: {
      username: params.username,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default SendTo;
