import React from 'react';
    import { useAuthenticator } from '@aws-amplify/ui-react';

    function CustomSignUp() {
      const { signUp } = useAuthenticator(context => [context.signUp]);

      const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password, firstname, lastname, email } = event.target.elements;

        await signUp({
          username: username.value,
          password: password.value,
          email: email.value,
          attributes: {
            firstname: firstname.value,
            lastname: lastname.value,
          },
        });
      };

      return (
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" required />
          <input name="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <input name="firstname" placeholder="First Name" required />
          <input name="lastname" placeholder="Last Name" required />
          <button type="submit">Sign Up</button>
        </form>
      );
    }

    export default CustomSignUp;
    