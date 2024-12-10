import { userData } from "../user/userProfile/userProfile";
import { showToast } from "../utils/toast"; 


export function validateEditedData(editedData:userData){
    console.log(editedData)
        if(editedData.PersonalInfo.firstName.trim()!==''){
            if( editedData.PersonalInfo.firstName.trim().length>10||
                editedData.PersonalInfo.firstName.trim().length<3){
                    showToast('First name should be between 3-10 ',"info")
                    return false
                }
               
            }
            if(editedData.PersonalInfo.secondName.trim()!==''){
                if(editedData.PersonalInfo.secondName.trim().length>10||
                editedData.PersonalInfo.secondName.trim().length<1){
                    showToast('Second name should be between 3-10',"info")
                    return false
                }
            }
            if(editedData.PersonalInfo.dateOfBirth!==''){
                const birthDate=new Date(editedData.PersonalInfo.dateOfBirth)
                console.log(birthDate)
                const today=new Date();
                let age=today.getFullYear()-birthDate.getFullYear()
                let monthdiff=today.getMonth()-birthDate.getMonth()
                let dayDiff=today.getDate()-birthDate.getDate()
                if(monthdiff<0||(monthdiff===0&&dayDiff<0)){
                    --age
                }
                if(age<18||age>60){
                    showToast('Age must be between 18-60',"info")
                    return false
                }

            }
            if(editedData.email.trim()!==''){
                const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid:boolean=emailRegex.test(editedData.email)
        if(!isValid){
            
            showToast('Email not valid',"info")
            return false
        }
        
            }
           
    return true
}