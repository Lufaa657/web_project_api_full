import { useContext, useRef } from "react";
import { CurrentUserContext } from "../../../../../../contexts/CurrentUserContext";

export default function EditAvatar(props) {
  const {
    formValidator,
    errorMsg,
    buttonDisabled,
    isSubmitting,
    onButtonLoading,
  } = props;
  const { currentUser, onUpdateAvatar } = useContext(CurrentUserContext);
  const urlInputRef = useRef();

  function handleInputValidation(evt) {
    const inputElement = evt.target;

    formValidator.enableValidation(inputElement);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onButtonLoading();
    onUpdateAvatar({ avatar: urlInputRef.current.value });
    onButtonLoading();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="popup__form"
      name="avatar"
      noValidate
    >
      <fieldset className="popup__fieldset">
        <label className="popup__form-field">
          <input
            onChange={handleInputValidation}
            ref={urlInputRef}
            type="url"
            className={`input input_popup-avatar ${
              errorMsg.link ? "input__popup_type_error" : ""
            }`}
            placeholder="Link de imagem"
            name="link"
            id="link"
            defaultValue={currentUser.avatar}
            required
          />
          <span
            className={

              `popup__error${errorMsg.link ? " popup__error_visible" : ""}`
            }
          >
            {errorMsg.link}
          </span>
        </label>
        <button
          type="submit"
          className={

            `button button_popup-submit${
              buttonDisabled && isSubmitting
                ? " button_popup-submit_disabled"
                : ""
            }`
          }
          disabled={buttonDisabled}
        >
          {
            !isSubmitting ? "Salvar" : "Salvando..."
          }
        </button>
      </fieldset>
    </form>
  );
}