import successImg from "../../../../../../images/success.svg";
import errorImg from "../../../../../../images/error.svg";
import { useEffect, useState } from "react";

export default function InfoTooltip({ error, signUpSuccess }) {
  const [message, setMessage] = useState("");
  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    if (signUpSuccess) {
      setMessage("Registro exitoso. Ahora inicia sesión.");
      setImageSrc(successImg);
      return;
    }

    if (error) {
      setMessage("Correo o contraseña incorrectos. Intenta nuevamente.");
      setImageSrc(errorImg);
      return;
    }

    setMessage("Algo salió mal. Intenta nuevamente.");
    setImageSrc(errorImg);
  }, [error, signUpSuccess]);

  return (
    <div className="info-tooltip">
      <img src={imageSrc} alt="" className="info-tooltip__image" />
      <h2 className="info-tooltip__message">{message}</h2>
    </div>
  );
}