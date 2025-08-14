import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth"
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  
  return <DashboardLayout>dashboard</DashboardLayout>; 
}

export default Dashboard
