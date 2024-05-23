import React, { useEffect, useState } from "react";

import { Navigate, Outlet } from "react-router-dom";

import { Auth } from "aws-amplify";

const ProtectedRoute = ({ allowedGroups, children }) => {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()

      .then((userData) => {
        const groups =
          userData.signInUserSession.accessToken.payload["cognito:groups"] ||
          [];

        setUser({ ...userData, groups });
      })

      .catch((err) => console.error(err))

      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  if (user && allowedGroups.some((group) => user.groups.includes(group))) {
    return children ? children : <Outlet />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
