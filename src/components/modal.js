import React, { useRef } from "react";
import { useForm } from "react-hook-form";

const CloseModal = {
  hidden: { opacity: 0, visibility: "hidden" },
  visible: { opacity: 1, visibility: "visible" },
};
export default function Modal({ handleTransfer, closed, setCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.amount) {
      handleTransfer(data);
    }
  };

  return (
    <>
      {
        <label
          onClick={() => setCloseModal(false)}
          className="btn btn--apply btn--primary transfer--btn"
          htmlFor="modal-1"
        >
          TRANSFER
        </label>
      }

      <input className="modal-state" id="modal-1" type="checkbox" />
      {closed === false && (
        <div className="modal">
          <div className="modal__inner">
            <label className="modal__close" for="modal-1"></label>
            {}
          </div>
        </div>
      )}
    </>
  );
}
