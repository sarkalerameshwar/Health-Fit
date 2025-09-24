"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // check for JWT
    if (!token) {
      router.replace("/login"); // redirect if not logged in
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default PrivateRoute;
