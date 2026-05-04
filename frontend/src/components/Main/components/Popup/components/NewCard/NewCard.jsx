import { useState } from "react";

export default function NewCard(props) {
  const {
    formValidator,
    errorMsg,
    buttonDisabled,
    isSubmitting,
    onButtonLoading,
    onAddPlaceSubmit,
  } = props;
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  function handleTitleChange(evt) {
    const inputElement = evt.target;
    setTitle(evt.target.value);

    formValidator.enableValidation(inputElement);
  }

  function handleUrlChange(evt) {
    const inputElement = evt.target;
    setUrl(evt.target.value);
    formValidator.enableValidation(inputElement);
  }



  function handleSubmit(evt) {
    evt.preventDefault();

    onButtonLoading();
    onAddPlaceSubmit({ name: title, link: url });
    onButtonLoading();
  }

  return (
    <form onSubmit={handleSubmit} className="popup__form" name="add" noValidate>
      <fieldset className="popup__fieldset">
        <label className="popup__form-field">
          <input
            onChange={handleTitleChange}
            type="text"
            className={`input input_popup-title ${
              errorMsg.title ? "input__popup_type_error" : ""
            }`}
            placeholder="Título"
            name="title"
            id="title"
            minLength="2"
            maxLength="30"
            value={title}
            required
          />
          <span
            className={

              `popup__error${errorMsg.title ? " popup__error_visible" : ""}`
            }
          >
            {errorMsg.title}
          </span>
        </label>
        <label className="popup__form-field">
          <input
            onChange={handleUrlChange}
            type="url"
            className={`input input_popup-link ${
              errorMsg.link ? "input__popup_type_error" : ""
            }`}
            placeholder="Link de imagem"
            name="link"
            id="link"
            value={url}
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
            !isSubmitting ? "Criar" : "Salvando..."
          }
        </button>
      </fieldset>
    </form>
  );
}