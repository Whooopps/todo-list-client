import { confirmAlert } from "react-confirm-alert";

export function alertConfirm(onConfirm, onCancel) {
  function execCb(cb, onClose) {
    if (cb) {
      cb(onClose);
    } else {
      onClose();
    }
  }
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="bg-white p-8 border border-solid border-gray-500 rounded">
          <p className="mb-4">Are you sure?</p>
          <div className="text-right">
            <button
              className="bg-red-500 px-3 py-1 rounded mx-2 text-sm text-white"
              onClick={() => execCb(onConfirm, onClose)}
            >
              Yes
            </button>
            <button
              className="border-solid border border-grey-300 mx-2 px-3 py-1 rounded text-sm"
              onClick={() => execCb(onCancel, onClose)}
            >
              No
            </button>
          </div>
        </div>
      );
    },
  });
}
