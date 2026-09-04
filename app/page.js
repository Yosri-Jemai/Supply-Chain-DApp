"use client";

import React, { useContext } from "react";
import { TrackingContext } from "../Context/Tracking";

export default function Home() {
  const { title } = useContext(TrackingContext);

  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}