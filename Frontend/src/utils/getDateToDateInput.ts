
export function getInputData(input:Date){

    const formattedDate =new Date (input).toISOString().split('T')[0]
    return  formattedDate
}