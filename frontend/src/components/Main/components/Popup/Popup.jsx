import { cloneElement, useEffect, useState } from "react";
import FormValidator from "../../../../utils/FormValidator";

export default function Popup(props) {
  const { title, onClose, popupType } = props;
  const [displayPopup, setDisplayPopup] = useState("");
  const [formValidator, setFormValidator] = useState("");
  const [errorMsg, setErrorMsg] = useState({
    link: "",
  });
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

    const formValidator = new FormValidator({
      classObj: {
        formSelector: ".popup__form",
        fieldsetSelector: ".popup__fieldset",
        inputSelector: ".input",
      },
      handleFormErrorState: ({ name, errorMessage }) => {

        setErrorMsg((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      },

      handleFormButtonState: (isDisabled) => {
        setbuttonDisabled(isDisabled);
      },
    });

    setFormValidator(formValidator);

    formValidator.enableValidation();
  }, []);

  useEffect(() => {

    setDisplayPopup(true);

    function handleEsc(evt) {
      if (evt.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => {

      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const children = cloneElement(props.children, {

    formValidator,
    errorMsg,
    buttonDisabled,
    isSubmitting,
    onButtonLoading: setButtonLoading,
  });


  function handleClickOutside(evt) {
    if (evt.target.classList.contains("popup")) {
      onClose();
    }
  }


  function setButtonLoading() {
    setIsSubmitting(!isSubmitting);
    setbuttonDisabled(!buttonDisabled);
  }

  return (
    <div
      onClick={handleClickOutside}
      className={`popup${displayPopup ? " popup_opened" : ""} `} //
    >
      <div
        className={`popup__container ${
          popupType === "image" ? "popup__container_image" : ""
        }`}
      >
        <button
          type="button"
          aria-label="Close modal"
          className="button button_close"
          onClick={onClose}
        ></button>
        {title && <h2 className="popup__title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}