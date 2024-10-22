import Swal from "sweetalert2";
import { SweetAlertIcon } from "sweetalert2";

export const handleAlert=(icon:SweetAlertIcon='info',title:string='Your work has been saved')=>{
    Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 2000
      });
}

export const promptSweet=()=>{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          return true
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
      });
      return false
}

export function alertWithOk(title:string,text:string,icon:SweetAlertIcon){
    Swal.fire({
        title:title,
        text: text,
        icon: icon
      });
}