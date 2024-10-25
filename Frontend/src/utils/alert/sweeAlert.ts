import Swal from "sweetalert2";
import { SweetAlertIcon } from "sweetalert2";
import './alert.css'


export const handleAlert=(icon:SweetAlertIcon='info',title:string='Your work has been saved')=>{
    Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 2000
      });
}
 
export const promptSweet=async (handler:()=>Promise<void>,text:string,completed:string)=>{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: `Action completed`,
            text: completed,
            icon: "success"
          });
          
          handler()
        } else if (
          result.dismiss === Swal.DismissReason.cancel
          
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Operation canceled",
            icon: "error"
          });
         
        }
      });
}

export function alertWithOk(title:string,text:string,icon:SweetAlertIcon){
    Swal.fire({
        title:title,
        text: text,
        icon: icon
      });
}