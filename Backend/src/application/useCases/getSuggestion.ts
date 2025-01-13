// import { Types } from "mongoose"
// import { profileTypeFetch } from "../../types/Types"
// import { IUserModel, UserModel } from "../../Infrastructure/db/userModel"
// import { getAge } from "../../interface/Utility/ageCalculator"




// export async function getSuggstion(id:unknown,partnerPreference:string,gender:string){
    
//      try {
            
//             if(typeof id==='string' ){
            
//                 const idd=new Types.ObjectId(id)
              
//                 let fetchedProfiles:{profile:suggestionType[],request:profileTypeFetch}[]=[];
                
                
//                 let currntPlan=await UserModel.aggregate([{$match:{_id:idd}},{$project:{_id:0,CurrentPlan:1}}])
//                 if(datas[0].profile){  
//                      datas[0].profile=datas[0].profile?.map((el,index)=>{
                    
//                         return ({
//                             ...el,
//                             no:index+1,
//                             age:getAge(el.dateOfBirth)
//                         }) 
//                     })
//                 }

//                 let totoalCount=0
//                 let totoalFull=0
//                 let totalHalf=0
//                 if(datas[0].profile&&datas[0].userProfile){
                  
//                     const main:IUserModel=datas[0].userProfile[0]
                  
//                     if(!main.PersonalInfo?.interest?.length){
//                         return   fetchedProfiles=[]
//                     }
//                     let FirstCat:{subscriber:suggestionType[],
//                          connectionOver:suggestionType[],prioriy:suggestionType[]}={subscriber:[],connectionOver:[],prioriy:[]}
//                     for (let user of datas[0].profile){
//                         totoalCount++
//                         if(main.PersonalInfo?.interest.every(el=>user?.interest.includes(el))){
//                           totoalFull++
//                             if(user.subscriber==='subscribed'||user.subscriber==="connection over"){
                               
//                                 if(user?.planFeatures?.includes('Priority')){
//                                     FirstCat.prioriy.push({...user,matchStatics:'hr'})   
//                                 }else{
                                   
//                                     FirstCat.subscriber.push({...user,matchStatics:'rc'})
//                                 }
//                             }
                            
//                         }else{
                            
//                             if(user.subscriber==='subscribed'||user.subscriber==="connection over"){
                                
//                                 totalHalf++
                               
//                                 if(user?.planFeatures&&user?.planFeatures?.includes('Priority')&&
//                                 user.interest?.some(elem=>main.PersonalInfo.interest?.includes(elem))){
//                                     FirstCat.prioriy.push({...user,matchStatics:'phr'})   
//                                 }
//                                 else if(user?.interest&&user?.interest.some(elem=>main.PersonalInfo?.interest?.includes(elem))){
//                                     FirstCat.prioriy.push({...user,matchStatics:'np'}) 
//                                 }
//                             }
                            
//                         }
                        
//                     }
//                     const array:suggestionType[]=[...FirstCat.prioriy,...FirstCat.subscriber,...FirstCat.connectionOver]
//                         fetchedProfiles=[{profile:array,request:datas[0].request}]
                    
//                 }
                
//                 return({datas
//                 :fetchedProfiles,currntPlan:currntPlan[0]?.CurrentPlan})
//             }else{
//                 throw new Error('id not found')
//             }
//         } catch (error:any) {
//             console.log(error)
//           throw new Error(error.message||'Error on suggstion page fetching')
//         }

// }