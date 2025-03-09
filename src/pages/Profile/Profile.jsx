import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utilities/AxiosInstance";
import Logout from "../../components/Authentication/Logout";
import { context } from "../../context/UserContext";

export default function Profile() {
  const { user, loading } = useContext(context);

  return (
    <div>
      <h1>Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      <Logout></Logout>
    </div>
  );
}
