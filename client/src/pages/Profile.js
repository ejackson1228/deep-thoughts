import React from 'react';
import { useParams, Navigate } from 'react-router-dom'; // navigate is extremely useful in routing to pages with JWT's

import ThoughtList from '../components/ThoughtList';
import FriendsList from '../components/FriendsList';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import auth from '../utils/auth';

import { ADD_FRIEND } from '../utils/mutations';

import ThoughtForm from '../components/ThoughtForm';


const Profile = () => {
  const [addFriend] = useMutation(ADD_FRIEND);

  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  if (auth.loggedIn() && auth.getProfile().data.username === userParam) {
    return <Navigate to='/profile' />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the links above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      })
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        {userParam && ( // conditionally renders based on if url contains a username. if only /profile, the button won't show
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendsList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
