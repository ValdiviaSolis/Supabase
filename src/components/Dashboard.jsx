import { useState } from "react";
import { supabase } from "../libs/supabaseClient";
import { useSessionContext } from "../hooks/useSession";
import Table from "./Table";
import Forecasting from "./Forecasting";

export default function Dashboard() {
  const [section, setSection] = useState("Dashboard");
  const {session} = useSessionContext();

  return (
    <>
      <div className="bg-slate-900 w-full text-white ">
        <div className="flex justify-between px-5">
          {/*left section*/}
          <div className="inline-flex items-center space-x-4">
            <h3 className="text-2xl font-bold">Telematica Weather Station</h3>
            <p
              className="cursor-pointer"
              onClick={() => setSection("Dashboard")}
            >
              Dashboard
            </p>
            <p
              className="cursor-pointer"
              onClick={() => setSection("Forecasting")}
            >
              Forecasting
            </p>
          </div>

          {/*Right Section*/}
          <div className="py-4 inline-flex items-center">
            <p className="p-4 m-1 rounded-full bg-slate-600 text-white font-bold">
              {session.user.email}
            </p>
            <p
              className="p-4 m-0 rounded-full bg-slate-100 font-bold text-black cursor-pointer"
              onClick={() => supabase.auth.signOut()}
            >
              Cerrar sesion
            </p>
          </div>
        </div>
      </div>

      {/*Title*/}
      <div className="w-full">
        <div className="container py-4 border-b border-black px-5">
          <h1 className="text-4xl font-bold">{section}</h1>
        </div>
      </div>

      <div className="px-5 py-8">
        {section == "Dashboard" && <Table/>}
        {section == "Forecasting" && <Forecasting />}
      </div>
    </>
  );
}