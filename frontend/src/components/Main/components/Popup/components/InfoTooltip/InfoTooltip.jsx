import successImg from "../../../../../../images/success.svg";
import errorImg from "../../../../../../images/error.svg";
import { useEffect, useState } from "react";

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const CONFLICT_ERROR = 409;

export default function InfoTooltip({ error, signIn = false, signUpSuccess }) {
  const [message, setMessage] = useState("");
  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    if (signUpSuccess) {
      setMessage("¡Felicidades! Ahora solo inicia sesión.");
    } else if (error?.status === BAD_REQUEST) {
      setMessage("El correo electrónico ingresado no es válido.");
    } else if (error?.status === CONFLICT_ERROR) {
      setMessage("El correo electrónico ya está registrado.");
    } else if (error?.status === UNAUTHORIZED && signIn) {
      setMessage("Correo electrónico o contraseña incorrectos. Intenta nuevamente.");
    } else if (error?.status === UNAUTHORIZED && !signIn) {
      setMessage(
        "Tu sesión expiró. Por favor inicia sesión nuevamente para continuar."
      );
    } else {
      setMessage("Lo sentimos, algo salió mal. Intenta nuevamente más tarde.");
    }

    setImageSrc(error ? errorImg : successImg);
  }, [error, signIn, signUpSuccess]);

  return (
    <div className="info-tooltip">
      <img src={imageSrc} alt="" className="info-tooltip__image" />
      <h2 className="info-tooltip__message">{message}</h2>
    </div>
  );
}