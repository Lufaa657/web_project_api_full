import aroundLogo from "../images/logo_around.svg";
import iconLogo from "../images/logo_icon.svg";
import Header from "./Header/Header";
import * as auth from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main/Main";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Footer from "./Footer/Footer";
import { api } from "../utils/Api";
import { useState, useEffect, useRef } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import InfoTooltip from "./Main/components/Popup/components/InfoTooltip/InfoTooltip";
import { getToken, removeToken, setToken } from "../utils/token";
import CheckBrowserVersion from "./CheckBrowserVersion/CheckBrowserVersion";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [popup, setPopup] = useState("");
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef();

  async function initializeSession(jwt) {
    try {
      const currentUser = await auth.getCurrentUser(jwt);
      const cards = await api.getInitialCards();

      setCurrentUser(currentUser);
      setIsLoggedIn(true);
      setCards(cards);
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      const errorPopup = {
        children: <InfoTooltip signIn />,
      };

      setPopup(errorPopup);

      if (error.status === 401) {
        removeToken();
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const jwt = getToken();
    const browserWarning = CheckBrowserVersion();

    if (jwt) {
      initializeSession(jwt);
    } else {
      setIsLoading(false);
    }

    setPopup(browserWarning);

    function handleBFCache(evt) {
      if (evt.persisted) {
        setIsLoading(true);
        const refreshedJWT = getToken();

        if (!refreshedJWT) {
          window.location.reload();
          return;
        }

        setIsLoading(false);
      }
    }

    window.addEventListener("pageshow", handleBFCache);
    return () => window.removeEventListener("pageshow", handleBFCache);
  }, []);

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup("");
  }

  async function handleUpdateUser(userInfo) {
    try {
      const newUserInfo = await api.updateUserInfo(userInfo);

      setCurrentUser((prevState) => ({
        ...prevState,
        name: newUserInfo.name,
        about: newUserInfo.about,
      }));

      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateAvatar(newAvatarUrl) {
    try {
      const newUserInfo = await api.updateUserAvatar(newAvatarUrl);

      setCurrentUser((prevState) => ({
        ...prevState,
        avatar: newUserInfo.avatar,
      }));

      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddPlaceSubmit(cardInfo) {
    try {
      const newCard = await api.addNewCard(cardInfo);
      setCards([newCard, ...cards]);
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCardDelete(id) {
    try {
      await api.deleteCard(id);
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== id)
      );
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCardLike(isLiked, card) {
    try {
      const newCard = await api.editLikeStatus(isLiked, card._id);

      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === newCard._id ? newCard : currentCard
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignUp(data) {
    try {
      setIsProcessing(true);

      const successPopup = {
        children: <InfoTooltip signUpSuccess />,
      };

      await auth.register(data);

      setPopup(successPopup);

      setTimeout(() => {
        setPopup("");
        navigate("/signin", { replace: true });
      }, 1000);
    } catch (error) {
      const errorPopup = {
        children: <InfoTooltip />,
      };

      setPopup(errorPopup);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleSignIn(user) {
    try {
      setIsProcessing(true);

      const { token } = await auth.authorize(user);

      setToken(token);
      setIsLoading(true);

      initializeSession(token);

      navigate("/", { replace: true });
    } catch (error) {
      const errorPopup = {
        children: <InfoTooltip signIn />,
      };

      setPopup(errorPopup);
    } finally {
      setIsProcessing(false);
    }
  }

  function handleSignOut() {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser("");
    setCards([]);
    navigate("/signin", { replace: true });
  }

  if (isLoading) {
    return (
      <div className="loading">
        <img src={iconLogo} className="loading__logo-icon" alt="" />
        <img src={aroundLogo} className="loading__logo-around" alt="" />
        <p className="loading__text">Carregando...</p>
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        onUpdateUser: handleUpdateUser,
        onUpdateAvatar: handleUpdateAvatar,
        onSignOut: handleSignOut,
      }}
    >
      <div className="page">
        <Header formRef={formRef} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  cards={cards}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signin"
            element={
              <ProtectedRoute anonymous>
                <Login
                  onClosePopup={handleClosePopup}
                  onSignIn={handleSignIn}
                  popup={popup}
                  formRef={formRef}
                  isProcessing={isProcessing}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <ProtectedRoute anonymous>
                <Register
                  onClosePopup={handleClosePopup}
                  onSignUp={handleSignUp}
                  popup={popup}
                  isProcessing={isProcessing}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}