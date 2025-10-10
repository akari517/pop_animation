// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AnimationProvider } from "./context/AnimationContext";

function App() {
  return (
    <AnimationProvider>
      <RouterProvider router={router} />
    </AnimationProvider>
  );
}

export default App;
