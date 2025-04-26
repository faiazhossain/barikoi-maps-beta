"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import MainContent from "./components/Layout/MainContent";

export default function Home() {
  return (
    <Provider store={store}>
      <MainContent />
    </Provider>
  );
}
