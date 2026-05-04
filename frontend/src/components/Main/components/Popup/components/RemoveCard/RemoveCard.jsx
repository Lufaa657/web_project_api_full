export default function RemoveCard(props) {
  const {
    onCardDelete,
    cardId,
    onButtonLoading,
    buttonDisabled,
    isSubmitting,
  } = props;


  function handleDeleteClick() {

    onButtonLoading();
    onCardDelete(cardId);
    onButtonLoading();
  }

  return (
    <>
      <button
        onClick={handleDeleteClick}
        type="button"
        className={

          `button button_popup-submit${
            buttonDisabled ? " button_popup-submit_disabled" : ""
          }`
        }
        disabled={buttonDisabled}
      >
        {
          !isSubmitting ? "Sim" : "Excluindo..."
        }
      </button>
    </>
  );
}