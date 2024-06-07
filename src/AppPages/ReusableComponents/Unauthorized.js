import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Card, Heading, Text } from "@aws-amplify/ui-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/LandingPage");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        padding="20px"
        border="1px solid #ccc"
        borderRadius="8px"
        boxShadow="0 4px 8px rgba(0,0,0,0.1)"
      >
        <Heading level={3} style={{ marginBottom: "10px" }}>
          Unauthorized Access
        </Heading>

        <Text style={{ marginBottom: "20px" }}>
          You are not authorized to view this page. Please contact the Admin
          team to get the necessary permissions.
        </Text>

        <Button onClick={handleGoBack}>Go Back</Button>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
