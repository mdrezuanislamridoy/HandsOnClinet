import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utilities/AxiosInstance";
import Button from "../UI/Button";
import { useContext } from "react";
import { context } from "../../context/UserContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(context);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button className="cursor-pointer" onClick={handleLogout}>
      Logout
    </Button>
  );
}
