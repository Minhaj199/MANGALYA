export function abuseDateFormat(date:Date){
    "13:37-25-11-2024"
   date=new Date(date)
   const formated=`${date.getHours()}-${date.getMinutes()}-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    return formated

} 