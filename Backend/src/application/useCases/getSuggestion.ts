import { Types } from "mongoose"
import { profileTypeFetch } from "../types/userTypes"
import { IUserModel, UserModel } from "../../Infrastructure/db/userModel"
import { getAge } from "../../interface/Utility/ageCalculator"

interface suggestionType  {
    name:string,
    lookingFor:string,secondName:string,
    state:string,gender:string,
    dateOfBirth:Date,interest:string[],
    photo:string,
    _id?:string,
    subscriber:'subscribed'|'Not subscribed'|'connection over'
    planFeatures:string[]
    matchStatics?:string
}


export async function getSuggstion(id:unknown,partnerPreference:string,gender:string){
    
     try {
            
            if(typeof id==='string' ){
            
                const idd=new Types.ObjectId(id.slice(1,25))
              
                let fetchedProfiles:{profile:suggestionType[],request:profileTypeFetch}[]=[];
                 let datas:{profile:suggestionType[],request:profileTypeFetch,userProfile:IUserModel[]}[]=await UserModel.aggregate([{
                    $facet:{
                        profile:[{$match:{$and:[{'PersonalInfo.gender':partnerPreference},{'partnerData.gender':gender},{match:{$not:{$elemMatch:{_id:idd}}}}]}},{$project:{name:'$PersonalInfo.firstName',
                        lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                            state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                            dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                            photo:'$PersonalInfo.image',match:'$match',subscriber:'$subscriber',planFeatures:'$CurrentPlan.features'}},{$sort:{_id:-1}}],
                        request:[{$match:{_id:idd}},{$unwind:'$match'},{$match:{'match.status':'pending','match.typeOfRequest':'recieved'}},
                            {$lookup:{from:'users',localField:'match._id',foreignField:'_id',as:'matchedUser'}},{$unwind:'$matchedUser'},{$project:{_id:0,matchedUser:1}},
                        {$project:{_id:'$matchedUser._id',name:'$matchedUser.PersonalInfo.firstName',
                        lookingFor:'$matchedUser.partnerData.gender',secondName:'$matchedUser.PersonalInfo.secondName',
                        state:'$matchedUser.PersonalInfo.state',gender:'$matchedUser.PersonalInfo.gender',
                        dateOfBirth:'$matchedUser.PersonalInfo.dateOfBirth',interest:'$matchedUser.PersonalInfo.interest',
                        photo:'$matchedUser.PersonalInfo.image'}},{$sort:{_id:-1}}],
                        userProfile:[{$match:{_id:idd}}]
                    }
                }])
                
                let currntPlan=await UserModel.aggregate([{$match:{_id:idd}},{$project:{_id:0,CurrentPlan:1}}])
                if(datas[0].profile){  
                     datas[0].profile=datas[0].profile?.map((el,index)=>{
                    
                        return ({
                            ...el,
                            no:index+1,
                            age:getAge(el.dateOfBirth)
                        }) 
                    })
                }

                let totoalCount=0
                let totoalFull=0
                let totalHalf=0
                if(datas[0].profile&&datas[0].userProfile){
                  
                    const main:IUserModel=datas[0].userProfile[0]
                  
                    if(!main.PersonalInfo?.interest?.length){
                        return   fetchedProfiles=[]
                    }
                    let FirstCat:{subscriber:suggestionType[],
                         connectionOver:suggestionType[],prioriy:suggestionType[]}={subscriber:[],connectionOver:[],prioriy:[]}
                    for (let user of datas[0].profile){
                        totoalCount++
                        if(main.PersonalInfo?.interest.every(el=>user?.interest.includes(el))){
                          totoalFull++
                            if(user.subscriber==='subscribed'||user.subscriber==="connection over"){
                               
                                if(user?.planFeatures?.includes('Priority')){
                                    FirstCat.prioriy.push({...user,matchStatics:'hr'})   
                                }else{
                                   
                                    FirstCat.subscriber.push({...user,matchStatics:'rc'})
                                }
                            }
                            
                        }else{
                            
                            if(user.subscriber==='subscribed'||user.subscriber==="connection over"){
                                
                                totalHalf++
                               
                                if(user?.planFeatures&&user?.planFeatures?.includes('Priority')&&
                                user.interest?.some(elem=>main.PersonalInfo.interest?.includes(elem))){
                                    FirstCat.prioriy.push({...user,matchStatics:'phr'})   
                                }
                                else if(user?.interest&&user?.interest.some(elem=>main.PersonalInfo?.interest?.includes(elem))){
                                    FirstCat.prioriy.push({...user,matchStatics:'np'}) 
                                }
                            }
                            
                        }
                        
                    }
                    const array:suggestionType[]=[...FirstCat.prioriy,...FirstCat.subscriber,...FirstCat.connectionOver]
                        fetchedProfiles=[{profile:array,request:datas[0].request}]
                    
                }
                
                return({datas
                :fetchedProfiles,currntPlan:currntPlan[0]?.CurrentPlan})
            }else{
                throw new Error('id not found')
            }
        } catch (error:any) {
            console.log(error)
          throw new Error(error.message||'Error on suggstion page fetching')
        }

}