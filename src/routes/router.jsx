import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { MainPage } from "../pages/MainPage";
import { PermutationEncryptionPage } from "../pages/PermutationEncryptionPage/PermutationEncryptionPage";
import { VigenereEncryptionPage } from "../pages/VigenereEncryptionPage/VigenereEncryptionPage";
import { GammaEncryptionPage } from "../pages/GammaEncryptionPage/GammaEncryptionPage";
import { FeistelEncryptionPage } from "../pages/FeistelEncryptionPage/FeistelEncryptionPage"
import { AesEncryptionPage } from "../pages/AesEncryptionPage/AesEncryptionPage"
import { DigitalSignaturePage } from "../pages/DigitalSignaturePage/DigitalSignaturePage"

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async() => {
      return null
    },
    children: [
      { index: true, element: <MainPage /> },
      { path: "permutation", element: <PermutationEncryptionPage /> },
      { path: "vigenere", element: <VigenereEncryptionPage /> },
      { path: "gamma", element: <GammaEncryptionPage /> },
      { path: "feistel", element: <FeistelEncryptionPage /> },
      { path: "aes", element: <AesEncryptionPage /> },
      { path: "signature", element: <DigitalSignaturePage /> }
    ]
  },
])

export default routes
