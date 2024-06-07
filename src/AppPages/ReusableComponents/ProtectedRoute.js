import React, { useEffect, useState } from "react";

import { Navigate, Outlet } from "react-router-dom";

import { Auth } from "aws-amplify";

const ProtectedRoute = ({ allowedGroups, children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        const groups = userData.signInUserSession.accessToken.payload["cognito:groups"] || [];
        setUser({ ...userData, groups });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!allowedGroups || allowedGroups.length === 0 || allowedGroups.some(group => user.groups.includes(group))) {
    // If no allowedGroups specified, just authenticate the user
    return children ? children : <Outlet />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
