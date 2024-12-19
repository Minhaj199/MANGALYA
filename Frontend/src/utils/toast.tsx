import { toast } from "react-toastify";

export const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
  switch (type) {
    case "success":
      toast.success(message,{
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message,{
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      break;
    case "warning":
      toast.warn(message,{
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      break;
    default:
      toast(message);
  }
};
