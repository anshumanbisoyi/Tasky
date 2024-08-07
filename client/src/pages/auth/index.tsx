import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
  SignUpButton,
} from '@clerk/clerk-react';

export const Auth = () => {
  return (
    <div className="sign-in-container">
      <SignedOut>
        <SignUpButton mode="modal" />
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Auth;


